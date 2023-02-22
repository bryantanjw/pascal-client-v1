import {
  Button,
  useColorModeValue as mode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Circle,
  Stack,
  Flex,
  Text,
  Input,
  FormControl,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const PositionModal = ({ isOpen, onClose }) => {
  return (
    <>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay backdropFilter="auto" backdropBlur="1px" />
        <ModalContent
          mx={"15px"}
          p={"15px"}
          rounded={"2xl"}
          boxShadow={"2xl"}
          bg={mode(
            "linear-gradient(200deg, rgba(218,187,237), white 30%)",
            "linear-gradient(140deg, rgb(21,23,27), rgb(40,40,40) 700%)"
          )}
          border={mode("", "solid 1px rgba(255, 255, 255, 0.08)")}
        >
          <Circle
            onClick={onClose}
            p={"5px"}
            m={"8px 12px"}
            size="12px"
            bg="#FB5753"
            color="#7E0609"
            border={"solid 2px #DF4644"}
            _hover={{
              "& > svg": {
                opacity: 1,
              },
            }}
          >
            <CloseIcon boxSize={"8px"} opacity={0} />
          </Circle>
          <ModalBody mt={3}>
            <Flex
              mb={3}
              px={6}
              py={4}
              rounded={"xl"}
              bg={mode("gray.100", "#2c2c2c")}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Stack>
                <Text>You sell</Text>
                <Text
                  fontSize={"xl"}
                  letterSpacing={"wide"}
                  fontWeight={"bold"}
                >
                  YES
                </Text>
              </Stack>
              <FormControl
                width={"50%"}
                isRequired
                as={Stack}
                alignItems={"end"}
              >
                <Text>Stake: {}</Text>
                <Input
                  type={"number"}
                  variant={"unstyled"}
                  placeholder={"0.00"}
                  textAlign={"end"}
                  fontSize={"xl"}
                  letterSpacing={"wide"}
                  fontWeight={"bold"}
                />
              </FormControl>
            </Flex>

            <Flex
              px={6}
              py={4}
              rounded={"xl"}
              bg={mode("gray.100", "#2c2c2c")}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Stack>
                <Text>You receive</Text>
                <Text
                  fontSize={"xl"}
                  letterSpacing={"wide"}
                  fontWeight={"bold"}
                >
                  USDC
                </Text>
              </Stack>
              <Stack alignItems={"end"}>
                <Text>Balance: {}</Text>
                <Text
                  fontSize={"xl"}
                  letterSpacing={"wide"}
                  fontWeight={"bold"}
                >
                  0.00
                </Text>
              </Stack>
            </Flex>
          </ModalBody>
          <ModalFooter justifyContent={"center"}>
            <Button
              as={motion.button}
              whileTap={{ scale: 0.9 }}
              type={"submit"}
              boxShadow={"lg"}
              width={"full"}
              rounded={"lg"}
              size={"lg"}
              textColor={mode("white", "gray.800")}
              bg={mode("rgba(53,53,53)", "gray.100")}
              _hover={{
                bg: mode("rgba(53,53,53,0.9)", "gray.200"),
              }}
            >
              Sell
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PositionModal;
