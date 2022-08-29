import {
    Box,
    chakra,
    Text,
    useRadio,
    UseRadioProps,
    UseRadioGroupProps,
    useRadioGroup,
    useColorModeValue as mode,
    useId,
    Stack,
    HStack,
} from '@chakra-ui/react'
import * as React from 'react'
  
const RadioBox = chakra('div', {
    baseStyle: {
      borderWidth: '1px',
      px: '6px',
      borderRadius: '3xl',
      cursor: 'pointer',
      transition: 'all 0.2s',
      _focus: { shadow: 'outline' },
    },
})
  
interface ButtonRadioProps extends UseRadioProps {
    icon: React.ReactElement
    label: string
}

interface ButtonRadioGroupProps extends UseRadioGroupProps {
    options: Array<{
      label: string
      value: string
      icon: React.ReactElement
    }>
}
  
export const ButtonRadio = (props: ButtonRadioProps) => {
    const { label, icon } = props
    const { getCheckboxProps, getInputProps, getLabelProps, state } = useRadio(props)
    const id = useId()
  
    const checkedStyles = {
      bg: mode('blue.50', 'rgb(0 31 71)'),
      borderColor: 'blue.600',
      boxShadow: 'none'
    }
  
    return (
      <label {...getLabelProps()}>
        <input {...getInputProps()} aria-labelledby={id} />
        <RadioBox {...getCheckboxProps()} _checked={checkedStyles} id={id}>
            <HStack p={1}>
              <Box aria-hidden fontSize="lg" color={state.isChecked ? 'blue.600' : undefined}>
                {icon}
              </Box>
              <Text fontWeight="bold" fontSize="sm">
                {label}
              </Text>
            </HStack>
        </RadioBox>
      </label>
    )
}
  
export const ButtonRadioGroup = (props: ButtonRadioGroupProps) => {
    const { options, ...rest } = props
    const { getRadioProps, getRootProps } = useRadioGroup(rest)
    
    return (
      <Stack
        direction={'row'}
        spacing="3"
        {...getRootProps()}
      >
        {options.map((option) => (
          <ButtonRadio
            key={option.value}
            icon={option.icon}
            label={option.label}
            {...getRadioProps({ value: option.value })}
          />
        ))}
      </Stack>
    )
}
  
  