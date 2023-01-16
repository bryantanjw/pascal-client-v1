import {
  Link as ChakraLink,
  LinkProps,
  useColorModeValue,
  forwardRef,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface NavLinkProps extends LinkProps {
  children?: string | React.ReactNode;
  to: string;
  activeProps?: LinkProps;
}

const ChakraNextLink = forwardRef<NavLinkProps, "div">((props, ref) => {
  const { to, activeProps, children, ...rest } = props;
  const router = useRouter();
  const isActive = router.pathname === to;
  const color = useColorModeValue("black", "selected");

  if (isActive) {
    return (
      <Link href={to} scroll={false}>
        <ChakraLink ref={ref} {...rest} {...activeProps} color={color}>
          {children}
        </ChakraLink>
      </Link>
    );
  }

  return (
    <Link href={to} scroll={false}>
      <ChakraLink ref={ref} {...rest}>
        {children}
      </ChakraLink>
    </Link>
  );
});

export default ChakraNextLink;
