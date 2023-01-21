import React, { useState, useEffect } from "react";
import {
  Box,
  useColorModeValue as mode,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import { Formik } from "formik";
import * as yup from "yup";
import { MotionConfig } from "framer-motion";
import { getMarket } from "@monaco-protocol/client";
import { PublicKey, Keypair } from "@solana/web3.js";
// @ts-ignore
import {
  createMarket,
  openMarket,
  MarketType,
  initialiseOutcomes,
  batchAddPricesToAllOutcomePools,
} from "@monaco-protocol/admin-client";
import { Form1, Form2, SubmittedForm, FormStepper } from "./StepForms";
import { useProgram } from "@/context/ProgramProvider";
import { getPriceData, logResponse, makeMarket } from "@/utils/monaco";
import { ResizablePanel } from "../common/ResizablePanel";

enum CreateStatus {
  CreatingMarket = "Creating Market",
  InitialisingOutcomes = "Initialising Outcomes",
  AddingPrices = "Adding Prices",
  OpeningMarket = "Opening Market",
  MakingMarket = "Making Market",
  Success = "Success",
}

async function createVerboseMarket(
  program,
  marketName,
  lockTimestamp,
  setCreateStatus
) {
  const mintToken = new PublicKey(
    "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU" // <-- USDC devnet token address
  );
  // Generate a publicKey to represent the event
  const eventAccountKeyPair = Keypair.generate();
  const eventPk = eventAccountKeyPair.publicKey;

  const marketLock = Date.parse(lockTimestamp) / 1000; // <-- lockTimestamp in seconds
  const type = MarketType.EventResultWinner;
  const outcomes = ["Yes", "No"];
  // Create a prob 1-100 price ladder
  const priceLadder = Array.from({ length: 101 }, (_, i) => i);
  const batchSize = 50;

  console.log(`Creating market ⏱`);
  const marketResponse = await createMarket(
    program,
    marketName,
    type,
    mintToken,
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
  // @ts-ignore
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
  // @ts-ignore
  const addPriceLaddersResponse = await batchAddPricesToAllOutcomePools(
    program,
    marketPk,
    priceLadder,
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

  const addMarket = async (values) => {
    const {
      title,
      category,
      lockTimestamp,
      description,
      resolutionSource,
      resolutionPrice,
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
      // Make market
      setCreateStatus(CreateStatus.MakingMarket);
      await makeMarket(program, marketPk);
      // Get market account
      const market = await getMarket(program, marketPk!);
      const marketAccount = market.data;
      // Get price data
      const priceData = await getPriceData(program, marketPk);

      // Add accounts to database
      const data = {
        category,
        description,
        tag,
        resolutionSource,
        resolutionPrice,
        marketCreateTimestamp,
        marketAccount,
        priceData,
      };
      const response = await fetch("../api/createMarket", {
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
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required("Market title is required"),
    category: yup.string().required("Market category is required"),
    lockTimestamp: yup
      .date()
      .min(new Date(), "Resolution date must be in the future")
      .required(),
    description: yup.string().required("Resolution criteria is required"),
    resolutionSource: yup.string(),
    resolutionPrice: yup.string(),
    tag: yup.string(),
  });

  return (
    <MotionConfig transition={{ duration, type: "tween" }}>
      <ModalOverlay backdropFilter="auto" backdropBlur="5px" />
      <Formik
        initialValues={{
          title: "",
          category: "",
          lockTimestamp: "",
          description: "",
          tag: "",
          resolutionSource: "",
          resolutionPrice: "",
          program,
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

            <ModalBody>
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
