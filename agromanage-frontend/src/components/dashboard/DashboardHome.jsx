import { Row, Col, Card } from "react-bootstrap"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

export default function DashboardHome() {
  // Dados mockados para os gráficos
  const receitaData = [
    { mes: "Jan", receita: 15000 },
    { mes: "Fev", receita: 18000 },
    { mes: "Mar", receita: 22000 },
    { mes: "Abr", receita: 19000 },
    { mes: "Mai", receita: 25000 },
    { mes: "Jun", receita: 28000 },
  ]

  const culturaData = [
    { mes: "Jan", milho: 85, soja: 78, feijao: 92 },
    { mes: "Fev", milho: 88, soja: 82, feijao: 89 },
    { mes: "Mar", milho: 92, soja: 85, feijao: 94 },
    { mes: "Abr", milho: 89, soja: 88, feijao: 91 },
    { mes: "Mai", milho: 94, soja: 91, feijao: 96 },
    { mes: "Jun", milho: 96, soja: 94, feijao: 98 },
  ]

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success mb-0">Dashboard</h2>
        <small className="text-muted">Última atualização: {new Date().toLocaleDateString()}</small>
      </div>

      {/* Cards Resumo */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-flower2 text-success" style={{ fontSize: "1.5rem" }}></i>
                </div>
                <div>
                  <h3 className="mb-0 text-success">12</h3>
                  <p className="text-muted mb-0">Total de Lavouras</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-cash-coin text-primary" style={{ fontSize: "1.5rem" }}></i>
                </div>
                <div>
                  <h3 className="mb-0 text-primary">R$ 127.000</h3>
                  <p className="text-muted mb-0">Receita Total</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-people text-warning" style={{ fontSize: "1.5rem" }}></i>
                </div>
                <div>
                  <h3 className="mb-0 text-warning">8</h3>
                  <p className="text-muted mb-0">Funcionários Ativos</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row className="g-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 pb-0">
              <h5 className="mb-0">Receita por Mês</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={receitaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, "Receita"]} />
                  <Bar dataKey="receita" fill="#198754" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 pb-0">
              <h5 className="mb-0">Desempenho das Culturas (%)</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={culturaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="milho" stroke="#ffc107" strokeWidth={2} />
                  <Line type="monotone" dataKey="soja" stroke="#198754" strokeWidth={2} />
                  <Line type="monotone" dataKey="feijao" stroke="#0d6efd" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
