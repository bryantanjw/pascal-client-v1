import React, { Suspense, useEffect, useState } from 'react'
import useSWR from 'swr'
import { 
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Stack,
  Text, Heading, useColorModeValue,
  Alert, AlertIcon, Spinner,
} from '@chakra-ui/react'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Stack fontSize={'sm'} textColor={'black.400'}>
        <Text top={0}>{label}</Text>
        <Heading fontSize={'sm'} color={'purple.400'}>{payload[0].value}</Heading>
      </Stack>
    )
  }

  return null
}

const CustomLegend = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    console.log(payload)
    return (
      <Heading fontSize={'sm'} color={'purple.400'}>{payload[0].value}</Heading>
    )
  }

  return null
}

const fetcher = async url => {
  const res = await fetch(url)

  if (!res.ok) {
    const error: any = new Error('An error occurred while fetching the data.')

    error.info = await res.json()
    error.status = res.status
    console.log("fetchPrice", error)
    throw error
  }
  return res.json()
}

const ResearchGraph = ({ market }) => {
  const { data, error } = useSWR(`/api/fetchPrice`, fetcher)

  if (error) {
    console.log("fetchPrice Error", error)
    return (
      <Alert status='error' rounded={'lg'}>
        <AlertIcon mr={4} />
        An error has occured loading chart.            
      </Alert>
    )
  }
  if (!data) {
    return (
      <Spinner />
    )
  }

  const { indicators, meta, timestamp } = data

  const chartData = timestamp.map((timestamp, value) => {
    var date = new Date(timestamp * 1000)
    return { 
      timestamp: date.toDateString(), 
      value: indicators.adjclose[0].adjclose[value].toFixed(2) 
    }
  })
  console.log("chartData", chartData)

  const mockData = [
    {
      timestamp: 'Page A',
      value: 2400,
    },
    {
      timestamp: 'Page B',
      value: 1398,
    },
  ]

  return (
    <Stack spacing={5} width={{ 'base': '87%', 'md': 'full' }} height={'100%'}>
      
      {/* TODO: add price change indicator */}

      {data && (
        <>
        <Heading fontSize={'2xl'} color={"#3182CE"}>${meta.chartPreviousClose}</Heading>

        <ResponsiveContainer width="95%" aspect={2.5}>
          <AreaChart data={chartData} 
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >

            <defs>
              <linearGradient id="colorvalue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={'#3182CE'} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={'#3182CE'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <XAxis dataKey="timestamp" 
              tickCount={5} tickLine={false} axisLine={false} 
              fontSize={'11px'} padding={{ right: 50 }}  
            />
            <YAxis type={'number'} domain={[dataMin => (dataMin), dataMax => (dataMax)]}
              orientation='right' tickCount={6} width={50} tickLine={false} 
              axisLine={false} fontSize={'11px'} 
            />

            <CartesianGrid vertical={false}
              // eslint-disable-next-line react-hooks/rules-of-hooks
              opacity={useColorModeValue('50%', '20%')}
            />
            <Tooltip content={<CustomTooltip active payload label/>} />
            
            <Area type="monotone" dataKey="value" stroke={'#3182CE'} fillOpacity={1} fill="url(#colorvalue)" />
          </AreaChart>
        </ResponsiveContainer>
        </>
      )}
    </Stack>
  );
}

export default ResearchGraph