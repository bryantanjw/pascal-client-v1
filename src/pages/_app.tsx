import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";
import { extendTheme } from "@chakra-ui/react";
import NextNProgress from "nextjs-progressbar";
import { AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";

import WalletContextProvider from "@/context/WalletContextProvider";
import { ProgramProvider } from "@/context/ProgramProvider";
import { baseURL } from "config";
import "@/styles/globals.css";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};
const styles = {
  global: (props) => ({
    body: {
      bg: mode("#F5F6FA", "#111927")(props),
      textColor: mode("gray.700", "gray.50")(props),
    },
  }),
};
const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};
const theme = extendTheme({
  colors,
  components: {
    Steps,
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              pointerEvents: "none",
              px: 1,
              my: 2,
              transformOrigin: "left top",
            },
          },
        },
      },
    },
    Switch: {
      variants: {
        glow: {
          thumb: {
            bg: "gray.50",
            _dark: {
              bg: "linear-gradient(to bottom, #FFF 0%, #A0AEC0 95%)",
            },
          },
          track: {
            p: "3px",
            bg: "gray.700",
            border: "solid 1px rgba(255, 255, 255, 0.2)",
            _dark: {
              bg: "blackAlpha.400",
            },
          },
        },
      },
    },
  },
  styles,
});

function MyApp({ Component, pageProps, router }: AppProps) {
  const url = `${baseURL}${router.route}`;

  return (
    <ChakraProvider theme={theme}>
      <WalletContextProvider>
        <ProgramProvider>
          <NextNProgress height={2} color={"black"} />
          <AnimatePresence
            mode="wait"
            initial={false}
            onExitComplete={() => window.scrollTo(0, 0)}
          >
            <Component {...pageProps} key={url} />
            <Analytics />
          </AnimatePresence>
        </ProgramProvider>
      </WalletContextProvider>
    </ChakraProvider>
  );
}
export default MyApp;
