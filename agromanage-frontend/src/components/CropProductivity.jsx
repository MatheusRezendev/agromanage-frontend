import { useState, useEffect } from "react"
import { Button, Card, Table, Modal, Form, Row, Col, Alert } from "react-bootstrap"

export default function CropProductivity({ crop, onBack, onUpdateCrop }) {
  const [productivity, setProductivity] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    production: "",
    value: "",
    notes: "",
  })
  const [alert, setAlert] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    setProductivity(crop.productivity || [])
  }, [crop])

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type })
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000)
  }

  const handleAddItem = () => {
    setEditingItem(null)
    setFormData({
      year: new Date().getFullYear().toString(),
      production: "",
      value: "",
      notes: "",
    })
    setShowModal(true)
  }

  const handleEditItem = (item, index) => {
    setEditingItem(index)
    setFormData(item)
    setShowModal(true)
  }

  const handleDeleteItem = (index) => {
    const updatedProductivity = productivity.filter((_, i) => i !== index)
    setProductivity(updatedProductivity)
    updateCropProductivity(updatedProductivity)
    showAlert("Registro excluído com sucesso!", "success")
  }

  const handleSaveItem = () => {
    if (!formData.year || !formData.production || !formData.value) {
      showAlert("Ano, produção e valor são obrigatórios!", "danger")
      return
    }

    let updatedProductivity
    if (editingItem !== null) {
      updatedProductivity = productivity.map((item, index) => (index === editingItem ? { ...formData } : item))
      showAlert("Registro atualizado com sucesso!", "success")
    } else {
      updatedProductivity = [...productivity, { ...formData, id: Date.now().toString() }]
      showAlert("Registro adicionado com sucesso!", "success")
    }

    setProductivity(updatedProductivity)
    updateCropProductivity(updatedProductivity)
    setShowModal(false)
  }

  const updateCropProductivity = (newProductivity) => {
    const updatedCrop = {
      ...crop,
      productivity: newProductivity,
    }
    onUpdateCrop(updatedCrop)
  }

  const calculateTotals = () => {
    const totalProduction = productivity.reduce((sum, item) => sum + Number(item.production || 0), 0)
    const totalValue = productivity.reduce(
      (sum, item) => sum + Number(item.production || 0) * Number(item.value || 0),
      0,
    )

    return { totalProduction, totalValue }
  }

  const totals = calculateTotals()

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <Button variant="outline-secondary" onClick={onBack} className="me-3">
            <i className="bi bi-arrow-left me-2"></i>
            Voltar
          </Button>
          <h1 className="d-inline">Produtividade: {crop.name}</h1>
        </div>
        <Button variant="success" onClick={handleAddItem}>
          <i className="bi bi-plus-circle me-2"></i>
          Adicionar Produção
        </Button>
      </div>

      {alert.show && (
        <Alert variant={alert.type} className="mb-4">
          {alert.message}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="stat-card border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="text-success mb-1">{crop.type}</h3>
              <p className="text-muted mb-0">Tipo de Cultura</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="text-primary mb-1">{totals.totalProduction.toLocaleString("pt-BR")} kg</h3>
              <p className="text-muted mb-0">Produção Total</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="text-warning mb-1">R$ {totals.totalValue.toLocaleString("pt-BR")}</h3>
              <p className="text-muted mb-0">Valor Total</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Registro de Produtividade</h5>
            <small className="text-muted">{productivity.length} registro(s)</small>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {productivity.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-graph-up text-muted" style={{ fontSize: "4rem" }}></i>
              <h5 className="text-muted mt-3">Nenhum registro de produtividade</h5>
              <p className="text-muted">Comece adicionando o primeiro registro de produção</p>
              <Button variant="success" onClick={handleAddItem}>
                <i className="bi bi-plus-circle me-2"></i>
                Adicionar Produção
              </Button>
            </div>
          ) : (
            <Table hover responsive className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Ano</th>
                  <th>Produção (kg)</th>
                  <th>Valor (R$/kg)</th>
                  <th>Valor Total</th>
                  <th>Observações</th>
                  <th width="120">Ações</th>
                </tr>
              </thead>
              <tbody>
                {productivity.map((item, index) => (
                  <tr key={index}>
                    <td>{item.year}</td>
                    <td>{Number(item.production).toLocaleString("pt-BR")} kg</td>
                    <td>R$ {Number(item.value).toLocaleString("pt-BR")}</td>
                    <td>R$ {(Number(item.production) * Number(item.value)).toLocaleString("pt-BR")}</td>
                    <td>{item.notes}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                        onClick={() => handleEditItem(item, index)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteItem(index)}>
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

      {/* Add/Edit Productivity Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem !== null ? "Editar Produção" : "Adicionar Produção"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ano *</Form.Label>
              <Form.Select value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })}>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Produção (kg) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.production}
                    onChange={(e) => setFormData({ ...formData, production: e.target.value })}
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Valor (R$/kg) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Observações</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Observações adicionais sobre a produção"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSaveItem}>
            {editingItem !== null ? "Atualizar" : "Adicionar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
