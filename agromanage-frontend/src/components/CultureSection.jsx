import { Container, Row, Col } from 'react-bootstrap';
import '../App.css'

export default function CultureSection() {
  return (
    <section id="culture" className="py-5">
      <Container>
        <h2 className="mb-4">
          <span className="culture-title">Nossa Cultura</span>
        </h2>
        <Row className="gy-4 fs-5">
          <Col md={5}>
            <p>
              Na AgroManage, acreditamos que a agricultura familiar é a força que move o Brasil. Nossa cultura é construída sobre o respeito ao campo, à simplicidade e à inovação com propósito.
            </p><br></br><br></br>
            <p>
              Trabalhamos lado a lado com pequenos produtores, ouvindo suas necessidades e transformando desafios em soluções acessíveis. Valorizamos cada colheita, cada história, cada sonho cultivado com esforço e dedicação.
            </p>
          </Col>
          <Col md={6}>
            <ul className="list-unstyled">
              <li className="mb-4"><i className="bi bi-bandaid-fill text-success me-2"></i><strong> Sustentabilidade:</strong> Desenvolvemos soluções que respeitam o meio ambiente e promovem o uso consciente dos recursos naturais.</li>
              <li className="mb-4"><i className="bi bi-rocket-takeoff-fill text-success me-2"></i><strong>Inovação acessível:</strong> Tecnologia fácil de usar, pensada para quem está no campo e quer resultados práticos.</li>
              <li className="mb-4"><i className="bi bi-activity text-success me-2"></i><strong>Parceria real:</strong> Crescemos junto com os produtores, com empatia e compromisso de longo prazo.</li>
              <li className="mb-4"><i className="bi bi-arrow-through-heart-fill text-success me-2"></i><strong>Orgulho do rural:</strong> Valorizamos a vida no campo e tudo o que ela representa para o futuro do país.</li>
            </ul>
          </Col>
        </Row>
      </Container>
    </section>
  );
}