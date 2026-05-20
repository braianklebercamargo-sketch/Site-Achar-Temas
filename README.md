# Achar Temas

**Achar Temas** é um hub de curadoria artística e cultural imersiva. Explore temas semanais com contexto histórico, galerias de arte e experiências sonoras.

## 🚀 Sobre o Projeto

Este projeto foi construído usando as mais modernas tecnologias web para entregar uma experiência fluída, rápida e altamente imersiva. Cada categoria nos convida a explorar tópicos variados (como Cultura Pop, Arte, Ciência, História, e mais), oferecendo uma rica galeria e um portal de conhecimento acessível.

A aplicação também conta com uma ferramenta de conversão para "Tema WordPress", permitindo que você exporte o design criado e hospede-o diretamente através do arquivo gerado (`achar-temas.zip`).

## 🛠 Tecnologias e Ferramentas

*   **React 19 & TypeScript**: Componentização moderna com tipagem estática.
*   **Vite**: Ferramenta de build super rápida e otimizada.
*   **Tailwind CSS 4**: Utilizado para estilo e responsividade da interface.
*   **Motion**: Transições suaves e animações.
*   **Lucide React**: Biblioteca robusta de ícones vetoriais em estilo "Clean".

## 📁 Estrutura de Arquivos Principal

*   `src/`: Contém todo o código-fonte da aplicação React.
    *   `src/App.tsx`: Ponto de entrada do componente principal.
    *   `src/data/`: Diretório contendo dados dos posts (`posts.json`).
*   `public/`: Arquivos estáticos e imagens do tema (incluindo imagens do WordPress e arquivos autogerados).
*   `achar-temas/`: Diretório base contendo o template inicial para o seu Tema de WordPress.
*   `build_theme_zip.js`: Script NodeJS que empacota o Frontend e cria o arquivo `achar-temas.zip` automaticamente para upload no painel ou cPanel.
*   `Guia_Migracao_cPanel_WordPress.md`: Instruções de upload do site em ambientes como HostGator / cPanel e como ativar o tema WordPress.

## ⚙️ Instalação e Scripts Locais

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Gere a versão de produção da sua aplicação (SPA Dist):

```bash
npm run build
```

Para gerar o Tema do WordPress pronto, empacotando-o em um arquivo .ZIP:

```bash
node build_theme_zip.js
```

## 📜 Hospedagem (cPanel / WordPress)

Se você tem a intenção de levar toda sua aplicação pronta ao seu próprio domínio e servidor base, nós criamos um pequeno tutorial dentro deste repositório. Consulte o [Guia de Migração para cPanel / WordPress](./Guia_Migracao_cPanel_WordPress.md) constando lá para detalhes práticos.

## 🌟 Destaques

*   Layout responsivo e imersivo "Desktop-First e Mobile-First";
*   Categorização dinâmica e interativa;
*   Renderização inteligente de galerias usando as suas próprias imagens do projeto;
*   Script de conversão robusto para ambientes tradicionais PHP (WordPress).

---

© 2024–2026 **Achar Temas** — *Por Neverson Camargo*
