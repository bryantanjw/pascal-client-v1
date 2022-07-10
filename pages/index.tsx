import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import WithSubnavigation from 'components/TopBar'
import { Box, Divider } from '@chakra-ui/react'
import List from 'components/List'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <WithSubnavigation />
      <Head>
        <title>Pascal&apos;s Markets</title>
        <meta name="description" content="Trade directly on the outcome of events" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Trade directly on the outcome of events.
        </h1>

        <p className={styles.description}>
          A commodity derivative powered by automated market makers.
        </p>

        <List /> 
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
