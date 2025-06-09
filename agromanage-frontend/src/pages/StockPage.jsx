import { useState, useEffect } from "react"
import { Row, Col, Card, Button, Modal, Table, Badge, Form, Alert } from "react-bootstrap"
import DashboardLayout from "../components/DashboardLayout"
import "../App.css"

export default function StockPage() {
  const [items, setItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "Insumo",
    quantity: "",
    unit: "un",
    minQuantity: "",
    location: "",
    notes: "",
  })
  const [alert, setAlert] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = () => {
    const currentUser = JSON.parse(localStorage.getItem("agromanage_currentUser") || "{}")
    const allItems = JSON.parse(localStorage.getItem("agromanage_stock") || "{}")
    const userItems = allItems[currentUser.id] || []
    setItems(userItems)
  }

  const saveItems = (itemsList) => {
    const currentUser = JSON.parse(localStorage.getItem("agromanage_currentUser") || "{}")
    const allItems = JSON.parse(localStorage.getItem("agromanage_stock") || "{}")
    allItems[currentUser.id] = itemsList
    localStorage.setItem("agromanage_stock", JSON.stringify(allItems))
    setItems(itemsList)
  }

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type })
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000)
  }

  const handleAddItem = () => {
    setEditingItem(null)
    setFormData({
      name: "",
      type: "Insumo",
      quantity: "",
      unit: "un",
      minQuantity: "",
      location: "",
      notes: "",
    })
    setShowModal(true)
  }

  const handleEditItem = (item, index) => {
    setEditingItem(index)
    setFormData({
      ...item,
      quantity: item.quantity.toString(),
      minQuantity: item.minQuantity?.toString() || "",
    })
    setShowModal(true)
  }

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index)
    saveItems(updatedItems)
    showAlert("Item removido com sucesso!", "success")
  }

  const handleSaveItem = () => {
    if (!formData.name || !formData.quantity) {
      showAlert("Nome e quantidade são campos obrigatórios!", "danger")
      return
    }

    const itemData = {
      ...formData,
      quantity: parseFloat(formData.quantity),
      minQuantity: formData.minQuantity ? parseFloat(formData.minQuantity) : null,
      lastUpdated: new Date().toISOString(),
    }

    let updatedItems
    if (editingItem !== null) {
      updatedItems = items.map((item, index) =>
        index === editingItem ? { ...itemData, id: item.id } : item,
      )
      showAlert("Item atualizado com sucesso!", "success")
    } else {
      updatedItems = [...items, { ...itemData, id: Date.now().toString() }]
      showAlert("Item adicionado com sucesso!", "success")
    }

    saveItems(updatedItems)
    setShowModal(false)
  }

  const getStatusBadge = (item) => {
    if (item.quantity <= 0) return <Badge bg="danger">Esgotado</Badge>
    if (item.minQuantity && item.quantity <= item.minQuantity)
      return <Badge bg="warning" text="dark">Baixo Estoque</Badge>
    return <Badge bg="success">Em Estoque</Badge>
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Controle de Estoque</h1>
          <Button variant="success" onClick={handleAddItem}>
            <i className="bi bi-plus-circle me-2"></i>
            Novo Item
          </Button>
        </div>

        {alert.show && (
          <Alert variant={alert.type} className="mb-4">
            {alert.message}
          </Alert>
        )}

        {/* Stock Summary */}
        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-primary mb-1">
                  {items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0)}
                </h3>
                <p className="text-muted mb-0">Itens no Total</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-warning mb-1">
                  {items.filter(item => item.minQuantity && item.quantity <= item.minQuantity).length}
                </h3>
                <p className="text-muted mb-0">Itens com Estoque Baixo</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-danger mb-1">
                  {items.filter(item => item.quantity <= 0).length}
                </h3>
                <p className="text-muted mb-0">Itens Esgotados</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Items Table */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            {items.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-box-seam text-muted" style={{ fontSize: "4rem" }}></i>
                <h5 className="text-muted mt-3">Nenhum item cadastrado</h5>
                <p className="text-muted">Comece adicionando seu primeiro item ao estoque</p>
                <Button variant="primary" onClick={handleAddItem}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Adicionar Item
                </Button>
              </div>
            ) : (
              <Table hover responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Item</th>
                    <th>Tipo</th>
                    <th className="text-end">Quantidade</th>
                    <th>Localização</th>
                    <th>Status</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>
                        <strong>{item.name}</strong>
                        {item.notes && (
                          <small className="d-block text-muted">{item.notes}</small>
                        )}
                      </td>
                      <td>{item.type}</td>
                      <td className="text-end">
                        {item.quantity} {item.unit}
                      </td>
                      <td>{item.location || '-'}</td>
                      <td>{getStatusBadge(item)}</td>
                      <td className="text-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleEditItem(item, index)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteItem(index)}
                        >
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
      </div>

      {/* Add/Edit Item Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingItem !== null ? 'Editar Item' : 'Adicionar Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Nome do Item*</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Adubo NPK, Semente de Milho, etc."
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Tipo*</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Insumo">Insumo Agrícola</option>
                    <option value="Ferramenta">Ferramenta</option>
                    <option value="Equipamento">Equipamento</option>
                    <option value="Outro">Outro</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Quantidade*</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Unidade</Form.Label>
                  <Form.Select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    <option value="un">Unidade (un)</option>
                    <option value="kg">Quilograma (kg)</option>
                    <option value="g">Grama (g)</option>
                    <option value="l">Litro (l)</option>
                    <option value="ml">Mililitro (ml)</option>
                    <option value="saca">Saca</option>
                    <option value="caixa">Caixa</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Quantidade Mínima</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                    placeholder="Opcional"
                  />
                  <Form.Text className="text-muted">Deixe em branco se não aplicável</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Localização</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Galpão 1, Prateleira A"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Observações</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Informações adicionais"
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
          <Button variant="success" onClick={handleSaveItem}>
            {editingItem !== null ? 'Atualizar' : 'Salvar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  )
}