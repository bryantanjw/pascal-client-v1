import { 
    Box, 
    SimpleGrid, 
    useColorModeValue as mode,
    Badge,
    Text,
    HStack,
    Heading,
} from '@chakra-ui/react'
import * as React from 'react'
import { BsCaretDownFill, BsCaretUpFill } from 'react-icons/bs'

export interface StatCardProps {
    data: {
      label: string
      value: string | number
      change: number
    }
}

interface IndicatorProps {
    type: 'up' | 'down'
    value: string | number
}
  
const types = {
    up: { icon: BsCaretUpFill, colorScheme: 'green' },
    down: { icon: BsCaretDownFill, colorScheme: 'red' },
}
  
export const Indicator = (props: IndicatorProps) => {
    const { type, value } = props

    return (
        <Badge
            display="flex"
            alignItems="center"
            variant="solid"
            colorScheme={types[type].colorScheme}
            rounded="base"
            px="1"
        >
            <Box
                aria-hidden
                color="currentcolor"
                as={types[type].icon}
                pos="relative"
                top={type === 'down' ? 'px' : undefined}
            />
            <Box srOnly>
                Value is {type} by {value}
            </Box>
            <Text fontSize="sm" color="white" marginStart="1">
                {value}
            </Text>
        </Badge>
    )
}

const data: StatCardProps['data'][] = [
  {
    label: 'Portfolio value',
    value: '$7,650',
    change: -0.025,
  },
  {
    label: 'Return on investment',
    value: '83%',
    change: 0.001,
  },
  {
    label: 'This week',
    value: '60.67%',
    change: 0.12,
  },
]
  
export function StatCard(props: StatCardProps) {
    const { label, value, change } = props.data
  
    const isNegative = change < 0
    const changeText = `${change * 100}%`
  
    return (
        <Box
            px="6"
            py="4"
            bg={mode('white', 'gray.700')}
            boxShadow={'md'}
            borderWidth={1}
            borderRadius={"md"}
            color={mode('gray.800', 'white')}
        >
            <Text fontWeight="sm" fontSize="sm">
                {label}
            </Text>

            <HStack spacing="4" mt="2">
                <Heading as="h4" fontSize="2xl" lineHeight="1" letterSpacing="tight">
                    {value}
                </Heading>
                <Indicator type={isNegative ? 'down' : 'up'} value={changeText} />
            </HStack>
        </Box>
    )
}  

export const Stats = () => {
  return (
    <Box as="section" bg={mode('gray.50', 'gray.800')} mb="10">
      <Box maxW="3xl">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="6">
          {data.map((stat, idx) => (
            <StatCard key={idx} data={stat} />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  )
}
