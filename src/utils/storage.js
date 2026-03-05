import { ensureAuth, saveWalletToFirestore, getWalletFromFirestore, clearWalletFromFirestore } from './firebase';

const WALLET_KEY = 'web3_wallet';
const NETWORK_KEY = 'web3_network';

// ── Wallet (localStorage + Firestore sync) ──

export function saveWallet(walletData) {
    localStorage.setItem(WALLET_KEY, JSON.stringify(walletData));
    // async Firestore sync
    ensureAuth().then((user) => {
        if (user) saveWalletToFirestore(user.uid, walletData);
    });
}

export function getWallet() {
    const data = localStorage.getItem(WALLET_KEY);
    return data ? JSON.parse(data) : null;
}

export async function getWalletAsync() {
    // Try localStorage first
    const local = getWallet();
    if (local) return local;
    // Fallback to Firestore
    const user = await ensureAuth();
    if (user) {
        const fsWallet = await getWalletFromFirestore(user.uid);
        if (fsWallet) {
            localStorage.setItem(WALLET_KEY, JSON.stringify(fsWallet));
            return fsWallet;
        }
    }
    return null;
}

export function clearWallet() {
    localStorage.removeItem(WALLET_KEY);
    ensureAuth().then((user) => {
        if (user) clearWalletFromFirestore(user.uid);
    });
}

// ── Network ──

export function saveNetwork(network) {
    localStorage.setItem(NETWORK_KEY, network);
}

export function getNetwork() {
    return localStorage.getItem(NETWORK_KEY) || 'sepolia';
}
