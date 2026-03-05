import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, ExternalLink, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { sendTransaction, waitForTransaction, getNetworkConfig } from '../utils/walletUtils';
import { getWallet, getNetwork } from '../utils/storage';
import { saveTransaction, updateTransactionStatus } from '../utils/transactions';
import Spinner from '../components/Spinner';

export default function SendTransaction() {
    const navigate = useNavigate();
    const wallet = getWallet();
    const network = getNetwork();
    const net = getNetworkConfig(network);

    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('idle');
    const [txHash, setTxHash] = useState('');
    const [error, setError] = useState('');

    if (!wallet) { navigate('/'); return null; }

    const handleSend = async (e) => {
        e.preventDefault();
        setError(''); setStatus('sending');
        try {
            const result = await sendTransaction(wallet.privateKey, to.trim(), amount.trim(), network);
            setTxHash(result.hash);
            setStatus('pending');

            // Save transaction to history
            saveTransaction({
                hash: result.hash,
                from: wallet.address,
                to: to.trim(),
                value: amount.trim(),
                network,
                status: 'pending',
            });

            await waitForTransaction(result.hash, network);
            setStatus('success');
            updateTransactionStatus(result.hash, 'confirmed');
        } catch (err) {
            setError(err.message || 'Transaction failed');
            setStatus('error');
            if (txHash) updateTransactionStatus(txHash, 'failed');
        }
    };

    const explorerLink = txHash ? `${net.explorer}/tx/${txHash}` : '';
    const shortFrom = `${wallet.address.slice(0, 8)}···${wallet.address.slice(-6)}`;

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
            <div className="w-full max-w-2xl space-y-6 anim-slide-up">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')}
                        className="w-11 h-11 rounded-2xl bg-surface border border-border
                       flex items-center justify-center hover:bg-surface-hover transition cursor-pointer">
                        <ArrowLeft size={18} className="text-text-secondary" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-text">Send ETH</h1>
                        <p className="text-text-muted text-sm mt-0.5">{net.name}</p>
                    </div>
                </div>

                {/* Success */}
                {status === 'success' && (
                    <div className="glass-card-strong p-8 space-y-6 anim-scale-in">
                        <div className="flex flex-col items-center text-center space-y-4 py-6">
                            <div className="w-18 h-18 rounded-full bg-success/10 border border-success/15
                              flex items-center justify-center" style={{ width: 72, height: 72 }}>
                                <CheckCircle2 size={36} className="text-success" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-success">Confirmed!</h3>
                            <p className="text-text-muted text-sm">Your transaction was processed successfully</p>
                        </div>

                        <div className="field p-5 space-y-2">
                            <p className="text-text-muted text-xs font-display font-bold tracking-label uppercase">Transaction Hash</p>
                            <p className="text-sm font-mono break-all text-text-secondary leading-relaxed">{txHash}</p>
                        </div>

                        <div className="space-y-3">
                            <a href={explorerLink} target="_blank" rel="noopener noreferrer"
                                className="btn-ghost flex items-center justify-center gap-2 w-full text-base">
                                <ExternalLink size={16} /> View on Etherscan
                            </a>
                            <button onClick={() => navigate('/dashboard')}
                                className="btn-primary w-full text-base">Back to Dashboard</button>
                        </div>
                    </div>
                )}

                {/* Pending */}
                {status === 'pending' && (
                    <div className="glass-card-strong p-8 anim-scale-in">
                        <div className="flex flex-col items-center text-center space-y-4 py-8">
                            <div className="w-18 h-18 rounded-full bg-warning/10 border border-warning/15
                              flex items-center justify-center" style={{ width: 72, height: 72 }}>
                                <Loader2 size={32} className="text-warning animate-spin" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-warning">Pending</h3>
                            <p className="text-text-muted text-sm">Waiting for network confirmation...</p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {status === 'error' && (
                    <div className="glass-card-strong p-8 space-y-6 anim-scale-in">
                        <div className="flex flex-col items-center text-center space-y-4 py-6">
                            <div className="w-18 h-18 rounded-full bg-danger/10 border border-danger/15
                              flex items-center justify-center" style={{ width: 72, height: 72 }}>
                                <XCircle size={36} className="text-danger" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-danger">Failed</h3>
                            <p className="text-text-muted text-sm break-all max-w-sm leading-relaxed">{error}</p>
                        </div>
                        <button onClick={() => { setStatus('idle'); setError(''); }}
                            className="btn-ghost w-full text-base">Try Again</button>
                    </div>
                )}

                {/* Form */}
                {(status === 'idle' || status === 'sending') && (
                    <form onSubmit={handleSend} className="glass-card-strong p-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-pink/10 border border-pink/15
                              flex items-center justify-center">
                                <Send size={22} className="text-pink" />
                            </div>
                            <div>
                                <span className="text-text font-display font-bold text-lg">Send Transaction</span>
                                <p className="text-text-muted text-xs tracking-label uppercase font-display mt-0.5">Transfer ETH</p>
                            </div>
                        </div>

                        <div className="divider" />

                        <div className="space-y-2">
                            <label className="text-text-muted text-xs font-display font-bold tracking-label uppercase">From</label>
                            <div className="field p-4 text-sm font-mono text-text-muted">{shortFrom}</div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-text-muted text-xs font-display font-bold tracking-label uppercase">
                                Recipient Address
                            </label>
                            <input type="text" value={to} onChange={(e) => setTo(e.target.value)}
                                placeholder="0x..."
                                className="w-full field p-4 text-base font-mono text-text
                           placeholder:text-text-muted/20
                           focus:outline-none transition-all"
                                required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-text-muted text-xs font-display font-bold tracking-label uppercase">
                                Amount (ETH)
                            </label>
                            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.001" step="any" min="0"
                                className="w-full field p-4 text-base font-mono text-text
                           placeholder:text-text-muted/20
                           focus:outline-none transition-all"
                                required />
                        </div>

                        <button type="submit" disabled={!to.trim() || !amount.trim() || status === 'sending'}
                            className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4">
                            {status === 'sending'
                                ? <><Spinner size={18} /> Sending...</>
                                : <><Send size={18} /> Send Transaction</>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
