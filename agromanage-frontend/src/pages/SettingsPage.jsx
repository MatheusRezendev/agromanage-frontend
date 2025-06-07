import { useState, useEffect } from "react"
import { Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import DashboardLayout from "../components/DashboardLayout"
import "../App.css"

export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    cep: "",
    address: "",
    city: "",
    state: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [alert, setAlert] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("agromanage_currentUser") || "{}")
    setUser(currentUser)

    // Carregar dados do perfil se existirem
    const userProfile = JSON.parse(localStorage.getItem("agromanage_profile") || "{}")
    const userProfileData = userProfile[currentUser.id] || {}

    setProfileData({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: userProfileData.phone || "",
      cep: userProfileData.cep || "",
      address: userProfileData.address || "",
      city: userProfileData.city || "",
      state: userProfileData.state || "",
    })
  }, [])

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type })
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000)
  }

  const handleProfileSave = () => {
    // Salvar dados do perfil
    const allProfiles = JSON.parse(localStorage.getItem("agromanage_profile") || "{}")
    allProfiles[user.id] = profileData
    localStorage.setItem("agromanage_profile", JSON.stringify(allProfiles))

    // Atualizar dados do usuário atual
    const updatedUser = { ...user, name: profileData.name, email: profileData.email }
    localStorage.setItem("agromanage_currentUser", JSON.stringify(updatedUser))
    setUser(updatedUser)

    showAlert("Perfil atualizado com sucesso!", "success")
  }

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showAlert("Todos os campos de senha são obrigatórios!", "danger")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert("A nova senha e confirmação não coincidem!", "danger")
      return
    }

    if (passwordData.newPassword.length < 6) {
      showAlert("A nova senha deve ter pelo menos 6 caracteres!", "danger")
      return
    }

    // Verificar senha atual
    const allUsers = JSON.parse(localStorage.getItem("agromanage_users") || "[]")
    const currentUserData = allUsers.find((u) => u.id === user.id)

    if (currentUserData.password !== passwordData.currentPassword) {
      showAlert("Senha atual incorreta!", "danger")
      return
    }

    // Atualizar senha
    const updatedUsers = allUsers.map((u) => (u.id === user.id ? { ...u, password: passwordData.newPassword } : u))
    localStorage.setItem("agromanage_users", JSON.stringify(updatedUsers))

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    showAlert("Senha alterada com sucesso!", "success")
  }

  const brazilianStates = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ]

  if (!user) {
    return <div className="text-center py-5">Carregando...</div>
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Configurações</h1>
        </div>

        {alert.show && (
          <Alert variant={alert.type} className="mb-4">
            {alert.message}
          </Alert>
        )}

        <Row className="g-4">
          {/* Dados do Perfil */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">
                  <i className="bi bi-person-circle text-success me-2"></i>
                  Dados do Perfil
                </h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nome Completo</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
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
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>CEP</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="00000-000"
                          value={profileData.cep}
                          onChange={(e) => setProfileData({ ...profileData, cep: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Cidade</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.city}
                          onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                          value={profileData.state}
                          onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                        >
                          <option value="">Selecione...</option>
                          {brazilianStates.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button variant="success" onClick={handleProfileSave} className="w-100">
                    Salvar Alterações
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Alterar Senha e Informações da Conta */}
          <Col lg={4}>
            {/* Alterar Senha */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">
                  <i className="bi bi-shield-lock text-success me-2"></i>
                  Alterar Senha
                </h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Senha Atual</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nova Senha</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                    <Form.Text className="text-muted">Mínimo de 6 caracteres</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirmar Nova Senha</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </Form.Group>

                  <Button variant="success" onClick={handlePasswordChange} className="w-100">
                    Alterar Senha
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Informações da Conta */}
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">
                  <i className="bi bi-info-circle text-success me-2"></i>
                  Informações da Conta
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <small className="text-muted">Plano Atual</small>
                  <p className="mb-0 fw-bold text-success">Básico</p>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Membro desde</small>
                  <p className="mb-0 fw-bold">Janeiro 2024</p>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Último acesso</small>
                  <p className="mb-0 fw-bold">{new Date().toLocaleDateString("pt-BR")}</p>
                </div>

                <Button variant="outline-primary" className="w-100">
                  Gerenciar Plano
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  )
}
