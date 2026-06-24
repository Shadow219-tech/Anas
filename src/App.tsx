import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ContinentPage from './pages/ContinentPage';
import CountryPage from './pages/CountryPage';
import HistoirePage from './pages/HistoirePage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AccountPage from './pages/AccountPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-black-1 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/histoire" element={<HistoirePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/confirmation/:orderNumber" element={<ConfirmationPage />} />
                <Route path="/compte" element={<AccountPage />} />
                <Route path="/pays/:code" element={<CountryPage />} />
                <Route path="/:continent" element={<ContinentPage />} />
              </Routes>
            </main>
            <Footer />
            <CartDrawer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
