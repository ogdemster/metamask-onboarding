import Web3 from "web3";

import { abi, NFT_CONTRACT_ADDRESS } from "../constants/index.js";

const provider = new Web3.providers.HttpProvider(
  "https://matic-mumbai.chainstacklabs.com"
);

const web3 = new Web3(provider);
const contract = new web3.eth.Contract(abi, NFT_CONTRACT_ADDRESS);

async function readValue() {
  const value = await contract.methods.ata().call();
  const pod = document.getElementById("titleFromContract");

  pod.innerHTML = value;
}

readValue();
