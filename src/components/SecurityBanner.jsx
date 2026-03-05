import { ShieldAlert } from 'lucide-react';

export default function SecurityBanner() {
    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-card">
            <div className="w-8 h-8 rounded-xl bg-warning/8 flex items-center justify-center shrink-0">
                <ShieldAlert size={14} className="text-warning" />
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
                For <strong className="text-warning/90 font-semibold">educational use</strong> only. Do not store real funds.
            </p>
        </div>
    );
}
