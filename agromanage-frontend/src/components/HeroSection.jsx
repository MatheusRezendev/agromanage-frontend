import { Container, Button } from 'react-bootstrap';
import '../App.css'

export default function HeroSection() {
  return (
    <section className="hero-section text-center bg-light py-5">
      <div className='hero-content'>
      <Container>
      <h1 className="display-3">
        Mais gestão. 
      </h1>
      <h1 className="display-3">
        Mais resultados no campo.
      </h1><br></br>
      <p className="lead">
        O <strong>AgroManage</strong> é o parceiro digital do agricultor familiar <br></br>Controle financeiro, planejamento de lavouras e decisões inteligentes.
      </p><br></br>
      <p className="lead">— porque quem move o Brasil merece crescer com eficiência..</p>
      </Container>
      <Button variant="success" size="lg" className='btn-descubra'>
        Descubra o AgroManage
      </Button>
      </div>
    </section>
  );
}