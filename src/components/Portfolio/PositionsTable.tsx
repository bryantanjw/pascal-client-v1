import React, { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Center,
  Button,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { Select as ReactSelect, chakraComponents } from "chakra-react-select";
import { BsSearch } from "react-icons/bs";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ChevronRightIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { PublicKey } from "@solana/web3.js";
import { PositionsContext } from ".";
import PositionModal from "./PositionModal";

import styles from "@/styles/Home.module.css";
import { formatNumber } from "@/utils/helpers";

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
    cell: (info) => formatNumber(info.getValue()) + " USDC",
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

  function renderCell(row, index: number) {
    return flexRender(
      row.getVisibleCells()[index].column.columnDef.cell,
      row.getVisibleCells()[index].getContext()
    );
  }

  const { isOpen, onClose, onOpen } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

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
                <ScaleFade key={row.id} in={true} delay={delay}>
                  <Stack
                    transition="all 0.2s ease"
                    minH="80px"
                    rounded="2xl"
                    p="6"
                    borderWidth={"1px"}
                    borderColor={mode("gray.300", "rgba(255, 255, 255, 0.11)")}
                    background={mode(
                      "transparent",
                      "linear-gradient(to bottom right, rgba(31,33,45,0.5), rgba(200,200,200,0.01) 100%)"
                    )}
                    backdropFilter={{ md: "blur(15px)" }}
                    _hover={{
                      background: mode(
                        "linear-gradient(to bottom right, rgba(255,255,255,1), rgba(255,255,255,0.8) 100%)",
                        "linear-gradient(to bottom right, rgba(31,33,45,0.7), rgba(200,200,200,0.1) 100%)"
                      ),
                      boxShadow: "lg",
                      borderColor: mode("", "rgba(255, 255, 255, 0.3)"),
                      cursor: "pointer",
                    }}
                    _focus={{
                      background: mode(
                        "linear-gradient(to bottom right, rgba(255,255,255,1), rgba(255,255,255,0.8) 100%)",
                        "linear-gradient(to bottom right, rgba(31,33,45,0.7), rgba(200,200,200,0.1) 100%)"
                      ),
                      boxShadow: "lg",
                      borderColor: mode("", "rgba(255, 255, 255, 0.3)"),
                      cursor: "pointer",
                    }}
                    letterSpacing={"wide"}
                    onClick={onOpen}
                  >
                    <Flex justifyContent="space-between" alignItems="center">
                      <Stack spacing={0} width={"65%"}>
                        <Text>{renderCell(row, 0)}</Text>
                        <HStack alignItems={"center"}>
                          <Text
                            fontWeight={"semibold"}
                            fontSize={"lg"}
                            color={mode("purple.500", "purple.200")}
                          >
                            {renderCell(row, 1)}
                          </Text>
                          <Text>•</Text>
                          <Text
                            fontSize={"sm"}
                            fontWeight={"medium"}
                            casing={"capitalize"}
                            color={mode("gray.500", "gray.400")}
                          >
                            {renderCell(row, 2)}
                          </Text>
                        </HStack>
                      </Stack>

                      <HStack spacing={6} alignItems={"center"}>
                        <Text fontWeight={"semibold"} fontSize={"lg"}>
                          {renderCell(row, 3)}
                        </Text>
                        <IconButton
                          as={Link}
                          href={`/market/${row.original.account.market.toBase58()}`}
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Navigate to market"
                          icon={<ChevronRightIcon />}
                          fontSize="3xl"
                          transition={"all .2s ease"}
                          variant={"ghost"}
                          bg={"gray.800"}
                          color={"gray.50"}
                          _hover={{
                            transform: "scale(1.08)",
                          }}
                        />
                      </HStack>
                    </Flex>
                  </Stack>
                </ScaleFade>
              );
            })}
          </Stack>
        </>
      )}

      <PositionModal isOpen={isOpen} onClose={onClose} />
    </Stack>
  );
};

const TableContent = () => {
  const positions = useContext(PositionsContext);

  return (
    <>
      {positions ? (
        positions.length === 0 ? (
          <HStack as={Center} flexDirection={"row"} spacing={12} pt={2} pb={12}>
            <ScaleFade in={true} initialScale={0.9}>
              <Image
                src="/emptyState.png"
                alt="Empty Pascal Position Table"
                width={250}
                height={250}
              />
            </ScaleFade>

            <ScaleFade in={true} initialScale={0.9} delay={0.1}>
              <Stack spacing={8}>
                <Text fontSize={"xl"}>You don't have any positions</Text>
                <Link href={"/"}>
                  <Button
                    className={mode(
                      styles.wallet_adapter_button_trigger_light_mode,
                      styles.wallet_adapter_button_trigger_dark_mode
                    )}
                    p="5"
                    rounded={"xl"}
                    fontSize={"lg"}
                    boxShadow={"xl"}
                    textColor={mode("white", "#353535")}
                    bg={mode("#353535", "gray.50")}
                  >
                    Start Trading
                  </Button>
                </Link>
              </Stack>
            </ScaleFade>
          </HStack>
        ) : (
          <DataTable columns={columns} data={positions} showHeader={false} />
        )
      ) : (
        Array(2)
          .fill(0)
          .map((_, i) => (
            <Flex
              className={styles.portfolioCard}
              key={i}
              my={2}
              py={5}
              px={6}
              justifyContent="space-between"
              alignItems={"center"}
              minH={"65px"}
              boxShadow={"0px 2px 8px 0px #0000001a"}
              bg={mode("#FBFBFD", "")}
              _before={{
                ml: -7,
                width: "130%",
                height: "210vh",
              }}
              _after={{
                bgImage: mode(
                  "none",
                  "linear-gradient(to bottom right, rgb(26,32,44,1), rgb(26,32,44,1) 120%)"
                ),
              }}
              letterSpacing={"wide"}
            >
              <Stack>
                <Skeleton rounded={"md"} width={"200px"} height="18px" />
                <Skeleton rounded={"md"} width={"100px"} height="18px" />
              </Stack>
              <Skeleton rounded={"md"} width={"80px"} height="20px" />
            </Flex>
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
