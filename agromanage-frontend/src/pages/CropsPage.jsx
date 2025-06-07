import { useState, useEffect } from "react"
import { Button, Modal, Table, Badge, Form, Row, Col, Card, Alert } from "react-bootstrap"
import DashboardLayout from "../components/DashboardLayout"
import CropProductivity from "../components/CropProductivity"
import "../App.css"

export default function CropsPage() {
  const [crops, setCrops] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingCrop, setEditingCrop] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    area: "",
    plantDate: "",
    harvestDate: "",
    status: "Ativo",
  })
  const [alert, setAlert] = useState({ show: false, message: "", type: "" })
  const [showProductivity, setShowProductivity] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState(null)
  const [stats, setStats] = useState({
    totalProduction: 0,
    totalValue: 0,
  })

  useEffect(() => {
    loadCrops()
  }, [])

  const loadCrops = () => {
    const currentUser = JSON.parse(localStorage.getItem("agromanage_currentUser") || "{}")
    const allCrops = JSON.parse(localStorage.getItem("agromanage_crops") || "{}")
    const userCrops = allCrops[currentUser.id] || []
    setCrops(userCrops)
    calculateStats(userCrops)
  }

  const calculateStats = (cropsList) => {
    let totalProduction = 0
    let totalValue = 0

    cropsList.forEach((crop) => {
      if (crop.productivity) {
        crop.productivity.forEach((p) => {
          totalProduction += Number(p.production) || 0
          totalValue += (Number(p.production) || 0) * (Number(p.value) || 0)
        })
      }
    })

    setStats({
      totalProduction,
      totalValue,
    })
  }

  const saveCrops = (cropsList) => {
    const currentUser = JSON.parse(localStorage.getItem("agromanage_currentUser") || "{}")
    const allCrops = JSON.parse(localStorage.getItem("agromanage_crops") || "{}")
    allCrops[currentUser.id] = cropsList
    localStorage.setItem("agromanage_crops", JSON.stringify(allCrops))
    setCrops(cropsList)
    calculateStats(cropsList)
  }

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type })
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000)
  }

  const handleAddCrop = () => {
    setEditingCrop(null)
    setFormData({
      name: "",
      type: "",
      area: "",
      plantDate: "",
      harvestDate: "",
      status: "Ativo",
    })
    setShowModal(true)
  }

  const handleEditCrop = (crop, index) => {
    setEditingCrop(index)
    setFormData(crop)
    setShowModal(true)
  }

  const handleDeleteCrop = (index) => {
    const updatedCrops = crops.filter((_, i) => i !== index)
    saveCrops(updatedCrops)
    showAlert("Lavoura excluída com sucesso!", "success")
  }

  const handleSaveCrop = () => {
    if (!formData.name || !formData.type || !formData.area || !formData.plantDate) {
      showAlert("Nome, tipo, área e data de plantio são obrigatórios!", "danger")
      return
    }

    let updatedCrops
    if (editingCrop !== null) {
      updatedCrops = crops.map((crop, index) => (index === editingCrop ? { ...formData } : crop))
      showAlert("Lavoura atualizada com sucesso!", "success")
    } else {
      updatedCrops = [...crops, { ...formData, id: Date.now().toString(), productivity: [] }]
      showAlert("Lavoura adicionada com sucesso!", "success")
    }

    saveCrops(updatedCrops)
    setShowModal(false)
  }

  const handleViewProductivity = (crop) => {
    setSelectedCrop(crop)
    setShowProductivity(true)
  }

  const handleUpdateCrop = (updatedCrop) => {
    const updatedCrops = crops.map((crop) => (crop.id === updatedCrop.id ? updatedCrop : crop))
    saveCrops(updatedCrops)
    setSelectedCrop(updatedCrop)
  }

  const getStatusBadge = (status) => {
    const variants = {
      Ativo: "success",
      Colhida: "primary",
      Inativo: "secondary",
    }
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>
  }

  const cropTypes = ["Milho", "Soja", "Feijão", "Arroz", "Trigo", "Algodão", "Cana-de-açúcar", "Café", "Outros"]

  if (showProductivity && selectedCrop) {
    return (
      <DashboardLayout>
        <CropProductivity
          crop={selectedCrop}
          onBack={() => setShowProductivity(false)}
          onUpdateCrop={handleUpdateCrop}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Gestão de Lavouras</h1>
          <Button variant="success" onClick={handleAddCrop}>
            <i className="bi bi-plus-circle me-2"></i>
            Nova Lavoura
          </Button>
        </div>

        {alert.show && (
          <Alert variant={alert.type} className="mb-4">
            {alert.message}
          </Alert>
        )}

        {/* Stats Cards */}
        <Row className="g-4 mb-4">
          <Col md={6}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-primary mb-1">{stats.totalProduction.toLocaleString("pt-BR")} kg</h3>
                <p className="text-muted mb-0">Produção Total</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-success mb-1">R$ {stats.totalValue.toLocaleString("pt-BR")}</h3>
                <p className="text-muted mb-0">Valor Total Produzido</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Crops Table */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            {crops.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-flower2 text-muted" style={{ fontSize: "4rem" }}></i>
                <h5 className="text-muted mt-3">Nenhuma lavoura cadastrada</h5>
                <p className="text-muted">Comece adicionando sua primeira lavoura</p>
                <Button variant="success" onClick={handleAddCrop}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Adicionar Lavoura
                </Button>
              </div>
            ) : (
              <Table hover responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Área</th>
                    <th>Data Plantio</th>
                    <th>Status</th>
                    <th>Previsão Colheita</th>
                    <th width="150">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {crops.map((crop, index) => (
                    <tr key={index} onClick={() => handleViewProductivity(crop)} style={{ cursor: "pointer" }}>
                      <td>
                        <strong>{crop.name}</strong>
                      </td>
                      <td>{crop.type}</td>
                      <td>{crop.area} hectares</td>
                      <td>{new Date(crop.plantDate).toLocaleDateString("pt-BR")}</td>
                      <td>{getStatusBadge(crop.status)}</td>
                      <td>
                        {crop.harvestDate ? new Date(crop.harvestDate).toLocaleDateString("pt-BR") : "Não definida"}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditCrop(crop, index)
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="me-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewProductivity(crop)
                          }}
                        >
                          <i className="bi bi-graph-up"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCrop(index)
                          }}
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

      {/* Add/Edit Crop Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingCrop !== null ? "Editar Lavoura" : "Nova Lavoura"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Lavoura Norte"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo *</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="">Selecione o tipo</option>
                    {cropTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Área (hectares) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="0.0"
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
                    <option value="Ativo">Ativo</option>
                    <option value="Colhida">Colhida</option>
                    <option value="Inativo">Inativo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data do Plantio *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.plantDate}
                    onChange={(e) => setFormData({ ...formData, plantDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Previsão de Colheita</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
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
          <Button variant="success" onClick={handleSaveCrop}>
            {editingCrop !== null ? "Atualizar" : "Adicionar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  )
}
