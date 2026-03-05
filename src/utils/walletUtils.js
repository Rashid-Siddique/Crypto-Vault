import { ethers } from 'ethers';

const NETWORKS = {
    sepolia: {
        name: 'Sepolia Testnet',
        chainId: 11155111,
        rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
        explorer: 'https://sepolia.etherscan.io',
        symbol: 'ETH',
    },
    mainnet: {
        name: 'Ethereum Mainnet',
        chainId: 1,
        rpcUrl: 'https://ethereum-rpc.publicnode.com',
        explorer: 'https://etherscan.io',
        symbol: 'ETH',
    },
};

export function getNetworkConfig(network = 'sepolia') {
    return NETWORKS[network] || NETWORKS.sepolia;
}

export function getProvider(network = 'sepolia') {
    const config = getNetworkConfig(network);
    return new ethers.JsonRpcProvider(config.rpcUrl);
}

export function createWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey,
    };
}

export function importWallet(privateKey) {
    try {
        if (!privateKey || typeof privateKey !== 'string') {
            throw new Error('Private key must be a valid string');
        }

        let formattedKey = privateKey.trim();

        // Ensure it starts with 0x
        if (!formattedKey.startsWith('0x')) {
            formattedKey = '0x' + formattedKey;
        }

        // ethers.Wallet requires exactly 66 characters total (0x + 64 hex chars)
        if (formattedKey.length !== 66) {
            throw new Error('Invalid private key length');
        }

        const wallet = new ethers.Wallet(formattedKey);

        return {
            address: wallet.address,
            privateKey: wallet.privateKey,
        };
    } catch (error) {
        throw new Error('Invalid private key. Please check and try again.');
    }
}

export async function getBalance(address, network = 'sepolia') {
    const provider = getProvider(network);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
}

export async function sendTransaction(privateKey, to, amountInEth, network = 'sepolia') {
    const provider = getProvider(network);
    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = await wallet.sendTransaction({
        to,
        value: ethers.parseEther(amountInEth),
    });

    return {
        hash: tx.hash,
        explorer: `${getNetworkConfig(network).explorer}/tx/${tx.hash}`,
    };
}

export async function waitForTransaction(hash, network = 'sepolia') {
    const provider = getProvider(network);
    const receipt = await provider.waitForTransaction(hash);
    return receipt;
}

export async function fetchTransactionHistory(address, network = 'sepolia') {
    // Use Blockscout API — free, no API key required
    const isMainnet = network === 'mainnet';
    const apiUrl = isMainnet
        ? 'https://eth.blockscout.com/api'
        : 'https://eth-sepolia.blockscout.com/api';

    const url = `${apiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === '1' && data.result) {
            return data.result.map(tx => ({
                hash: tx.hash,
                from: ethers.getAddress(tx.from),
                to: tx.to ? ethers.getAddress(tx.to) : '',
                value: ethers.formatEther(tx.value),
                timestamp: parseInt(tx.timeStamp) * 1000,
                status: tx.isError === '0' ? 'confirmed' : 'failed',
                network: network,
                gasUsed: tx.gasUsed
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}
