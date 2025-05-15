"use client"

import { Container, Navbar, Nav, Button } from "react-bootstrap"
import { Link, useLocation, useNavigate } from "react-router-dom"
import "bootstrap-icons/font/bootstrap-icons.css"
import { useEffect, useState } from "react"

export default function NavbarComponent() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Verificar se o usuário está logado
    const currentUser = JSON.parse(localStorage.getItem("agromanage_currentUser") || "{}")
    setIsLoggedIn(currentUser.isLoggedIn || false)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem("agromanage_currentUser")
    setIsLoggedIn(false)
    navigate("/login")
  }

  // Verificar se estamos na página de dashboard
  const isDashboard = location.pathname === "/dashboard"

  return (
    <Navbar bg="success" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="title-navbar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="white"
            className="bi bi-leaf-fill text-success fs-4"
            viewBox="0 1 20 20"
          >
            <path d="M1.4 1.7c.217.289.65.84 1.725 1.274 1.093.44 2.885.774 5.834.528 2.02-.168 3.431.51 4.326 1.556C14.161 6.082 14.5 7.41 14.5 8.5q0 .344-.027.734C13.387 8.252 11.877 7.76 10.39 7.5c-2.016-.288-4.188-.445-5.59-2.045-.142-.162-.402-.102-.379.112.108.985 1.104 1.82 1.844 2.308 2.37 1.566 5.772-.118 7.6 3.071.505.8 1.374 2.7 1.75 4.292.07.298-.066.611-.354.715a.7.7 0 0 1-.161.042 1 1 0 0 1-1.08-.794c-.13-.97-.396-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.124-.887-1.889-2.095-2.39-3.383-1-2.562-1-5.536-.65-7.28L.73.806z" />
          </svg>{" "}
          AgroManage
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {!isDashboard ? (
            <>
              <Nav className="mx-auto">
                <Nav.Link href="#about" className="opt-navbar">
                  Sobre nós
                </Nav.Link>
                <Nav.Link href="#culture" className="opt-navbar">
                  Cultura
                </Nav.Link>
                <Nav.Link href="#how" className="opt-navbar">
                  Como ajudamos
                </Nav.Link>
                <Nav.Link href="#benefits" className="opt-navbar">
                  Benefícios
                </Nav.Link>
                <Nav.Link href="#plans" className="opt-navbar">
                  Planos
                </Nav.Link>
              </Nav>
              <Nav className="ms-auto">
                {isLoggedIn ? (
                  <>
                    <Nav.Link as={Link} to="/dashboard">
                      <Button variant="light" className="px-4">
                        Meu Painel
                      </Button>
                    </Nav.Link>
                    <Nav.Link onClick={handleLogout}>
                      <Button variant="" className="opt-navbar">
                        Sair
                      </Button>
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login">
                      <Button variant="light" className="px-4">
                        Login
                      </Button>
                    </Nav.Link>
                    <Nav.Link as={Link} to="/cadastrar">
                      <Button variant="" className="opt-navbar">
                        Cadastrar-se
                      </Button>
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link onClick={handleLogout}>
                <Button variant="light" className="px-4">
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Sair
                </Button>
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
