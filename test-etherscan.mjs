import { ethers } from 'ethers';

async function testFetch() {
    const address = '0xAD9F726eD9D4fB8dAA092040bAC1f4EdE1c9061E';
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Status:", data.status);
        console.log("Message:", data.message);
        console.log("Result length:", data.result ? data.result.length : 'undefined');
        if (data.status === '1') {
            const parsed = data.result.map(tx => ({
                hash: tx.hash,
                from: ethers.getAddress(tx.from),
                to: tx.to ? ethers.getAddress(tx.to) : '',
                value: ethers.formatEther(tx.value),
                timestamp: parseInt(tx.timeStamp) * 1000,
            }));
            console.log("Parsed first tx:", parsed[0]);
        } else {
            console.log("Failed. Result:", data.result);
        }
    } catch (e) {
        console.error(e);
    }
}

testFetch();
