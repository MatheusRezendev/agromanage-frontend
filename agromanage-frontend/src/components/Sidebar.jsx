import { useState, useEffect } from "react"
import { Nav, Button } from "react-bootstrap"
import { Link, useLocation, useNavigate } from "react-router-dom"
import "../App.css"

export default function Sidebar() {
  const [user, setUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("agromanage_currentUser") || "{}")
    setUser(currentUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("agromanage_currentUser")
    navigate("/login")
  }

  const menuItems = [
    { path: "/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
    { path: "/lavouras", icon: "bi-flower2", label: "Lavouras" },
    { path: "/financas", icon: "bi-cash-coin", label: "Finanças" },
    { path: "/estoque", icon: "bi-box-seam", label: "Estoque" },
    { path: "/funcionarios", icon: "bi-people", label: "Funcionários" },
    { path: "/configuracoes", icon: "bi-gear", label: "Configurações" },
  ]

  if (!user) return null

  return (
    <div className="sidebar">
      {/* User Profile */}
      <div className="sidebar-profile">
        <div className="profile-avatar">
          <i className="bi bi-person-circle"></i>
        </div>
        <div className="profile-info">
          <h6>{user.name}</h6>
          <small>{user.email}</small>
        </div>
      </div>

      {/* Navigation Menu */}
      <Nav className="sidebar-nav flex-column">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            className={`sidebar-nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <i className={`bi ${item.icon} me-3`}></i>
            {item.label}
          </Nav.Link>
        ))}
      </Nav>

      {/* Logout Button */}
      <div className="sidebar-footer">
        <Button variant="outline-danger" className="w-100" onClick={handleLogout}>
          <i className="bi bi-box-arrow-left me-2"></i>
          Sair
        </Button>
      </div>
    </div>
  )
}
