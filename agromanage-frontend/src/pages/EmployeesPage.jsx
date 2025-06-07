import { useState, useEffect } from "react"
import { Row, Col, Card, Button, Modal, Table, Badge } from "react-bootstrap"
import DashboardLayout from "../components/DashboardLayout"
import EmployeeForm from "../components/EmployeeForm"
import EmployeeActivities from "../components/EmployeeActivities"
import "../App.css"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("add")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)
  const [showActivities, setShowActivities] = useState(false)

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = () => {
    const currentUser = JSON.parse(localStorage.getItem("agromanage_currentUser") || "{}")
    const allEmployees = JSON.parse(localStorage.getItem("agromanage_employees") || "{}")
    const userEmployees = allEmployees[currentUser.id] || []

    // Remover campos desnecessários dos funcionários existentes
    const cleanedEmployees = userEmployees.map((emp) => {
      const { department, salary, address, email, ...cleanedEmp } = emp
      return cleanedEmp
    })

    setEmployees(cleanedEmployees)

    // Atualizar localStorage com dados limpos
    if (JSON.stringify(cleanedEmployees) !== JSON.stringify(userEmployees)) {
      allEmployees[currentUser.id] = cleanedEmployees
      localStorage.setItem("agromanage_employees", JSON.stringify(allEmployees))
    }
  }

  const saveEmployees = (employeesList) => {
    const currentUser = JSON.parse(localStorage.getItem("agromanage_currentUser") || "{}")
    const allEmployees = JSON.parse(localStorage.getItem("agromanage_employees") || "{}")
    allEmployees[currentUser.id] = employeesList
    localStorage.setItem("agromanage_employees", JSON.stringify(allEmployees))
    setEmployees(employeesList)
  }

  const calculateTotalPayment = (employee) => {
    if (!employee.activities) return 0
    return employee.activities.reduce((total, activity) => {
      return total + (Number.parseFloat(activity.amount) || 0)
    }, 0)
  }

  const calculatePayroll = () => {
    return employees
      .filter((emp) => emp.status === "Ativo")
      .reduce((total, emp) => total + calculateTotalPayment(emp), 0)
  }

  const exportToExcel = (employee) => {
    const csvContent = [
      ["RELATÓRIO DO FUNCIONÁRIO"],
      [""],
      ["Dados Pessoais"],
      ["Nome", employee.name],
      ["Telefone", employee.phone || ""],
      ["Cargo", employee.position],
      ["Data de Admissão", new Date(employee.hireDate).toLocaleDateString("pt-BR")],
      ["Status", employee.status],
      [""],
      ["Atividades"],
      ["Data", "Atividade", "Status", "Tipo Pagamento", "Valor"],
      ...(employee.activities || []).map((activity) => [
        new Date(activity.date).toLocaleDateString("pt-BR"),
        activity.activity,
        activity.status,
        activity.paymentType,
        `R$ ${Number.parseFloat(activity.amount || 0).toLocaleString("pt-BR")}`,
      ]),
      [""],
      ["Total Pago", "", "", "", `R$ ${calculateTotalPayment(employee).toLocaleString("pt-BR")}`],
    ]

    const csvString = csvContent.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${employee.name.replace(/\s+/g, "_")}_relatorio.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAddEmployee = () => {
    setModalType("add")
    setSelectedEmployee(null)
    setShowModal(true)
  }

  const handleEditEmployee = (employee) => {
    setModalType("edit")
    setSelectedEmployee(employee)
    setShowModal(true)
  }

  const handleDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    const updatedEmployees = employees.filter((emp) => emp.id !== employeeToDelete.id)
    saveEmployees(updatedEmployees)
    setShowDeleteModal(false)
    setEmployeeToDelete(null)
  }

  const handleSaveEmployee = (employeeData) => {
    let updatedEmployees

    if (modalType === "add") {
      const newEmployee = {
        id: Date.now().toString(),
        ...employeeData,
        status: "Ativo",
        createdAt: new Date().toISOString(),
        activities: [],
      }
      updatedEmployees = [...employees, newEmployee]
    } else {
      updatedEmployees = employees.map((emp) => (emp.id === selectedEmployee.id ? { ...emp, ...employeeData } : emp))
    }

    saveEmployees(updatedEmployees)
    setShowModal(false)
  }

  const handleViewActivities = (employee) => {
    setSelectedEmployee(employee)
    setShowActivities(true)
  }

  const activeEmployees = employees.filter((emp) => emp.status === "Ativo").length

  if (showActivities && selectedEmployee) {
    return (
      <DashboardLayout>
        <EmployeeActivities
          employee={selectedEmployee}
          onBack={() => setShowActivities(false)}
          onUpdateEmployee={(updatedEmployee) => {
            const updatedEmployees = employees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
            saveEmployees(updatedEmployees)
            setSelectedEmployee(updatedEmployee)
          }}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Gestão de Funcionários</h1>
          <Button variant="success" onClick={handleAddEmployee}>
            <i className="bi bi-plus-circle me-2"></i>
            Novo Funcionário
          </Button>
        </div>

        {/* Stats Cards */}
        <Row className="g-4 mb-4">
          <Col md={6}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-primary mb-1">{activeEmployees}</h3>
                <p className="text-muted mb-0">Funcionários Ativos</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-warning mb-1">R$ {calculatePayroll().toLocaleString("pt-BR")}</h3>
                <p className="text-muted mb-0">Folha de Pagamento</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Employees Table */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            {employees.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-people text-muted" style={{ fontSize: "4rem" }}></i>
                <h5 className="text-muted mt-3">Nenhum funcionário cadastrado</h5>
                <p className="text-muted">Comece adicionando seu primeiro funcionário</p>
                <Button variant="success" onClick={handleAddEmployee}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Adicionar Funcionário
                </Button>
              </div>
            ) : (
              <Table hover responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nome</th>
                    <th>Cargo</th>
                    <th>Pagamento</th>
                    <th>Data Admissão</th>
                    <th>Status</th>
                    <th width="180">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} onClick={() => handleViewActivities(employee)} style={{ cursor: "pointer" }}>
                      <td>
                        <strong>{employee.name}</strong>
                      </td>
                      <td>{employee.position}</td>
                      <td>R$ {calculateTotalPayment(employee).toLocaleString("pt-BR")}</td>
                      <td>{employee.hireDate ? new Date(employee.hireDate).toLocaleDateString("pt-BR") : "-"}</td>
                      <td>
                        <Badge bg={employee.status === "Ativo" ? "success" : "secondary"}>{employee.status}</Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditEmployee(employee)
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
                            exportToExcel(employee)
                          }}
                          title="Exportar Excel"
                        >
                          <i className="bi bi-file-earmark-excel"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteEmployee(employee)
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

      {/* Add/Edit Employee Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalType === "add" ? "Adicionar Funcionário" : "Editar Funcionário"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmployeeForm employee={selectedEmployee} onSave={handleSaveEmployee} onCancel={() => setShowModal(false)} />
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Tem certeza que deseja excluir o funcionário <strong>{employeeToDelete?.name}</strong>?
          </p>
          <p className="text-muted small">Esta ação não pode ser desfeita.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  )
}
