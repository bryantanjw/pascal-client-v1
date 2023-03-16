import React, { useState } from "react";
import {
  Box,
  useColorModeValue as mode,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Formik } from "formik";
import * as yup from "yup";
import { MotionConfig } from "framer-motion";
import { getMarket } from "@monaco-protocol/client";
import { PublicKey, Keypair } from "@solana/web3.js";
import {
  createMarket,
  openMarket,
  MarketType,
  initialiseOutcomes,
  batchAddPricesToAllOutcomePools,
  checkOperatorRoles,
} from "@monaco-protocol/admin-client";
import { Form1, Form2, SubmittedForm, FormStepper } from "./StepForms";
import { useProgram } from "@/context/ProgramProvider";
import { getPriceData, logResponse } from "@/utils/monaco";
import { ResizablePanel } from "../common/ResizablePanel";
import { PRICE_LADDER, usdcMint } from "@/utils/constants";

import styles from "@/styles/Home.module.css";

enum CreateStatus {
  CreatingMarket = "Creating Market",
  InitialisingOutcomes = "Initialising Outcomes",
  AddingPrices = "Adding Prices",
  OpeningMarket = "Opening Market",
  MakingMarket = "Making Market",
  Success = "Success",
}

const headers = { "Content-Type": "application/json" };
if (process.env.CREATE_MARKET_API_KEY) {
  headers["X-API-KEY"] = process.env.CREATE_MARKET_API_KEY;
}

async function createVerboseMarket(
  program,
  marketName,
  lockTimestamp,
  setCreateStatus
) {
  const checkRoles = await checkOperatorRoles(
    program,
    program.provider.publicKey
  );

  if (!checkRoles.data.market)
    throw new Error(
      `Currently set wallet ${program.provider.publicKey} does not have the operator role`
    );

  // Generate a publicKey to represent the event
  const eventAccountKeyPair = Keypair.generate();
  const eventPk = eventAccountKeyPair.publicKey;

  const marketLock = Date.parse(lockTimestamp) / 1000; // lockTimestamp in seconds
  const type = MarketType.EventResultWinner;
  const outcomes = ["Yes", "No"];
  const batchSize = 50;

  console.log(`Creating market ⏱`);
  const marketResponse = await createMarket(
    program,
    marketName,
    type,
    usdcMint,
    marketLock,
    eventPk
  );
  // returns CreateMarketResponse: market account public key, creation transaction id, and market account
  logResponse(marketResponse);
  if (marketResponse.success) {
    console.log(
      `MarketAccount ${marketResponse.data.marketPk.toString()} created ✅`
    );
    console.log(`TransactionId: ${marketResponse.data.tnxId}`);
    setCreateStatus(CreateStatus.InitialisingOutcomes);
  } else {
    console.log("Error creating market");
    return;
  }

  const marketPk = marketResponse.data.marketPk;

  console.log(`Initialising market outcomes ⏱`);
  const initialiseOutcomePoolsResponse = await initialiseOutcomes(
    program,
    marketPk,
    outcomes
  );
  // returns OutcomeInitialisationsResponse: list of outcomes, their pdas, and transaction id
  logResponse(initialiseOutcomePoolsResponse);
  if (initialiseOutcomePoolsResponse.success) {
    console.log(`Outcomes added to market ✅`);
    setCreateStatus(CreateStatus.AddingPrices);
  } else {
    console.log("Error initialising outcomes");
    return;
  }

  console.log(`Adding prices to outcomes ⏱`);
  const addPriceLaddersResponse = await batchAddPricesToAllOutcomePools(
    program,
    marketPk,
    PRICE_LADDER,
    batchSize
  );
  // returns BatchAddPricesToOutcomeResponse: transaction id, and confirmation
  logResponse(addPriceLaddersResponse);
  if (addPriceLaddersResponse.success) {
    console.log(`Prices added to outcomes ✅`);
  } else {
    console.log("Error adding prices to outcomes");
    return;
  }

  console.log(`Market ${marketPk.toString()} creation complete ✨`);
  return marketResponse.data.marketPk;
}

export const CreateMarketModal = () => {
  const program = useProgram();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [marketPk, setMarketPk] = useState<PublicKey>();
  const [createStatus, setCreateStatus] = useState<CreateStatus>(
    CreateStatus.CreatingMarket
  );
  let duration = 0.5;

  async function addMarket(values) {
    const {
      title,
      category,
      lockTimestamp,
      description,
      resolutionSource,
      resolutionValue,
      oracleSymbol,
      ticker,
      tag,
      program,
    } = values;

    try {
      const marketPk = await createVerboseMarket(
        program,
        title,
        lockTimestamp,
        setCreateStatus
      );
      if (!marketPk) {
        throw new Error("Error creating market");
      }
      // Set market status from 'initializing' to 'open'
      setCreateStatus(CreateStatus.OpeningMarket);
      await openMarket(program, marketPk);
      // Get market creation timestamp
      const marketCreateTimestamp = (new Date().getTime() / 1000).toString(16);

      // Market make
      // setCreateStatus(CreateStatus.MakingMarket);
      // await marketMake(program, marketPk);

      // Get price data
      const priceData = await getPriceData(program, marketPk);
      // Get market account
      const market = await getMarket(program, marketPk!);
      const marketAccount = market.data;

      // Add accounts to database
      const data = {
        category,
        description,
        tag,
        resolutionSource,
        resolutionValue,
        oracleSymbol,
        ticker,
        marketCreateTimestamp,
        marketAccount,
        priceData,
      };
      await fetch("../api/createMarket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setIsSuccess(true);
      setCreateStatus(CreateStatus.Success);
      setMarketPk(marketPk);
    } catch (error) {
      setIsSuccess(false);
      console.log("addMarket", error);
    }
  }

  const validationSchema = yup.object().shape({
    title: yup.string().required("Market title is required"),
    category: yup.string().required("Market category is required"),
    lockTimestamp: yup
      .date()
      .min(new Date(), "Resolution date must be in the future")
      .required(),
    description: yup.string().required("Resolution criteria is required"),
    resolutionSource: yup.string(),
    tag: yup.string(),
    ticker: yup.string(),
    oracleSymbol: yup.string(),
    resolutionValue: yup.string(),
  });

  return (
    <MotionConfig transition={{ duration, type: "tween" }}>
      <ModalOverlay backdropFilter="auto" backdropBlur="5px" />
      <Formik
        initialValues={{
          program,
          title: "",
          category: "",
          lockTimestamp: "",
          description: "",
          tag: "",
          resolutionSource: "",
          ticker: "",
          oracleSymbol: "",
          resolutionValue: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
          await addMarket(values);
        }}
      >
        {(props) => (
          <ModalContent
            border={"1px solid rgb(255, 255, 255, 0.12)"}
            maxW={"500px"}
            p={"12px 15px"}
            rounded={"2xl"}
            boxShadow={"2xl"}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            bg={
              isSuccess
                ? mode("rgb(64,40,249,0.85)", "rgb(64,40,220,0.9)")
                : mode("rgb(255,255,255)", "rgb(17, 25, 40, 0.9)")
            }
            backdropFilter={{ md: "blur(7px)" }}
          >
            <ModalCloseButton
              color={isSuccess ? "gray.50" : mode("gray.700", "gray.100")}
              m={"10px auto"}
              rounded={"xl"}
              size={"lg"}
              isDisabled={props.isSubmitting}
            />

            <ModalBody className={styles.modal_container}>
              <Box m="10px auto">
                <ResizablePanel>
                  <FormStepper
                    success={isSuccess}
                    marketPk={marketPk}
                    {...props}
                  >
                    <Form1 />
                    <Form2 title={props.values.title} />
                    <SubmittedForm
                      publicKey={marketPk}
                      success={isSuccess}
                      isSubmitting={props.isSubmitting}
                      status={createStatus}
                    />
                  </FormStepper>
                </ResizablePanel>
              </Box>
            </ModalBody>
          </ModalContent>
        )}
      </Formik>
    </MotionConfig>
  );
};
