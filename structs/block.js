const Transaction = require("./structs/transaction");

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

    static getGenesis(faucetAddress) {
        return new Block(
            0, //index
            [
                new Transaction(
                    "0x0",          // fromAddress
                    faucetAddress,   // toAddress
                    1000000000000, // transactionValue,
                    "",             // senderPubKey
                    "",             //  senderSignature,
                    "",             // transactionHash,
                    Date.now(),     // dateReceived,
                    0,          // minedInBlockIndex,
                    true           // paid
                )
            ], // transactions array
            5,  // difficulty
            "d279fa6a31ae4fb07cfd9cf7f35cc013cf20a",  // previous block hash
            "f582d57711a618e69d588ce93895d749858fa95b", // mined by
            "5d845cddcd4404ecfd5476fd6b1cf0ea80cd3",  // block data hash
            2455432,  // nonce
            "2018-02-01T23:23:56.337Z", // date created
            '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7'); // block hash
    }
}

module.exports = Block