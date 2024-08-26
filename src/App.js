import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockDetailsAvailable, setBlockNumberDetailsAvailable] =
    useState(false);
  const [transactionDetails, setTransactionDetails] = useState([]);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  });

  const fetchTransactionDetails = async () => {
    const block = await alchemy.core.getBlock();
    setBlockNumberDetailsAvailable(true);

    const txDetails = await Promise.all(
      block.transactions.map((tx) => alchemy.core.getTransactionReceipt(tx))
    );
    setTransactionDetails(txDetails);
  };

  return (
    <div>
      <div className="App">Block Number: {blockNumber}</div>
      <div className="App">
        <button onClick={fetchTransactionDetails}>Get Block Details</button>

        {blockDetailsAvailable &&
          transactionDetails.map((txDetails, i) => (
            <div key={i}>
              <h2>Transaction</h2>
              <ul>
                <li>Transaction Hash: {txDetails.transactionHash}</li>
                <li>Transaction Index: {txDetails.transactionIndex}</li>
                <li>From: {txDetails.from}</li>
                <li>To: {txDetails.to}</li>
              </ul>
              <hr />
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
