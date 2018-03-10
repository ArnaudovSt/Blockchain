const express = require("express");
const bodyParser = require("body-parser");

const blockDifficulty = 4;
const faucetAddress = "c3293572dbe6ebc60de4a20ed0e21446cae66b17";
const faucetBalance = 12398178923123;
const blockReward = 25;

const Block = require("./structs/block");
const Blockchain = [Block.getGenesis(faucetAddress)];

const blockchainService = require("./services/blockchain.service")(Blockchain);

const blockchainDetails = require("./structs/blockchainDetails")(blockDifficulty,faucetAddress, faucetBalance, blockReward);

const nodeController = require("./controllers/node-controller")(blockchainService, blockchainDetails);

const app = express();
const port = 3000;
app.use(bodyParser.json());

app.get();


app.listen(port, () => {
    console.log(`The application has started on port ${port}`);
});