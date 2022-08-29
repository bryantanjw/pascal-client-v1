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

interface ButtonCheckboxProps extends UseCheckboxProps {
    iconUrl: string,
    title: string
}

export const ToggleButton = (props: BoxProps) => (
    <Box
      borderWidth="1px"
      py={1}
      px={2}
      borderRadius="3xl"
      cursor="pointer"
      transition="all 0.2s"
      _focus={{ shadow: 'outline', boxShadow: 'none' }}
      _checked={{
        bg: useColorModeValue('black', 'white'),
        color: useColorModeValue('white', 'black'),
      }}
      {...props}
    />
)
  
  
export const FilterToggle = (props: ButtonCheckboxProps) => {
    const { iconUrl, title, ...rest } = props
    const { getCheckboxProps, getInputProps, getLabelProps, state } = useCheckbox(rest)
    const id = useId()

    return (
      <label {...getLabelProps()}>
        <input {...getInputProps()} aria-labelledby={id} />
        <ToggleButton {...getCheckboxProps()} id={id}>
          <HStack spacing={1}>
            <Image src={iconUrl} alt={title} width={'15px'}
                filter={useColorModeValue('invert(0%)', 'invert(100%)')} />
            <Box>
              <Text fontSize={'sm'} fontWeight="bold">{title}</Text>
            </Box>
          </HStack>
        </ToggleButton>
      </label>
    )
}
  