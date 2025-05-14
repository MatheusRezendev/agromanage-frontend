import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3">
      <Container>
        <small>© {new Date().getFullYear()} AgroManage. Todos os direitos reservados.</small>
      </Container>
    </footer>
  );
}
