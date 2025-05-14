import { Container, Row, Col, Card } from 'react-bootstrap';
import '../App.css'

export default function BenefitsSection() {
  return (
    <section id="benefits" className="bg-light py-5">
      <Container>
        <h2 className="benefits-title text-center mb-5">Benefícios de usar o AgroManage</h2>
        <Row className="g-4">
          <Col md={6} lg={4}>
            <Card className="text-center h-100 border-0 shadow-sm">
              <Card.Body>
                <i className="bi bi-ui-checks-grid text-success mb-3" style={{ fontSize: '2rem' }}></i>
                <Card.Title>Fácil de usar</Card.Title>
                <Card.Text>Interface simples e intuitiva, ideal para produtores de todos os perfis.</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="text-center h-100 border-0 shadow-sm">
              <Card.Body>
                <i className="bi bi-headset text-success mb-3" style={{ fontSize: '2rem' }}></i>
                <Card.Title>Suporte dedicado</Card.Title>
                <Card.Text>Equipe pronta para ajudar você sempre que precisar.</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="text-center h-100 border-0 shadow-sm">
              <Card.Body>
                <i className="bi bi-cloud-check-fill text-success mb-3" style={{ fontSize: '2rem' }}></i>
                <Card.Title>Backup automático</Card.Title>
                <Card.Text>Seus dados seguros na nuvem, sempre protegidos.</Card.Text>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </section>
  );
}
