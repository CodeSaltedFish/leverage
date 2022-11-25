import React from "react";
//import { Box, Button, Flex, Image, Link, Spacer } from "@chakra-ui/react";

export default function NavBar({ accounts, setAccounts }) {
  const isConnected = Boolean(accounts[0]);

  async function connectAccount() {
    //是否安装钱包
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      //设置到变量中
      console.log(accounts);
      setAccounts(accounts);
    }
  }
  return (
    <div
      style={{ backgroundColor: false ? "pink" : "skyblue", height: "50px" }}
    >
      {isConnected ? (
        <p>{accounts[0]}</p>
      ) : (
        <button onClick={connectAccount}> Connect</button>
      )}
    </div>
  );
}
