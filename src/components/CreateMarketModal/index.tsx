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
import useMeasure from "react-use-measure";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  createOrderUiStake,
  getMarket,
  getMarketOutcomesByMarket,
  getTradesForMarket,
} from "@monaco-protocol/client";
import { openMarket } from "@monaco-protocol/admin-client";
import { PublicKey, Keypair } from "@solana/web3.js";
import {
  createMarket,
  MarketType,
  DEFAULT_PRICE_LADDER,
  initialiseOutcomes,
  batchAddPricesToAllOutcomePools,
} from "@monaco-protocol/admin-client";
import { Form1, Form2, SubmittedForm, FormStepper } from "./StepForms";
import { useProgram } from "@/context/ProgramProvider";
import { getPriceData, logResponse } from "@/utils/monaco";
import { ResizablePanel } from "../common/ResizablePanel";

enum CreateStatus {
  CreatingMarket = "Creating Market",
  InitialisingOutcomes = "Initialising Outcomes",
  AddingPrices = "Adding Prices",
  OpeningMarket = "Opening Market",
  Success = "Success",
}

/* To maintain a non-informative distribution while
 * still ensuring that the market price settles at 0.5,
 * we use a combination of both random and uniform distributions.
 * We generate random prices using a uniform distribution, with a range of 0 to 1,
 * and then apply a bias to the prices so that the mean of the prices is 0.5.
 *
 * Note: market price might not exactly settle at 0.5 prob after all market operations
 * so should increase number of orders so the bias will have a cumulative effect over
 * a larger number of orders.
 */
async function makeMarket(program, marketPk: PublicKey) {
  const numOrders = 20;
  const minPrice = 20;
  const maxPrice = 70;
  const minSize = 1;
  const maxSize = 2;

  const buyOrders: Array<{ price: number; size: number }> = [];
  const sellOrders: Array<{ price: number; size: number }> = [];

  let totalPrice = 0;
  for (let i = 0; i < numOrders; i++) {
    // Generate a random price with uniform distribution
    let price = Math.round(minPrice + Math.random() * (maxPrice - minPrice));
    totalPrice += price;
    // Generate a random size between the min and max size
    const size = minSize + Math.floor(Math.random() * (maxSize - minSize + 1));
    // 50% chance of placing a buy order or a sell order
    if (Math.random() < 0.5) {
      buyOrders.push({ price, size });
    } else {
      sellOrders.push({ price, size });
    }
  }
  const meanPrice = totalPrice / numOrders;
  const bias = Math.round(50 - meanPrice);
  buyOrders.forEach((order) => (order.price += bias));
  sellOrders.forEach((order) => (order.price += bias));
  console.log("buyOrders", buyOrders);
  console.log("sellOrders", sellOrders);

  // Place the orders for buy and sell side for one outcome (first)
  for (const order of buyOrders) {
    const response = await createOrderUiStake(
      program,
      marketPk,
      0, // outcome index
      true, // buy side
      order.price,
      order.size // stake
    );
    logResponse(response);
  }

  for (const order of sellOrders) {
    const response = await createOrderUiStake(
      program,
      marketPk,
      0, // outcome index
      false, // sell side
      order.price,
      order.size // stake
    );
    logResponse(response);
  }
}

async function createVerboseMarket(
  program,
  marketName,
  lockTimestamp,
  setCreateStatus,
  toast
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
  logResponse(toast, marketResponse);
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
  logResponse(toast, initialiseOutcomePoolsResponse);
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
    priceLadder,
    batchSize
  );
  // returns BatchAddPricesToOutcomeResponse: transaction id, and confirmation
  logResponse(toast, addPriceLaddersResponse);
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
  const toast = useToast();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [marketPk, setMarketPk] = useState<PublicKey>();
  const [createStatus, setCreateStatus] = useState<CreateStatus>(
    CreateStatus.CreatingMarket
  );
  let duration = 0.5;

  const addMarket = async (values) => {
    const { title, category, lockTimestamp, description, tag, program } =
      values;

    try {
      const marketPk = await createVerboseMarket(
        program,
        title,
        lockTimestamp,
        setCreateStatus,
        toast
      );
      if (!marketPk) {
        throw new Error("Error creating market");
      }
      // Set market status from 'initializing' to 'open'
      setCreateStatus(CreateStatus.OpeningMarket);
      await openMarket(program, marketPk);
      const marketCreationTimestamp = new Date().getTime().toString(16);

      // Get accounts
      const outcomeResponse = await getMarketOutcomesByMarket(
        program,
        marketPk!
      );
      const outcomeAccounts = outcomeResponse?.data.marketOutcomeAccounts;
      const trade = await getTradesForMarket(program, marketPk!);
      const tradeAccount = trade.data;
      const priceSummary = await getPriceData(marketPk, program);
      const market = await getMarket(program, marketPk!);
      const marketAccount = market.data;

      // Add accounts to database
      const data = {
        category,
        description,
        tag,
        marketCreationTimestamp,
        marketAccount,
        outcomeAccounts,
        tradeAccount,
        priceSummary,
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
