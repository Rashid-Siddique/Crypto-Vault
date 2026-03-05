import { useNavigate } from 'react-router-dom';
import { Wallet, KeyRound, Hexagon, ArrowRight, Shield, Zap, Globe2, LayoutDashboard } from 'lucide-react';
import SecurityBanner from '../components/SecurityBanner';
import { getWallet } from '../utils/storage';

/* Floating crypto token SVGs — rendered at low opacity in the background */
function FloatingTokens() {
    const tokens = [
        // Bitcoin
        {
            x: '8%', y: '12%', size: 48, delay: 0, dur: 18,
            path: 'M12.5 3.5v1.7M11.5 3.5v1.7M12.5 18.8v1.7M11.5 18.8v1.7M7 8.2h8.6c1.2 0 2.2 1 2.2 2.2s-1 2.2-2.2 2.2H7m0-4.4v8.5h9c1.2 0 2.2-1 2.2-2.2s-1-2.2-2.2-2.2',
            color: '#f7931a'
        },
        // Ethereum
        {
            x: '88%', y: '20%', size: 44, delay: 3, dur: 22,
            path: 'M12 1.5L5.5 12.2 12 15.7l6.5-3.5L12 1.5zM5.5 13.5L12 22.5l6.5-9L12 17l-6.5-3.5z',
            color: '#627eea'
        },
        // Generic coin
        {
            x: '15%', y: '75%', size: 36, delay: 5, dur: 20,
            path: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a1 1 0 011 1v1.5a3.5 3.5 0 012.5 3A3.5 3.5 0 0113 14v1a1 1 0 01-2 0v-1a3.5 3.5 0 01-2.5-3.5A3.5 3.5 0 0111 7V5.5a1 1 0 011-1z',
            color: '#fc72ff'
        },
        // Diamond
        {
            x: '82%', y: '70%', size: 40, delay: 7, dur: 16,
            path: 'M12 2L2 9l10 13L22 9 12 2zM4.5 9L12 4l7.5 5L12 19.5 4.5 9z',
            color: '#7b61ff'
        },
        // Chain link
        {
            x: '50%', y: '85%', size: 32, delay: 2, dur: 24,
            path: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
            color: '#2a5ada'
        },
        // Shield token
        {
            x: '5%', y: '45%', size: 30, delay: 9, dur: 19,
            path: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
            color: '#00d395'
        },
        // Star
        {
            x: '92%', y: '48%', size: 28, delay: 4, dur: 21,
            path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
            color: '#f0b90b'
        },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {tokens.map((t, i) => (
                <svg key={i}
                    width={t.size} height={t.size} viewBox="0 0 24 24"
                    fill="none" stroke={t.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                    className="absolute"
                    style={{
                        left: t.x, top: t.y, opacity: 0.15,
                        animation: `floatToken ${t.dur}s ease-in-out ${t.delay}s infinite`,
                    }}>
                    <path d={t.path} />
                </svg>
            ))}
        </div>
    );
}

export default function LandingPage() {
    const navigate = useNavigate();
    const wallet = getWallet();

    return (
        <div className="flex-1 flex flex-col items-center px-8 py-12 relative overflow-y-auto">
            <FloatingTokens />

            <div className="w-full max-w-2xl flex flex-col items-center relative z-10">

                {/* ── Hero: Icon + Title + Description ── */}
                <div className="text-center anim-slide-up">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl
                          bg-pink/8 border border-pink/12 anim-float mb-10">
                        <Hexagon size={38} className="text-pink" />
                    </div>

                    <h1 className="text-5xl font-display font-extrabold tracking-tight mb-4">
                        <span className="gradient-text">Crypto</span>
                        <span className="text-text">Vault</span>
                    </h1>

                    <p className="text-text-secondary text-lg leading-[1.7] mb-6">
                        Your secure gateway to the Ethereum blockchain.
                        <br />
                        Create wallets, send ETH, and explore Web3.
                    </p>

                    {/* Badges */}
                    <div className="flex items-center justify-center gap-5">
                        {[
                            { icon: Shield, label: 'Secure', color: 'text-emerald' },
                            { icon: Zap, label: 'Fast', color: 'text-warning' },
                            { icon: Globe2, label: 'Multi-Net', color: 'text-cyan' },
                        ].map(({ icon: Icon, label, color }) => (
                            <div key={label} className="flex items-center gap-2 px-5 py-2.5 rounded-full
                                          bg-surface border border-border
                                          text-xs text-text-muted font-medium tracking-label">
                                <Icon size={12} className={color} />
                                {label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Spacer between badges and cards ── */}
                <div className="h-12" />

                {/* ── Action cards ── */}
                <div className="w-full flex flex-col gap-8 anim-slide-up-d1">
                    <button onClick={() => navigate('/create')}
                        className="group w-full glass-card py-7 px-8 flex items-center gap-6 cursor-pointer text-left
                       hover:border-pink/20 transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-pink/8 border border-pink/12
                            flex items-center justify-center shrink-0
                            group-hover:bg-pink/15 group-hover:scale-105 transition-all duration-300">
                            <Wallet size={24} className="text-pink" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-display font-semibold text-base text-text
                             group-hover:text-white transition-colors">
                                Create New Wallet
                            </h3>
                            <p className="text-text-muted text-sm mt-1.5 leading-relaxed">
                                Generate a fresh Ethereum wallet with a new address and private key
                            </p>
                        </div>
                        <ArrowRight size={18} className="text-pink/40 group-hover:text-pink shrink-0 transition-colors" />
                    </button>

                    <button onClick={() => navigate('/import')}
                        className="group w-full glass-card py-7 px-8 flex items-center gap-6 cursor-pointer text-left
                       hover:border-violet/20 transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-violet/8 border border-violet/12
                            flex items-center justify-center shrink-0
                            group-hover:bg-violet/15 group-hover:scale-105 transition-all duration-300">
                            <KeyRound size={24} className="text-violet" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-display font-semibold text-base text-text
                             group-hover:text-white transition-colors">
                                Import Existing Wallet
                            </h3>
                            <p className="text-text-muted text-sm mt-1.5 leading-relaxed">
                                Restore a wallet you already own using your private key
                            </p>
                        </div>
                        <ArrowRight size={18} className="text-violet/40 group-hover:text-violet shrink-0 transition-colors" />
                    </button>

                    {wallet && (
                        <button onClick={() => navigate('/dashboard')}
                            className="group w-full glass-card py-7 px-8 flex items-center gap-6 cursor-pointer text-left
                         hover:border-blue/20 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-blue/8 border border-blue/12
                              flex items-center justify-center shrink-0">
                                <LayoutDashboard size={24} className="text-blue" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-display font-semibold text-base text-text">
                                    Go to Dashboard
                                </h3>
                                <p className="text-text-muted text-sm mt-1.5">
                                    {wallet.address.slice(0, 6)}···{wallet.address.slice(-4)} — View balance & send ETH
                                </p>
                            </div>
                            <ArrowRight size={18} className="text-text-muted/30 shrink-0" />
                        </button>
                    )}
                </div>

                {/* ── Security warning (outside cards container) ── */}
                <div className="h-8" />
                <div className="w-full anim-slide-up-d2">
                    <SecurityBanner />
                </div>
            </div>
        </div>
    );
}
