import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Flex, useColorModeValue as mode } from "@chakra-ui/react";

type Props = {
  children: ReactNode;
};

const variants = {
  hidden: { opacity: 0, x: -200, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
};

const Layout = ({ children }: Props): JSX.Element => (
  <div>
    <Flex
      zIndex={-1}
      backgroundImage={
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1295275/background-noise.png"
      }
      position={"absolute"}
      backgroundRepeat={"repeat"}
      left={0}
      top={-10}
      width={"full"}
      height={{ base: "full", md: "116%" }}
      opacity={mode("100%", "40%")}
    />

    <motion.main
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ type: "tween", duration: 0.3 }}
      className="
                    flex flex-col items-start w-full pt-10
                    px-8 sm:px-16 md:px-36 lg:px-52 xl:px-80 2xl:px-96
                    pt-24 h-full
                "
    >
      {children}
    </motion.main>
  </div>
);

export default Layout;
