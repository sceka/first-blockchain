const SHA256 = require('crypto-js/sha256');

class Transaction {
	constructor(fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}

class Block {
	constructor(timestamp, transaction, previousHash = '') {
		this.timestamp = timestamp;
		this.transaction = transaction;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}
	calculateHash() {
		return SHA256(
			this.timestamp +
				JSON.stringify(this.transaction) +
				this.previousHash +
				this.nonce
		).toString();
	}

	mineBlock(difficulty) {
		while (
			this.hash.substring(0, difficulty) !==
			Array(difficulty + 1).join('0')
		) {
			this.nonce++;
			this.hash = this.calculateHash();
		}
		console.log('Block mined: ' + this.hash);
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 2;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock() {
		return new Block(
			'23/11/2021',
			'Genesis Block',
			'0'
		);
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress) {
		let block = new Block(
			Date.now(),
			this.pendingTransactions
		);
		block.mineBlock(this.difficulty);
		console.log('Block mined successfully!');

		this.chain.push(block);

		this.pendingTransactions = [
			new Transaction(
				null,
				miningRewardAddress,
				this.miningReward
			)
		];
	}

	createTransactions(transaction) {
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address) {
		let balance = 0;

		for (const block of this.chain) {
			for (const trans of block.transaction) {
				if (trans.fromAddress === address) {
					balance -= trans.amount;
				}
				if (trans.toAddress === address) {
					balance += trans.amount;
				}
			}
		}
		return balance;
	}

	isChainValid() {
		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if (
				currentBlock.hash !==
				currentBlock.calculateHash()
			) {
				return false;
			}
			if (
				currentBlock.previousHash !==
				previousBlock.hash
			) {
				return false;
			}
		}
		return true;
	}
}

let ethCoin = new Blockchain();

ethCoin.createTransactions(
	new Transaction('address1', 'adrress2', 100)
);
ethCoin.createTransactions(
	new Transaction('address2', 'adrress1', 50)
);

console.log('Starting the miner...');
ethCoin.minePendingTransactions('marko-address');
console.log(
	" \nBalance of marko's address is: " +
		ethCoin.getBalanceOfAddress('marko-address')
);

console.log(' \nStarting the miner again...');
ethCoin.minePendingTransactions('marko-address');
console.log(
	" \nBalance of marko's address is: " +
		ethCoin.getBalanceOfAddress('marko-address')
);
