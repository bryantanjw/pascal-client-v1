import { memo, useContext, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HStack,
  useColorModeValue as mode,
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
import {
  createColumnHelper,
  FilterFn,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import { ChevronRightIcon } from "@chakra-ui/icons";
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
import { Pagination, TableActions } from "../common/Pagination";
import PositionModal from "./PositionModal";
import { formatNumber } from "@/utils/helpers";

import styles from "@/styles/Home.module.css";

const marketStatusOptions = [
  {
    label: "OPEN",
    value: "open",
    colorScheme: "green",
  },
  {
    label: "CLOSED",
    value: "closed",
    colorScheme: "orange",
  },
  {
    label: "SETTLED",
    value: "settled",
    colorScheme: "gray",
  },
];

const badgeEnum: Record<string, string> = {
  open: "green",
  closed: "orange",
  settled: "gray",
};

type Position = {
  publicKey: PublicKey;
  account: any;
  marketTitle: string;
  marketStatus: string;
  prices: any;
  probYes: string | number;
  totalStake: number;
  lockTimestamp: string;
};

const columnHelper = createColumnHelper<Position>();

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
    cell: (info) => formatNumber(info.getValue()),
    header: "Stake",
  }),
  columnHelper.accessor((row) => row.lockTimestamp, {
    cell: (info) => info.getValue(),
    header: "Market Lock on",
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
  const [position, setPosition] = useState<Position | null>(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const globalFilterFn: FilterFn<any> = (
    row,
    columnId,
    filterValue: string
  ) => {
    const search = filterValue.toLowerCase();

    let value = row.getValue(columnId) as string;
    if (typeof value === "number") value = String(value);

    return value?.toLowerCase().includes(search);
  };

  const table = useReactTable({
    columns,
    data,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: globalFilterFn,
    state: {
      sorting,
      pagination,
      globalFilter,
    },
  });

  function renderCell(row, index: number) {
    return flexRender(
      row.getVisibleCells()[index].column.columnDef.cell,
      row.getVisibleCells()[index].getContext()
    );
  }

  return (
    <>
      <TableActions
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        menuOptions={marketStatusOptions}
        badgeEnum={badgeEnum}
      />

      {data && (
        <>
          <Stack spacing={2} mb={5}>
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
                    boxShadow="sm"
                    background={mode(
                      "transparent",
                      "linear-gradient(to bottom right, rgba(31,33,45,0.5), rgba(200,200,200,0.01) 100%)"
                    )}
                    backdropFilter={{ md: "blur(15px)" }}
                    _hover={{
                      background: mode(
                        "rgba(255,255,255,0.5)",
                        "linear-gradient(to bottom right, rgba(31,33,45,0.7), rgba(200,200,200,0.1) 100%)"
                      ),
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
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
                    onClick={() => {
                      onOpen();
                      setPosition(row.original);
                    }}
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
                          {renderCell(row, 3)} USDC
                        </Text>
                        <IconButton
                          as={Link}
                          href={`/market/${row.original.account.market.toBase58()}`}
                          onClick={(e) => e.stopPropagation()} // Prevent button from triggering parent onClick
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

          {position && (
            <PositionModal
              isOpen={isOpen}
              onClose={onClose}
              position={position}
            />
          )}

          <Pagination table={table} />
        </>
      )}
    </>
  );
};

const PositionsTable = () => {
  const positions = useContext(PositionsContext);

  return (
    <>
      {positions ? (
        positions.length === 0 ? (
          <HStack
            as={Center}
            flexDirection={"row"}
            spacing={12}
            pt={12}
            pb={12}
          >
            <ScaleFade in={true} initialScale={0.9}>
              <Image
                src="/emptyState.png"
                alt="Empty Pascal Position Tab"
                width={250}
                height={250}
              />
            </ScaleFade>

            <ScaleFade in={true} initialScale={0.9} delay={0.1}>
              <Stack spacing={5}>
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
        <Stack spacing={0}>
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <Flex
                className={styles.portfolioCard}
                key={i}
                my={2}
                mt={14}
                py={5}
                px={6}
                justifyContent="space-between"
                alignItems={"center"}
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
            ))}
        </Stack>
      )}
    </>
  );
};

export default memo(PositionsTable);
