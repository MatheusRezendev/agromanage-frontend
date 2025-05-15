"use client"

import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import NavbarComponent from "../components/NavbarComponent"
import Footer from "../components/Footer"
import "../App.css"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    // Validação básica
    if (!email || !password) {
      setError("Por favor, preencha todos os campos")
      return
    }

    // Buscar usuários do localStorage
    const users = JSON.parse(localStorage.getItem("agromanage_users") || "[]")

    // Verificar se o usuário existe
    const user = users.find((user) => user.email === email && user.password === password)

    if (user) {
      // Armazenar informação de login
      localStorage.setItem(
        "agromanage_currentUser",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          isLoggedIn: true,
        }),
      )

      // Redirecionar para dashboard (futura implementação)
      navigate("/dashboard")
    } else {
      setError("Email ou senha incorretos")
    }
  }

  return (
    <>
      <NavbarComponent />
      <div className="login-page py-5">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h2 className="login-title">Acesse sua conta</h2>
                    <p className="text-muted">Bem-vindo de volta ao AgroManage</p>
                  </div>

                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Senha</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>

                    <div className="d-grid">
                      <Button variant="success" type="submit" size="lg" className="mb-3">
                        Entrar
                      </Button>
                    </div>

                    <div className="text-center mt-3">
                      <p>
                        Não tem uma conta?{" "}
                        <Link to="/cadastrar" className="text-success fw-bold">
                          Cadastre-se
                        </Link>
                      </p>
                      <Link to="/" className="text-muted">
                        <i className="bi bi-arrow-left me-1"></i> Voltar para a página inicial
                      </Link>
                    </div>
                  </Form>
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
