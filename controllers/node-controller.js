class NodeController {
    constructor(blockchainService, blockchainDetails) {
        this._blockchainService = blockchainService;
        this._blockchainDetails = blockchainDetails;
    }
}

module.exports = NodeController;