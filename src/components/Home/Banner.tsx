import {
  Box,
  Button,
  CloseButton,
  useColorModeValue as mode,
  Icon,
  Square,
  Stack,
  Text,
  useBreakpointValue,
  Slide,
  LinkOverlay,
} from "@chakra-ui/react";
import { useEffect, useLayoutEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";

const Banner = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
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
          bg={mode("gray.800", "brand.700")}
          rounded={"sm"}
          boxShadow="lg"
          py={{ base: "5", md: "3" }}
          px={{ base: "6", md: "20" }}
          position="fixed"
          width={isMobile ? "102%" : "full"}
          bottom="0px"
          boxSizing="border-box"
        >
          <CloseButton
            display={{ sm: "none" }}
            position="absolute"
            right="2"
            top="2"
            onClick={handleClose}
          />
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={{ base: "3", md: "2" }}
            justifyContent="space-between"
          >
            <Stack
              spacing="4"
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}
              textColor={mode("gray.100", "gray.100")}
            >
              <Square
                size={isMobile ? "3" : "12"}
                bg="bg-subtle"
                borderRadius="md"
              >
                <Icon as={FiInfo} boxSize={isMobile ? 5 : 6} />
              </Square>
              <Stack
                direction={{ base: "column", md: "row" }}
                spacing={{ base: "0.5", md: "1.5" }}
                pe={{ base: "4", sm: "0" }}
              >
                <Text fontWeight="medium">
                  Pascal is currently only on Solana devnet.
                </Text>
              </Stack>
            </Stack>
            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={{ base: "3", sm: "5" }}
              align={{ base: "stretch", sm: "center" }}
            >
              <Button
                as={LinkOverlay}
                href="https://usdcfaucet.com/"
                bg={mode("gray.50", "gray.100")}
                width="full"
                textColor={mode("gray.800", "gray.800")}
              >
                Airdrop USDC
              </Button>
              <CloseButton
                color={mode("gray.100", "gray.800")}
                display={{ base: "none", sm: "inline-flex" }}
                onClick={handleClose}
              />
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default Banner;
