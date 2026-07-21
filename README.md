# Igreja Nossa Senhora do Perpétuo Socorro e São Judas Tadeu

Site institucional da Igreja Nossa Senhora do Perpétuo Socorro e São Judas Tadeu, em Nova Iguaçu — RJ.

O projeto reúne informações sobre a comunidade, endereços das igrejas e capelas, mídias, formas de contato e doações. A interface utiliza HTML, CSS e JavaScript puro, sem frameworks, e está configurada para hospedagem no Firebase.

## Tecnologias

- HTML5;
- CSS3;
- JavaScript com ES Modules;
- Firebase Hosting;
- Cloud Functions for Firebase;
- Cloud Firestore;
- Node.js 24 nas Cloud Functions.

## Páginas

| Rota | Conteúdo |
| --- | --- |
| `/` | Página inicial |
| `/capelas` | Endereços, cards e mapas das igrejas e capelas |
| `/midias` | Pesquisa e listagem de mídias |
| `/doacoes` | Informações para doação |
| `/contato` | WhatsApp e redes sociais |
| `/midias/artigos/...` | Artigos publicados |
| `/midias/video` | Exibição de vídeos |
| `/404.html` | Página personalizada para rotas inexistentes |

Não existe atualmente uma página exclusiva para horários. Os links de horários direcionam para `/capelas`.

## Estrutura do projeto

```text
.
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── functions/
│   ├── index.js
│   └── package.json
└── public/
    ├── components/
    │   ├── header.html
    │   └── footer.html
    ├── src/
    │   ├── data/
    │   ├── images/
    │   ├── scripts/
    │   └── styles/
    ├── capelas/
    ├── contato/
    ├── doacoes/
    ├── midias/
    └── index.html
```

O header e o footer são componentes compartilhados. Eles são carregados em todas as páginas por `public/src/scripts/components.js`, usando caminhos absolutos a partir da raiz do Hosting.

## Executando localmente

### Pré-requisitos

- Node.js 24;
- npm;
- Firebase CLI.

Instale as dependências das Cloud Functions:

```bash
npm install --prefix functions
```

Caso o Firebase CLI ainda não esteja instalado:

```bash
npm install --global firebase-tools
```

Autentique-se no Firebase quando necessário:

```bash
firebase login
```

Inicie os emuladores a partir da raiz do projeto:

```bash
firebase emulators:start --only hosting,functions,firestore
```

O projeto Firebase configurado em `.firebaserc` é `igrejaperpetuosocorro-bdb7d`.

Para uma conferência exclusivamente visual das páginas estáticas, também é possível servir a pasta `public` com um servidor HTTP local. Abrir os arquivos diretamente com `file://` não é recomendado, pois os componentes compartilhados são carregados com `fetch`.

## Componentes compartilhados

- `public/components/header.html`: barra superior, identidade, menu desktop e menu mobile;
- `public/components/footer.html`: identidade institucional, links, endereço e redes sociais;
- `public/src/scripts/components.js`: carregamento dos componentes e identificação da rota ativa;
- `public/src/styles/components.css`: estilos compartilhados do header e do footer;
- `public/src/styles/site-pages.css`: base visual das páginas internas.

Ao adicionar uma página, inclua:

```html
<link rel="stylesheet" href="/src/styles/components.css">
<script type="module" src="/src/scripts/components.js"></script>
```

E os pontos de montagem:

```html
<div id="site-header"></div>

<main>
    <!-- Conteúdo da página -->
</main>

<div id="site-footer"></div>
```

## Dados das igrejas e capelas

Os nomes, endereços e links dos mapas são mantidos em:

```text
public/src/data/locations.js
```

Esse arquivo é consumido por `public/src/scripts/capelas.js`. Para evitar divergências, alterações de endereço devem ser feitas na fonte de dados, e não diretamente nos cards gerados.

## Firebase e segurança

As regras atuais do Firestore adotam negação por padrão:

```text
allow read, write: if false;
```

Nenhuma coleção está liberada para clientes e o frontend ainda não consulta o Firestore. Regras específicas deverão ser criadas somente depois da aprovação da modelagem de dados e da estratégia de autenticação.

Não adicione credenciais, arquivos de conta de serviço ou variáveis de ambiente ao repositório. Os padrões correspondentes já estão no `.gitignore`.

## Estado atual e limitações

- A próxima missa usa uma mensagem temporária;
- A seção de eventos exibe um estado vazio;
- Ainda não existem coleções para missas, eventos ou horários;
- As Functions `busca` e `video` são endpoints provisórios e retornam dados vazios;
- A área de mídias ainda contém arquivos PHP/MySQL legados. O Firebase Hosting não executa PHP, portanto essa integração deverá ser migrada antes de funcionar integralmente no ambiente Firebase;
- Não há painel administrativo ou Firebase Authentication implementados.

## Boas práticas para alterações

- Manter o código em inglês e o conteúdo do site em português;
- Não adicionar frameworks sem discussão prévia;
- Reutilizar header, footer, paleta e containers compartilhados;
- Utilizar caminhos absolutos, como `/src/images/...`, para recursos públicos;
- Não inserir dados fictícios de missas, eventos, contatos ou doações;
- Não alterar regras do Firestore sem revisar o impacto de segurança;
- Testar desktop e mobile antes de enviar alterações;
- Não incluir segredos ou dados sensíveis em commits.

## Deploy

O deploy modifica o ambiente remoto e deve ser executado somente por uma pessoa autorizada, após revisão das alterações.

```bash
firebase deploy
```

Para publicar partes específicas, utilize os seletores do Firebase CLI, por exemplo:

```bash
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

