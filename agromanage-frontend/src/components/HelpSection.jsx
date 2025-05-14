import { Container, Row, Col, Card } from 'react-bootstrap';
import '../App.css'

export default function HelpSection() {
  return (
    <section id="how" className="bg-light py-5">
      <Container>
        <h2 className="text-center mb-5 how-title">Como o AgroManage ajuda</h2>
        <Row className="g-4">
          <Col md={6} lg={3}>
            <Card className="text-center shadow-lg border-0 h-100">
              <Card.Body>
                <i className="bi bi-flower2 text-success mb-3" style={{ fontSize: '2rem' }}></i>
                <Card.Title>Controle de lavouras</Card.Title>
                <Card.Text>Organize e acompanhe cada etapa do cultivo com precisão.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="text-center shadow-lg border-0 h-100">
              <Card.Body>
                <i className="bi bi-cash-coin text-success mb-3" style={{ fontSize: '2rem' }}></i>
                <Card.Title>Gestão financeira</Card.Title>
                <Card.Text>Registre receitas, despesas e visualize seu lucro com facilidade.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="text-center shadow-lg border-0 h-100">
              <Card.Body>
                <i className="bi bi-bar-chart-fill text-success mb-3" style={{ fontSize: '2rem' }}></i>
                <Card.Title>Relatórios inteligentes</Card.Title>
                <Card.Text>Obtenha insights visuais para melhorar suas decisões no campo.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="text-center shadow-lg border-0 h-100">
              <Card.Body>
                <i className="bi bi-phone-fill text-success mb-3" style={{ fontSize: '2rem' }}></i>
                <Card.Title>Acesso em qualquer lugar</Card.Title>
                <Card.Text>Utilize o sistema em dispositivos móveis e desktop, onde estiver.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}