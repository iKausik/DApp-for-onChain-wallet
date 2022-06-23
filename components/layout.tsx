import React, { useState, useEffect } from "react";

import { ethers, utils } from "ethers";

import abi from "./contracts/SharedWallet.json";

const Layout = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isAccountHolder, setIsAccountHolder] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [accountBalance, setAccountBalance] = useState("0");
  // const [accountNumber, setAccountNumber] = useState(
  //   "0x0000000000000000000000000000000000000000"
  // );
  const [inputValue, setInputValue] = useState({
    user: "",
    deposit: "",
    withdrawTo: "",
    withdraw: "",
  });

  const contractAddress: string = "0x2d7579AA4419F60BAe8D6b5dfF3e8b95BA55E799";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const sharedWalletContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];

        setIsWalletConnected(true);
        setCurrentAccount(account);

        const accountHolder = await sharedWalletContract.hasAccount(account);
        const user = await sharedWalletContract.isUser(account);
        setIsAccountHolder(accountHolder);
        setIsUser(user);
        console.log("Connected Wallet:", account);

        // account balance
        const acctBalance = await sharedWalletContract.getBalance();
        const weiToEther = utils.formatEther(acctBalance).toString();
        setAccountBalance(weiToEther);
        console.log("Account Balance:", weiToEther);

        // account number
        // const acctNumber = await sharedWalletContract.getAccountNumber();
        // const numb = utils.recoverAddress(acctNumber);
        // setAccountNumber(acctNumber.toString());
        // console.log("Account Number:", numb);
      } else {
        alert("Connect your Ethereum Wallet");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openAccount = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const sharedWalletContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const accountHolder = await sharedWalletContract.hasAccount(
        currentAccount
      );
      const user = await sharedWalletContract.isUser(currentAccount);

      if (isWalletConnected && accountHolder == false && user == false) {
        await sharedWalletContract.createAccount();

        setIsAccountHolder(accountHolder);
        setIsUser(user);

        console.log("Congrats! You opened an account");
      } else {
        alert("You already have an account or associated with an account.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addUser = async (event: any) => {
    try {
      event.preventDefault();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const sharedWalletContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      if (isWalletConnected && isAccountHolder) {
        const txn = await sharedWalletContract.addUser(inputValue.user);
        console.log("Adding new user...");
        await txn.wait();
        console.log("User added", txn.hash);
      } else {
        alert("You're not an account holder.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event: any) => {
    setInputValue((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const depositMoney = async (event: any) => {
    try {
      event.preventDefault();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const sharedWalletContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      if (isWalletConnected && isUser) {
        const txn = await sharedWalletContract.deposit({
          value: utils.parseEther(inputValue.deposit),
        });
        console.log("Depositing ether...");
        await txn.wait();
        console.log("Ether deposited...done", txn.hash);
      } else {
        alert("You're not an account holder or user of any account.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const withdrawMoney = async (event: any) => {
    try {
      event.preventDefault();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const sharedWalletContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      if (isWalletConnected && isUser) {
        const txn = await sharedWalletContract.withdraw(
          inputValue.withdrawTo,
          utils.parseEther(inputValue.withdraw)
        );
        console.log(`Withdrawing ether to ${inputValue.withdrawTo}...`);
        await txn.wait();
        console.log("Ether withdrew...done", txn.hash);
      } else {
        alert("You're not an account holder or user of any account.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="contain">
      {/* Title */}
      <div className="box1 p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center ">
        <img src="safe.png" width={100} height={100} alt="safe" />

        <h1 className="title">SharedWallet</h1>
      </div>

      {/* Connect Wallet Button */}
      <div className="box2 p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center ">
        {!isWalletConnected ? (
          <button
            className="btn1 px-5 py-3 text-md text-gray-600 bg-lime-400 hover:bg-lime-500 font-semibold rounded-full"
            onClick={checkIfWalletIsConnected}
          >
            Connect Wallet
          </button>
        ) : (
          <p className="txt text-xl font-medium">
            Connected Wallet <br />{" "}
            <span className="text-xs">{currentAccount}</span>
          </p>
        )}
        <br />
        <br />
        <img src="plug.png" width={50} height={50} alt="plug" />
      </div>

      {/* Add user to your account */}
      <div className="box3 col-span-4 p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center ">
        <label htmlFor="user" className="txt text-xl font-medium text-black">
          Add user
          {/* to <br /> <span className="text-xs">{accountNumber}</span> */}
        </label>
        <br />
        <input
          type="text"
          name="user"
          id="user"
          placeholder="Type the user address here"
          onChange={handleInputChange}
          value={inputValue.user}
          disabled={!isAccountHolder && isUser ? true : false}
        />
        <br />
        <button
          type="submit"
          className={
            !isAccountHolder && isUser
              ? "px-4 py-2 text-sm text-gray-600 bg-zinc-400 hover:bg-zinc-400 font-semibold rounded-full"
              : "px-4 py-2 text-sm text-gray-600 bg-lime-400 hover:bg-lime-500 font-semibold rounded-full"
          }
          onClick={addUser}
          disabled={!isAccountHolder && isUser ? true : false}
        >
          Add User
        </button>
        <br />
        {!isAccountHolder && isUser ? (
          <p className="disclaimer">
            <b>Info:</b> You're not an account holder. Only an account holder
            can add a new user to his/her account.
          </p>
        ) : (
          <>
            <p className="disclaimer">
              <b>Disclaimer:</b> Only an account holder can add user to his/her
              account.
            </p>
            <br />
            <p className="disclaimer">
              <b>Reminder:</b> The user will get access to deposit and withdraw
              funds from your account.
            </p>
          </>
        )}
      </div>

      {/* Open new account */}
      <div className="box4 p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center ">
        <p className="txt text-xl font-medium text-black">Open new account</p>
        <br />

        <button
          className={
            isAccountHolder || isUser
              ? "px-4 py-2 text-sm text-gray-600 bg-zinc-400 hover:bg-zinc-400 font-semibold rounded-full"
              : "px-4 py-2 text-sm text-gray-600 bg-lime-400 hover:bg-lime-500 font-semibold rounded-full"
          }
          onClick={openAccount}
          disabled={isAccountHolder || isUser ? true : false}
        >
          Open Account
        </button>
        <br />

        {isAccountHolder || isUser ? (
          <p className="disclaimer">
            <b>Info:</b> You already have an account or associated with an
            account.
          </p>
        ) : (
          <p className="disclaimer">
            <b>Disclaimer:</b> If you already have one account or you’re
            associated with another person’s account, you can’t open new
            account.
          </p>
        )}
      </div>

      {/* account balance */}
      <div className="box5 p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center ">
        <p className="txt text-xl font-medium text-black">
          Your account balance is <br /> {accountBalance} ether
        </p>
        {/* {console.log(accountBalance + " " + accountNumber)} */}
      </div>

      {/* Deposit ether */}
      <div className="box6 p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center ">
        <label htmlFor="deposit" className="txt text-xl font-medium text-black">
          Deposit ether
          {/* to <br />{" "}
          <span className="text-xs">{accountNumber}</span> */}
        </label>
        <br />
        <input
          type="number"
          name="deposit"
          id="deposit"
          placeholder="Type the ether amount here"
          onChange={handleInputChange}
          value={inputValue.deposit}
        />
        <br />
        <button
          type="submit"
          className="px-4 py-2 text-sm text-gray-600 bg-lime-400 hover:bg-lime-500 font-semibold rounded-full"
          onClick={depositMoney}
        >
          Deposit Ether
        </button>
        <br />
        <p className="disclaimer">
          <b>Disclaimer:</b> Only the account holder and associated users can
          deposit to the account.
        </p>
      </div>

      {/* built by */}
      <div className="box7 p-8 max-w-sm mx-auto bg-lime-50 rounded-xl shadow-lg flex flex-col items-center ">
        <p className="txt text-xl font-medium text-black">
          Coded by{" "}
          <a href="https://www.kausikdas.com" target="_blank">
            Kausik Das ✪
          </a>
        </p>
      </div>

      {/* Withdraw ether */}
      <div className="box8 p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center ">
        <label
          htmlFor="withdraw"
          className="txt text-xl font-medium text-black"
        >
          Withdraw ether
          {/* from <br />{" "}
          <span className="text-xs">{accountNumber}</span> */}
        </label>
        <br />
        <input
          type="text"
          name="withdrawTo"
          id="withdrawTo"
          placeholder="Type the address to withdraw to"
          onChange={handleInputChange}
          value={inputValue.withdrawTo}
        />
        <br />
        <input
          type="number"
          name="withdraw"
          id="withdraw"
          placeholder="Type the ether amount here"
          onChange={handleInputChange}
          value={inputValue.withdraw}
        />
        <br />
        <button
          type="submit"
          className="px-4 py-2 text-sm text-gray-600 bg-lime-400 hover:bg-lime-500 font-semibold rounded-full"
          onClick={withdrawMoney}
        >
          Withdraw Ether
        </button>
        <br />
        <p className="disclaimer">
          <b>Disclaimer:</b> Only the account holder and associated users can
          withdraw from the account.
        </p>
      </div>
    </div>
  );
};

export default Layout;
