const Block = require('./block');
const cryptoHash = require('../util/crypto-hash'); 

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
        if (!chain || JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            return false;

        for (let i = 1; i < chain.length; i++) {
            const { timestamp, lastHash, hash, data, nonce, difficulty } = chain[i];
            const actualLashHash = chain[i - 1].hash;
            const lastDifficulty = chain[i - 1].difficulty;

            if (lastHash !== actualLashHash) return false;
            if (cryptoHash(timestamp, lastHash, data, nonce, difficulty) !== hash) return false;
            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }

        return true;
    }

    replaceChain(chain) {
        if (chain 
            && chain.length > this.chain.length 
            && Blockchain.isValidChain(chain))
            this.chain = chain;
        
        if (chain && chain.length <= this.chain.length)
            console.log('Incoming chain must be longer to replace');
            
    }
}

module.exports = Blockchain;