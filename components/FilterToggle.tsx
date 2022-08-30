import {
  Box, BoxProps,
  HStack,
  Text,
  useCheckbox,
  UseCheckboxProps,
  useColorModeValue,
  useId,
  Image,
} from '@chakra-ui/react'
import * as React from 'react'

interface ToggleButtonProps extends UseCheckboxProps {
  iconUrl: string,
  title: string
}

export const ToggleButton = (props: BoxProps) => (
  <Box
    borderWidth="1px"
    py={1}
    px={3}
    borderRadius="3xl"
    cursor="pointer"
    transition="all 0.2s"
    bg={useColorModeValue('gray.100', 'gray.700')}
    _hover={{
      borderColor: useColorModeValue('black', 'white'),
      bg: useColorModeValue('white', 'gray.800')
    }}
    _focus={{ shadow: 'outline', boxShadow: 'none' }}
    _checked={{
      bg: useColorModeValue('black', 'white'),
      color: useColorModeValue('white', 'black'),
    }}
    {...props}
  />
)
  
export const FilterToggle = (props: ToggleButtonProps) => {
  const { iconUrl, title, ...rest } = props
  const { getCheckboxProps, getInputProps, getLabelProps, state } = useCheckbox(rest)
  const id = useId()

  const toggledIcon = {
      filter: useColorModeValue('invert(100%)', 'invert(0%)')
  }
  const notToggledIcon = {
      filter: useColorModeValue('invert(0%)', 'invert(100%)')
  }

  return (
    <label {...getLabelProps()}>
      <input {...getInputProps()} aria-labelledby={id} />
      <ToggleButton {...getCheckboxProps()} id={id}>
        <HStack spacing={1}>
          {/* change icon filter based on toggle checked state */}
          <Image src={iconUrl} alt={title} width={'15px'} 
              sx={state.isChecked ? toggledIcon : notToggledIcon}
          />
          
          <Box>
            <Text fontSize={'sm'} fontWeight="bold">{title}</Text>
          </Box>
        </HStack>
      </ToggleButton>
    </label>
  )
}
  