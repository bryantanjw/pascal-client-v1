import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { StepsStyleConfig as Steps } from 'chakra-ui-steps'
import { extendTheme } from '@chakra-ui/react'
import WalletContextProvider from 'components/WalletContextProvider'

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}
const styles = {
  global: props => ({
    body: {
      bg: mode('#F9FBFA', 'gray.900')(props),
    },
  }),
};
const theme = extendTheme({ 
  colors,
  components: {
    Steps,
  },
  styles,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WalletContextProvider>
        <Component {...pageProps} />
      </WalletContextProvider>
    </ChakraProvider>
  )
}

export default MyApp
