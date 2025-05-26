"use client"

import { useState } from "react"
import { Row, Col, Card, Form, Button, Alert } from "react-bootstrap"

export default function Configuracoes({ user }) {
  const [formData, setFormData] = useState({
    nome: user?.name || "",
    email: user?.email || "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
  })

  const [senhaData, setSenhaData] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  })

  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState("success")

  const handlePerfilSubmit = (e) => {
    e.preventDefault()

    // Aqui seria feita a integração com o backend
    console.log("Dados do perfil:", formData)

    setAlertMessage("Perfil atualizado com sucesso!")
    setAlertType("success")
    setShowAlert(true)

    setTimeout(() => setShowAlert(false), 3000)
  }

  const handleSenhaSubmit = (e) => {
    e.preventDefault()

    if (senhaData.novaSenha !== senhaData.confirmarSenha) {
      setAlertMessage("As senhas não coincidem!")
      setAlertType("danger")
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      return
    }

    if (senhaData.novaSenha.length < 6) {
      setAlertMessage("A nova senha deve ter pelo menos 6 caracteres!")
      setAlertType("danger")
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      return
    }

    // Aqui seria feita a integração com o backend
    console.log("Alteração de senha")

    setAlertMessage("Senha alterada com sucesso!")
    setAlertType("success")
    setShowAlert(true)

    setSenhaData({
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    })

    setTimeout(() => setShowAlert(false), 3000)
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success mb-0">Configurações</h2>
      </div>

      {showAlert && (
        <Alert variant={alertType} className="mb-4">
          {alertMessage}
        </Alert>
      )}

      <Row className="g-4">
        {/* Dados do Perfil */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">
                <i className="bi bi-person-circle me-2 text-success"></i>
                Dados do Perfil
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePerfilSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome Completo</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Telefone</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="(00) 00000-0000"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>CEP</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="00000-000"
                        value={formData.cep}
                        onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Endereço</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  />
                </Form.Group>

                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cidade</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.cidade}
                        onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Estado</Form.Label>
                      <Form.Select
                        value={formData.estado}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      >
                        <option value="">Selecione...</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid">
                  <Button variant="success" type="submit">
                    Salvar Alterações
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Alterar Senha */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">
                <i className="bi bi-shield-lock me-2 text-success"></i>
                Alterar Senha
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSenhaSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Senha Atual</Form.Label>
                  <Form.Control
                    type="password"
                    value={senhaData.senhaAtual}
                    onChange={(e) => setSenhaData({ ...senhaData, senhaAtual: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nova Senha</Form.Label>
                  <Form.Control
                    type="password"
                    value={senhaData.novaSenha}
                    onChange={(e) => setSenhaData({ ...senhaData, novaSenha: e.target.value })}
                    required
                  />
                  <Form.Text className="text-muted">Mínimo de 6 caracteres</Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Nova Senha</Form.Label>
                  <Form.Control
                    type="password"
                    value={senhaData.confirmarSenha}
                    onChange={(e) => setSenhaData({ ...senhaData, confirmarSenha: e.target.value })}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="outline-success" type="submit">
                    Alterar Senha
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Informações da Conta */}
          <Card className="border-0 shadow-sm mt-4">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2 text-success"></i>
                Informações da Conta
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <small className="text-muted">Plano Atual</small>
                <div className="fw-bold text-success">Básico</div>
              </div>
              <div className="mb-3">
                <small className="text-muted">Membro desde</small>
                <div className="fw-bold">Janeiro 2024</div>
              </div>
              <div className="mb-3">
                <small className="text-muted">Último acesso</small>
                <div className="fw-bold">{new Date().toLocaleDateString()}</div>
              </div>
              <Button variant="outline-primary" size="sm" className="w-100">
                Gerenciar Plano
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
