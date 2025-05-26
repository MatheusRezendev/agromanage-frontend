"use client"

import { useState } from "react"
import { Row, Col, Card, Table, Button, Modal, Form, Badge } from "react-bootstrap"

export default function LavourasCrud() {
  const [lavouras, setLavouras] = useState([
    {
      id: 1,
      nome: "Lavoura Norte",
      tipo: "Milho",
      area: "15 hectares",
      dataPlantio: "2024-03-15",
      status: "Ativa",
      previsaoColheita: "2024-08-15",
    },
    {
      id: 2,
      nome: "Lavoura Sul",
      tipo: "Soja",
      area: "20 hectares",
      dataPlantio: "2024-02-10",
      status: "Ativa",
      previsaoColheita: "2024-07-10",
    },
    {
      id: 3,
      nome: "Lavoura Leste",
      tipo: "Feijão",
      area: "8 hectares",
      dataPlantio: "2024-01-20",
      status: "Colhida",
      previsaoColheita: "2024-05-20",
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingLavoura, setEditingLavoura] = useState(null)
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    area: "",
    dataPlantio: "",
    status: "Ativa",
    previsaoColheita: "",
  })

  const handleShowModal = (lavoura = null) => {
    if (lavoura) {
      setEditingLavoura(lavoura)
      setFormData(lavoura)
    } else {
      setEditingLavoura(null)
      setFormData({
        nome: "",
        tipo: "",
        area: "",
        dataPlantio: "",
        status: "Ativa",
        previsaoColheita: "",
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingLavoura(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingLavoura) {
      // Editar lavoura existente
      setLavouras(lavouras.map((l) => (l.id === editingLavoura.id ? { ...formData, id: editingLavoura.id } : l)))
    } else {
      // Adicionar nova lavoura
      const newLavoura = {
        ...formData,
        id: Date.now(),
      }
      setLavouras([...lavouras, newLavoura])
    }

    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta lavoura?")) {
      setLavouras(lavouras.filter((l) => l.id !== id))
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      Ativa: "success",
      Colhida: "primary",
      Inativa: "secondary",
    }
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success mb-0">Gestão de Lavouras</h2>
        <Button variant="success" onClick={() => handleShowModal()}>
          <i className="bi bi-plus-circle me-2"></i>
          Nova Lavoura
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Área</th>
                <th>Data Plantio</th>
                <th>Status</th>
                <th>Previsão Colheita</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lavouras.map((lavoura) => (
                <tr key={lavoura.id}>
                  <td className="fw-bold">{lavoura.nome}</td>
                  <td>{lavoura.tipo}</td>
                  <td>{lavoura.area}</td>
                  <td>{new Date(lavoura.dataPlantio).toLocaleDateString()}</td>
                  <td>{getStatusBadge(lavoura.status)}</td>
                  <td>{new Date(lavoura.previsaoColheita).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(lavoura)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(lavoura.id)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal para Adicionar/Editar */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingLavoura ? "Editar Lavoura" : "Nova Lavoura"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome da Lavoura</Form.Label>
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
                  <Form.Label>Tipo de Cultura</Form.Label>
                  <Form.Select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Milho">Milho</option>
                    <option value="Soja">Soja</option>
                    <option value="Feijão">Feijão</option>
                    <option value="Arroz">Arroz</option>
                    <option value="Trigo">Trigo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Área</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: 15 hectares"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    required
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
                    <option value="Ativa">Ativa</option>
                    <option value="Colhida">Colhida</option>
                    <option value="Inativa">Inativa</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Plantio</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.dataPlantio}
                    onChange={(e) => setFormData({ ...formData, dataPlantio: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Previsão de Colheita</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.previsaoColheita}
                    onChange={(e) => setFormData({ ...formData, previsaoColheita: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              {editingLavoura ? "Salvar Alterações" : "Criar Lavoura"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
