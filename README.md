# SolarFlow — Cadastro Técnico (CAD_TEC)

Aplicativo PWA (offline-first) para cadastro técnico de projetos fotovoltaicos, com geração de PDF no padrão visual da marca **SolarFlow**.

## Estrutura

```
index.html            Tela de login e formulário de cadastro
style.css             Estilos com a paleta de cores SolarFlow
app.js                Lógica do app e geração do PDF (jsPDF)
service-worker.js     Cache offline (PWA)
manifest.webmanifest  Configuração do PWA (nome, ícones, tema)
assets/logo.png       Logo usada no cabeçalho e no PDF
icons/icon-192.png    Ícone do app (192x192)
icons/icon-512.png    Ícone do app (512x512)
```

## Paleta de cores

| Cor | Hex |
|---|---|
| Navy escuro | `#0D1B2A` |
| Navy | `#1B263B` |
| Amarelo | `#F4C430` |
| Azul claro | `#5DADE2` |
| Verde (uso pontual) | `#28A745` |
| Cinza claro | `#F2F2F2` |

## Como publicar no GitHub Pages

1. Crie um repositório e envie todos os arquivos desta pasta para a raiz (ou para `/docs`).
2. Em **Settings → Pages**, selecione a branch e a pasta onde os arquivos estão.
3. Acesse a URL gerada pelo GitHub Pages — o app funciona offline após o primeiro carregamento (PWA).

## Código de acesso

O código de acesso padrão é `1234`, definido em `app.js` (constante `ACCESS_CODE`). Altere conforme necessário antes de publicar.

## Funcionalidades

- Login com código de acesso.
- Cadastro de dados do cliente (nome, telefone, email, CPF, RG).
- Campos separados para **Inversor** (modelo + quantidade) e **Módulo** (modelo + quantidade).
- Campos separados para **Disjuntor do PDE** (corrente + tipo mono/bi/trifásico) e **Disjuntor do Inversor** (corrente + tipo).
- Upload de anexos: RG e CPF, Conta de energia (geradora), Conta de energia beneficiária (se houver), Documento do imóvel.
- Geração de PDF com identidade visual SolarFlow: cabeçalho com logo, seções organizadas e cada anexo em página própria com título identificando o tipo de documento.
- Compressão automática de imagens antes de inserir no PDF.
- Funciona offline como Progressive Web App (PWA).
