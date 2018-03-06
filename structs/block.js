class Block {
    constructor(index, transactions, difficulty, prevBlockHash, minedBy, blockDataHash, nonce, dateCreated, blockHash) {
        this.index = index;
        this.transactions = transactions;
        this.prevBlockHash = prevBlockHash;
        this.blockDataHash = blockDataHash;
        this.minedBy = minedBy;
        this.nonce = nonce;
        this.difficulty = difficulty;
        this.dateCreated = dateCreated;
        this.blockHash = blockHash;
    }

    static get genesis() {
        return new Block(
            // TODO: Add Genesis Info
        );
    }
}

module.exports = Block