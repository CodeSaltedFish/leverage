import { useEffect, useCallback, useState } from "react";
import { ethers } from "ethers";
import Bignumber from "bignumber.js";
//import detectEthereumProvider from "@metamask/detect-provider";
import { BaseTable } from "ali-react-table";

const poolAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_underlying",
        type: "address",
      },
      {
        internalType: "address",
        name: "_config",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_pair",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_isListed",
        type: "bool",
      },
    ],
    name: "SetAccessPair",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_config",
        type: "address",
      },
    ],
    name: "SetConfig",
    type: "event",
  },
  {
    inputs: [],
    name: "IRG",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "accountTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "borrow",
    outputs: [
      {
        internalType: "uint256",
        name: "ig",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "config",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "exchangeRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAavePoolValue",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getBorrowRate",
    outputs: [
      {
        internalType: "uint256",
        name: "borrowRate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "trader",
        type: "address",
      },
    ],
    name: "getCurrentBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "totalTokens",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentTotalBorrows",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getExchangeRate",
    outputs: [
      {
        internalType: "uint256",
        name: "rate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMarketInterests",
    outputs: [
      {
        internalType: "uint256",
        name: "ig",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSupplyRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastAccrueBlockNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "repay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_config",
        type: "address",
      },
    ],
    name: "setConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_market",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_isListed",
        type: "bool",
      },
    ],
    name: "setMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenAmount",
        type: "uint256",
      },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stakeETH",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalBorrows",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "underlying",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "updateMarketInterests",
    outputs: [
      {
        internalType: "uint256",
        name: "ig",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "utilizationRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "validaPoolData",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const pairAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "quote",
        type: "address",
      },
      {
        internalType: "address",
        name: "base",
        type: "address",
      },
      {
        internalType: "address",
        name: "v3pool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_oracle",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "baseLendingPool",
    outputs: [
      {
        internalType: "contract ILVLendingPool",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "borrower",
        type: "address",
      },
      {
        internalType: "int256",
        name: "direction",
        type: "int256",
      },
    ],
    name: "checkLiquidation",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "ratio",
        type: "int256",
      },
    ],
    name: "closeLong",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "ratio",
        type: "int256",
      },
    ],
    name: "closeShort",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "borrower",
        type: "address",
      },
    ],
    name: "longLiquidation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "direction",
        type: "int256",
      },
      {
        internalType: "uint8",
        name: "leverage",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "marginToken",
        type: "address",
      },
      {
        internalType: "uint96",
        name: "marginAmount",
        type: "uint96",
      },
    ],
    name: "open",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    name: "positions",
    outputs: [
      {
        internalType: "address",
        name: "marginToken",
        type: "address",
      },
      {
        internalType: "uint96",
        name: "marginAmount",
        type: "uint96",
      },
      {
        internalType: "uint8",
        name: "leverage",
        type: "uint8",
      },
      {
        internalType: "int120",
        name: "base",
        type: "int120",
      },
      {
        internalType: "int120",
        name: "quote",
        type: "int120",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "debt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ig",
            type: "uint256",
          },
        ],
        internalType: "struct LVMarketPair2.Borrow",
        name: "borrow",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "quoteLendingPool",
    outputs: [
      {
        internalType: "contract ILVLendingPool",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "repayCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "quote",
        type: "address",
      },
      {
        internalType: "address",
        name: "base",
        type: "address",
      },
    ],
    name: "setLendingPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "borrower",
        type: "address",
      },
    ],
    name: "shortLiquidation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "amount0Delta",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "amount1Delta",
        type: "int256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "uniswapV3SwapCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const tokenAbi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const oracleAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "secondsAgo",
        type: "uint32",
      },
    ],
    name: "getMarketTokenPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "token0Price",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const columns = [
  {
    code: "cp",
    name: "池子精度误差",
    width: 110,
  },
  {
    code: "bt",
    name: "用户Pool本息",
    width: 100,
  },
  // {
  //   code: "qt",
  //   name: "用户quotePool本息",
  //   getCellProps(value, record, rowIndex) {
  //     if (rowIndex === 0) {
  //       return { rowSpan: 2 };
  //     }
  //   },
  //   width: 100,
  // },
  { code: "d", name: "方向", width: 20 },
  { code: "le", name: "杠杆", width: 20 },
  { code: "m", name: "保证金", width: 100, align: "left" },
  { code: "b", name: "持仓", width: 100, align: "left" },
  { code: "debt", name: "负债(本息)", width: 100 },
  { code: "p", name: "pnl", width: 100 },
  { code: "l", name: "强平价", width: 100 },
];

const uniPoolAddrss = "0xcCe0dEE9FdCf791E9cD7FE3863C5aD19B8d40762";
const oracleAddress = "0xF3Aba2A3a8355bF4ef2066Cbb0CaE0516ce72D48";
const baseAddress = "0x52dA0EF24d893cC2f4E1591cAB10458eB0528C5a";
const quoteAddress = "0x4556a12E6b3cC71107a4965ec20dce3A7277da32";
const basePoolAddress = "0x01E3De56a88B17FFaB433C1A18e0168648ae8bAa";
const quotePoolAddress = "0xA0F03FCE074ad754F27543B47bEDb82C9518EeEA";
const pairAddress = "0x5662014d9eC60DF6724077ab81e998702B66c2C4";

export default function MainPage({ accounts, setAccounts }) {
  const [mintTxid, setMintTxid] = useState("");
  const [stakeTxid, setStakeTxid] = useState("");
  const [withdrawTxid, setWithdrawTxid] = useState("");
  const [openTxid, setOpenTxid] = useState("");
  const [closeTxid, setCloseTxid] = useState("");
  const [arr, setArr] = useState([]);
  const [priceData, setPriceData] = useState("");

  const isConnected = Boolean(accounts[0]);

  let basePool;
  let quotePool;
  let pair;
  let base;
  let quote;
  let oracle;
  if (window.ethereum && isConnected) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    basePool = new ethers.Contract(basePoolAddress, poolAbi, signer);
    quotePool = new ethers.Contract(quotePoolAddress, poolAbi, signer);
    pair = new ethers.Contract(pairAddress, pairAbi, signer);
    base = new ethers.Contract(baseAddress, tokenAbi, signer);
    quote = new ethers.Contract(quoteAddress, tokenAbi, signer);
    oracle = new ethers.Contract(oracleAddress, oracleAbi, signer);
  }

  const addBaseToken = async () => {
    const tokenSymbol = "UNI";
    const tokenDecimals = 18;
    if (window.ethereum && isConnected) {
      try {
        const wasAdded = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: baseAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
            },
          },
        });

        if (wasAdded) {
          console.log("Token added Successfully!");
        } else {
          console.log("Failed to add the token");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const addQuoteToken = async () => {
    const tokenSymbol = "USDT";
    const tokenDecimals = 18;
    if (window.ethereum && isConnected) {
      try {
        const wasAdded = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: quoteAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
            },
          },
        });

        if (wasAdded) {
          console.log("Token added Successfully!");
        } else {
          console.log("Failed to add the token");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  async function mintBase() {
    if (window.ethereum && isConnected) {
      let amount = document.getElementById("mintamount").value;

      if (amount > 0) {
        amount = amount * 1e18;
        try {
          const response = await base.mint(new Bignumber(amount).toFixed());
          setMintTxid(response.hash);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  async function mintQuote() {
    if (window.ethereum && isConnected) {
      if (window.ethereum) {
        let amount = document.getElementById("mintamount").value;
        if (amount > 0) {
          amount = amount * 1e18;
          try {
            const response = await quote.mint(new Bignumber(amount).toFixed());
            setMintTxid(response.hash);
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  }

  async function stake() {
    if (window.ethereum && isConnected) {
      let token = document.getElementById("staketoken").value;
      let amount = document.getElementById("stakeamount").value;
      if (amount > 0) {
        amount = amount * 1e18;
        try {
          //授权
          const allowce = await (token === baseAddress
            ? base
            : quote
          ).allowance(
            accounts[0],
            token === baseAddress ? basePoolAddress : quotePoolAddress
          );

          if (allowce.toString() === "0") {
            await (token === baseAddress ? base : quote).approve(
              token === baseAddress ? basePoolAddress : quotePoolAddress,
              "1000000000000000000000000000000000000000000000000000"
            );
          }

          const response = await (token === baseAddress
            ? basePool
            : quotePool
          ).stake(new Bignumber(amount).toFixed());
          setStakeTxid(response.hash);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  async function withdraw() {
    if (window.ethereum && isConnected) {
      let token = document.getElementById("withdrawtoken").value;
      let amount = document.getElementById("withdrawamount").value;
      if (amount > 0) {
        amount = amount * 1e18;
        try {
          if (token === baseAddress) {
            const response = await basePool.withdraw(
              new Bignumber(amount).toFixed()
            );
            setWithdrawTxid(response.hash);
          }

          if (token === quoteAddress) {
            const response = await quotePool.withdraw(
              new Bignumber(amount).toFixed()
            );
            setWithdrawTxid(response.hash);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  async function open() {
    if (window.ethereum && isConnected) {
      let direction = document.getElementById("direction").value;
      let leverage = document.getElementById("leverage").value;
      let margintoken = document.getElementById("margintoken").value;
      let margin = document.getElementById("margin").value;
      if (margin > 0) {
        margin = margin * 1e18;
        try {
          //授权
          const allowce = await (margintoken === baseAddress
            ? base
            : quote
          ).allowance(accounts[0], pairAddress);
          if (allowce.toString() === "0") {
            console.log(1111111);
            await (margintoken === baseAddress ? base : quote).approve(
              pairAddress,
              "1000000000000000000000000000000000000000000000000000"
            );
          }

          const response = await pair.open(
            direction,
            leverage,
            margintoken,
            new Bignumber(margin).toFixed()
          );

          setOpenTxid(response.hash);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  async function close() {
    if (window.ethereum && isConnected) {
      let direction = document.getElementById("closedirection").value;
      let percent1 = document.getElementById("percent").value;
      if (percent1 >= 0) {
        percent1 = percent1 * 1e16;
        try {
          if (direction === "1") {
            const response = await pair.closeLong(
              new Bignumber(percent1).toFixed()
            );
            setCloseTxid(response.hash);
          }

          if (direction === "-1") {
            const response = await pair.closeShort(
              new Bignumber(percent1).toFixed()
            );
            setCloseTxid(response.hash);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  async function updateData() {
    if (window.ethereum && isConnected) {
      console.log("update data");
      let posotionDataLong = await pair.positions(accounts[0], 1);
      let posotionDataShort = await pair.positions(accounts[0], -1);
      let currentPrice = await oracle.getMarketTokenPrice(uniPoolAddrss, 900);
      let ig = await quotePool.getMarketInterests();
      let validaBasePoolData = await basePool.validaPoolData();
      let validaQuotePoolData = await quotePool.validaPoolData();
      let basePoolBalance = await basePool.getCurrentBalance(accounts[0]);
      let quotePoolBalance = await quotePool.getCurrentBalance(accounts[0]);

      let price = currentPrice.toString() / 1e18;

      setPriceData(1.0 / price);

      let longDebt =
        (ig * posotionDataLong.borrow.debt.toString()) /
        posotionDataLong.borrow.ig.toString() /
        1e18;

      let shortDebt =
        (ig * posotionDataShort.borrow.debt.toString()) /
        posotionDataShort.borrow.ig.toString() /
        1e18;

      let isLongMarinBase = posotionDataLong.marginToken === baseAddress;

      let longPnl =
        (isLongMarinBase
          ? posotionDataLong.base.toString() / 1e18
          : posotionDataLong.base.toString() / 1e18 / price) -
        (isLongMarinBase ? longDebt * price : longDebt) -
        posotionDataLong.marginAmount.toString() / 1e18;

      let isShortMarinBase = posotionDataShort.marginToken === baseAddress;

      let shortPnl =
        (isShortMarinBase
          ? (posotionDataShort.quote.toString() / 1e18) * price
          : posotionDataShort.quote.toString() / 1e18) -
        (isShortMarinBase ? shortDebt : shortDebt / price) -
        posotionDataShort.marginAmount.toString() / 1e18;

      let longLPrice =
        (1.02 * longDebt) / (posotionDataLong.base.toString() / 1e18);

      let shortLPrice =
        posotionDataShort.quote.toString() / 1e18 / (1.02 * shortDebt);

      let arrData = [
        {
          cp: "basePool:" + validaBasePoolData.toString() / 1e18,
          bt: "basePool:" + basePoolBalance.toString() / 1e18,
          d: 1,
          le: posotionDataLong.leverage.toString(),
          m:
            posotionDataLong.marginAmount.toString() !== "0"
              ? posotionDataLong.marginAmount.toString() / 1e18 +
                (isLongMarinBase ? " UNI" : " USDT")
              : "",
          b: posotionDataLong.base.toString() / 1e18 + " UNI",
          debt:
            posotionDataLong.borrow.debt.toString() !== "0"
              ? longDebt + " USDT"
              : "",
          p:
            posotionDataLong.base.toString() === "0"
              ? ""
              : longPnl / 1e18 + (isLongMarinBase ? " UNI" : " USDT"),
          l: longLPrice,
        },
        {
          cp: "quotePool:" + validaQuotePoolData.toString() / 1e18,
          bt: "qoutePool:" + quotePoolBalance.toString() / 1e18,
          d: -1,
          le: posotionDataShort.leverage.toString(),
          m:
            posotionDataShort.marginAmount.toString() !== "0"
              ? posotionDataShort.marginAmount.toString() / 1e18 +
                (isShortMarinBase ? " UNI" : " USDT")
              : "",
          b: posotionDataShort.quote.toString() / 1e18 + " USDT",
          debt:
            posotionDataShort.borrow.debt.toString() !== "0"
              ? shortDebt + " UNI"
              : "",
          p:
            posotionDataShort.quote.toString() === "0"
              ? ""
              : shortPnl / 1e18 + (isShortMarinBase ? " UNI" : " USDT"),
          l: shortLPrice,
        },
      ];
      setArr(arrData);
    }
  }

  useEffect(() => {
    const timer = setInterval(updateData, 3000);
    return () => clearInterval(timer);
  }, [updateData]);

  return (
    <div style={{ backgroundColor: true ? "pink" : "skyblue" }}>
      <table>
        <hr></hr>
        <tr>
          <h2>UNI/USDT交易对 UNI最新价格:{priceData}</h2>
        </tr>
        <hr></hr>
        <tr>mint测试币</tr>
        <tr>
          <a href="https://faucet.polygon.technology/" target="_blank">
            测试网 Matic faucet
          </a>
        </tr>
        <tr>
          basetoken: {baseAddress}
          <button onClick={addBaseToken}>add to metamask</button>
        </tr>
        <tr>
          quotetoken: {quoteAddress}
          <button onClick={addQuoteToken}>add to metamask</button>
        </tr>
        <tr>
          <label>数量:</label>
          <input type="text" id="mintamount"></input>
          <button onClick={mintBase}>mint BaseToken</button>
          <button onClick={mintQuote}>mint QuoteToken</button>
          <label>txid: {mintTxid}</label>
        </tr>
        <hr></hr>
        <tr>存钱</tr>
        <tr>
          <label>存入币种地址:</label>
          <input type="text" id="staketoken"></input>
          <label>amount:</label>
          <input type="text" id="stakeamount"></input>
          <button onClick={stake}>stake</button>
          <label>{stakeTxid}</label>
        </tr>
        <hr></hr>
        <tr>取钱</tr>
        <tr>
          <label>取出币种地址:</label>
          <input type="text" id="withdrawtoken"></input>
          <label>amount:</label>
          <input type="text" id="withdrawamount"></input>
          <button onClick={withdraw}>withdraw</button>
          <label>{withdrawTxid}</label>
        </tr>
        <hr></hr>
        <tr>开仓</tr>
        <tr>
          <label>direction:</label>
          <input type="text" id="direction"></input>
          <label>leverage(1.1-10):</label>
          <input type="text" id="leverage"></input>
          <label>保证金币种地址:</label>
          <input type="text" id="margintoken"></input>
          <label>margin:</label>
          <input type="text" id="margin"></input>
          <button onClick={open}>open</button>
          <label>{openTxid}</label>
        </tr>
        <hr></hr>
        <tr>平仓</tr>
        <tr>
          <label>direction(1或-1):</label>
          <input type="text" id="closedirection"></input>
          <label>percent(1-100):</label>
          <input type="text" id="percent"></input>
          <button onClick={close}>close</button>
          <label>{closeTxid}</label>
        </tr>
      </table>
      <BaseTable dataSource={arr} columns={columns} />
    </div>
  );
}
