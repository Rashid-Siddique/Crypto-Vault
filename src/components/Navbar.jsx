import { useNavigate, useLocation } from 'react-router-dom';
import { Hexagon, Home, LayoutDashboard, Send } from 'lucide-react';
import { getWallet } from '../utils/storage';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const wallet = getWallet();
    const path = location.pathname;
    const isActive = (p) => path === p;

    const links = [
        { path: '/', label: 'Home', icon: Home, always: true },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, wallet: true },
        { path: '/send', label: 'Send', icon: Send, wallet: true },
    ];

    return (
        <header className="w-full px-6 py-4 flex items-center justify-between relative z-50">
            {/* Logo */}
            <button onClick={() => navigate('/')}
                className="flex items-center gap-2.5 cursor-pointer group">
                <div className="w-10 h-10 rounded-2xl bg-pink/10 border border-pink/15
                        flex items-center justify-center
                        group-hover:bg-pink/20 group-hover:scale-105
                        transition-all duration-300">
                    <Hexagon size={18} className="text-pink" />
                </div>
                <span className="font-display font-bold text-lg tracking-tight">
                    <span className="gradient-text">Crypto</span>
                    <span className="text-text-secondary">Vault</span>
                </span>
            </button>

            {/* Nav */}
            <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1
                      bg-surface border border-border rounded-2xl p-1">
                {links.map((l) => {
                    if (l.wallet && !wallet) return null;
                    const Icon = l.icon;
                    const active = isActive(l.path);
                    return (
                        <button key={l.path} onClick={() => navigate(l.path)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm
                         font-display font-medium cursor-pointer
                         transition-all duration-200
                         ${active
                                    ? 'bg-surface-active text-text'
                                    : 'text-text-muted hover:text-text-secondary'}`}>
                            <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                            {l.label}
                        </button>
                    );
                })}
            </nav>

            {/* Right spacer for balance */}
            <div className="w-10" />
        </header>
    );
}
