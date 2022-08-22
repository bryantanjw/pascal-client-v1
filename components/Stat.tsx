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
      py={1}
      bg="bg-surface"
      borderRadius="lg"
      {...boxProps}
    >
      <Stack>
        <Text fontSize="sm" color="muted">
          {label}
        </Text>
        <Heading fontWeight={'semibold'} size={useBreakpointValue({ base: 'sm', md: 'sm' })}>{value}</Heading>
      </Stack>
    </Box>
  )
}