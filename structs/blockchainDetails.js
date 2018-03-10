class BlockchainDetails {
    constructor(difficulty, faucetAddress, faucetBalance, blockReward) {
        this.pendingTransactions = [];
        this.miningJobs = [];
        this.difficulty = difficulty;
        this.peers = [];
        this.balances = [];
        this.balances[faucetAddress.toString()] = faucetBalance;
        this.reward = blockReward;
    }
}

module.exports = BlockchainDetails;