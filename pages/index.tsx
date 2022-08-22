import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import WithSubnavigation from 'components/TopBar'
import List from 'components/List'
import Footer from 'components/Footer'
import { Box, Stack, Heading, Text } from '@chakra-ui/react'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <WithSubnavigation />
      <Head>
        <title>Pascal&apos;s Markets</title>
        <meta name="description" content="Trade directly on the outcome of events" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box maxW={{ base: '3xl', lg: '5xl' }}
        mx="auto"
        py={{ base: '6', md: '8', lg: '12' }}
      >
        <Stack spacing={{ base: 8, md: 10 }}>

          <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}>
              <Text
                as={'span'}
                position={'relative'}
                _after={{
                  content: "''",
                  width: 'full',
                  height: '30%',
                  position: 'absolute',
                  bottom: 1,
                  left: 0,
                  bg: 'blue.400',
                  zIndex: -1,
                }}>
                Trade directly
              </Text>
              <br />
              <Text as={'span'} color={'blue.400'}>
                on the outcome of events.
              </Text>
            </Heading>
            <Text color={'gray.500'} fontSize={{ base: 'xl', md: '2xl' }}>
              A commodity derivative powered by automated market makers.
            </Text>

          <List />

        </Stack>
      </Box>
    </div>
  )
}

export default Home
