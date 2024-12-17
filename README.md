# Teste técnico Advice Health

## Uso

Para iniciar a aplicação, execute:

`npm run build`

Espere a aplicação terminar o build, execute:
`npm run start`

A aplicação estará disponível em `http://localhost:3000`.

## Descrição

Este projeto foi desenvolvido utilizando **Next.js** como framework de React. O **Bootstrap** foi utilizado principalmente para a construção dos grids do layout, enquanto o **Material UI** foi empregado para os componentes. A aplicação oferece suporte a telas Full HD, HD e tablets; abaixo dessas resoluções, a experiência do usuário pode cair drasticamente.

Para semear a aplicação com dados, estou utilizando um **json-server**, e no front-end estou consumindo os dados através do **React Query**. A escolha pelo React Query se deve ao fato de que, em alguns momentos, ele é utilizado como gerenciador de estados, como na terceira tela, onde preciso realizar um refetch de uma query em um componente que não está vinculada ou dependendo dessa query. Sempre que possível, transmiti o refetch diretamente para manter uma única fonte de verdade, mas é importante ter a flexibilidade que o React Query proporciona.

## Como Funciona a Aplicação

### Tela Inicial

A primeira tela é bem simples e apresenta alguns números estatísticos de acordo com a data selecionada. A caixinha com os médicos leva o usuário para a página de agendamento com o médico já selecionado, além de exibir uma tabela com os agendamentos do dia escolhido e a possibilidade de acessar diretamente a página daquele agendamento ao clicar na linha. O layout também conta com um menu simples que se esconde, contendo alguns ícones para navegação e um tooltip para acessibilidade.

### Página de Agendamento

A segunda página, a página de agendamento, é o coração da aplicação. Nela, você pode selecionar a data e o médico e realizar agendamentos, editar, transferir e excluir agendamentos, além de fazer pagamentos e atendimentos.

> **Disclaimer 1**: A rotina de pagamento e atendimento não é ideal; atualmente, há apenas um botão para pagar ou agendar. Isso não seria funcional em produção. Entretanto, a falta de um backend robusto gera impedimentos para a criação de um sistema de pagamento real. Gerenciar múltiplas relações sem um banco de dados robusto, como geralmente se vê em entidades de pagamento, criaria uma complexidade muito grande para a aplicação e preferi evitar.

### Página Administrativa

Na terceira página, imaginei que essa seria uma espécie de página administrativa, permitindo verificar todos os agendamentos. Nela é possível filtrar por pesquisa e aplicar filtros avançados como pagamento, atendimento, médico e data.

## Tecnologias Utilizadas

- Next.js
- Bootstrap
- Material UI
- json-server
- React Query

## Instalação

Instruções sobre como instalar e configurar o projeto:

1. Clone o repositório:
git clone https://github.com/usuario/nome-do-repositorio.git
text
2. Navegue até o diretório do projeto:
cd nome-do-repositorio
text
3. Instale as dependências:
npm install
text

## Uso

Para iniciar a aplicação, execute:

`npm run build`

Espere a aplicação terminar o build, execute:
`npm run start`

A aplicação estará disponível em `http://localhost:3000`.

## Feedback
Feedbacks sao bem vindos, abra uma issue para que eu possa melhorar a aplicação e como desenvolver!

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
