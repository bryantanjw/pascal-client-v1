import React, { useContext, useState } from "react";
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue as mode,
  Badge,
  chakra,
  Flex,
  Stack,
  Text,
  Skeleton,
  ScaleFade,
} from "@chakra-ui/react";
import { Select as ReactSelect, chakraComponents } from "chakra-react-select";
import { BsSearch } from "react-icons/bs";
import { createColumnHelper } from "@tanstack/react-table";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { PublicKey } from "@solana/web3.js";
import ChakraNextLink from "../ChakraNextLink";
import { PositionsContext } from ".";

import styles from "@/styles/Home.module.css";

// TODO: add sorting table column function using react-table
// example: https://codesandbox.io/s/mjk1v?file=/src/makeData.js:19-24

// Custom style config for ReactSelect
// Documentation: https://github.com/csandman/chakra-react-select
const ReactSelectMenuItem = {
  Option: ({ children, ...props }) => (
    // @ts-ignore
    <chakraComponents.Option {...props}>
      <Badge my={1} colorScheme={props.data.colorScheme}>
        {children}
      </Badge>
    </chakraComponents.Option>
  ),
};

const statusOptions = [
  {
    label: "ACTIVE",
    value: "matched",
    colorScheme: "green",
  },
  {
    label: "PENDING",
    value: "open",
    colorScheme: "orange",
  },
  {
    label: "CLOSED",
    value: "closed",
    colorScheme: "gray",
  },
];

const badgeEnum: Record<string, string> = {
  matched: "green",
  open: "orange",
  closed: "gray",
};

type Positions = {
  publicKey: PublicKey;
  account: any;
  marketTitle: string;
  marketStatus: string;
  prices: any;
  probYes: string | number;
  totalStake: number;
};

const columnHelper = createColumnHelper<Positions>();

const columns = [
  columnHelper.accessor((row) => row.marketTitle, {
    cell: (info) => info.getValue(),
    header: "Market",
  }),
  columnHelper.accessor((row) => row.probYes, {
    cell: (info) => Number(info.getValue()) * 100 + "%",
    header: "Price",
  }),
  columnHelper.accessor((row) => row.marketStatus, {
    cell: (info) => info.getValue(),
    header: "Status",
  }),
  columnHelper.accessor((row) => row.totalStake, {
    cell: (info) => info.getValue() + " USDC",
    header: "Stake",
  }),
];

type DataTableProps<Data extends object> = {
  data: any[];
  columns: ColumnDef<Data, any>[];
  showHeader?: boolean;
};

const DataTable = <Data extends object>({
  data,
  columns,
  showHeader = true,
}: DataTableProps<Data>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <Stack my={1}>
      {data && (
        <>
          {showHeader &&
            table.getHeaderGroups().map((headerGroup) => (
              <Flex
                key={headerGroup.id}
                justifyContent={"space-between"}
                px={4}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <Text
                      _hover={{
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      <chakra.span
                        pl="4"
                        display={
                          header.column.getIsSorted() ? "inline-block" : "none"
                        }
                      >
                        {header.column.getIsSorted() === "desc" ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )}
                      </chakra.span>
                    </Text>
                  );
                })}
              </Flex>
            ))}
          <Stack spacing={2}>
            {table.getRowModel().rows.map((row, index) => {
              const delay = index * 0.12;

              return (
                <ChakraNextLink
                  key={row.id}
                  to={`/market/${row.original.account.market.toBase58()}`}
                  _hover={{ textDecoration: "none" }}
                >
                  <ScaleFade in={true} delay={delay}>
                    <Flex
                      className={styles.portfolioCard}
                      py={5}
                      px={6}
                      justifyContent="space-between"
                      alignItems={"center"}
                      transition={"all 0.2s ease"}
                      minH={"65px"}
                      boxShadow={"0px 2px 8px 0px #0000001a"}
                      _hover={{
                        shadow: mode("0px 2px 8px 3px #0000001a", ""),
                        transform: mode("scale(1.018)", ""),
                      }}
                      _after={{
                        bg: mode("#FBFBFD", ""),
                        bgImage: mode(
                          "none",
                          "linear-gradient(to bottom left, rgb(26,32,44), rgb(26,32,44) 120%)"
                        ),
                      }}
                      _before={{
                        ml: -7,
                        width: "130%",
                        height: "180vh",
                      }}
                      letterSpacing={"wide"}
                    >
                      <Stack spacing={0} width={"65%"}>
                        <Text>
                          {flexRender(
                            row.getVisibleCells()[0].column.columnDef.cell,
                            row.getVisibleCells()[0].getContext()
                          )}
                        </Text>
                        <HStack alignItems={"center"}>
                          <Text
                            fontWeight={"semibold"}
                            fontSize={"lg"}
                            color={mode("purple.500", "purple.200")}
                          >
                            {flexRender(
                              row.getVisibleCells()[1].column.columnDef.cell,
                              row.getVisibleCells()[1].getContext()
                            )}
                          </Text>
                          <Text>•</Text>
                          <Text
                            fontSize={"sm"}
                            fontWeight={"medium"}
                            casing={"capitalize"}
                            color={mode("gray.500", "gray.400")}
                          >
                            {flexRender(
                              row.getVisibleCells()[2].column.columnDef.cell,
                              row.getVisibleCells()[2].getContext()
                            )}
                          </Text>
                        </HStack>
                      </Stack>
                      <Text fontWeight={"semibold"} fontSize={"lg"}>
                        {flexRender(
                          row.getVisibleCells()[3].column.columnDef.cell,
                          row.getVisibleCells()[3].getContext()
                        )}
                      </Text>
                    </Flex>
                  </ScaleFade>
                </ChakraNextLink>
              );
            })}
          </Stack>
        </>
      )}
    </Stack>
  );
};

const TableContent = () => {
  const positions = useContext(PositionsContext);

  return (
    <>
      {positions ? (
        positions.length === 0 ? (
          <Text>No market positions found</Text>
        ) : (
          <DataTable columns={columns} data={positions} showHeader={false} />
        )
      ) : (
        Array(3)
          .fill(0)
          .map((_, i) => (
            <Stack key={i} my={2}>
              <Skeleton borderRadius={"10px"} height="45px" />
            </Stack>
          ))
      )}
    </>
  );
};

const TableActions = () => {
  return (
    <HStack spacing={3} justifyContent={"flex-end"}>
      <FormControl w={"300px"} id="search">
        <InputGroup size="sm" variant={"filled"}>
          <FormLabel srOnly>Search</FormLabel>
          <InputLeftElement pointerEvents="none" color="gray.400">
            <BsSearch />
          </InputLeftElement>
          <Input rounded="base" type="search" placeholder="Search" />
        </InputGroup>
      </FormControl>

      <FormControl minW={{ base: "100px", md: "150px" }} w={"auto"}>
        <ReactSelect
          variant="outline"
          isMulti
          useBasicStyles
          size="sm"
          name="status"
          options={statusOptions}
          placeholder="Status"
          closeMenuOnSelect={false}
          components={ReactSelectMenuItem}
        />
      </FormControl>
    </HStack>
  );
};

const PositionsTable = () => {
  return (
    <>
      {/* <TableActions /> */}
      <TableContent />
    </>
  );
};

export default React.memo(PositionsTable);
