import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import '../App.css'

export default function PlansSection() {
  return (
    <section id="plans" className="py-5">
      <Container>
        <h2 className="text-center mb-5 title-plans">Escolha o plano ideal</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="plan-card text-center">
              <Card.Body>
                <Card.Title className="plan-title">Gratuito</Card.Title>
                <p className="plan-price text-success">R$ 0</p>
                <Card.Text>Ideal para começar. Controle básico de lavouras.</Card.Text>
                <Button variant="outline-success" className="plan-button">Começar grátis</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="plan-card text-center plan-featured">
              <Card.Body>
                <Badge bg="success" className="plan-badge mb-3">Mais popular</Badge>
                <Card.Title className="plan-title">Básico</Card.Title>
                <p className="plan-price text-success">R$ 19,90/mês</p>
                <Card.Text>Inclui gestão financeira e relatórios.</Card.Text>
                <Button variant="success" className="plan-button">Assinar</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="plan-card text-center">
              <Card.Body>
                <Card.Title className="plan-title">Profissional</Card.Title>
                <p className="plan-price text-success">R$ 39,90/mês</p>
                <Card.Text>Todas funcionalidades + suporte completo.</Card.Text>
                <Button variant="success" className="plan-button">Assinar</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
