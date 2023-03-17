import { useEffect, useMemo, useState } from "react";
import {
  HStack,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useColorModeValue as mode,
  chakra,
  Badge,
  Skeleton,
  Icon,
  Tooltip,
  ScaleFade,
  TableContainer,
  Image,
} from "@chakra-ui/react";
import { getMarket, Orders } from "@monaco-protocol/client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "@/context/ProgramProvider";
import { FaCircle } from "react-icons/fa";
import {
  ExternalLinkIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import {
  createColumnHelper,
  FilterFn,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Pagination, TableActions } from "../common/Pagination";
import { PublicKey } from "@solana/web3.js";
import ChakraNextLink from "../ChakraNextLink";

const orderStatusOptions = [
  {
    label: "MATCHED",
    value: "matched",
    colorScheme: "green",
  },
  {
    label: "OPEN",
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

type Activity = {
  publicKey: PublicKey;
  account: any;
  marketTitle: string;
  orderStatus: string;
};

const columnHelper = createColumnHelper<Activity>();

const columns = [
  columnHelper.accessor((row) => row.account.marketOutcomeIndex, {
    cell: (info) => (
      <HStack>
        <Icon
          as={FaCircle}
          boxSize={2}
          opacity={0.5}
          color={info.getValue() === 0 ? "purple.500" : "teal.500"}
        />
        <Text fontSize={"sm"} fontWeight={"semibold"}>
          {info.getValue() === 0 ? "YES" : "NO"}
        </Text>
      </HStack>
    ),
    header: " ",
  }),
  columnHelper.accessor((row) => row.marketTitle, {
    cell: (info) => (
      <Tooltip p={2} rounded={"md"} label={info.getValue()}>
        <Text ml={-6}>{info.getValue().substring(0, 35)}...</Text>
      </Tooltip>
    ),
    header: "Market",
  }),
  columnHelper.accessor((row) => row.account.stake, {
    cell: (info) => (
      <HStack alignItems={"center"}>
        <Text>{parseInt(info.getValue().toString(16), 16) / 10 ** 6}</Text>
        <Image ml={-1} alt="USDC coin" boxSize={"1.1rem"} src={"/usdc.png"} />
      </HStack>
    ),
    header: "Stake",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor((row) => row.account.expectedPrice, {
    cell: (info) => "$" + info.getValue(),
    header: "Price",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor((row) => row.orderStatus, {
    cell: (info) => (
      <Badge
        variant={"subtle"}
        fontSize="xs"
        colorScheme={badgeEnum[info.getValue()]}
      >
        {info.getValue()}
      </Badge>
    ),
    header: "Order Status",
  }),
  columnHelper.accessor((row) => row.account.creationTimestamp, {
    cell: (info) =>
      new Date(parseInt(info.getValue().toString(16), 16) * 1000).toUTCString(),
    header: "Timestamp",
  }),
  columnHelper.accessor((row) => row.publicKey, {
    cell: (info) => (
      <ChakraNextLink
        to={`https://solscan.io/account/${info
          .getValue()
          .toBase58()}?cluster=devnet`}
      >
        <ExternalLinkIcon />
      </ChakraNextLink>
    ),
    header: "Account",
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
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
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
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: globalFilterFn,
    state: {
      sorting,
      pagination,
      globalFilter,
    },
  });

  return (
    <>
      <TableActions
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        menuOptions={orderStatusOptions}
        badgeEnum={badgeEnum}
      />
      <TableContainer
        bg={mode("whiteAlpha.800", "rgba(32, 34, 46, 0.3)")}
        backdropFilter={{ base: "", md: "blur(15px)" }}
        boxShadow={"lg"}
        rounded={"xl"}
        borderWidth="1px"
        overflowX={"auto"}
        sx={{ borderCollapse: "separate", borderSpacing: 0 }}
      >
        <Table>
          {showHeader && (
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const meta: any = header.column.columnDef.meta;
                    return (
                      <Th
                        key={header.id}
                        _hover={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        pt={4}
                        isNumeric={meta?.isNumeric}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        <chakra.span
                          pl="4"
                          display={
                            header.column.getIsSorted()
                              ? "inline-block"
                              : "none"
                          }
                        >
                          {header.column.getIsSorted() === "desc" ? (
                            <TriangleDownIcon aria-label="sorted descending" />
                          ) : (
                            <TriangleUpIcon aria-label="sorted ascending" />
                          )}
                        </chakra.span>
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
          )}
          <Tbody>
            {data ? (
              data.length === 0 ? (
                <Tr>
                  <Td colSpan={columns.length}>
                    <Text
                      color={mode("gray.600", "gray.50")}
                      p={6}
                      textAlign={"center"}
                    >
                      No activities found
                    </Text>
                  </Td>
                </Tr>
              ) : (
                table.getRowModel().rows.map((row, index) => {
                  const delay = index * 0.08;

                  return (
                    <Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        const meta: any = cell.column.columnDef.meta;
                        return (
                          <Td key={cell.id} isNumeric={meta?.isNumeric}>
                            <ScaleFade key={row.id} in={true} delay={delay}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </ScaleFade>
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })
              )
            ) : (
              <Tr>
                {Array(7)
                  .fill(0)
                  .map((_, i) => (
                    <Td key={i}>
                      <Skeleton height="20px" />
                    </Td>
                  ))}
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      {data && <Pagination table={table} />}
    </>
  );
};

export const ActivityTable = () => {
  const program = useProgram();
  const { publicKey } = useWallet();
  const [activities, setAcitivities] = useState<any>();

  useEffect(() => {
    if (publicKey) {
      const fetchActivities = async () => {
        try {
          const orderResponse = await Orders.orderQuery(program)
            .filterByPurchaser(publicKey)
            .fetch();
          const filteredData = orderResponse.data.orderAccounts
            .filter((d) => d.account.forOutcome === true)
            .sort((a, b) => {
              return (
                parseInt(b.account.creationTimestamp.toString(16), 16) * 1000 -
                parseInt(a.account.creationTimestamp.toString(16), 16) * 1000
              );
            });
          const withTitle = await Promise.all(
            filteredData.map(async (d) => {
              const market = await getMarket(program, d.account.market);
              return {
                ...d,
                orderStatus: Object.keys(d.account.orderStatus)[0],
                marketTitle: market.data.account.title,
              };
            })
          );
          setAcitivities(withTitle);
        } catch (error) {
          console.log("fetchActivities error: ", error);
        }
      };
      fetchActivities();
    }
  }, [program]);

  return (
    <>
      <DataTable columns={columns} data={activities} showHeader={true} />
    </>
  );
};

export default ActivityTable;
