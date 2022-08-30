import { Box, Heading, Stack, Text, useBreakpointValue } from '@chakra-ui/react'
import * as React from 'react'

interface Props {
  label: string
  value: string
}
export const Stat = (props: Props) => {
  const { label, value, ...boxProps } = props

  // Get duration until event closing date
  // useEffect(() => {
  //     const interval = setInterval(() => {
  //         const delta = (new Date(event.closing_date)).valueOf() - (new Date()).valueOf();
  //         const hours = Math.floor(delta / 3.6e6);
  //         const minutes = Math.floor((delta % 3.6e6) / 6e4);
      
  //         setTimerString(`${hours}h ${minutes}m remaining`);
      
  //         if (delta < 0) {
  //           console.log('Clearing interval...');
  //           clearInterval(interval);
  //         }
  //     }, 1000);

  //     // Anytime the component unmounts clean up the interval
  //     return () => {
  //         if (interval) {
  //             clearInterval(interval);
  //         }
  //     }
  // }, []);

  return (
    <Box
      py={2}
      bg="bg-surface"
      borderRadius="lg"
      {...boxProps}
    >
      <Stack>
        <Text mb={-1} fontSize="md" color="muted">
          {label}
        </Text>
        <Heading fontWeight={'semibold'} size={useBreakpointValue({ base: 'sm', md: 'md' })}>{value}</Heading>
      </Stack>
    </Box>
  )
}