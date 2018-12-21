const Block = require('./block');
const cryptoHash = require('./crypto-hash'); 

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        });

        this.chain.push(newBlock);
    }

    static isValidChain(chain) {
        if (!chain) return false;

        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            return false;

        for (let i = 1; i < chain.length; i++) {
            const { timestamp, lastHash, hash, data } = chain[i];
            const actualLashHash = chain[i - 1].hash;

            if (lastHash !== actualLashHash) return false;
            if (cryptoHash(timestamp, lastHash, data) !== hash) return false;
        }

        return true;
    }

    replaceChain(chain) {
        if (chain 
            && chain.length > this.chain.length 
            && Blockchain.isValidChain(chain))
            this.chain = chain;
    }
}

module.exports = Blockchain;