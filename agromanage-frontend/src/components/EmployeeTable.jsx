"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Modal, Form, Row, Col, Alert } from "react-bootstrap"

export default function EmployeeTable({ employee, onUpdateEmployee }) {
  const [tableData, setTableData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingRow, setEditingRow] = useState(null)
  const [formData, setFormData] = useState({
    date: "",
    activity: "",
    hoursWorked: "",
    productivity: "",
    observations: "",
  })
  const [alert, setAlert] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    setTableData(employee.tableData || [])
  }, [employee])

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type })
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000)
  }

  const handleAddRow = () => {
    setEditingRow(null)
    setFormData({
      date: new Date().toISOString().split("T")[0],
      activity: "",
      hoursWorked: "",
      productivity: "",
      observations: "",
    })
    setShowModal(true)
  }

  const handleEditRow = (row, index) => {
    setEditingRow(index)
    setFormData(row)
    setShowModal(true)
  }

  const handleDeleteRow = (index) => {
    const updatedData = tableData.filter((_, i) => i !== index)
    setTableData(updatedData)
    updateEmployeeData(updatedData)
    showAlert("Registro excluído com sucesso!", "success")
  }

  const handleSaveRow = () => {
    if (!formData.date || !formData.activity) {
      showAlert("Data e atividade são obrigatórios!", "danger")
      return
    }

    let updatedData
    if (editingRow !== null) {
      updatedData = tableData.map((row, index) => (index === editingRow ? { ...formData } : row))
      showAlert("Registro atualizado com sucesso!", "success")
    } else {
      updatedData = [...tableData, { ...formData, id: Date.now().toString() }]
      showAlert("Registro adicionado com sucesso!", "success")
    }

    setTableData(updatedData)
    updateEmployeeData(updatedData)
    setShowModal(false)
  }

  const updateEmployeeData = (newTableData) => {
    const updatedEmployee = {
      ...employee,
      tableData: newTableData,
    }
    onUpdateEmployee(updatedEmployee)
  }

  const exportToCSV = () => {
    if (tableData.length === 0) {
      showAlert("Não há dados para exportar!", "warning")
      return
    }

    const headers = ["Data", "Atividade", "Horas Trabalhadas", "Produtividade", "Observações"]
    const csvContent = [
      headers.join(","),
      ...tableData.map((row) =>
        [row.date, row.activity, row.hoursWorked, row.productivity, row.observations].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${employee.name}_dados.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Card className="border-0 shadow-sm h-100">
        <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">
              <i className="bi bi-table me-2"></i>
              Tabela de {employee.name}
            </h5>
            <small>
              {employee.position} - {employee.department}
            </small>
          </div>
          <div>
            <Button variant="light" size="sm" className="me-2" onClick={exportToCSV}>
              <i className="bi bi-download me-1"></i>
              Exportar
            </Button>
            <Button variant="light" size="sm" onClick={handleAddRow}>
              <i className="bi bi-plus me-1"></i>
              Adicionar
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {alert.show && (
            <Alert variant={alert.type} className="m-3 mb-0">
              {alert.message}
            </Alert>
          )}

          {tableData.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-table text-muted" style={{ fontSize: "3rem" }}></i>
              <h6 className="text-muted mt-3">Nenhum registro encontrado</h6>
              <p className="text-muted">Comece adicionando o primeiro registro de atividade</p>
              <Button variant="success" onClick={handleAddRow}>
                <i className="bi bi-plus me-2"></i>
                Adicionar Primeiro Registro
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Data</th>
                    <th>Atividade</th>
                    <th>Horas</th>
                    <th>Produtividade</th>
                    <th>Observações</th>
                    <th width="120">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index}>
                      <td>{new Date(row.date).toLocaleDateString("pt-BR")}</td>
                      <td>{row.activity}</td>
                      <td>{row.hoursWorked}h</td>
                      <td>{row.productivity}</td>
                      <td>{row.observations}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleEditRow(row, index)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteRow(index)}>
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal para Adicionar/Editar Registro */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingRow !== null ? "Editar Registro" : "Adicionar Registro"}</Modal.Title>
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
                  <Form.Label>Horas Trabalhadas</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.5"
                    value={formData.hoursWorked}
                    onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                    placeholder="8.0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Atividade *</Form.Label>
              <Form.Control
                type="text"
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                placeholder="Descreva a atividade realizada"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Produtividade</Form.Label>
              <Form.Control
                type="text"
                value={formData.productivity}
                onChange={(e) => setFormData({ ...formData, productivity: e.target.value })}
                placeholder="Ex: 100 kg colhidos, 5 hectares plantados"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Observações</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                placeholder="Observações adicionais sobre o trabalho realizado"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSaveRow}>
            {editingRow !== null ? "Atualizar" : "Adicionar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
