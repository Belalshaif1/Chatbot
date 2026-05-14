import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DashboardLayout from './pages/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import CreateBot from './pages/CreateBot';
import ChatInterface from './pages/ChatInterface';
import Analytics from './pages/Analytics';
import DataSources from './pages/DataSources';
import Settings from './pages/Settings';
import BotManagement from './pages/BotManagement';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import AdminPanel from './pages/AdminPanel';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/share/:botId" element={<ChatInterface isEmbedded={true} />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="create" element={<CreateBot />} />
        <Route path="bot/:botId" element={<BotManagement />} />
        <Route path="chat" element={<ChatInterface />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="sources" element={<DataSources />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admin" element={<AdminPanel />} />
      </Route>
    </Routes>
  );
}
