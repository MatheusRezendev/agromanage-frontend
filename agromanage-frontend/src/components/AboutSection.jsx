import { Container, Row, Col } from 'react-bootstrap';
import '../App.css'
export default function AboutSection() {
  return (
    <section id="about" className="py-5 bg-light">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h2 className="title-about">Sobre nós</h2>
            <p className="fs-5">
              O <strong>AgroManage</strong> nasceu com a missão de empoderar o agricultor familiar — protagonista de uma das maiores riquezas do Brasil. 
            </p>
            <p className="fs-5">
              Combinamos <strong>tecnologia acessível</strong> e <strong>gestão inteligente</strong> para facilitar o controle financeiro, o planejamento das lavouras e a tomada de decisões estratégicas no campo.
            </p>
            <p className="fs-5">
              Acreditamos que quando o pequeno produtor prospera, toda a economia local cresce. Nosso compromisso é gerar <strong>impacto social positivo</strong> por meio da inovação.
            </p>
          </Col>
          <Col md={6}>
            <img 
              src="/src/assets/about-img.png" 
              alt="Agricultores usando tecnologia no campo"
              className="img-about img-fluid rounded shadow"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}