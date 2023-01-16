/* eslint-disable react/jsx-key */
import React from "react";
import { useTable, useSortBy } from "react-table";
import {
  Link,
  Box,
  useColorModeValue as mode,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Text,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Position } from "./PositionsTable";

// TODO: add sorting table column function using react-table
// example: https://codesandbox.io/s/mjk1v?file=/src/makeData.js:19-24

const ActivityTable = ({ user }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Market",
        accessor: "market",
      },
      {
        Header: "Amount",
        accessor: "size",
      },
      {
        Header: "Action",
        accessor: "action",
      },
      {
        Header: "Time",
        accessor: "createdAt",
      },
      {
        Header: "Tx",
        accessor: "txId",
        Cell: function MarketCell(data: any) {
          return (
            <Link href="#">
              <ExternalLinkIcon />
            </Link>
          );
        },
      },
    ],
    []
  );

  return (
    <Box my={4} rounded={"lg"} borderWidth="1px" overflowX={"auto"}>
      <Table fontSize="sm">
        <Thead bg={mode("gray.50", "gray.800")}>
          <Tr>
            {columns.map((column, index) => (
              <Th whiteSpace="nowrap" scope="col" key={index}>
                {column.Header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {user &&
            user.positions.map((row, index) => (
              <Tr key={index}>
                {columns.map((column, index) => {
                  const cell = row[column.accessor as keyof typeof row];
                  const element = column.Cell?.(cell) ?? cell;
                  return (
                    <Td whiteSpace="nowrap" key={index}>
                      {element}
                    </Td>
                  );
                })}
              </Tr>
            ))}
        </Tbody>
      </Table>
      {!user && (
        <Text color={mode("gray.600", "gray.700")} p={6} textAlign={"center"}>
          No activities found
        </Text>
      )}
    </Box>
  );
};

export default ActivityTable;
