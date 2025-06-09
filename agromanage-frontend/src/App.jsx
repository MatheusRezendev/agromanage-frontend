import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import EmployeesPage from "./pages/EmployeesPage"
import FinancesPage from "./pages/FinancesPage"
import CropsPage from "./pages/CropsPage"
import SettingsPage from "./pages/SettingsPage"
import StockPage from "./pages/StockPage"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastrar" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/funcionarios" element={<EmployeesPage />} />
        <Route path="/financas" element={<FinancesPage />} />
        <Route path="/estoque" element={<StockPage />} />
        <Route path="/lavouras" element={<CropsPage />} />
        <Route path="/configuracoes" element={<SettingsPage />} />
      </Routes>
    </Router>
  )
}
