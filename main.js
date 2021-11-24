const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate(
	'1ae5e8d4cd43d6caaa978d5a397123bc35fd661243ac6db6abc51733a988aedf'
);
const myWalletAddress = myKey.getPublic('hex');

let ethCoin = new Blockchain();

console.log('Starting the miner...');
ethCoin.minePendingTransactions(myWalletAddress);

const tx1 = new Transaction(
	myWalletAddress,
	'public key goes here',
	10
);
tx1.signTransactions(myKey);
ethCoin.addTransactions(tx1);

ethCoin.minePendingTransactions(myWalletAddress);
console.log(
	" \nBalance of marko's address is: " +
		ethCoin.getBalanceOfAddress(myWalletAddress)
);
