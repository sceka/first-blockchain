const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(index, timestamp, data, previousHash) {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
	}
	calculateHash() {
		return SHA256(
			this.index +
				this.timestamp +
				JSON.stringify(this.data) +
				this.previousHash
		).toString();
	}
}

class BlockChain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
	}

	createGenesisBlock() {
		return new Block(
			'0',
			'24/11/2021',
			'Genesis Block',
			'0'
		);
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}
}

let ethCoin = new BlockChain();
ethCoin.addBlock(new Block(1, '25/11/2021', { amount: 2 }));
ethCoin.addBlock(new Block(2, '26/11/2021', { amount: 5 }));

console.log(JSON.stringify(ethCoin, null, 4));
