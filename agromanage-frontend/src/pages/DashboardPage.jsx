"use client"

import { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import NavbarComponent from "../components/NavbarComponent"
import Sidebar from "../components/dashboard/Sidebar"
import DashboardHome from "../components/dashboard/DashboardHome"
import LavourasCrud from "../components/dashboard/LavourasCrud"
import FinancasCrud from "../components/dashboard/FinancasCrud"
import FuncionariosCrud from "../components/dashboard/FuncionariosCrud"
import Configuracoes from "../components/dashboard/Configuracoes"
import "../App.css"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [activeSection, setActiveSection] = useState("dashboard")
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar se o usuário está logado
    const currentUser = JSON.parse(localStorage.getItem("agromanage_currentUser") || "{}")

    if (!currentUser.isLoggedIn) {
      navigate("/login")
      return
    }

    setUser(currentUser)
  }, [navigate])

  const handleLogout = () => {
    // Remover usuário atual do localStorage
    localStorage.removeItem("agromanage_currentUser")
    navigate("/login")
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardHome />
      case "lavouras":
        return <LavourasCrud />
      case "financas":
        return <FinancasCrud />
      case "funcionarios":
        return <FuncionariosCrud />
      case "configuracoes":
        return <Configuracoes user={user} />
      default:
        return <DashboardHome />
    }
  }

  if (!user) {
    return <div className="text-center py-5">Carregando...</div>
  }

  return (
    <>
      <NavbarComponent />
      <div className="dashboard-page" style={{ paddingTop: "76px", minHeight: "100vh" }}>
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col xs={12} md={3} lg={2}>
              <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                onLogout={handleLogout}
                user={user}
              />
            </Col>
            <Col xs={12} md={9} lg={10}>
              <div className="p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "calc(100vh - 76px)" }}>
                {renderContent()}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
