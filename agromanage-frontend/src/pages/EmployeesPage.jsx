"use client"

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
    // Criar uma tabela HTML que o Excel pode abrir
    let excelHtml =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">'
    excelHtml +=
      "<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Relatório</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->"
    excelHtml += '<meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>'
    excelHtml +=
      "<style>td { mso-number-format:'\\@'; } .number { mso-number-format:'0.00'; } .currency { mso-number-format:'R$\\ #,##0.00'; }</style>"
    excelHtml += "</head><body>"

    // Iniciar a tabela
    excelHtml += '<table border="1" cellpadding="3" style="border-collapse:collapse;">'

    // Título do relatório
    excelHtml +=
      '<tr><td colspan="5" style="font-weight:bold;background-color:#4CAF50;color:white;text-align:center;font-size:14pt">RELATÓRIO DO FUNCIONÁRIO</td></tr>'

    // Linha em branco
    excelHtml += '<tr><td colspan="5"></td></tr>'

    // Cabeçalhos dos dados pessoais
    excelHtml += "<tr>"
    excelHtml += '<td style="font-weight:bold;background-color:#E8F5E9">Nome</td>'
    excelHtml += '<td style="font-weight:bold;background-color:#E8F5E9">Telefone</td>'
    excelHtml += '<td style="font-weight:bold;background-color:#E8F5E9">Cargo</td>'
    excelHtml += '<td style="font-weight:bold;background-color:#E8F5E9">Data de Admissão</td>'
    excelHtml += '<td style="font-weight:bold;background-color:#E8F5E9">Status</td>'
    excelHtml += "</tr>"

    // Dados pessoais do funcionário
    excelHtml += "<tr>"
    excelHtml += `<td>${employee.name || ""}</td>`
    excelHtml += `<td>${employee.phone || ""}</td>`
    excelHtml += `<td>${employee.position || ""}</td>`
    excelHtml += `<td>${employee.hireDate ? new Date(employee.hireDate).toLocaleDateString("pt-BR") : ""}</td>`
    excelHtml += `<td>${employee.status || ""}</td>`
    excelHtml += "</tr>"

    // Cabeçalho da seção de atividades
    excelHtml += '<tr><td colspan="5">Atividades</td></tr>'

    // Cabeçalhos das colunas de atividades
    excelHtml += "<tr>"
    excelHtml += '<td style="font-weight:bold">Data</td>'
    excelHtml += '<td style="font-weight:bold">Atividade</td>'
    excelHtml += '<td style="font-weight:bold">Status</td>'
    excelHtml += '<td style="font-weight:bold">Tipo Pagamento</td>'
    excelHtml += '<td style="font-weight:bold">Valor</td>'
    excelHtml += "</tr>"

    // Dados das atividades
    if (employee.activities && employee.activities.length > 0) {
      employee.activities.forEach((activity) => {
        excelHtml += "<tr>"
        excelHtml += `<td>${new Date(activity.date).toLocaleDateString("pt-BR")}</td>`
        excelHtml += `<td>${activity.activity || ""}</td>`
        excelHtml += `<td>${activity.status || ""}</td>`
        excelHtml += `<td>${activity.paymentType || ""}</td>`
        // Formatar o valor como moeda com vírgula
        const amount = Number.parseFloat(activity.amount || 0)
        excelHtml += `<td class="currency">R$ ${amount.toFixed(2).replace(".", ",")}</td>`
        excelHtml += "</tr>"
      })
    }

    // Adicionar linhas vazias para completar até a linha 13
    const rowsToAdd = Math.max(0, 7 - (employee.activities?.length || 0))
    for (let i = 0; i < rowsToAdd; i++) {
      excelHtml += "<tr>"
      excelHtml += "<td></td>"
      excelHtml += "<td></td>"
      excelHtml += "<td></td>"
      excelHtml += "<td></td>"
      excelHtml += "<td></td>"
      excelHtml += "</tr>"
    }

    // Calcular o total para exibir no HTML (para navegadores que não suportam fórmulas Excel)
    const totalAmount = calculateTotalPayment(employee)

    // Total pago com fórmula do Excel
    excelHtml += "<tr>"
    excelHtml += "<td>Total Pago</td>"
    excelHtml += '<td colspan="3"></td>'

    // Usar a sintaxe correta para fórmulas no Excel em português
    excelHtml += '<td class="currency">=SOMA(E7:E13)</td>'

    excelHtml += "</tr>"

    // Fechar a tabela e o documento HTML
    excelHtml += "</table></body></html>"

    // Criar um blob com o conteúdo HTML
    const blob = new Blob([excelHtml], { type: "application/vnd.ms-excel" })
    const url = URL.createObjectURL(blob)

    // Criar um link para download e clicar nele
    const link = document.createElement("a")
    link.href = url
    link.download = `${employee.name.replace(/\s+/g, "_")}_relatorio.xls`
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
