import { Box, Heading, Stack, Text, useBreakpointValue, useColorModeValue } from '@chakra-ui/react'
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
      bg="bg-surface"
      borderRadius="lg"
      boxShadow={useColorModeValue('sm', 'sm-dark')}
      {...boxProps}
    >
      <Stack>
        <Text fontSize="sm" color="muted">
          {label}
        </Text>
        <Heading size={useBreakpointValue({ base: 'sm', md: 'md' })}>{value}</Heading>
      </Stack>
    </Box>
  )
}