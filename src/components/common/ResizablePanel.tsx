import { Box } from "@chakra-ui/react";
import useMeasure from "react-use-measure";
import { motion, AnimatePresence } from "framer-motion";

export const ResizablePanel = ({ children }) => {
  let [ref, { height }] = useMeasure();

  return (
    <motion.div
      animate={{ height: height || "auto" }}
      className="relative overflow-hidden"
    >
      <AnimatePresence initial={false}>
        <Box ref={ref} className="px-8 pb-8">
          {children}
        </Box>
      </AnimatePresence>
    </motion.div>
  );
};
