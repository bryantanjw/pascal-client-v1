import { Box, Heading, Stack, Text, useBreakpointValue } from '@chakra-ui/react'
import * as React from 'react'

interface Props {
  label: string
  value: string
}
export const Stat = (props: Props) => {
  const { label, value, ...boxProps } = props

  return (
    <Box
      py={2}
      mb={{ 'base': 1, 'md': 0}}
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