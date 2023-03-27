import Web3 from "web3";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants/index.js";

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(abi, NFT_CONTRACT_ADDRESS);

async function writeValue(newValue, accounts) {
  const result = await contract.methods
    .writeNewHello(newValue)
    .send({ from: accounts[0] })
    .on("transactionHash", function (hash) {
      console.log(hash);
    });

  console.log(result);
}
// writeValue();

export default writeValue;
