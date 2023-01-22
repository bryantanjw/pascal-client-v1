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
  Img,
  Badge,
  Skeleton,
  Icon,
  TableContainer,
} from "@chakra-ui/react";
import { GetAccount, Order, Orders } from "@monaco-protocol/client";
import { useWallet } from "@solana/wallet-adapter-react";
import { Select as ReactSelect, chakraComponents } from "chakra-react-select";
import { BsSearch } from "react-icons/bs";
import { useProgram } from "@/context/ProgramProvider";
import { FaCircle } from "react-icons/fa";

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

interface MarketPositionProps {
  data: {
    category: string;
    market: string;
  };
}

export const Position = (props: MarketPositionProps) => {
  const { category, market } = props.data;

  return (
    <Stack direction="row" spacing="4" align="center">
      <Box flexShrink={0} h="5" w="5">
        <Img
          filter={mode("invert(0%)", "invert(100%)")}
          objectFit="cover"
          src={`${category}.svg`}
          alt=""
        />
      </Box>
      <Box>
        <Box fontSize="sm" fontWeight="medium">
          {category}
        </Box>
      </Box>
    </Stack>
  );
};

export const badgeEnum: Record<string, string> = {
  matched: "green",
  open: "orange",
  closed: "gray",
};

const TableContent = ({ user }, error) => {
  const program = useProgram();
  const { publicKey } = useWallet();
  const [positions, setPositions] = useState<GetAccount<Order>[]>();

  useEffect(() => {
    if (publicKey) {
      const fetchUserPositions = async () => {
        try {
          const response = await Orders.orderQuery(program)
            .filterByPurchaser(publicKey)
            // .filterByStatus(status)
            .fetch();
          const sortedData = response.data.orderAccounts
            .filter((d) => d.account.forOutcome === true)
            .sort((a, b) => {
              return (
                parseInt(b.account.creationTimestamp.toString(16), 16) * 1000 -
                parseInt(a.account.creationTimestamp.toString(16), 16) * 1000
              );
            });
          setPositions(sortedData);
        } catch (error) {
          console.log("fetchUserPositions error: ", error);
        }
      };
      fetchUserPositions();
    }
  }, [program]);

  if (positions) console.log("positions: ", positions);

  return (
    <Box
      bg={mode("whiteAlpha.800", "rgba(32, 34, 46, 0.2)")}
      boxShadow={"lg"}
      my={4}
      rounded={"lg"}
      borderWidth="1px"
      overflowX={"auto"}
    >
      <TableContainer>
        <Table alignContent={"start"}>
          <Thead bg={mode("gray.50", "gray.800")}>
            <Tr>
              <Th></Th>
              <Th pl={0}>Market</Th>
              <Th>Stake</Th>
              <Th>Status</Th>
              <Th>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {positions ? (
              positions.map((pos, index) => (
                <Tr key={index}>
                  <Td>
                    <HStack>
                      <Icon
                        as={FaCircle}
                        boxSize={2}
                        opacity={0.5}
                        color={
                          pos.account.marketOutcomeIndex === 0
                            ? "purple.500"
                            : "teal.500"
                        }
                      />
                      <Text fontSize={"sm"} fontWeight={"medium"}>
                        {pos.account.marketOutcomeIndex === 0 ? "Yes" : "No"}
                      </Text>
                    </HStack>
                  </Td>
                  <Td pl={0}>
                    <Text>
                      {pos.account.market.toBase58().substring(0, 20)}...
                    </Text>
                  </Td>
                  <Td>
                    {parseInt(pos.account.stake.toString(16), 16) / 10 ** 6}
                  </Td>
                  <Td>
                    <Badge
                      variant={"subtle"}
                      fontSize="xs"
                      colorScheme={
                        badgeEnum[Object.keys(pos.account.orderStatus)[0]]
                      }
                    >
                      {Object.keys(pos.account.orderStatus)[0]}
                    </Badge>
                  </Td>
                  <Td>
                    {new Date(
                      parseInt(pos.account.creationTimestamp.toString(16), 16) *
                        1000
                    ).toUTCString()}
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                {Array(5)
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
        {positions?.length === 0 && (
          <Text color={mode("gray.600", "gray.700")} p={6} textAlign={"center"}>
            No positions found
          </Text>
        )}
      </TableContainer>
    </Box>
  );
};

const TableActions = () => {
  return (
    <Stack spacing="4" mt={8}>
      <HStack>
        <FormControl w={"300px"} id="search">
          <InputGroup size="sm" variant={"filled"}>
            <FormLabel srOnly>Filter by market</FormLabel>
            <InputLeftElement pointerEvents="none" color="gray.400">
              <BsSearch />
            </InputLeftElement>
            <Input
              rounded="base"
              type="search"
              placeholder="Filter by market"
            />
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
    </Stack>
  );
};

const PositionsTable = ({ user }) => {
  return (
    <>
      <TableActions />
      <TableContent user={user} />
    </>
  );
};

export default PositionsTable;
