"use client"

import { useState } from "react"
import { Row, Col, Card, Table, Button, Modal, Form, Badge } from "react-bootstrap"

export default function FuncionariosCrud() {
  const [funcionarios, setFuncionarios] = useState([
    {
      id: 1,
      nome: "João Silva",
      cargo: "Operador de Máquinas",
      departamento: "Produção",
      salario: 3500,
      dataAdmissao: "2023-01-15",
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Maria Santos",
      cargo: "Técnica Agrícola",
      departamento: "Técnico",
      salario: 4200,
      dataAdmissao: "2023-03-10",
      status: "Ativo",
    },
    {
      id: 3,
      nome: "Pedro Oliveira",
      cargo: "Auxiliar de Campo",
      departamento: "Produção",
      salario: 2800,
      dataAdmissao: "2023-06-20",
      status: "Ativo",
    },
    {
      id: 4,
      nome: "Ana Costa",
      cargo: "Supervisora",
      departamento: "Gestão",
      salario: 5500,
      dataAdmissao: "2022-11-05",
      status: "Inativo",
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingFuncionario, setEditingFuncionario] = useState(null)
  const [formData, setFormData] = useState({
    nome: "",
    cargo: "",
    departamento: "",
    salario: "",
    dataAdmissao: "",
    status: "Ativo",
  })

  const handleShowModal = (funcionario = null) => {
    if (funcionario) {
      setEditingFuncionario(funcionario)
      setFormData(funcionario)
    } else {
      setEditingFuncionario(null)
      setFormData({
        nome: "",
        cargo: "",
        departamento: "",
        salario: "",
        dataAdmissao: "",
        status: "Ativo",
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingFuncionario(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const funcionarioData = {
      ...formData,
      salario: Number.parseFloat(formData.salario),
    }

    if (editingFuncionario) {
      setFuncionarios(
        funcionarios.map((f) =>
          f.id === editingFuncionario.id ? { ...funcionarioData, id: editingFuncionario.id } : f,
        ),
      )
    } else {
      const newFuncionario = {
        ...funcionarioData,
        id: Date.now(),
      }
      setFuncionarios([...funcionarios, newFuncionario])
    }

    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {
      setFuncionarios(funcionarios.filter((f) => f.id !== id))
    }
  }

  const getStatusBadge = (status) => {
    return status === "Ativo" ? <Badge bg="success">Ativo</Badge> : <Badge bg="secondary">Inativo</Badge>
  }

  const funcionariosAtivos = funcionarios.filter((f) => f.status === "Ativo").length
  const folhaPagamento = funcionarios.filter((f) => f.status === "Ativo").reduce((sum, f) => sum + f.salario, 0)

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success mb-0">Gestão de Funcionários</h2>
        <Button variant="success" onClick={() => handleShowModal()}>
          <i className="bi bi-plus-circle me-2"></i>
          Novo Funcionário
        </Button>
      </div>

      {/* Cards Resumo */}
      <Row className="g-3 mb-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h5 className="text-primary">Funcionários Ativos</h5>
              <h3 className="text-primary">{funcionariosAtivos}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h5 className="text-warning">Folha de Pagamento</h5>
              <h3 className="text-warning">R$ {folhaPagamento.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Salário</th>
                <th>Data Admissão</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td className="fw-bold">{funcionario.nome}</td>
                  <td>{funcionario.cargo}</td>
                  <td>{funcionario.departamento}</td>
                  <td>R$ {funcionario.salario.toLocaleString()}</td>
                  <td>{new Date(funcionario.dataAdmissao).toLocaleDateString()}</td>
                  <td>{getStatusBadge(funcionario.status)}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(funcionario)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(funcionario.id)}>
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
          <Modal.Title>{editingFuncionario ? "Editar Funcionário" : "Novo Funcionário"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
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
                  <Form.Label>Cargo</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Departamento</Form.Label>
                  <Form.Select
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Produção">Produção</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Gestão">Gestão</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Manutenção">Manutenção</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Salário (R$)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.salario}
                    onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Admissão</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.dataAdmissao}
                    onChange={(e) => setFormData({ ...formData, dataAdmissao: e.target.value })}
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
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              {editingFuncionario ? "Salvar Alterações" : "Adicionar Funcionário"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
