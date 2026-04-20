import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './i18n';
import Landing from './pages/Landing';
import Confirmation from './pages/Confirmation';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}
