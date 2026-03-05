import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, ArrowLeft, ShieldCheck, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { createWallet } from '../utils/walletUtils';
import { saveWallet } from '../utils/storage';
import SecurityBanner from '../components/SecurityBanner';

export default function CreateWallet() {
    const navigate = useNavigate();
    const [wallet] = useState(() => createWallet());
    const [copiedField, setCopiedField] = useState(null);
    const [showKey, setShowKey] = useState(false);
    const [saved, setSaved] = useState(false);

    const copy = async (text, field) => {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
            <div className="w-full max-w-2xl space-y-5 anim-slide-up">
                {/* Header */}
                <div className="flex items-center gap-3 mb-1">
                    <button onClick={() => navigate('/')}
                        className="w-10 h-10 rounded-2xl bg-surface border border-border
                       flex items-center justify-center hover:bg-surface-hover transition cursor-pointer">
                        <ArrowLeft size={18} className="text-text-secondary" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-text">Create Wallet</h1>
                        <p className="text-text-muted text-sm">Your new wallet is ready</p>
                    </div>
                </div>

                {/* Main card */}
                <div className="glass-card-strong p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-1">
                        <div className="w-11 h-11 rounded-full bg-emerald/10 border border-emerald/15
                            flex items-center justify-center">
                            <ShieldCheck size={22} className="text-emerald" />
                        </div>
                        <div>
                            <p className="text-emerald font-display font-bold text-lg">Wallet Generated</p>
                            <p className="text-text-muted text-xs tracking-label uppercase font-display">Ethereum Wallet</p>
                        </div>
                    </div>

                    <div className="divider" />

                    {/* Address */}
                    <div className="space-y-2">
                        <label className="text-text-muted text-xs font-display font-bold tracking-label uppercase">
                            Wallet Address
                        </label>
                        <div className="flex items-center gap-3 field p-4">
                            <code className="flex-1 text-sm break-all text-text-secondary font-mono leading-relaxed">
                                {wallet.address}
                            </code>
                            <button onClick={() => copy(wallet.address, 'addr')}
                                className="shrink-0 p-2 rounded-xl hover:bg-surface-hover transition cursor-pointer">
                                {copiedField === 'addr'
                                    ? <Check size={16} className="text-success" />
                                    : <Copy size={16} className="text-text-muted" />}
                            </button>
                        </div>
                    </div>

                    {/* Private Key */}
                    <div className="space-y-2">
                        <label className="text-text-muted text-xs font-display font-bold tracking-label uppercase">
                            Private Key
                        </label>
                        <div className="flex items-center gap-3 field p-4 border-danger/10">
                            <code className="flex-1 text-sm break-all font-mono leading-relaxed text-danger/70">
                                {showKey ? wallet.privateKey : '•'.repeat(32)}
                            </code>
                            <button onClick={() => setShowKey(!showKey)}
                                className="shrink-0 p-2 rounded-xl hover:bg-surface-hover transition cursor-pointer">
                                {showKey ? <EyeOff size={16} className="text-text-muted" /> : <Eye size={16} className="text-text-muted" />}
                            </button>
                            <button onClick={() => copy(wallet.privateKey, 'key')}
                                className="shrink-0 p-2 rounded-xl hover:bg-surface-hover transition cursor-pointer">
                                {copiedField === 'key'
                                    ? <Check size={16} className="text-success" />
                                    : <Copy size={16} className="text-text-muted" />}
                            </button>
                        </div>
                    </div>

                    <div className="field border-danger/10 p-4 text-sm text-danger/80 leading-relaxed">
                        ⚠️ <strong>Keep your private key secret.</strong> Anyone with it can access your wallet.
                    </div>
                </div>

                {/* Continue */}
                <div className="space-y-4 anim-slide-up-d1">
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-2xl hover:bg-surface transition">
                        <input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)}
                            className="w-5 h-5 accent-pink rounded" />
                        <span className="text-text-secondary text-sm font-display">
                            I have securely saved my private key
                        </span>
                    </label>
                    <button onClick={() => { saveWallet(wallet); navigate('/dashboard'); }}
                        disabled={!saved}
                        className="btn-primary w-full flex items-center justify-center gap-2 text-base">
                        Continue to Dashboard
                        <ChevronRight size={18} />
                    </button>
                </div>

                <div className="anim-slide-up-d2">
                    <SecurityBanner />
                </div>
            </div>
        </div>
    );
}
