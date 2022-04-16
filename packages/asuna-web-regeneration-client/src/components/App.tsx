import React, { useState, useEffect } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import InventoryPage from "./pages/inventory/InventoryPage";
import WalletPage from "./pages/wallet/WalletPage";
import SwapPage from "./pages/swap/SwapPage";

import bg from "../assets/media/bg.png";
import logo from "../assets/media/logo-white.png";
import Wrapper from "./Wrapper";
import { walletAddress } from "../wallet";
import Web3 from "web3";
import { ethers, utils } from "ethers";

import getTransactionReceiptMined from "../getTransactionReceiptMined.js";
import { JsonRpcSigner } from "@ethersproject/providers";

declare let window: any;

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://eth-rinkeby.alchemyapi.io/v2/j0ktCyFHlKmPB56gs_d_cQG1IdDioY8x"
  )
);

export enum Page {
  Inventory,
  Wallet,
  Swap,
}

function App() {
  let [firstLoad, setFirstLoad] = useState(true); // the first time inventory is mounted, if inventory is empty, transition to import from wallet
  let [page, setPage] = useState(0 as Page);
  let [wallet, setWallet] = useState(null);
  let [address, setAddress] = useState("");
  let [signer, setSigner] = useState(null);
  let [provider, setProvider] = useState(null);
  let [isLoggedIntoMetaMask, setIsLoggedIntoMetaMask] = useState(false);

  const changePage = (n: number) => {
    if (n % 3 === Page.Inventory) {
      setFirstLoad(false);
    }
    setPage(n % 3);
  };

  const refreshData = async () => {
    if (typeof web3 !== "undefined") {
      console.log("web3 is enabled");
      await initWallet();
    } else {
      console.log("web3 is not found");
    }
  };

  const initWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setSigner(provider.getSigner(0));
    const accounts = await provider.listAccounts();
    window.ethereum.on("accountsChanged", function (accounts) {
      window.location.reload();
    });
    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });
    if (accounts.length > 0) {
      const address = await provider.getSigner(0).getAddress();
      setIsLoggedIntoMetaMask(true);
      setProvider(provider);
      setAddress(address);
    }
  };

  useEffect(() => {
    refreshData();
  }, [address]);

  return (
    <div
      className="flex h-full bg-cover"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex-1 pt-120 pl-120">
        <img src={logo} className="max-h-180" alt="logo" />
      </div>
      <Wrapper className="flex flex-col">
        <div className="flex flex-1 relative overflow-hidden">
          <SwitchTransition>
            <CSSTransition key={page} classNames="page-d0" timeout={300}>
              {page === Page.Inventory ? (
                <InventoryPage firstLoad={firstLoad} changePage={changePage} />
              ) : page === Page.Wallet ? (
                <WalletPage changePage={changePage} address={address} />
              ) : page === Page.Swap ? (
                <SwapPage changePage={changePage} />
              ) : null}
            </CSSTransition>
          </SwitchTransition>
        </div>
      </Wrapper>
      <div className="flex-1 flex justify-end items-start pt-120 pr-120">
        <div className="flex items-center px-100 py-50 border border-white rounded-full">
          <i className="icon icon-sparkle mr-50" />
          {`${address.substring(0, 5)}...${address.substring(
            address.length - 4
          )}`}
        </div>
      </div>
    </div>
  );
}

export default App;
