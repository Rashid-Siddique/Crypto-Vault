// Transaction history — stored in localStorage
const TX_KEY = 'cryptovault_transactions';

export function getTransactions() {
    try {
        return JSON.parse(localStorage.getItem(TX_KEY) || '[]');
    } catch { return []; }
}

export function saveTransaction(tx) {
    const txs = getTransactions();
    txs.unshift({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        network: tx.network,
        status: tx.status || 'pending',
        timestamp: Date.now(),
    });
    // Keep last 50 transactions
    localStorage.setItem(TX_KEY, JSON.stringify(txs.slice(0, 50)));
}

export function updateTransactionStatus(hash, status) {
    const txs = getTransactions();
    const idx = txs.findIndex(t => t.hash === hash);
    if (idx !== -1) {
        txs[idx].status = status;
        localStorage.setItem(TX_KEY, JSON.stringify(txs));
    }
}

export function clearTransactions() {
    localStorage.removeItem(TX_KEY);
}
