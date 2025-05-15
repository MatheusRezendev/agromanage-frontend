"use client"

import { useEffect, useState } from "react"
import { Container, Row, Col, Card, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import NavbarComponent from "../components/NavbarComponent"
import Footer from "../components/Footer"
import "../App.css"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
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

  if (!user) {
    return <div className="text-center py-5">Carregando...</div>
  }

  return (
    <>
      <NavbarComponent />
      <div className="dashboard-page py-5">
        <Container className="py-5">
          <Row className="mb-4">
            <Col>
              <h1 className="dashboard-welcome">Bem-vindo, {user.name}!</h1>
              <p className="text-muted">Gerencie sua produção agrícola com eficiência</p>
            </Col>
            <Col xs="auto">
              <Button variant="outline-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Sair
              </Button>
            </Col>
          </Row>

          <Row className="g-4 mb-5">
            <Col md={4}>
              <Card className="dashboard-card h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="text-success mb-3">
                    <i className="bi bi-flower2" style={{ fontSize: "2rem" }}></i>
                  </div>
                  <Card.Title>Minhas Lavouras</Card.Title>
                  <Card.Text>Gerencie suas plantações e acompanhe o desenvolvimento de cada cultura.</Card.Text>
                  <Button variant="success" className="mt-2">
                    Gerenciar Lavouras
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="dashboard-card h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="text-success mb-3">
                    <i className="bi bi-cash-coin" style={{ fontSize: "2rem" }}></i>
                  </div>
                  <Card.Title>Finanças</Card.Title>
                  <Card.Text>
                    Controle receitas, despesas e acompanhe o desempenho financeiro da sua produção.
                  </Card.Text>
                  <Button variant="success" className="mt-2">
                    Ver Finanças
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="dashboard-card h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="text-success mb-3">
                    <i className="bi bi-bar-chart-fill" style={{ fontSize: "2rem" }}></i>
                  </div>
                  <Card.Title>Relatórios</Card.Title>
                  <Card.Text>Visualize dados e estatísticas para tomar decisões mais inteligentes.</Card.Text>
                  <Button variant="success" className="mt-2">
                    Ver Relatórios
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <Card.Title>Próximas Atividades</Card.Title>
                  <p className="text-muted">
                    Você ainda não tem atividades programadas. Comece adicionando sua primeira lavoura.
                  </p>
                  <Button variant="outline-success">
                    <i className="bi bi-plus-circle me-2"></i>
                    Adicionar Lavoura
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  )
}
