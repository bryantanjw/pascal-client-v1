import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import WithSubnavigation from 'components/TopBar'
import List from 'components/List'
import { Box, Stack, Heading, Text } from '@chakra-ui/react'
import Layout from 'components/Layout'

const Home: NextPage = () => {
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Pascal Finance</title>
        <meta name="description" content="Trade directly on the outcome of events" />
        <meta property="og:title" content="Pascal Finance" />
        <meta
          property="og:description"
          content="Trade directly on the outcome of events"
        />
        <meta
          property="og:image"
          content="/Preview.png"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <WithSubnavigation />

      <Layout>
        <Box maxW={{ base: '3xl', lg: '5xl' }}
          mx="auto"
          py={{ base: '10', md: '10', lg: '12' }}
        >
          <Stack spacing={{ base: 8, md: 10 }}>

            <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '4xl', sm: '4xl', lg: '6xl' }}>
                <Text
                  as={'span'}
                  position={'relative'}
                >
                  Trade
                </Text>
                <Text
                  as={'span'}
                  position={'relative'}
                  color={'gray.500'}
                >
                  &nbsp;directly
                </Text>
                <br />
                <Text as={'span'} color={'gray.500'}>
                  on the outcome of
                </Text>
                <Text as={'span'}>
                  &nbsp;events.
                </Text>
              </Heading>
              <Text color={'gray.500'} fontSize={{ base: 'xl', md: '2xl' }}>
                A commodity derivative powered by automated market makers.
              </Text>

            <List />

          </Stack>
        </Box>
      </Layout>
    </div>
  )
}

export default Home
