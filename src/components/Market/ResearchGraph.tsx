import React from 'react'
import useSWR from 'swr'
import { 
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend,
} from 'recharts';
import {
  Stack,
  Text, Heading, useColorModeValue,
  Alert, AlertIcon,
} from '@chakra-ui/react'

const data = [
    {
      timestamp: 'Page A',
      value: 2400,
    },
    {
      timestamp: 'Page B',
      value: 1398,
    },
    {
      timestamp: 'Page C',
      value: 9800,
    },
    {
      timestamp: 'Page D',
      value: 3908,
    },
    {
      timestamp: 'Page E',
      value: 4800,
    },
    {
      timestamp: 'Page F',
      value: 3800,
    },
]

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

const fetcher = (url) => fetch(url)

const ResearchGraph = ({ market }) => {
  const { data, error } = useSWR(`/api/fetchPrice`, fetcher)
  if (error) {
    console.log("Error fetchPrice ", error)
    return (
      <Alert status='error' rounded={'lg'}>
          <AlertIcon mr={4} />
          An error has occured loading chart.            
      </Alert>
    )
  }
  if (!data) return <div>Loading data...</div>
  if (data) console.log("fetchPrice", data.body)

  return (
    <Stack spacing={5}>
      {/* TODO: add change in price */}
      <Heading fontSize={'2xl'} color={"#3182CE"}>{market.target_value}</Heading>

      <AreaChart width={586} height={250} data={data} 
        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>

        <defs>
          <linearGradient id="colorvalue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={'#3182CE'} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={'#3182CE'} stopOpacity={0}/>
          </linearGradient>
        </defs>
        
        <XAxis dataKey="timestamp" 
          tickCount={5} tickLine={false} axisLine={false} 
          fontSize={'11px'} padding={{ right: 50 }}  />
        <YAxis  type={'number'} domain={[dataMin => (dataMin), dataMax => (dataMax)]}
          orientation='right' tickCount={6} width={50} tickLine={false} 
          axisLine={false} fontSize={'11px'} />

        <CartesianGrid vertical={false}
          // eslint-disable-next-line react-hooks/rules-of-hooks
          opacity={useColorModeValue('50%', '20%')}
        />
        <Tooltip content={<CustomTooltip active payload label/>} />
        
        <Area type="monotone" dataKey="value" stroke={'#3182CE'} fillOpacity={1} fill="url(#colorvalue)" />
      </AreaChart>
    </Stack>
  );
}

export default ResearchGraph