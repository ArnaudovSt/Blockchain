const CryptoJs = require("crypto-js");

class BlockchainService {
    constructor(blockchain, blockchainDetails) {
        this._blockchain = blockchain;
        this._blockchainDetails = blockchainDetails;
    }

    getBlockHash(block) {
        const merkleRoot = CryptoJs.SHA256(block.transactions);
        const hashData = `${block.index}${merkleRoot}${block.prevBlockHash}${block.dateCreated}${block.nonce}`;
        return CryptoJs.SHA256(hashData) + '';
    }

    addBlock(newBlock) {
        if (_checkNewBlock(newBlock, this.getLatestBlock())) {
            this._blockchain.push(newBlock);
        }
    }

    getLatestBlock() {
        return this._blockchain[this._blockchain.length - 1];
    }

    getBlockchainLength() {
        return this._blockchain.length;
    }

    getBlockchainBlocks() {
        return this_blockchain.slice();
    }

    getBlockByIndex(index) {
        return this._blockchain[+index];
    }

    verifyAndAddBlock(proofOfWork) {
        const minerAddress = proofOfWork.params['address'];
        const pow = proofOfWork.body;
        const previousBlock = this.getLatestBlock();
        const newBlockIndex = previousBlock.index + 1;
        const newBlock = new Block(
            newBlockIndex,
            this._blockchainDetails.miningJobs[minerAddress.toString()].transactions,
            this._blockchainDetails.miningJobs[minerAddress.toString()].difficulty,
            this._blockchainDetails.miningJobs[minerAddress.toString()].prevBlockHash,
            minerAddress,
            this._blockchainDetails.miningJobs[minerAddress.toString()].transactionsHash,
            pow.nonce,
            pow.dateCreated,
            pow.blockHash
        );

        if (this._checkNewBlock(newBlock, this._getLatestBlock())) {
            this._blockchainDetails.miningJobs[minerAddress.toString()].transactions.forEach((transaction) => {
                this._blockchainDetails.pendingTransactions = this._blockchainDetails.pendingTransactions.filter((tran) => {
                    return tran.index !== transaction.index;
                });
            });

            this._blockchain.push(newBlock);
            this._blockchainDetails.miningJobs[minerAddress.toString()] = '';

            this._blockchainDetails.balances[minerAddress.toString()] += this._blockchainDetails.reward;
        }

        return pow;
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