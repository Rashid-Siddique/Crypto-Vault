import { useState } from 'react';
import { X, Copy, Check, ArrowDownLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function ReceiveModal({ address, onClose }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative glass-card-strong px-8 py-8 w-full max-w-sm anim-scale-in"
                onClick={(e) => e.stopPropagation()}>

                {/* Close button */}
                <button onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-surface border border-border
                        flex items-center justify-center cursor-pointer
                        text-text-muted hover:text-white hover:border-border-light transition-all">
                    <X size={16} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-violet/10 border border-violet/15
                        flex items-center justify-center">
                        <ArrowDownLeft size={18} className="text-violet" />
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-lg text-white">Receive ETH</h2>
                        <p className="text-text-muted text-xs">Scan or copy your wallet address</p>
                    </div>
                </div>

                <div className="divider mb-6" />

                {/* QR Code */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-2xl bg-white">
                        <QRCodeSVG
                            value={address}
                            size={180}
                            level="H"
                            bgColor="#ffffff"
                            fgColor="#1a1a2e"
                        />
                    </div>
                </div>

                {/* Address display */}
                <div className="mb-6">
                    <p className="text-text-muted text-[10px] font-display font-bold tracking-label uppercase mb-2">
                        Your Wallet Address
                    </p>
                    <div className="field px-4 py-3">
                        <p className="font-mono text-xs text-text-secondary break-all leading-relaxed">
                            {address}
                        </p>
                    </div>
                </div>

                {/* Copy button */}
                <button onClick={handleCopy}
                    className="w-full py-3 rounded-2xl font-display font-semibold text-sm cursor-pointer
                        flex items-center justify-center gap-2 transition-all duration-200
                        bg-violet/15 border border-violet/20 text-violet
                        hover:bg-violet/25 hover:border-violet/30">
                    {copied ? (
                        <>
                            <Check size={16} />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy size={16} />
                            Copy Address
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
