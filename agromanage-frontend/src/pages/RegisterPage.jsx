"use client"

import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import NavbarComponent from "../components/NavbarComponent"
import Footer from "../components/Footer"
import "../App.css"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validação básica
    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    // Buscar usuários existentes
    const users = JSON.parse(localStorage.getItem("agromanage_users") || "[]")

    // Verificar se o email já está em uso
    if (users.some((user) => user.email === email)) {
      setError("Este email já está cadastrado")
      return
    }

    // Criar novo usuário
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    }

    // Adicionar ao localStorage
    localStorage.setItem("agromanage_users", JSON.stringify([...users, newUser]))

    setSuccess("Cadastro realizado com sucesso! Redirecionando para o login...")

    // Limpar formulário
    setName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")

    // Redirecionar para login após 2 segundos
    setTimeout(() => {
      navigate("/login")
    }, 2000)
  }

  return (
    <>
      <NavbarComponent />
      <div className="register-page py-5">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h2 className="register-title">Crie sua conta</h2>
                    <p className="text-muted">Comece a gerenciar sua produção agrícola</p>
                  </div>

                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome completo</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Seu nome completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Senha</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Crie uma senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <Form.Text className="text-muted">Mínimo de 6 caracteres</Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label>Confirmar senha</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Confirme sua senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-grid">
                      <Button variant="success" type="submit" size="lg" className="mb-3">
                        Criar conta
                      </Button>
                    </div>

                    <div className="text-center mt-3">
                      <p>
                        Já tem uma conta?{" "}
                        <Link to="/login" className="text-success fw-bold">
                          Faça login
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
