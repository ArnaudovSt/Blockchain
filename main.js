const express = require("express");
const bodyParser = require("body-parser");

const blockDifficulty = 4;
const faucetAddress = "c3293572dbe6ebc60de4a20ed0e21446cae66b17";
const faucetBalance = 12398178923123;
const blockReward = 25;
const blockchainDetails = require("./structs/blockchainDetails")(blockDifficulty, faucetAddress, faucetBalance, blockReward);

const Block = require("./structs/block");
const Blockchain = [Block.getGenesis(faucetAddress)];

const blockchainService = require("./services/blockchain.service")(Blockchain, blockchainDetails);

const miningService = require("./services/mining.service")(blockchainService, blockchainDetails);

const nodeController = require("./controllers/node-controller")(blockchainService, blockchainDetails, miningService);

const app = express();
const port = 3000;
app.use(bodyParser.json());

app.get('/', nodeController.main);
app.get('/info', nodeController.getNodeInfo);
app.get('/blocks', nodeController.getBlockchainBlocks);
app.get('/blocks/:index', nodeController.getBlockByIndex);
app.get('/balance/:address/confirmations/:confirmCount', nodeController.getBalanceByAddress);
app.post('/transactions/new', nodeController.addNewTransaction);
app.get('/mining/get-block/:address', nodeController.getMinerBlock);
app.get('/transactions/:tranHash/info', nodeController.getTransaction);
app.post('/blocks/notify', nodeController.addedNewBlock);
app.get('/peers', nodeController.getPeers);
app.post('/peers', nodeController.addNewPeer);
app.post('/mining/get-block/:address', nodeController.verifyAndAddBlock);
app.get('/transactions/pending', nodeController.getPendingTransactions);

app.listen(port, () => {
    console.log(`The application has started on port ${port}`);
});