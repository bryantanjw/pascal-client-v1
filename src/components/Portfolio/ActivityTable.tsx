import { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useColorModeValue as mode,
  Box,
  Badge,
  Skeleton,
  Icon,
  TableContainer,
  Tooltip,
  Link,
  ScaleFade,
} from "@chakra-ui/react";
import { getMarket, Orders } from "@monaco-protocol/client";
import { useWallet } from "@solana/wallet-adapter-react";
import { Select as ReactSelect, chakraComponents } from "chakra-react-select";
import { BsSearch } from "react-icons/bs";
import { useProgram } from "@/context/ProgramProvider";
import { FaCircle } from "react-icons/fa";
import { ExternalLinkIcon } from "@chakra-ui/icons";

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

export const badgeEnum: Record<string, string> = {
  matched: "green",
  open: "orange",
  closed: "gray",
};

const TableContent = () => {
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
    <Box
      bg={mode("whiteAlpha.800", "rgba(32, 34, 46, 0.7)")}
      backdropFilter={{ base: "", md: "blur(15px)" }}
      boxShadow={"lg"}
      my={1}
      rounded={"lg"}
      borderWidth="1px"
      overflowX={"auto"}
    >
      <TableContainer>
        <Table alignContent={"start"}>
          <Thead bg={mode("gray.50", "gray.800")}>
            <Tr>
              <Th />
              <Th pl={0}>Market</Th>
              <Th>Stake</Th>
              <Th>Status</Th>
              <Th>Timestamp</Th>
              <Th>Account</Th>
            </Tr>
          </Thead>
          <Tbody>
            {activities ? (
              activities.map((i, index) => {
                const delay = index * 0.12;
                return (
                  <Tr key={index}>
                    <Td>
                      <ScaleFade in={true} delay={delay}>
                        <HStack>
                          <Icon
                            as={FaCircle}
                            boxSize={2}
                            opacity={0.5}
                            color={
                              i.account.marketOutcomeIndex === 0
                                ? "purple.500"
                                : "teal.500"
                            }
                          />
                          <Text fontSize={"sm"} fontWeight={"semibold"}>
                            {i.account.marketOutcomeIndex === 0 ? "YES" : "NO"}
                          </Text>
                        </HStack>
                      </ScaleFade>
                    </Td>

                    <Td pl={0}>
                      <ScaleFade in={true} delay={delay}>
                        <Link href={`/market/${i.account.market}`}>
                          <Tooltip p={2} rounded={"md"} label={i.marketTitle}>
                            <Text>{i.marketTitle.substring(0, 28)}...</Text>
                          </Tooltip>
                        </Link>
                      </ScaleFade>
                    </Td>
                    <Td>
                      <ScaleFade in={true} delay={delay}>
                        {parseInt(i.account.stake.toString(16), 16) / 10 ** 6}
                      </ScaleFade>
                    </Td>
                    <Td>
                      <ScaleFade in={true} delay={delay}>
                        <Badge
                          variant={"subtle"}
                          fontSize="xs"
                          colorScheme={
                            badgeEnum[Object.keys(i.account.orderStatus)[0]]
                          }
                        >
                          {Object.keys(i.account.orderStatus)[0]}
                        </Badge>
                      </ScaleFade>
                    </Td>
                    <Td>
                      <ScaleFade in={true} delay={delay}>
                        {new Date(
                          parseInt(
                            i.account.creationTimestamp.toString(16),
                            16
                          ) * 1000
                        ).toUTCString()}
                      </ScaleFade>
                    </Td>
                    <Td>
                      <ScaleFade in={true} delay={delay}>
                        <Link
                          href={`https://solscan.io/account/${i.publicKey.toBase58()}?cluster=devnet`}
                          isExternal
                        >
                          <ExternalLinkIcon />
                        </Link>
                      </ScaleFade>
                    </Td>
                  </Tr>
                );
              })
            ) : (
              <Tr>
                {Array(6)
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
        {activities?.length === 0 && (
          <Text color={mode("gray.600", "gray.700")} p={6} textAlign={"center"}>
            No activities found
          </Text>
        )}
      </TableContainer>
    </Box>
  );
};

const TableActions = () => {
  return (
    <HStack spacing="4" mt={4}>
      <FormControl w={"300px"} id="search">
        <InputGroup size="sm" variant={"filled"}>
          <FormLabel srOnly>Filter by market</FormLabel>
          <InputLeftElement pointerEvents="none" color="gray.400">
            <BsSearch />
          </InputLeftElement>
          <Input rounded="base" type="search" placeholder="Filter by market" />
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

const ActivityTable = () => {
  return (
    <>
      {/* <TableActions /> */}
      <TableContent />
    </>
  );
};

export default ActivityTable;
