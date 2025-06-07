import { useState, useEffect } from "react"
import { Row, Col, Card, Button, Modal, Table, Badge, Form, Alert } from "react-bootstrap"
import DashboardLayout from "../components/DashboardLayout"
import "../App.css"

export default function FinancesPage() {
  const [transactions, setTransactions] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [formData, setFormData] = useState({
    type: "Receita",
    description: "",
    detailedDescription: "",
    category: "",
    amount: "",
    date: "",
  })
  const [alert, setAlert] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = () => {
    const currentUser = JSON.parse(localStorage.getItem("agromanage_currentUser") || "{}")
    const allTransactions = JSON.parse(localStorage.getItem("agromanage_transactions") || "{}")
    const userTransactions = allTransactions[currentUser.id] || []
    setTransactions(userTransactions)
  }

  const saveTransactions = (transactionsList) => {
    const currentUser = JSON.parse(localStorage.getItem("agromanage_currentUser") || "{}")
    const allTransactions = JSON.parse(localStorage.getItem("agromanage_transactions") || "{}")
    allTransactions[currentUser.id] = transactionsList
    localStorage.setItem("agromanage_transactions", JSON.stringify(allTransactions))
    setTransactions(transactionsList)
  }

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type })
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000)
  }

  const calculateTotals = () => {
    const receitas = transactions
      .filter((t) => t.type === "Receita")
      .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

    const despesas = transactions
      .filter((t) => t.type === "Despesa")
      .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

    return {
      receitas,
      despesas,
      saldo: receitas - despesas,
    }
  }

  const handleAddTransaction = () => {
    setEditingTransaction(null)
    setFormData({
      type: "Receita",
      description: "",
      detailedDescription: "",
      category: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    })
    setShowModal(true)
  }

  const handleEditTransaction = (transaction, index) => {
    setEditingTransaction(index)
    setFormData({
      ...transaction,
      detailedDescription: transaction.detailedDescription || "",
    })
    setShowModal(true)
  }

  const handleViewTransaction = (transaction, index) => {
    setSelectedTransaction({ ...transaction, index })
    setShowDetailModal(true)
  }

  const handleDeleteTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index)
    saveTransactions(updatedTransactions)
    showAlert("Transação excluída com sucesso!", "success")
  }

  const handleSaveTransaction = () => {
    if (!formData.description || !formData.category || !formData.amount || !formData.date) {
      showAlert("Todos os campos obrigatórios devem ser preenchidos!", "danger")
      return
    }

    let updatedTransactions
    if (editingTransaction !== null) {
      updatedTransactions = transactions.map((transaction, index) =>
        index === editingTransaction ? { ...formData } : transaction,
      )
      showAlert("Transação atualizada com sucesso!", "success")
    } else {
      updatedTransactions = [...transactions, { ...formData, id: Date.now().toString() }]
      showAlert("Transação adicionada com sucesso!", "success")
    }

    saveTransactions(updatedTransactions)
    setShowModal(false)
  }

  const handleSaveDetailedDescription = () => {
    const updatedTransactions = transactions.map((transaction, index) =>
      index === selectedTransaction.index
        ? { ...transaction, detailedDescription: selectedTransaction.detailedDescription }
        : transaction,
    )
    saveTransactions(updatedTransactions)
    setShowDetailModal(false)
    showAlert("Descrição detalhada salva com sucesso!", "success")
  }

  const getCategories = (type) => {
    if (type === "Receita") {
      return ["Vendas", "Serviços", "Outros"]
    }
    return ["Insumos", "Manutenção", "Combustível", "Mão de obra", "Outros"]
  }

  const totals = calculateTotals()

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Gestão Financeira</h1>
          <Button variant="success" onClick={handleAddTransaction}>
            <i className="bi bi-plus-circle me-2"></i>
            Nova Transação
          </Button>
        </div>

        {alert.show && (
          <Alert variant={alert.type} className="mb-4">
            {alert.message}
          </Alert>
        )}

        {/* Financial Summary */}
        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-success mb-1">R$ {totals.receitas.toLocaleString("pt-BR")}</h3>
                <p className="text-muted mb-0">Receitas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-danger mb-1">R$ {totals.despesas.toLocaleString("pt-BR")}</h3>
                <p className="text-muted mb-0">Despesas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className={`mb-1 ${totals.saldo >= 0 ? "text-primary" : "text-danger"}`}>
                  R$ {totals.saldo.toLocaleString("pt-BR")}
                </h3>
                <p className="text-muted mb-0">Saldo</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Transactions Table */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            {transactions.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-cash-coin text-muted" style={{ fontSize: "4rem" }}></i>
                <h5 className="text-muted mt-3">Nenhuma transação registrada</h5>
                <p className="text-muted">Comece adicionando sua primeira transação</p>
                <Button variant="success" onClick={handleAddTransaction}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Adicionar Transação
                </Button>
              </div>
            ) : (
              <Table hover responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Tipo</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Valor</th>
                    <th>Data</th>
                    <th width="120">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr
                      key={index}
                      onClick={() => handleViewTransaction(transaction, index)}
                      style={{ cursor: "pointer" }}
                      className="transaction-row"
                    >
                      <td>
                        <Badge bg={transaction.type === "Receita" ? "success" : "danger"}>{transaction.type}</Badge>
                      </td>
                      <td>
                        <div>
                          {transaction.description}
                          {transaction.detailedDescription && (
                            <small className="text-muted d-block">
                              <i className="bi bi-file-text me-1"></i>
                              Detalhes disponíveis
                            </small>
                          )}
                        </div>
                      </td>
                      <td>{transaction.category}</td>
                      <td>R$ {Number.parseFloat(transaction.amount).toLocaleString("pt-BR")}</td>
                      <td>{new Date(transaction.date).toLocaleDateString("pt-BR")}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditTransaction(transaction, index)
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteTransaction(index)
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

      {/* Add/Edit Transaction Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingTransaction !== null ? "Editar Transação" : "Nova Transação"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo *</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value, category: "" })}
                  >
                    <option value="Receita">Receita</option>
                    <option value="Despesa">Despesa</option>
                  </Form.Select>
                </Form.Group>
              </Col>
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
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descrição *</Form.Label>
              <Form.Control
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva a transação"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição Detalhada</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.detailedDescription}
                onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                placeholder="Adicione detalhes adicionais sobre esta transação (opcional)"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoria *</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Selecione uma categoria</option>
                    {getCategories(formData.type).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Valor *</Form.Label>
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
          <Button variant="success" onClick={handleSaveTransaction}>
            {editingTransaction !== null ? "Atualizar" : "Adicionar"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Transaction Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalhes da Transação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Tipo:</strong>
                  <br />
                  <Badge bg={selectedTransaction.type === "Receita" ? "success" : "danger"}>
                    {selectedTransaction.type}
                  </Badge>
                </Col>
                <Col md={6}>
                  <strong>Data:</strong>
                  <br />
                  {new Date(selectedTransaction.date).toLocaleDateString("pt-BR")}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Categoria:</strong>
                  <br />
                  {selectedTransaction.category}
                </Col>
                <Col md={6}>
                  <strong>Valor:</strong>
                  <br />
                  <span className={selectedTransaction.type === "Receita" ? "text-success" : "text-danger"}>
                    R$ {Number.parseFloat(selectedTransaction.amount).toLocaleString("pt-BR")}
                  </span>
                </Col>
              </Row>

              <div className="mb-3">
                <strong>Descrição:</strong>
                <br />
                {selectedTransaction.description}
              </div>

              <div className="mb-3">
                <strong>Descrição Detalhada:</strong>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={selectedTransaction.detailedDescription || ""}
                  onChange={(e) =>
                    setSelectedTransaction({ ...selectedTransaction, detailedDescription: e.target.value })
                  }
                  placeholder="Adicione ou edite a descrição detalhada desta transação..."
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Fechar
          </Button>
          <Button variant="success" onClick={handleSaveDetailedDescription}>
            Salvar Descrição
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  )
}
