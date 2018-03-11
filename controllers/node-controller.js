const CryptoJs = require("crypto-js");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class NodeController {
    constructor(blockchainService, blockchainDetails, miningService) {
        this._blockchainService = blockchainService;
        this._blockchainDetails = blockchainDetails;
        this._miningService = miningService;
    }

    main(req, res) {
        res.send('Blockchain Dev Camp Node');
    }

    getNodeInfo(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(
            {
                "about": "Blockchain",
                "nodeName": "Softuni",
                "peers": this._blockchainDetails.peers,
                "difficulty": this._blockchainDetails.difficulty,
                "blocks": this._blockchainService.getBlockchainLength(),
                "cummulativeDifficulty": 127,
                "confirmedTransactions": 208,
                "pendingTransactions": this._blockchainDetails.pendingTransactions.length,
            }
        );
    }

    getBlockchainBlocks(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(this._blockchainService.getBlockchainBlocks());
    }

    getBlockByIndex(req, res) {
        res.setHeader('Content-Type', 'application/json');
        const index = req.params.index;
        res.send(this._blockchainService.getBlockByIndex(index));
    }

    getBalanceByAddress(req, res) {
        res.setHeader('Content-Type', 'application/json');
        const address = req.params['address'];
        const confirmCount = +req.params['confirmCount'];

        const balance = this._blockchainDetails.balances[address.toString()];
        if (balance) {
            res.send(
                {
                    "address": address,
                    "confirmedBalance": this._blockchainDetails.balances[address.toString()],
                    "lastMinedBalance": this._blockchainDetails.balances[address.toString()],
                    "pendingBalance": this._blockchainDetails.balances[address.toString()]
                }
            )
        }
        else {
            res.send(
                {
                    "address": address,
                    "confirmedBalance": 0,
                    "lastMinedBalance": 0,
                    "pendingBalance": 0
                }
            )
        }
    }

    addNewTransaction(req, res) {
        res.setHeader('Content-Type', 'application/json');
        const newTransaction = req.body;

        const timestamp = new Date(newTransaction.dateCreated).getTime();
        const transactionHash = CryptoJs.SHA256(newTransaction.from + newTransaction.to + newTransaction.value + newTransaction.senderPubKey + newTransaction.senderSignature + newTransaction.timestamp).toString();

        const hasBalance = (this._blockchainDetails.balances[newTransaction.from.toString()] - newTransaction.value) > 0;

        if (hasBalance) {
            newTransaction.transactionHash = transactionHash;
            this._blockchainDetails.pendingTransactions.push(newTransaction);

            this._blockchainDetails.balances[newTransaction.from.toString()] -= newTransaction.value;
            if (Number(this._blockchainDetails.balances[newTransaction.to.toString()]) > 0) {
                this._blockchainDetails.balances[newTransaction.to.toString()] += newTransaction.value;
            }
            else {
                this._blockchainDetails.balances[newTransaction.to.toString()] = Number(newTransaction.value);
            }

            res.status(200);
            res.send(
                {
                    "dateReceived": new Date().toString(),
                    "transactionHash": transactionHash
                }
            );
        }
        else {
            res.status(400);
            res.send(
                {
                    "error": "Insufficient funds!"
                }
            );
        }
    }

    getMinerBlock(req, res) {
        const minerAddress = req.params['address'];
        const miningJob = this._miningService.getMiningJob(minerAddress);

        res.setHeader('Content-Type', 'application/json');
        res.send(miningJob);
    }

    getTransaction(req, res) {
        const tranHash = req.params['tranHash'];

        this._blockchainService.getBlockchainBlocks().forEach((block, index) => {
            block.transactions.forEach((transaction, index) => {
                if (transaction.transactionHash.toUpperCase() == tranHash.toUpperCase()) {
                    res.setHeader('Content-Type', 'application/json');
                    transaction.status = "Paid";
                    res.send(transaction)
                }
            })
        });

        this._blockchainDetails.pendingTransactions.forEach((transaction) => {
            if (transaction.transactionHash.toUpperCase() == tranHash.toUpperCase()) {
                res.setHeader('Content-Type', 'application/json');
                transaction.status = "Pending";
                res.send(transaction)
            }
        });

        res.setHeader('Content-Type', 'application/json');
        res.send(
            {
                "error": "Invalid transaction hash!"
            }
        );
    }

    addedNewBlock(req, res) {
        const blockIndex = +req.body.index;
        res.setHeader('Content-Type', 'application/json');
        res.send(
            {
                "message": "Thank you!"
            }
        );
    }

    getPeers = (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(this._blockchainDetails.peers);
    }

    addNewPeer(req, res) {
        const nodeUrl = req.body.url;

        this._blockchainDetails.peers.push(nodeUrl);

        res.setHeader('Content-Type', 'application/json');
        res.send(
            {
                "message": "Added peer: " + nodeUrl
            }
        )
    }

    verifyAndAddBlock(req, res) {
        const jobDone = this._blockchainService.verifyAndAddBlock(req.body);
        res.setHeader('Content-Type', 'application/json');
        res.send(jobDone);
    }

    getPendingTransactions(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(this._blockchainDetails.pendingTransactions);
    }
}

module.exports = NodeController;