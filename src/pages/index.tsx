import type { NextPage } from 'next'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { Box, Stack, Heading, Text, useColorModeValue as mode } from '@chakra-ui/react'
import clientPromise from '@/lib/mongodb'
import Layout from 'components/Layout'
import WithSubnavigation from 'components/TopBar'
import MarketList from '@/components/Trade'

import styles from '@/styles/Home.module.css'

export async function getServerSideProps(context) {
  try {
    await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

const Home: NextPage = ({ isConnected }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (isConnected) console.log("Connected to MongoDB")
  else(console.log("Not connected to MongoDB"))
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Pascal Protocol</title>
        <meta name="description" content="Trade directly on the outcome of events" />
        <meta property="og:title" content="Pascal Protocol" />
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
          zIndex={1}
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
              <Text color={mode('gray.500', 'gray.200')} fontSize={{ base: 'xl', md: '2xl' }}>
                A commodity derivative powered by automated market makers.
              </Text>
              
            <MarketList />
          </Stack>
        </Box>
      </Layout>
    </div>
  )
}

export default Home
