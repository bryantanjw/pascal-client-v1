import { useState, useEffect } from "react";
import {
  HStack,
  Stack,
  Textarea,
  Text,
  Image,
  Button,
  FormControl,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { FaRegHeart } from "react-icons/fa";
import { Discussion } from "@/models/Discussion";
import * as web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const DISCUSSION_PROGRAM_ID = "GeJqz9A7ZCS4vBvjWSzVkXaMsweEBpfmb7EaUjdzphbC";

export interface CardProps {
  discussion: Discussion;
}

export const Card = (props: CardProps) => {
  const { discussion } = props;

  return (
    <Stack>
      <HStack alignItems={"flex-start"}>
        <Image
          src={"/profile-photo.png"}
          objectFit={"cover"}
          borderRadius={"full"}
          boxSize={"35px"}
          alt={"Profile Photo"}
        />
        <Stack direction={"column"}>
          <Text># name</Text>
          <Text>{discussion.comment}</Text>
          <Stack direction={"column"} alignContent={"end"}>
            <HStack>
              <Icon as={FaRegHeart} />
              <Text># upvotes</Text>
            </HStack>
          </Stack>
        </Stack>
      </HStack>
      <Divider py={2} />
    </Stack>
  );
};

export const DiscussionForm = () => {
  const [comment, setComment] = useState("");
  const [upvotes, setUpvotes] = useState(0);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const discussion = new Discussion(comment);
    handleTransactionSubmit(discussion);
  };

  const handleTransactionSubmit = async (discussion: Discussion) => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    const buffer = discussion.serialize();
    const transaction = new web3.Transaction();

    const [pda] = await web3.PublicKey.findProgramAddress(
      [publicKey.toBuffer(), Buffer.from(discussion.comment)],
      new web3.PublicKey(DISCUSSION_PROGRAM_ID)
    );

    const instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: buffer,
      programId: new web3.PublicKey(DISCUSSION_PROGRAM_ID),
    });

    transaction.add(instruction);

    try {
      let txid = await sendTransaction(transaction, connection);
      alert(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
    } catch (e) {
      console.log(JSON.stringify(e));
      alert(JSON.stringify(e));
    }
  };

  return (
    <Stack py={4}>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <HStack alignItems={"flex-start"}>
            <Image
              src={"/profile-photo.png"}
              objectFit={"cover"}
              borderRadius={"full"}
              boxSize={"35px"}
              alt={"Profile Photo"}
            />
            <Textarea
              resize={"none"}
              p={2}
              border={"0px"}
              rounded={0}
              placeholder="What's happening?"
              _focus={{ boxShadow: "none" }}
              onChange={(e) => setComment(e.currentTarget.value)}
            />
          </HStack>
        </FormControl>
        <Stack direction={"column"} alignItems={"end"} mx={4}>
          <Button rounded={"xl"} type={"submit"}>
            Post
          </Button>
        </Stack>
        <Divider py={2} />
      </form>
    </Stack>
  );
};

export const DiscussionList = () => {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  useEffect(() => {
    connection
      .getProgramAccounts(new web3.PublicKey(DISCUSSION_PROGRAM_ID))
      .then(async (accounts) => {
        const discussions: Discussion[] = accounts.reduce(
          (accum: Discussion[], { pubkey, account }) => {
            const discussion = Discussion.deserialize(account.data);
            if (!discussion) {
              return accum;
            }

            return [...accum, discussion];
          },
          []
        );
        setDiscussions(discussions);
      });
  }, []);

  return (
    <div>
      {discussions.map((discussion, i) => (
        <Card key={i} discussion={discussion} />
      ))}
    </div>
  );
};
