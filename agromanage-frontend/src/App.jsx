import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, Button, Row, Col, Card } from 'react-bootstrap';

function App() {
  return (
    <>
      {/* Navbar */}
      <Navbar bg="light" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="#home">AgroManage</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#about">Sobre nós</Nav.Link>
              <Nav.Link href="#culture">Cultura</Nav.Link>
              <Nav.Link href="#how">Como ajudamos</Nav.Link>
              <Nav.Link href="#benefits">Benefícios</Nav.Link>
              <Nav.Link href="#plans">Planos</Nav.Link>
              <Nav.Link href="#login">Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section className="text-center bg-light py-5" style={{ marginTop: '75px' }}>
        <Container>
          <h1 className="display-4">Transforme sua gestão agrícola com tecnologia</h1>
          <p className="lead">AgroManage ajuda pequenos produtores com controle, visão e praticidade.</p>
          <Button variant="success" size="lg">Conheça os planos</Button>
        </Container>
      </section>

      {/* Sobre nós */}
      <section id="about" className="py-5">
        <Container>
          <h2>Sobre nós</h2>
          <p>Somos apaixonados por tecnologia e agricultura familiar. Nosso objetivo é facilitar a gestão do campo com ferramentas simples e eficazes.</p>
        </Container>
      </section>

      {/* Cultura da empresa */}
      <section id="culture" className="bg-light py-5">
        <Container>
          <h2>Cultura da empresa</h2>
          <p>Valorizamos a sustentabilidade, a colaboração com pequenos produtores e o desenvolvimento contínuo de soluções digitais no campo.</p>
        </Container>
      </section>

      {/* Como ajudamos */}
      <section id="how" className="py-5">
        <Container>
          <h2>Como o AgroManage ajuda</h2>
          <Row>
            <Col md={3}><Card body>Controle de lavouras</Card></Col>
            <Col md={3}><Card body>Gestão financeira simples</Card></Col>
            <Col md={3}><Card body>Relatórios inteligentes</Card></Col>
            <Col md={3}><Card body>Acesso em qualquer lugar</Card></Col>
          </Row>
        </Container>
      </section>

      {/* Benefícios */}
      <section id="benefits" className="bg-light py-5">
        <Container>
          <h2>Benefícios</h2>
          <ul>
            <li>Fácil de usar</li>
            <li>Suporte dedicado</li>
            <li>Backup automático</li>
            <li>Funciona no celular e no computador</li>
          </ul>
        </Container>
      </section>

      {/* Planos */}
      <section id="plans" className="py-5">
        <Container>
          <h2>Planos</h2>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Gratuito</Card.Title>
                  <Card.Text>Ideal para começar. Controle básico de lavouras.</Card.Text>
                  <Button variant="outline-success">Começar grátis</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Básico</Card.Title>
                  <Card.Text>Gestão financeira e relatórios por R$19,90/mês.</Card.Text>
                  <Button variant="success">Assinar</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Profissional</Card.Title>
                  <Card.Text>Todas funcionalidades + suporte completo.</Card.Text>
                  <Button variant="success">Assinar</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Rodapé */}
      <footer className="bg-dark text-white text-center py-3">
        <Container>
          <small>© {new Date().getFullYear()} AgroManage. Todos os direitos reservados.</small>
        </Container>
      </footer>
    </>
  );
}

export default App
