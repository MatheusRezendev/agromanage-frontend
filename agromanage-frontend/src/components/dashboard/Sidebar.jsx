"use client"

import { Nav, Card } from "react-bootstrap"

export default function Sidebar({ activeSection, setActiveSection, onLogout, user }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { id: "lavouras", label: "Lavouras", icon: "bi-flower2" },
    { id: "financas", label: "Finanças", icon: "bi-cash-coin" },
    { id: "funcionarios", label: "Funcionários", icon: "bi-people" },
    { id: "configuracoes", label: "Configurações", icon: "bi-gear" },
  ]

  return (
    <div
      className="bg-white border-end"
      style={{
        height: "calc(100vh - 76px)",
        position: "sticky",
        top: "76px",
        overflowY: "auto",
      }}
    >
      <div className="p-3">
        <Card className="border-0 bg-light mb-3">
          <Card.Body className="p-3">
            <div className="d-flex align-items-center">
              <div
                className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "40px", height: "40px" }}
              >
                <i className="bi bi-person-fill text-white"></i>
              </div>
              <div>
                <h6 className="mb-0">{user?.name}</h6>
                <small className="text-muted">{user?.email}</small>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Nav className="flex-column">
          {menuItems.map((item) => (
            <Nav.Link
              key={item.id}
              className={`d-flex align-items-center py-3 px-3 mb-1 rounded ${
                activeSection === item.id ? "bg-success text-white" : "text-dark hover-bg-light"
              }`}
              style={{
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => setActiveSection(item.id)}
            >
              <i className={`${item.icon} me-3`} style={{ fontSize: "1.1rem" }}></i>
              {item.label}
            </Nav.Link>
          ))}

          <hr className="my-3" />

          <Nav.Link
            className="d-flex align-items-center py-3 px-3 text-danger rounded"
            style={{
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={onLogout}
          >
            <i className="bi bi-box-arrow-right me-3" style={{ fontSize: "1.1rem" }}></i>
            Sair
          </Nav.Link>
        </Nav>
      </div>
    </div>
  )
}
