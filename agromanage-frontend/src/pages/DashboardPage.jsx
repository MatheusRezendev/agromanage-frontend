import { useState, useEffect } from "react"
import { Row, Col, Card } from "react-bootstrap"
import DashboardLayout from "../components/DashboardLayout"
import "../App.css"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalLavouras: 0,
    receitaTotal: 0,
    funcionariosAtivos: 0,
  })
  const [revenueData, setRevenueData] = useState([])
  const [cropProductionData, setCropProductionData] = useState([])
  const [cropTypes, setCropTypes] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    const currentUser = JSON.parse(localStorage.getItem("agromanage_currentUser") || "{}")

    // Carregar dados das lavouras
    const allCrops = JSON.parse(localStorage.getItem("agromanage_crops") || "{}")
    const userCrops = allCrops[currentUser.id] || []

    // Carregar dados financeiros
    const allTransactions = JSON.parse(localStorage.getItem("agromanage_transactions") || "{}")
    const userTransactions = allTransactions[currentUser.id] || []

    // Carregar dados dos funcionários
    const allEmployees = JSON.parse(localStorage.getItem("agromanage_employees") || "{}")
    const userEmployees = allEmployees[currentUser.id] || []

    // Calcular estatísticas
    const totalLavouras = userCrops.length
    const funcionariosAtivos = userEmployees.filter((emp) => emp.status === "Ativo").length

    // Calcular receita total
    const receitas = userTransactions
      .filter((t) => t.type === "Receita")
      .reduce((sum, t) => sum + Number.parseFloat(t.amount || 0), 0)

    setStats({
      totalLavouras,
      receitaTotal: receitas,
      funcionariosAtivos,
    })

    // Gerar dados de receita por mês baseado nas transações
    generateRevenueData(userTransactions)

    // Gerar dados de produção das culturas baseado nas lavouras
    generateCropProductionData(userCrops)
  }

  const generateRevenueData = (transactions) => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]
    const currentYear = new Date().getFullYear()

    const monthlyRevenue = months.map((month, index) => {
      const monthTransactions = transactions.filter((t) => {
        if (!t.date || t.type !== "Receita") return false
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === index && transactionDate.getFullYear() === currentYear
      })

      const value = monthTransactions.reduce((sum, t) => sum + Number.parseFloat(t.amount || 0), 0)
      return { month, value }
    })

    setRevenueData(monthlyRevenue)
  }

  const generateCropProductionData = (crops) => {
    // Extrair tipos únicos de culturas
    const uniqueTypes = [...new Set(crops.map((crop) => crop.type).filter(Boolean))]
    setCropTypes(uniqueTypes)

    // Agrupar produção por tipo de cultura e ano
    const productionByType = {}
    const years = []

    crops.forEach((crop) => {
      if (crop.type && crop.productivity && crop.productivity.length > 0) {
        if (!productionByType[crop.type]) {
          productionByType[crop.type] = {}
        }

        crop.productivity.forEach((p) => {
          if (!years.includes(p.year)) {
            years.push(p.year)
          }

          if (!productionByType[crop.type][p.year]) {
            productionByType[crop.type][p.year] = 0
          }

          productionByType[crop.type][p.year] += Number(p.production) || 0
        })
      }
    })

    // Ordenar anos
    years.sort()

    // Formatar dados para o gráfico
    const formattedData = years.map((year) => {
      const yearData = { year }
      uniqueTypes.forEach((type) => {
        yearData[type] = productionByType[type]?.[year] || 0
      })
      return yearData
    })

    setCropProductionData(formattedData)
  }

  const maxRevenue = Math.max(...revenueData.map((d) => d.value), 1000)
  const maxProduction = Math.max(
    ...cropProductionData.flatMap((data) => cropTypes.map((type) => data[type] || 0)),
    1000,
  )

  // Cores para os tipos de culturas
  const cropColors = {
    Milho: "#4CAF50",
    Soja: "#66BB6A",
    Feijão: "#81C784",
    Arroz: "#A5D6A7",
    Trigo: "#C8E6C9",
    Algodão: "#E8F5E8",
    "Cana-de-açúcar": "#2E7D32",
    Café: "#388E3C",
    Outros: "#43A047",
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Dashboard</h1>
          <small className="text-muted">Última atualização: {new Date().toLocaleDateString("pt-BR")}</small>
        </div>

        {/* Stats Cards */}
        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="stat-icon text-success me-3">
                  <i className="bi bi-flower2"></i>
                </div>
                <div>
                  <h3 className="text-success mb-0">{stats.totalLavouras}</h3>
                  <p className="text-muted mb-0">Total de Lavouras</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="stat-icon text-primary me-3">
                  <i className="bi bi-cash-stack"></i>
                </div>
                <div>
                  <h3 className="text-primary mb-0">R$ {stats.receitaTotal.toLocaleString("pt-BR")}</h3>
                  <p className="text-muted mb-0">Receita Total</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="stat-icon text-warning me-3">
                  <i className="bi bi-people"></i>
                </div>
                <div>
                  <h3 className="text-warning mb-0">{stats.funcionariosAtivos}</h3>
                  <p className="text-muted mb-0">Funcionários Ativos</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row className="g-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-0 d-flex align-items-center">
                <div className="chart-icon me-3">
                  <i className="bi bi-bar-chart-fill"></i>
                </div>
                <h5 className="mb-0">Receita Mensal (R$)</h5>
              </Card.Header>
              <Card.Body>
                <div className="modern-chart-container">
                  {revenueData.length > 0 ? (
                    <div className="modern-bar-chart">
                      <div className="chart-grid-modern">
                        {[1.0, 0.8, 0.6, 0.4, 0.2, 0.0].map((ratio, index) => {
                          return (
                            <div key={index} className="grid-line-modern" style={{ bottom: `${ratio * 100}%` }}>
                              {ratio === 0 && <span className="grid-label-modern">0</span>}
                            </div>
                          )
                        })}
                      </div>
                      <div className="bars-container">
                        {revenueData.map((item, index) => (
                          <div key={index} className="bar-wrapper">
                            {item.value > 0 && (
                              <div
                                className="modern-bar"
                                style={{
                                  height: `${Math.max((item.value / maxRevenue) * 100, 2)}%`,
                                }}
                                title={`${item.month}: R$ ${item.value.toLocaleString("pt-BR")}`}
                              ></div>
                            )}
                            <span className="modern-bar-label">{item.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-bar-chart text-muted" style={{ fontSize: "3rem" }}></i>
                      <p className="text-muted mt-2">Nenhuma receita registrada</p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-0 d-flex align-items-center">
                <div className="chart-icon me-3">
                  <i className="bi bi-graph-up"></i>
                </div>
                <h5 className="mb-0">Produção por Cultura (kg)</h5>
              </Card.Header>
              <Card.Body>
                <div className="modern-chart-container">
                  {cropProductionData.length > 0 && cropTypes.length > 0 ? (
                    <div className="modern-bar-chart">
                      <div className="chart-grid-modern">
                        {[1.0, 0.8, 0.6, 0.4, 0.2, 0.0].map((ratio, index) => {
                          const value = Math.round(maxProduction * ratio)
                          return (
                            <div key={index} className="grid-line-modern" style={{ bottom: `${ratio * 100}%` }}>
                              <span className="grid-label-modern">
                                {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      <div className="bars-container">
                        {cropProductionData.map((data, index) => (
                          <div key={index} className="bar-wrapper">
                            <div className="stacked-bars">
                              {cropTypes.map((type, typeIndex) => {
                                const value = data[type] || 0
                                const height = (value / maxProduction) * 100

                                return (
                                  <div
                                    key={typeIndex}
                                    className="modern-bar-stacked"
                                    style={{
                                      height: `${Math.max(height, value > 0 ? 3 : 0)}%`,
                                      backgroundColor: cropColors[type] || "#4CAF50",
                                    }}
                                    title={`${type}: ${value.toLocaleString("pt-BR")} kg`}
                                  ></div>
                                )
                              })}
                            </div>
                            <span className="modern-bar-label">{data.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-graph-up text-muted" style={{ fontSize: "3rem" }}></i>
                      <p className="text-muted mt-2">Nenhuma produção registrada</p>
                    </div>
                  )}
                  <div className="crop-chart-legend">
                    {cropTypes.map((type, index) => (
                      <div key={index} className="crop-legend-item">
                        <span
                          className="crop-legend-color"
                          style={{ backgroundColor: cropColors[type] || "#4CAF50" }}
                        ></span>
                        <span>{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  )
}
