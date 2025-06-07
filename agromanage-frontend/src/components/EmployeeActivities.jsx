import { useState, useEffect } from "react"
import { Button, Card, Table, Modal, Form, Row, Col, Badge, Alert } from "react-bootstrap"

export default function EmployeeActivities({ employee, onBack, onUpdateEmployee }) {
  const [activities, setActivities] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)
  const [formData, setFormData] = useState({
    date: "",
    activity: "",
    status: "Pendente",
    paymentType: "Salário",
    amount: "",
  })
  const [alert, setAlert] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    setActivities(employee.activities || [])
  }, [employee])

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type })
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000)
  }

  const handleAddActivity = () => {
    setEditingActivity(null)
    setFormData({
      date: new Date().toISOString().split("T")[0],
      activity: "",
      status: "Pendente",
      paymentType: "Salário",
      amount: "",
    })
    setShowModal(true)
  }

  const handleEditActivity = (activity, index) => {
    setEditingActivity(index)
    setFormData(activity)
    setShowModal(true)
  }

  const handleDeleteActivity = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index)
    setActivities(updatedActivities)
    updateEmployeeActivities(updatedActivities)
    showAlert("Atividade excluída com sucesso!", "success")
  }

  const handleSaveActivity = () => {
    if (!formData.date || !formData.activity) {
      showAlert("Data e atividade são obrigatórios!", "danger")
      return
    }

    let updatedActivities
    if (editingActivity !== null) {
      updatedActivities = activities.map((activity, index) => (index === editingActivity ? { ...formData } : activity))
      showAlert("Atividade atualizada com sucesso!", "success")
    } else {
      updatedActivities = [...activities, { ...formData, id: Date.now().toString() }]
      showAlert("Atividade adicionada com sucesso!", "success")
    }

    setActivities(updatedActivities)
    updateEmployeeActivities(updatedActivities)
    setShowModal(false)
  }

  const updateEmployeeActivities = (newActivities) => {
    const updatedEmployee = {
      ...employee,
      activities: newActivities,
    }
    onUpdateEmployee(updatedEmployee)
  }

  const getStatusBadge = (status) => {
    const variants = {
      Pendente: "warning",
      "Em Andamento": "primary",
      Concluída: "success",
      Cancelada: "danger",
    }
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>
  }

  const getPaymentTypeBadge = (type) => {
    const variants = {
      Salário: "info",
      Diária: "success",
      "Por Medida": "warning",
    }
    return <Badge bg={variants[type] || "secondary"}>{type}</Badge>
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <Button variant="outline-secondary" onClick={onBack} className="me-3">
            <i className="bi bi-arrow-left me-2"></i>
            Voltar
          </Button>
          <h1 className="d-inline">Atividades de {employee.name}</h1>
        </div>
        <Button variant="success" onClick={handleAddActivity}>
          <i className="bi bi-plus-circle me-2"></i>
          Nova Atividade
        </Button>
      </div>

      {alert.show && (
        <Alert variant={alert.type} className="mb-4">
          {alert.message}
        </Alert>
      )}

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Registro de Atividades</h5>
            <small className="text-muted">{activities.length} atividade(s) registrada(s)</small>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {activities.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-clipboard-data text-muted" style={{ fontSize: "4rem" }}></i>
              <h5 className="text-muted mt-3">Nenhuma atividade registrada</h5>
              <p className="text-muted">Comece adicionando a primeira atividade</p>
              <Button variant="success" onClick={handleAddActivity}>
                <i className="bi bi-plus-circle me-2"></i>
                Adicionar Atividade
              </Button>
            </div>
          ) : (
            <Table hover responsive className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Data</th>
                  <th>Atividade</th>
                  <th>Status</th>
                  <th>Pagamento</th>
                  <th>Valor</th>
                  <th width="120">Ações</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <tr key={index}>
                    <td>{new Date(activity.date).toLocaleDateString("pt-BR")}</td>
                    <td>{activity.activity}</td>
                    <td>{getStatusBadge(activity.status)}</td>
                    <td>{getPaymentTypeBadge(activity.paymentType)}</td>
                    <td>
                      {activity.amount ? `R$ ${Number.parseFloat(activity.amount).toLocaleString("pt-BR")}` : "-"}
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                        onClick={() => handleEditActivity(activity, index)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteActivity(index)}>
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Activity Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingActivity !== null ? "Editar Atividade" : "Nova Atividade"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluída">Concluída</option>
                    <option value="Cancelada">Cancelada</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Atividade *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                placeholder="Descreva a atividade realizada"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Pagamento</Form.Label>
                  <Form.Select
                    value={formData.paymentType}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                  >
                    <option value="Salário">Salário</option>
                    <option value="Diária">Diária</option>
                    <option value="Por Medida">Por Medida (Produtividade)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Valor</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSaveActivity}>
            {editingActivity !== null ? "Atualizar" : "Adicionar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
