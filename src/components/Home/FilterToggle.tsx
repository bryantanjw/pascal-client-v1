import {
  Box,
  BoxProps,
  HStack,
  Text,
  useCheckbox,
  UseCheckboxProps,
  useColorModeValue as mode,
  useId,
  Image,
} from "@chakra-ui/react";
import * as React from "react";

interface ToggleButtonProps extends UseCheckboxProps {
  iconUrl: string;
  title: string;
}

const ToggleButton = (props: BoxProps) => (
  <Box
    borderWidth="1px"
    py={1}
    px={{ base: 5, md: 3 }}
    borderRadius="3xl"
    cursor="pointer"
    transition="all 0.2s ease"
    bg={mode("gray.100", "gray.700")}
    _hover={{
      borderColor: mode("black", "white"),
      bg: "transparent",
    }}
    _focus={{ shadow: "outline", boxShadow: "none" }}
    _checked={{
      bg: mode("black", "white"),
      color: mode("white", "black"),
    }}
    {...props}
  />
);

const FilterToggle = (props: ToggleButtonProps) => {
  const { iconUrl, title, ...rest } = props;
  const { getCheckboxProps, getInputProps, getLabelProps, state } =
    useCheckbox(rest);
  const id = useId();

  const toggledIcon = {
    filter: mode("invert(100%)", "invert(0%)"),
  };
  const notToggledIcon = {
    filter: mode("invert(0%)", "invert(100%)"),
  };

  return (
    <label {...getLabelProps()}>
      <input {...getInputProps()} aria-labelledby={id} />
      <ToggleButton {...getCheckboxProps()} id={id}>
        <HStack spacing={1}>
          <Image
            src={iconUrl}
            alt={title}
            width={{ base: "11px", md: "15px" }}
            sx={state.isChecked ? toggledIcon : notToggledIcon}
            ml={{ base: -2, md: 0 }}
          />
          <Text fontSize={{ base: "10px", md: "sm" }} fontWeight="bold">
            {title}
          </Text>
        </HStack>
      </ToggleButton>
    </label>
  );
};

export default FilterToggle;
