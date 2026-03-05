import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Copy, Check, LogOut, RefreshCw, ChevronDown,
    Globe, ExternalLink, ArrowUpRight, ArrowDownLeft, Repeat, Activity,
    Clock, CheckCircle2, XCircle, Loader2
} from 'lucide-react';
import { getBalance, getNetworkConfig, fetchTransactionHistory } from '../utils/walletUtils';
import { getWallet, clearWallet, getNetwork, saveNetwork } from '../utils/storage';
import { getTransactions } from '../utils/transactions';
import SecurityBanner from '../components/SecurityBanner';
import Spinner from '../components/Spinner';
import ReceiveModal from '../components/ReceiveModal';

export default function Dashboard() {
    const navigate = useNavigate();
    const [wallet, setWallet] = useState(null);
    const [network, setNetwork] = useState(getNetwork());
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showNet, setShowNet] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [showReceive, setShowReceive] = useState(false);

    useEffect(() => {
        const w = getWallet();
        if (!w) { navigate('/'); return; }
        setWallet(w);
        setTransactions(getTransactions());
    }, [navigate]);

    const fetchWalletData = useCallback(async () => {
        if (!wallet) return;
        setLoading(true);
        try {
            // Fetch balance
            const bal = await getBalance(wallet.address, network);
            setBalance(bal);

            // Fetch and merge transactions
            const onChainTxs = await fetchTransactionHistory(wallet.address, network);
            const localTxs = getTransactions();

            const allTxsMap = new Map();
            // Add on-chain txs first (confirmed truth for this network)
            onChainTxs.forEach(tx => allTxsMap.set(tx.hash, tx));

            // Add local txs
            localTxs.forEach(tx => {
                // Only merge local txs for the currently selected network
                if (tx.network === network || (!tx.network && network === 'sepolia')) {
                    if (!allTxsMap.has(tx.hash)) {
                        allTxsMap.set(tx.hash, tx);
                    } else if (tx.status === 'pending') {
                        // If it's in local storage as pending but found on-chain, it's confirmed
                        tx.status = 'confirmed';
                    }
                }
            });

            // Sort merged transactions by timestamp descending
            const merged = Array.from(allTxsMap.values()).sort((a, b) => b.timestamp - a.timestamp);
            setTransactions(merged);

        } catch (err) {
            console.error('Error fetching wallet data:', err);
            setBalance('Error');
        } finally {
            setLoading(false);
        }
    }, [wallet, network]);

    useEffect(() => { fetchWalletData(); }, [fetchWalletData]);

    const handleCopy = async () => {
        if (!wallet) return;
        await navigator.clipboard.writeText(wallet.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const switchNetwork = (n) => {
        setNetwork(n); saveNetwork(n); setBalance(null); setShowNet(false);
    };

    if (!wallet) return null;

    const net = getNetworkConfig(network);
    const short = `${wallet.address.slice(0, 6)}···${wallet.address.slice(-4)}`;

    const formatDate = (ts) => {
        const d = new Date(ts);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
            ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const statusIcon = (s) => {
        if (s === 'confirmed') return <CheckCircle2 size={16} className="text-success" />;
        if (s === 'failed') return <XCircle size={16} className="text-danger" />;
        return <Loader2 size={16} className="text-warning animate-spin" />;
    };

    return (
        <div className="flex-1 flex flex-col items-center px-6 sm:px-10 lg:px-16 py-8 overflow-y-auto">
            <div className="w-full max-w-[780px] mx-auto space-y-6">

                {/* ── Top bar: Avatar + Address + Disconnect ── */}
                <div className="relative z-[100] flex items-center justify-between anim-slide-up">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink to-violet
                            flex items-center justify-center text-white text-sm font-bold font-mono
                            shadow-lg shadow-pink/15 shrink-0">
                            {wallet.address.slice(2, 4).toUpperCase()}
                        </div>
                        <div>
                            <button onClick={handleCopy}
                                className="flex items-center gap-2 text-text font-mono text-sm
                           cursor-pointer hover:text-pink transition-colors font-medium">
                                {short}
                                {copied
                                    ? <Check size={14} className="text-success" />
                                    : <Copy size={14} className="text-text-muted" />}
                            </button>
                            <div className="relative inline-block">
                                <button onClick={() => setShowNet(!showNet)}
                                    className="flex items-center gap-1.5 text-text-muted text-xs cursor-pointer
                             hover:text-text-secondary transition-colors mt-0.5">
                                    <div className={`w-2 h-2 rounded-full ${network === 'sepolia' ? 'bg-warning' : 'bg-emerald'}`} />
                                    {net.name}
                                    <ChevronDown size={11} className={`transition-transform ${showNet ? 'rotate-180' : ''}`} />
                                </button>
                                {showNet && (
                                    <div className="absolute top-full left-0 mt-2 w-52 glass-card-strong overflow-hidden z-50 py-1 anim-scale-in">
                                        {['sepolia', 'mainnet'].map((n) => (
                                            <button key={n} onClick={() => switchNetwork(n)}
                                                className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 cursor-pointer
                                   font-display transition-colors
                                   ${network === n ? 'text-pink bg-pink/5' : 'text-text-muted hover:bg-surface-hover'}`}>
                                                <div className={`w-2 h-2 rounded-full ${n === 'sepolia' ? 'bg-warning' : 'bg-emerald'}`} />
                                                {getNetworkConfig(n).name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <button onClick={() => { clearWallet(); navigate('/'); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-2xl text-text-muted text-sm
                       bg-surface border border-border cursor-pointer font-display font-medium
                       hover:text-danger hover:border-danger/20 transition-all">
                        <LogOut size={14} />
                        Disconnect
                    </button>
                </div>

                {/* ── Balance card ── */}
                <div className="glass-card-strong px-8 py-8 anim-slide-up-d1">
                    <div className="mb-5">
                        <p className="text-text-muted text-xs font-display font-semibold tracking-label uppercase mb-3">
                            Total Balance
                        </p>
                        {loading ? (
                            <div className="flex items-center gap-3 text-text-muted py-2">
                                <Spinner size={20} />
                                <span className="text-sm font-display">Fetching balance...</span>
                            </div>
                        ) : (
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl font-display font-extrabold text-white tracking-tight">
                                    {balance !== null ? parseFloat(balance).toFixed(4) : '-.----'}
                                </span>
                                <span className="text-text-secondary text-xl font-display font-bold">ETH</span>
                            </div>
                        )}
                        <p className="text-text-muted text-sm font-display mt-2">≈ $0.00 USD</p>
                    </div>

                    {/* Action row — 4-column grid for even spacing */}
                    <div className="grid grid-cols-4 pt-2">
                        <button onClick={() => navigate('/send')} className="action-btn">
                            <div className="icon-circle">
                                <ArrowUpRight size={20} className="text-pink" />
                            </div>
                            <span className="icon-label">Send</span>
                        </button>

                        <button onClick={() => setShowReceive(true)} className="action-btn">
                            <div className="icon-circle">
                                <ArrowDownLeft size={20} className="text-violet" />
                            </div>
                            <span className="icon-label">Receive</span>
                        </button>

                        <div className="action-btn disabled">
                            <div className="icon-circle">
                                <Repeat size={20} className="text-blue" />
                            </div>
                            <span className="icon-label">Swap</span>
                        </div>

                        <button onClick={fetchWalletData} className="action-btn">
                            <div className="icon-circle">
                                <RefreshCw size={20} className={`text-emerald ${loading ? 'animate-spin' : ''}`} />
                            </div>
                            <span className="icon-label">Refresh</span>
                        </button>
                    </div>
                </div>

                {/* ── Wallet details card ── */}
                <div className="glass-card px-7 py-6 space-y-5 anim-slide-up-d1">
                    <h3 className="text-xs font-display font-bold text-text-muted tracking-label uppercase">
                        Wallet Details
                    </h3>
                    <div className="divider" />

                    <div className="space-y-5">
                        <div className="flex items-start gap-4">
                            <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center shrink-0 mt-0.5">
                                <Globe size={15} className="text-text-muted" />
                            </div>
                            <div>
                                <p className="text-text-muted text-[10px] font-display font-bold tracking-label uppercase">Network</p>
                                <p className="text-text-secondary text-sm mt-1">{net.name} · Chain {net.chainId}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center shrink-0 mt-0.5">
                                <Copy size={15} className="text-text-muted" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-text-muted text-[10px] font-display font-bold tracking-label uppercase">Full Address</p>
                                <p className="font-mono text-xs break-all text-text-secondary leading-relaxed mt-1">
                                    {wallet.address}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center shrink-0 mt-0.5">
                                <Activity size={15} className="text-text-muted" />
                            </div>
                            <div>
                                <p className="text-text-muted text-[10px] font-display font-bold tracking-label uppercase">Status</p>
                                <p className="text-emerald text-sm font-medium mt-1">● Connected</p>
                            </div>
                        </div>
                    </div>

                    <a href={`${net.explorer}/address/${wallet.address}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 text-sm text-pink/70
                       hover:text-pink transition-colors font-display font-medium
                       bg-surface border border-border rounded-2xl">
                        <ExternalLink size={14} />
                        View on Etherscan
                    </a>
                </div>

                {/* ── Security banner ── */}
                <div className="anim-slide-up-d2">
                    <SecurityBanner />
                </div>

                {/* ── Transaction History ── */}
                <div className="glass-card px-7 py-6 space-y-5 anim-slide-up-d3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-display font-bold text-text-muted tracking-label uppercase flex items-center gap-2">
                            <Clock size={14} />
                            Transaction History
                        </h3>
                        <span className="text-xs text-text-muted font-mono">
                            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="divider" />

                    {transactions.length === 0 ? (
                        <div className="text-center py-10 space-y-3">
                            <div className="w-14 h-14 rounded-full bg-surface border border-border
                              flex items-center justify-center mx-auto">
                                <Clock size={22} className="text-text-muted" />
                            </div>
                            <p className="text-text-muted text-sm font-display">No transactions yet</p>
                            <p className="text-text-muted/50 text-xs max-w-[280px] mx-auto leading-relaxed">
                                Your transactions will appear here.
                                Use the Send button above to make your first transfer.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((tx, i) => {
                                const txNet = getNetworkConfig(tx.network || network);
                                const isReceived = tx.to?.toLowerCase() === wallet.address.toLowerCase();
                                const shortToOrFrom = isReceived && tx.from
                                    ? `From: ${tx.from.slice(0, 6)}···${tx.from.slice(-4)}`
                                    : `To: ${tx.to ? `${tx.to.slice(0, 6)}···${tx.to.slice(-4)}` : '—'}`;

                                return (
                                    <div key={tx.hash || i}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-surface/50 border border-border
                               hover:border-border-light transition-colors">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                            ${isReceived
                                                ? 'bg-emerald/8 border border-emerald/12'
                                                : 'bg-pink/8 border border-pink/12'}`}>
                                            {isReceived
                                                ? <ArrowDownLeft size={16} className="text-emerald" />
                                                : <ArrowUpRight size={16} className="text-pink" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-text font-display font-medium text-sm">
                                                    {isReceived ? 'Received ETH' : 'Sent ETH'}
                                                </span>
                                                {statusIcon(tx.status)}
                                            </div>
                                            <p className="text-text-muted text-xs font-mono mt-1">{shortToOrFrom}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className={`font-mono text-sm font-medium ${isReceived ? 'text-emerald' : 'text-text'}`}>
                                                {isReceived ? '+' : '-'}{tx.value || '?'} ETH
                                            </p>
                                            <p className="text-text-muted text-xs mt-1">
                                                {tx.timestamp ? formatDate(tx.timestamp) : '—'}
                                            </p>
                                        </div>
                                        {tx.hash && (
                                            <a href={`${txNet.explorer}/tx/${tx.hash}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="shrink-0 p-2 rounded-xl hover:bg-surface-hover transition text-text-muted hover:text-pink">
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {showReceive && wallet && (
                    <ReceiveModal
                        address={wallet.address}
                        onClose={() => setShowReceive(false)}
                    />
                )}
            </div>
        </div>
    );
}
