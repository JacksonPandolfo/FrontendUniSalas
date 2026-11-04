# UniSalas · Frontend

Interface web do UniSalas, sistema de reserva de salas acadêmicas desenvolvido por Jackson Pandolfo como trabalho de conclusão de curso. Um professor pode solicitar uma sala para uma aula ou evento, informar quantas pessoas vão participar e indicar os recursos necessários. A equipe de atendimento recebe a solicitação, consulta os espaços e decide qual sala alocar.

O frontend usa **Next.js 15 (App Router), React 19 e TypeScript**. O calendário usa FullCalendar e a interface combina Tailwind CSS e Bootstrap. Os dados de usuários, espaços e reservas vêm da [API do UniSalas](https://github.com/JacksonPandolfo/BackendUniSalas).

## Como uma reserva funciona

1. O solicitante acessa `/reservas/agendamento` e informa o tipo de evento, o período, o número de participantes e as necessidades de acessibilidade, equipamentos e mobiliário. A reserva pode ser esporádica ou recorrente.
2. O sistema registra a solicitação como pendente e atribui um aprovador de atendimento ou administração, diferente do solicitante.
3. No painel `/home`, o aprovador seleciona uma sala para aprovar o pedido. O solicitante acompanha o status no mesmo painel. As reservas aprovadas aparecem no calendário da sala.

| Área | Quem acessa | O que encontra |
| --- | --- | --- |
| `/home` | Usuário autenticado | Solicitações próprias e pedidos atribuídos para aprovação |
| `/reservas` | Usuário autenticado | Calendário de reservas da sala selecionada |
| `/espacos` | Atendimento e administração | Navegação por setor, bloco e sala, com os eventos do dia |
| `/gerenciamento` | Administração | Gestão dos espaços e dos usuários |

## Executar localmente

Use Node.js 22 e npm. Primeiro, siga as [instruções do backend](https://github.com/JacksonPandolfo/BackendUniSalas#executar-localmente) para preparar o PostgreSQL e iniciar a API.

```bash
git clone https://github.com/JacksonPandolfo/FrontendUniSalas.git
cd FrontendUniSalas
npm ci
```

Crie um arquivo `.env.local` na raiz do frontend:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
JWT_SECRET=cole_aqui_o_mesmo_segredo_do_backend
```

O Next.js encaminha as chamadas de `/api` ao backend e recebe dele o cookie de sessão. O middleware usa `JWT_SECRET` para validar esse cookie. Se as chaves forem diferentes, o usuário pode voltar para a tela de login logo após se autenticar.

```bash
npm run dev
```

Abra [localhost:3000/login](http://localhost:3000/login). Para o primeiro acesso, use [o cadastro](http://localhost:3000/cadastro). O formulário acrescenta `@unisinos.br` ao identificador informado. No login, digite o e-mail completo.

### Experimentar o fluxo

Em um banco de demonstração, cadastre duas contas distintas, uma como **Ministrante** e outra como **Atendimento**. Prepare ao menos um setor, um bloco e uma sala no backend. Com a primeira conta, envie uma solicitação. Com a segunda, abra o painel inicial para analisar o pedido. Se houver vários aprovadores, o sistema escolhe um deles aleatoriamente.

## Onde fica cada parte

| Caminho | Responsabilidade |
| --- | --- |
| [src/app](src/app) | Páginas e navegação do App Router |
| [src/app/api](src/app/api) | Rotas do Next.js que recebem as chamadas da interface |
| [src/lib/api](src/lib/api) | Funções usadas pelas telas para acessar essas rotas |
| [src/components](src/components) | Calendário, seleção de sala, cartões e ações de reserva |
| [src/middleware.ts](src/middleware.ts) | Validação da sessão e acesso às áreas por cargo |

## Estado do build

O comando de produção é `npm run build`. Na versão analisada, a verificação de tipos interrompe o build porque a propriedade `isOpen` de [ConfirmarAcao](src/components/modalConfirmacao/index.tsx) tem tipo `any` implícito. Em desenvolvimento, a página de login renderiza, mas o Next.js também registra um erro no [componente da página 404](src/app/not-found.tsx), que passa um manipulador de clique a um link a partir de um Server Component.
