import React from 'react'
import moment from 'moment'
import useSWR from 'swr'
import { 
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import {
  Stack,
  Text, Heading, useColorModeValue,
  Alert, AlertIcon, Spinner, HStack, Skeleton,
} from '@chakra-ui/react'

const fetcher = async url => {
  const res = await fetch(url)

  if (!res.ok) {
    const error: any = new Error('An error occurred while fetching the data.')

    error.info = await res.json()
    error.status = res.status
    console.log("fetcher", error)
    throw error
  }
  return res.json()
}

const ResearchGraph = ({ market }) => {
  switch(market.category) {
    case 'Financials': return <FinancialsChart market={market} />
    case 'Crypto': return <CoinChart market={market} />
    default: return null
  }
}

const FinancialsChart = ({ market }) => {
  const { short, ticker } = market
  const { data, error } = useSWR(`/api/research/fetchFinancialData?name=${ticker}`, fetcher)

  if (error) {
    console.log("fetchFinancialData Error", error)
    return (
      <Alert status='error' rounded={'lg'}>
        <AlertIcon mr={4} />
        An error has occured loading chart.            
      </Alert>
    )
  }
  if (!data) {
    return (
      <Skeleton minW={{ 'md': '500px' }} minH={{ 'md': '200px' }} rounded={'xl'}/>
    )
  }

  const { indicators, timestamp } = data

  // Array to store unique timestamps
  const timestamps: number[] = []
  let day1 = 0

  const chartData = timestamp.map((timestamp, value) => {
    let day2 = new Date(timestamp * 1000).getDate()
    if (day1 !== day2) {
      timestamps.push(timestamp * 1000)
      day1 = day2
    }

    return { 
      timestamp: timestamp * 1000, 
      value: indicators.quote[0].close[value].toFixed(2) 
    }
  })

  const priceChange = ((chartData[chartData.length -1].value - chartData[0].value) / chartData[0].value) * 100

  return (
    <Stack spacing={5} width={{ 'base': '87%', 'md': 'full' }} mb={4}>
      {data && (
        <>
        <Stack>
          <Heading fontSize={'xl'} fontWeight={'extrabold'}>{short}</Heading>
          <HStack spacing={3}>
            <Text fontSize={'md'} fontWeight={'bold'}>
              {chartData[chartData.length -1].value}
            </Text>
            <Text fontSize={'sm'} fontWeight={'semibold'}
              color={priceChange < 0 ? 'red.400' : 'green.400'}
            >
              {priceChange.toFixed(2)}%
            </Text>
          </HStack>
        </Stack>

        <ResponsiveContainer width="100%" aspect={2.2}>
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorvalue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={'#3182CE'} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={'#3182CE'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <XAxis dataKey="timestamp"
              tickFormatter={(tick) => moment(tick).format('DD')}
              tickLine={false} axisLine={false}
              ticks={timestamps}
              fontSize={'11px'}
            />
            <YAxis type={'number'} domain={['auto', 'auto']}
              orientation='right' tickCount={5} tickLine={false} 
              axisLine={false} fontSize={'11px'} 
            />

            <CartesianGrid vertical={false}
              // eslint-disable-next-line react-hooks/rules-of-hooks
              opacity={useColorModeValue('50%', '20%')}
            />
            <Tooltip content={<CustomTooltip active payload label />} />
            
            <Area type="monotone" dataKey="value" stroke={'#3182CE'} fillOpacity={1} fill="url(#colorvalue)" />
          </AreaChart>
        </ResponsiveContainer>
        </>
      )}
    </Stack>
  );
}

const CoinChart = ({ market }) => {
  const { short, ticker } = market
  const { data, error } = useSWR(
    `https://api.coingecko.com/api/v3/coins/${ticker}/market_chart?vs_currency=usd&days=5`, 
    fetcher
  )

  if (error) {
    console.log("Error fetching data from CoinGecko", error)
    return (
      <Alert status='error' rounded={'lg'}>
        <AlertIcon mr={4} />
        An error has occured loading chart.            
      </Alert>
    )
  }
  if (!data) {
    return (
      <Skeleton minW={{ 'md': '500px' }} minH={{ 'md': '200px' }} rounded={'xl'}/>
    )
  }

  const { prices } = data
  
  // Array to store unique timestamps
  const timestamps: number[] = []
  let day1 = 0

  const chartData = prices.map((price) => {
    let day2 = new Date(price[0]).getDate()
    if (day1 !== day2) {
      timestamps.push(price[0])
      day1 = day2
    }

    return { 
      timestamp: price[0], 
      value: price[1].toFixed(2) 
    }
  })

  const priceChange = ((chartData[chartData.length -1].value - chartData[0].value) / chartData[0].value) * 100

  return (
    <Stack spacing={5} width={{ 'base': '87%', 'md': 'full' }} mb={4}>
      {data && (
        <>
        <Stack>
          <Heading fontSize={'xl'} fontWeight={'extrabold'}>{short}</Heading>
          <HStack spacing={3}>
            <Text fontSize={'md'} fontWeight={'bold'}>
              {chartData[chartData.length -1].value}
            </Text>
            <Text fontSize={'sm'} fontWeight={'semibold'}
              color={priceChange < 0 ? 'red.400' : 'green.400'}
            >
              {priceChange.toFixed(2)}%
            </Text>
          </HStack>
        </Stack>

        <ResponsiveContainer width="100%" aspect={2.2}>
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorvalue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={'#3182CE'} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={'#3182CE'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <XAxis dataKey="timestamp"
              tickFormatter={(tick) => moment(tick).format('DD')}
              ticks={timestamps}
              tickLine={false} axisLine={false}
              fontSize={'11px'}
            />
            <YAxis type={'number'} domain={['auto', 'auto']}
              orientation='right' tickCount={5} tickLine={false} 
              axisLine={false} fontSize={'11px'}
            />

            <CartesianGrid vertical={false}
              // eslint-disable-next-line react-hooks/rules-of-hooks
              opacity={useColorModeValue('50%', '20%')}
            />
            <Tooltip content={<CustomTooltip active payload label />} />
            
            <Area type="monotone" dataKey="value" stroke={'#3182CE'} fillOpacity={1} fill="url(#colorvalue)" />
          </AreaChart>
        </ResponsiveContainer>
        </>
      )}
    </Stack>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Stack fontSize={'sm'} spacing={0} backdropFilter={'blur(1px)'} p={2}>
        <Text fontWeight={'semibold'}
          // eslint-disable-next-line react-hooks/rules-of-hooks
          color={useColorModeValue('gray.700', 'gray.200')}
        >
          {moment(label).format('DD MMM YYYY')} at {moment(label).format('HH:mm')}
        </Text>
        <Text fontWeight={'bold'} color={'blue.400'}>{payload[0].value}</Text>
      </Stack>
    )
  }

  return null
}

export default ResearchGraph