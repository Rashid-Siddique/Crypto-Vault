import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import CreateWallet from './pages/CreateWallet';
import ImportWallet from './pages/ImportWallet';
import Dashboard from './pages/Dashboard';
import SendTransaction from './pages/SendTransaction';

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(25, 25, 35, 0.9)',
            backdropFilter: 'blur(24px)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreateWallet />} />
          <Route path="/import" element={<ImportWallet />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendTransaction />} />
        </Route>
      </Routes>
    </Router>
  );
}
