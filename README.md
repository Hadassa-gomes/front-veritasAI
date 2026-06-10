# VeritasAI Frontend

Interface web da aplicação VeritasAI. Este projeto é o front-end em React que permite ao usuário enviar conteúdos para análise de veracidade em quatro modos:

- `Texto`: cola uma afirmação ou notícia para checagem
- `Link`: envia uma URL para extração e análise do conteúdo
- `Imagem`: faz upload de uma imagem para análise multimodal
- `Histórico`: lista as verificações anteriores salvas no backend

O front se comunica com a API do projeto backend e exibe o veredito, a confiança, o resumo e a análise detalhada retornados pelo servidor.

## Tecnologias

- React 18
- Vite
- React Icons

## Requisitos

- Node.js 18 ou superior
- npm
- Backend do VeritasAI em execução, ou acesso ao endpoint publicado

## Configuração

Por padrão, o front usa a API publicada em:

```bash
https://back-veritasai.onrender.com
```

Se quiser apontar para uma API local, crie um arquivo `.env` na raiz deste projeto com:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Instalação

```bash
npm install
```

## Como rodar

### Ambiente de desenvolvimento

```bash
npm run dev
```

O Vite vai subir a aplicação normalmente em `http://localhost:5173`.

### Build de produção
```bash
npm run build
```

### Pré-visualizar a build


```bash
npm run preview
```

## Como funciona

O fluxo da interface é simples:

1. O usuário escolhe o tipo de conteúdo.
2. O front envia os dados para o backend em uma das rotas:
   - `POST /verify/text`
   - `POST /verify/url`
   - `POST /verify/image`
3. A resposta é exibida com veredito e detalhes da análise.
4. Na aba `Histórico`, o front chama `GET /history`.

## Estrutura principal

- `src/App.jsx`: lógica principal da interface
- `src/main.jsx`: ponto de entrada do React
- `src/index.css`: estilos da aplicação
- `vite.config.js`: configuração do Vite

## Observações

- O upload de imagem usa o nome de campo `file`, exatamente como o backend espera.
- Se a API estiver em outro domínio, verifique se o CORS do backend está liberado.





## VeritasAI Frontend
Web interface for the VeritasAI application. This project is the React front-end that allows users to submit content for truth-checking in four modes:

Texto (Text): paste a statement or news story for checking

Link: submit a URL for content extraction and analysis

Imagem (Image): upload an image for multimodal analysis

Histórico (History): list previous verifications saved in the backend

The front-end communicates with the backend project API and displays the verdict, confidence score, summary, and detailed analysis returned by the server.

## Technologies
React 18

Vite

React Icons

## Requirements
Node.js 18 or higher

npm

VeritasAI Backend running, or access to the published endpoint

Configuration
By default, the front-end uses the published API at:

## Bash


https://back-veritasai.onrender.com
If you want to point to a local API, create a .env file in the root of this project with:

## Snippet de código


VITE_API_BASE_URL=http://localhost:8000

## Installation
Bash


npm install
How to Run
Development Environment
Bash


npm run dev
Vite will start the application, usually at http://localhost:5173.

## Production Build
Bash


npm run build
Preview the Build
Bash


npm run preview
How It Works
The interface workflow is simple:

The user chooses the content type.

## The front-end sends the data to the backend via one of the routes:

POST /verify/text

POST /verify/url

POST /verify/image

The response is displayed with the verdict and analysis details.

## In the Histórico (History) tab, the front-end calls GET /history.

Main Structure
src/App.jsx: main interface logic

src/main.jsx: React entry point

src/index.css: application styles

vite.config.js: Vite configuration

## Notes
The image upload uses the field name file, exactly as the backend expects.

If the API is on a different domain, ensure that CORS is enabled on the backend.


