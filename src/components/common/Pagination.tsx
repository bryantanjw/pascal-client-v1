import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { BsSearch } from "react-icons/bs";

export const Pagination = ({ table }) => {
  const paginationButtonStyle = {
    border: "1px solid transparent",
    _hover: {
      bg: mode("gray.200", "rgba(23,25,35,0.3)"),
    },
    _active: {
      bg: mode("gray.50", "rgba(32, 34, 46, 0.3)"),
      backdropFilter: { base: "", md: "blur(15px)" },
      boxShadow: "md",
      rounded: "lg",
      borderColor: mode("gray.400", "rgba(255,255,255,0.16)"),
    },
  };

  return (
    <ButtonGroup
      size={"sm"}
      variant={"ghost"}
      mt={6}
      display={"flex"}
      justifyContent="flex-end"
      alignItems={"center"}
    >
      <IconButton
        aria-label="Previous Page"
        icon={<ChevronLeftIcon />}
        onClick={() => table.previousPage()}
        isDisabled={!table.getCanPreviousPage()}
        sx={paginationButtonStyle}
      />
      {table.getPageCount() > 1 && (
        <>
          {table.getPageCount() <= 4 ? (
            [...Array(table.getPageCount())].map((_, i) => (
              <Button
                key={i}
                onClick={() => table.setPageIndex(i)}
                disabled={!table.getCanPreviousPage()}
                isActive={table.getState().pagination.pageIndex === i}
                sx={paginationButtonStyle}
              >
                {i + 1}
              </Button>
            ))
          ) : (
            <>
              <Button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                display={
                  table.getState().pagination.pageIndex > 2 ? "block" : "none"
                }
                isActive={table.getState().pagination.pageIndex === 0}
                sx={paginationButtonStyle}
              >
                1
              </Button>
              {table.getState().pagination.pageIndex > 2 && <span>...</span>}
              {table.getState().pagination.pageIndex > 1 && (
                <Button
                  onClick={() =>
                    table.setPageIndex(
                      table.getState().pagination.pageIndex - 1
                    )
                  }
                  disabled={!table.getCanPreviousPage()}
                  sx={paginationButtonStyle}
                >
                  {table.getState().pagination.pageIndex}
                </Button>
              )}
              <Button
                onClick={() =>
                  table.setPageIndex(table.getState().pagination.pageIndex)
                }
                disabled={!table.getCanPreviousPage()}
                isActive={true}
                sx={paginationButtonStyle}
              >
                {table.getState().pagination.pageIndex + 1}
              </Button>
              {table.getState().pagination.pageIndex <
                table.getPageCount() - 2 && (
                <Button
                  onClick={() =>
                    table.setPageIndex(
                      table.getState().pagination.pageIndex + 1
                    )
                  }
                  disabled={!table.getCanPreviousPage()}
                  sx={paginationButtonStyle}
                >
                  {table.getState().pagination.pageIndex + 2}
                </Button>
              )}
              {table.getState().pagination.pageIndex <
                table.getPageCount() - 3 && <span>...</span>}
              <Button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                display={
                  table.getState().pagination.pageIndex <
                  table.getPageCount() - 1
                    ? "block"
                    : "none"
                }
                isActive={
                  table.getState().pagination.pageIndex ===
                  table.getPageCount() - 1
                }
                sx={paginationButtonStyle}
              >
                {table.getPageCount()}
              </Button>
            </>
          )}
        </>
      )}
      <IconButton
        aria-label="Next Page"
        icon={<ChevronRightIcon />}
        onClick={() => table.nextPage()}
        isDisabled={!table.getCanNextPage()}
        sx={paginationButtonStyle}
      />
    </ButtonGroup>
  );
};

// A debounced input react component
export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export const TableActions = ({
  globalFilter,
  setGlobalFilter,
  menuOptions,
  badgeEnum,
}) => {
  return (
    <HStack mb={3} width={"fit-content"} ml={"auto"}>
      <FormControl id="search" width={"fit-content"}>
        <InputGroup
          w={{ base: "full", md: "280px" }}
          size="md"
          variant={"outline"}
          ml="auto"
        >
          <FormLabel srOnly>Search market</FormLabel>
          <InputLeftElement pointerEvents="none" color="gray.400">
            <BsSearch />
          </InputLeftElement>
          <Input
            as={DebouncedInput}
            rounded="lg"
            boxShadow={"sm"}
            bg={mode("gray.50", "rgba(32, 34, 46, 0.3)")}
            fontSize={"sm"}
            type="text"
            placeholder="Search market"
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
          />
        </InputGroup>
      </FormControl>

      <Menu closeOnSelect={false}>
        <MenuButton
          variant={"outline"}
          boxShadow={"sm"}
          fontWeight={"normal"}
          fontSize={"sm"}
          rounded={"lg"}
          bg={mode("gray.50", "rgba(32, 34, 46, 0.3)")}
          textColor={mode("gray.600", "gray.300")}
          _active={{ bg: mode("gray.50", "") }}
          as={Button}
          rightIcon={<ChevronDownIcon ml={{ base: 5, md: 2 }} />}
        >
          Status
        </MenuButton>
        <MenuList>
          <MenuOptionGroup
            type="radio"
            onChange={(value) => setGlobalFilter(String(value))}
          >
            {menuOptions.map((option, index) => (
              <MenuItemOption key={index} value={option.value}>
                <Badge
                  variant={"subtle"}
                  fontSize="xs"
                  colorScheme={badgeEnum[option.value]}
                >
                  {option.label}
                </Badge>
              </MenuItemOption>
            ))}
            ;
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </HStack>
  );
};
