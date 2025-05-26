"use client"

import { useState } from "react"
import { Row, Col, Card, Table, Button, Modal, Form, Badge } from "react-bootstrap"

export default function FinancasCrud() {
  const [financas, setFinancas] = useState([
    {
      id: 1,
      tipo: "Receita",
      descricao: "Venda de Milho",
      valor: 25000,
      data: "2024-06-15",
      categoria: "Vendas",
    },
    {
      id: 2,
      tipo: "Despesa",
      descricao: "Compra de Sementes",
      valor: 5000,
      data: "2024-03-10",
      categoria: "Insumos",
    },
    {
      id: 3,
      tipo: "Receita",
      descricao: "Venda de Soja",
      valor: 18000,
      data: "2024-05-20",
      categoria: "Vendas",
    },
    {
      id: 4,
      tipo: "Despesa",
      descricao: "Manutenção de Equipamentos",
      valor: 3500,
      data: "2024-04-05",
      categoria: "Manutenção",
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingFinanca, setEditingFinanca] = useState(null)
  const [formData, setFormData] = useState({
    tipo: "Receita",
    descricao: "",
    valor: "",
    data: "",
    categoria: "",
  })

  const handleShowModal = (financa = null) => {
    if (financa) {
      setEditingFinanca(financa)
      setFormData(financa)
    } else {
      setEditingFinanca(null)
      setFormData({
        tipo: "Receita",
        descricao: "",
        valor: "",
        data: "",
        categoria: "",
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingFinanca(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const financeData = {
      ...formData,
      valor: Number.parseFloat(formData.valor),
    }

    if (editingFinanca) {
      setFinancas(financas.map((f) => (f.id === editingFinanca.id ? { ...financeData, id: editingFinanca.id } : f)))
    } else {
      const newFinanca = {
        ...financeData,
        id: Date.now(),
      }
      setFinancas([...financas, newFinanca])
    }

    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      setFinancas(financas.filter((f) => f.id !== id))
    }
  }

  const getTipoBadge = (tipo) => {
    return tipo === "Receita" ? <Badge bg="success">Receita</Badge> : <Badge bg="danger">Despesa</Badge>
  }

  const calcularResumo = () => {
    const receitas = financas.filter((f) => f.tipo === "Receita").reduce((sum, f) => sum + f.valor, 0)
    const despesas = financas.filter((f) => f.tipo === "Despesa").reduce((sum, f) => sum + f.valor, 0)
    const saldo = receitas - despesas

    return { receitas, despesas, saldo }
  }

  const { receitas, despesas, saldo } = calcularResumo()

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success mb-0">Gestão Financeira</h2>
        <Button variant="success" onClick={() => handleShowModal()}>
          <i className="bi bi-plus-circle me-2"></i>
          Nova Transação
        </Button>
      </div>

      {/* Cards Resumo Financeiro */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h5 className="text-success">Receitas</h5>
              <h3 className="text-success">R$ {receitas.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h5 className="text-danger">Despesas</h5>
              <h3 className="text-danger">R$ {despesas.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h5 className={saldo >= 0 ? "text-primary" : "text-warning"}>Saldo</h5>
              <h3 className={saldo >= 0 ? "text-primary" : "text-warning"}>R$ {saldo.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {financas.map((financa) => (
                <tr key={financa.id}>
                  <td>{getTipoBadge(financa.tipo)}</td>
                  <td className="fw-bold">{financa.descricao}</td>
                  <td>{financa.categoria}</td>
                  <td className={financa.tipo === "Receita" ? "text-success" : "text-danger"}>
                    R$ {financa.valor.toLocaleString()}
                  </td>
                  <td>{new Date(financa.data).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(financa)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(financa.id)}>
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
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingFinanca ? "Editar Transação" : "Nova Transação"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                required
              >
                <option value="Receita">Receita</option>
                <option value="Despesa">Despesa</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    required
                  >
                    <option value="">Selecione...</option>
                    {formData.tipo === "Receita" ? (
                      <>
                        <option value="Vendas">Vendas</option>
                        <option value="Subsídios">Subsídios</option>
                        <option value="Outros">Outros</option>
                      </>
                    ) : (
                      <>
                        <option value="Insumos">Insumos</option>
                        <option value="Manutenção">Manutenção</option>
                        <option value="Combustível">Combustível</option>
                        <option value="Mão de obra">Mão de obra</option>
                        <option value="Outros">Outros</option>
                      </>
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Valor (R$)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              {editingFinanca ? "Salvar Alterações" : "Criar Transação"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
