import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, AlertCircle, Import } from 'lucide-react';
import { importWallet } from '../utils/walletUtils';
import { saveWallet } from '../utils/storage';
import SecurityBanner from '../components/SecurityBanner';
import Spinner from '../components/Spinner';

export default function ImportWallet() {
    const navigate = useNavigate();
    const [privateKey, setPrivateKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImport = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            saveWallet(importWallet(privateKey.trim()));
            navigate('/dashboard');
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
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
                        <h1 className="text-2xl font-display font-bold text-text">Import Wallet</h1>
                        <p className="text-text-muted text-sm">Restore from private key</p>
                    </div>
                </div>

                {/* Card */}
                <form onSubmit={handleImport} className="glass-card-strong p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-1">
                        <div className="w-11 h-11 rounded-full bg-violet/10 border border-violet/15
                            flex items-center justify-center">
                            <KeyRound size={22} className="text-violet" />
                        </div>
                        <div>
                            <p className="text-violet font-display font-bold text-lg">Private Key</p>
                            <p className="text-text-muted text-xs tracking-label uppercase font-display">Paste below</p>
                        </div>
                    </div>

                    <div className="divider" />

                    <div className="space-y-2">
                        <label className="text-text-muted text-xs font-display font-bold tracking-label uppercase">
                            Enter Private Key
                        </label>
                        <textarea value={privateKey} onChange={(e) => setPrivateKey(e.target.value)}
                            placeholder="0x..."
                            rows={4}
                            className="w-full field p-4 text-sm font-mono text-text
                         placeholder:text-text-muted/20 resize-none
                         focus:outline-none transition-all" />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-danger text-sm field border-danger/15 p-4">
                            <AlertCircle size={16} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={!privateKey.trim() || loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 text-base">
                        {loading ? <><Spinner size={18} /> Importing...</> : <><Import size={18} /> Import Wallet</>}
                    </button>
                </form>

                <div className="anim-slide-up-d1">
                    <SecurityBanner />
                </div>
            </div>
        </div>
    );
}
