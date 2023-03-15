import * as Web3 from "@solana/web3.js";

export const categories = [
  "Financial",
  "Economics",
  "Crypto",
  "Climate",
  "Other",
];

export const PRICE_LADDER = [
  1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.07, 1.08, 1.09, 1.1, 1.11, 1.12, 1.13,
  1.14, 1.15, 1.16, 1.17, 1.18, 1.19, 1.2, 1.21, 1.22, 1.23, 1.24, 1.25, 1.26,
  1.27, 1.28, 1.29, 1.3, 1.31, 1.32, 1.33, 1.34, 1.35, 1.36, 1.37, 1.38, 1.39,
  1.4, 1.41, 1.42, 1.43, 1.44, 1.45, 1.46, 1.47, 1.48, 1.49, 1.5, 1.51, 1.52,
  1.53, 1.54, 1.55, 1.56, 1.57, 1.58, 1.59, 1.6, 1.61, 1.62, 1.63, 1.64, 1.65,
  1.66, 1.67, 1.68, 1.69, 1.7, 1.71, 1.72, 1.73, 1.74, 1.75, 1.76, 1.77, 1.78,
  1.79, 1.8, 1.81, 1.82, 1.83, 1.84, 1.85, 1.86, 1.87, 1.88, 1.89, 1.9, 1.91,
  1.92, 1.93, 1.94, 1.95, 1.96, 1.97, 1.98, 1.99,
];
export const resolutionSources = [
  { title: "Pyth", url: "https://pyth.network/" },
  { title: "Coingecko", url: "https://www.coingecko.com/" },
  { title: "Switchboard", url: "https://switchboard.xyz/" },
  { title: "Human Protocol", url: "https://www.humanprotocol.org/" },
  { title: "U.S. Bureau of Labor Statistics", url: "https://www.bls.gov/" },
  {
    title: "Federal Reserve Bank of St. Louis",
    url: "https://fred.stlouisfed.org/",
  },
];

export const usdcMint = new Web3.PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);

export const tokenSwapStateAccount = new Web3.PublicKey(
  "EV7FEEq2EyTFtKx4ukp2QfW9mWLGcJckGGBNp5cjcHUe"
);

export const swapAuthority = new Web3.PublicKey(
  "24zqZMTYLVk4gm62seqU7KhBwvi3uBGtyDbnsC4rkbuR"
);

export const poolKryptAccount = new Web3.PublicKey(
  "BVPUZrv5nk3jMyTWkZdxvp2LuyPF1DmGTyR8AzKvgZgN"
);

export const poolScroogeAccount = new Web3.PublicKey(
  "5ttkBtMndCbHdSib22K4wRUE5ifprPXkMSckzBRSQv3K"
);

export const poolMint = new Web3.PublicKey(
  "CXQYDT9ShDYG1JMMwjNiR6TcL4u4uJNnguAbLKw6jVv4"
);

export const tokenAccountPool = new Web3.PublicKey(
  "Fp1W1KHuakombQATnToDCSpTnqLicFEfxWgtCAWbuvCM"
);

export const feeAccount = new Web3.PublicKey(
  "EY4hgx73saq9xuLr85HNaxGMAK6R5TkvuSDchKbpt291"
);

export const kryptMint = new Web3.PublicKey(
  "DWiD4EVUtnsgqoGbdSK5kBjHRJ7XoGx58WPHBu7t73Dh"
);

export const ScroogeCoinMint = new Web3.PublicKey(
  "4AG5yRYmMcpMxcRvvkLPHHiSdnCnRQhtncs79CoQNnRQ"
);

export const airdropProgramId = new Web3.PublicKey(
  "CPEV4ibq2VUv7UnNpkzUGL82VRzotbv2dy8vGwRfh3H3"
);

export const airdropPDA = new Web3.PublicKey(
  "99ynLfSvcRXwYMKv4kmbcAyGxhfD7KfgrsuHTx9Dvoot"
);

export const TOKEN_SWAP_PROGRAM_ID = new Web3.PublicKey(
  "SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8"
);

export const ASSOCIATED_TOKEN_PROGRAM_ID = new Web3.PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export const SPL_BINARY_OPTION_PROGRAM_ID = new Web3.PublicKey(
  "betw959P4WToez4DkuXwNsJszqbpe3HuY56AcG5yevx"
);

export const MOBILE_WIDTH: number = 800; // px

export const ORDERBOOK_LEVELS: number = 25; // rows count
