const CryptoJs = require("crypto-js");

class BlockchainService {
    constructor(blockchain) {
        this._blockchain = blockchain;
    }

    getBlockHash(block) {
        const merkleRoot = CryptoJs.SHA256(block.transactions);
        const hashData = `${block.index}${merkleRoot}${block.prevBlockHash}${block.dateCreated}${block.dateCreated}${block.nonce}`;
        return CryptoJs.SHA256(hashData) + '';
    }

    addBlock(newBlock) {
        if (_checkNewBlock(newBlock, _getLatestBlock())) {
            this._blockchain.push(newBlock);
        }
    }

    _getLatestBlock() {
        return this._blockchain[this._blockchain.length - 1];
    }

    _checkNewBlock(newBlock, previousBlock) {
        if (newBlock.index !== previousBlock.index + 1) {
            console.error(`Wrong newBlock index: ${newBlock.index} should be ${previousBlock.index + 1}`);
            return false;
        }

        if (newBlock.previousHash !== previousBlock.hash) {
            console.error(`Wrong newBlock previousHash: ${newBlock.previousHash} should be ${previousBlock.hash}`);
            return false;
        }

        const newBlockHash = this.getBlockHash(newBlock);
        if (newBlock.blockHash !== newBlockHash) {
            console.error(`Wrong newBlock blockHash: ${newBlock.blockHash} should be ${newBlockHash}`);
            return false;
        }

        return true;
    }
}

module.exports = BlockchainService;