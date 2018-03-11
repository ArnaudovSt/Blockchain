const Transaction = require("../structs/transaction");
let MiningJob = require("../structs/miningJob")
let CryptoJs = require("crypto-js");

class MiningService {
    constructor(blockchainService, blockchainDetails) {
        this._blockchainService = blockchainService;
        this._blockchainDetails = blockchainDetails;
    }

    getMiningJob(minerAddress) {
        const index = this._blockchainService.getLatestBlock().index + 1;

        const coinBaseTransaction = new Transaction(
            "0x0",
            minerAddress,
            this._blockchainDetails.reward,
            "",
            "",
            "",
            Date.now(),
            index,
            true
        );

        const transactionHash = CryptoJS.SHA256(coinBaseTransaction.fromAddress + coinBaseTransaction.toAddress + coinBaseTransaction.value + coinBaseTransaction.dateReceived);
        coinBaseTransaction.transactionHash = transactionHash.toString();

        this._blockchainDetails.pendingTransactions.push(coinBaseTransaction);

        const currentTransactions = pendingTransactions;
        const transactionsHash = CryptoJs.SHA256(currentTransactions).toString();
        const prevBlockHash = this._blockchainService.getLatestBlock().blockHash;

        const jobForMining = new MiningJob(index, expectedReward, currentTransactions, transactionsHash, prevBlockHash, this._blockchainDetails.difficulty);

        this._blockchainDetails.miningJobs[minerAddress] = jobForMining;

        return jobForMining;
    }

    checkProof(proof) {
        const miningJob = this._blockchainDetails.miningJobs[proof.minedBy];
        const validHash = this.calculateHash(miningJob.index, miningJob.prevBlockHash, proof.timestamp, miningJob.transactionsHash, proof.nonce);

        return proof.blockHash === validHash && this.achievedDifficulty(pow.blockHash);
    }

    _achievedDifficulty(hash) {
        for (let i = 0, b = hash.length; i < b; i += 1) {
            if (hash[i] !== '0') {
                return i >= this._blockchainDetails.difficulty;
            }
        }
    }
}

module.exports = MiningService;