# Agromanage Frontend

## 1. Visão Geral do Projeto

O Agromanage é uma aplicação web de gerenciamento agrícola projetada para ajudar produtores rurais a administrar suas operações de forma eficiente. A interface do frontend, construída com React, oferece funcionalidades para gerenciar finanças, funcionários, lavouras e estoque, além de um dashboard central com visualizações de dados importantes.

O projeto foi inicializado usando o template Vite + React e utiliza `react-router-dom` para navegação e `react-bootstrap` para componentização da UI.

## 2. Tecnologias Utilizadas

-   **Framework:** [React](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Roteamento:** [React Router](https://reactrouter.com/)
-   **Componentes de UI:** [React Bootstrap](https://react-bootstrap.github.io/) e [Bootstrap](https://getbootstrap.com/)
-   **Ícones:** [Bootstrap Icons](https://icons.getbootstrap.com/)
-   **Linguagem:** JavaScript (ES6+)

## 3. Estrutura de Arquivos

A estrutura principal do código-fonte está localizada no diretório `src/`:

```
src/
├── assets/         # Imagens, logos e outros arquivos estáticos
├── components/     # Componentes React reutilizáveis
│   ├── AboutSection.jsx
│   ├── BenefitsSection.jsx
│   ├── CropProductivity.jsx
│   ├── CultureSection.jsx
│   ├── DashboardLayout.jsx
│   ├── EmployeeActivities.jsx
│   ├── EmployeeForm.jsx
│   ├── Footer.jsx
│   ├── HelpSection.jsx
│   ├── HeroSection.jsx
│   ├── NavbarComponent.jsx
│   ├── PlansSection.jsx
│   └── Sidebar.jsx
├── pages/          # Componentes que representam as páginas da aplicação
│   ├── CropsPage.jsx
│   ├── DashboardPage.jsx
│   ├── EmployeesPage.jsx
│   ├── FinancesPage.jsx
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── SettingsPage.jsx
│   └── StockPage.jsx
├── App.css         # Estilos globais da aplicação
├── App.jsx         # Componente raiz com a configuração das rotas
├── main.jsx        # Ponto de entrada da aplicação
└── index.css       # Estilos base
```

## 4. Principais Páginas e Componentes

### 4.1. Páginas (`src/pages`)

-   **`LandingPage.jsx`**: A página inicial da aplicação, apresentando o produto para visitantes. É composta por várias seções (`HeroSection`, `AboutSection`, etc.).
-   **`LoginPage.jsx` / `RegisterPage.jsx`**: Páginas para autenticação e registro de novos usuários.
-   **`DashboardPage.jsx`**: O painel principal após o login. Exibe um resumo das operações, incluindo estatísticas de lavouras, receita total e funcionários ativos. Apresenta gráficos de receita mensal e produção por cultura.
-   **`EmployeesPage.jsx`**: Página para gerenciamento de funcionários.
-   **`FinancesPage.jsx`**: Página para controle de transações financeiras (receitas e despesas).
-   **`CropsPage.jsx`**: Página dedicada ao gerenciamento das lavouras.
-   **`StockPage.jsx`**: Página para controle de estoque.
-   **`SettingsPage.jsx`**: Página para configurações do usuário e da conta.

### 4.2. Componentes Reutilizáveis (`src/components`)

-   **`DashboardLayout.jsx`**: Um layout padrão para todas as páginas do dashboard, que inclui o `Sidebar` e a área de conteúdo principal.
-   **`Sidebar.jsx`**: A barra de navegação lateral presente nas páginas do dashboard, permitindo o acesso rápido às diferentes seções da aplicação.
-   **`NavbarComponent.jsx`**: A barra de navegação superior utilizada nas páginas públicas como a `LandingPage`.
-   **`Footer.jsx`**: O rodapé da aplicação.
-   **Componentes da Landing Page**: `HeroSection`, `AboutSection`, `CultureSection`, `HelpSection`, `BenefitsSection`, e `PlansSection` são blocos de conteúdo que compõem a página inicial.

## 5. Gerenciamento de Dados

Atualmente, a aplicação utiliza o `localStorage` do navegador para persistir os dados do usuário, incluindo informações sobre lavouras, transações e funcionários. Os dados são carregados e processados diretamente nos componentes das páginas, como visto em `DashboardPage.jsx`.

---

_Esta documentação foi gerada automaticamente para fornecer um contexto geral do projeto._
