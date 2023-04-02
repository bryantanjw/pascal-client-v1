import {
  Box,
  Button,
  useColorModeValue as mode,
  Text,
  Link,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Banner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isBannerClosed = localStorage.getItem("isBannerClosed");
    if (isBannerClosed) {
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
    setIsLoading(false);
  }, []);

  const handleClose = () => {
    localStorage.setItem("isBannerClosed", "true");
    setShowBanner(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      {showBanner && (
        <Box
          position="sticky"
          rounded="2xl"
          w={{ base: "full", sm: "581px" }}
          h={{ base: "40px", sm: "80px" }}
          padding="0.5"
          zIndex="10"
          bottom="10"
          left="0"
          right="0"
          mx="auto"
        >
          <Flex
            rounded="14px"
            w="full"
            h="full"
            bg={mode("gray.50", "gray.800")}
            border="1px"
            borderColor={mode("gray.200", "rgba(255,255,255,0.12)")}
            flexDir={{ base: "column", sm: "row" }}
            alignItems="center"
            justifyContent={{ base: "center", sm: "space-between" }}
            px="5"
          >
            <Text
              color={mode("black", "white")}
              fontSize="13px"
              fontFamily="mono"
              w={{ base: "full", sm: "304px" }}
              h="10"
              display="flex"
              alignItems="center"
              justifyContent="center"
              p="3"
            >
              Pascal is currently only live on devnet.{" "}
              <Button
                display={"contents"}
                textColor={"blue.600"}
                fontSize="13px"
                onClick={handleClose}
              >
                Dismiss →
              </Button>
            </Text>
            <Link
              isExternal
              color={mode("white", "gray.800")}
              fontSize="13px"
              fontFamily="mono"
              bg={mode("gray.900", "gray.100")}
              _hover={{
                bg: mode("gray.700", "gray.300"),
                transition: "all 0.3s ease",
              }}
              transition="all"
              rounded="md"
              w={{ base: "full", sm: "220px" }}
              h="10"
              display="flex"
              alignItems="center"
              justifyContent="center"
              whiteSpace="nowrap"
              href="https://usdcfaucet.com/"
            >
              Airdrop USDC
            </Link>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default Banner;
