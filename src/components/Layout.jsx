import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="h-screen flex flex-col relative overflow-hidden">
            {/* ── Full-viewport animated background ── */}
            <div className="app-bg">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            {/* ── App shell ── */}
            <div className="relative z-10 flex flex-col h-full">
                <Navbar />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
