# Como Exportar e Hospedar o Site na HostGator

O Achar Temas agora está projetado para ser **completamente estático** e compatível com as hospedagens como a HostGator, descartando qualquer necessidade de banco de dados ou backend, com exceção do Firebase que funciona via lado do cliente (client-side) e roda em qualquer lugar.

Siga os passos abaixo para exportar seu projeto e colocá-lo na HostGator.

## 1. Exportar e Fazer o Build do Projeto
1. Aqui na plataforma Google AI Studio, vá no menu principal do projeto.
2. Selecione a opção para exportar arquivos (Export as ZIP).
3. Após extrair, você precisará gerar o build super otimizado do site.
4. Caso tenha Node.js instalado no seu PC:
   - Abra o terminal na pasta do projeto e execute `npm install`.
   - Após a instalação, rode o comando de build: `npm run build`.
   - Será gerada uma pasta chamada `dist/`. **Esta é a única pasta que você precisará subir para o seu servidor**. Todos os códigos otimizados, arquivos `.htaccess` e imagens estarão lá.

> **Importante:** Se quiser hospedar em um subdiretório (por exemplo, `meusite.com/blog`), será necessário alterar nas opções de build ou no `src/App.tsx` para garantir que o caminho comece com o subdiretório. Se for hospedar na raiz (no domínio principal `achartemas.com`), nenhuma configuração a mais precisa ser feita.

## 2. Preparar e Fazer Upload na HostGator
1. Acesse o **cPanel** da sua conta na HostGator.
2. Navegue até o **Gerenciador de Arquivos** e abra a pasta do seu domínio (geralmente será a **public_html**).
3. Apague qualquer página principal padrão que tiver dentro dessa pasta (como o arquivo `default.html` da Hostgator).
4. Pege o **conteúdo que está dentro da pasta `dist/` gerada** (e não a própria pasta "dist", mas sim os arquivos estáticos como o `index.html`, `assets/`, `wp-images/` e o `.htaccess`) e faça o **Upload** diretamente para dentro da pasta `public_html`.

**E pronto! Seu site já estará online!**

## 3. Considerações do Servidor HostGator

- Nós incluímos automaticamente um arquivo `.htaccess` configurado à sua distribuição (dentro de `public/.htaccess`). Esse arquivo garante 3 otimizações principais:
  1. Que **todas as páginas e links direcionam e funcionem corretamente** no React sem mostrar o temido "Erro 404".
  2. Implementa **Compressão GZIP** para o carregamento do site na HostGator ficar instantâneo (economizando até 70% de dados da rede).
  3. Adiciona um sistema de cache poderoso no lado do navegador, garantindo notas mais altas em ferramentas de análise como o **Google PageSpeed**.

## 4. O Autenticador Firebase Vai Continuar Funcionando?
Sim. O Firebase funciona do lado do cliente e roda em qualquer estrutura HTML (não exige servidores NodeJS ou afins). Ele vai rodar perfeitamente na HostGator.
A única ressalva é que se você ainda não incluiu seu domínio da HostGator (por exemplo, `achartemas.com`) na **Rede de Autorização do Firebase**, ele recusará novos acessos por segurança técnica.
- Como liberar o link? Acesse o console do **[Firebase (seção Authentication -> Settings -> Authorized Domains)](console.firebase.google.com)** e adicione o seu domínio oficial lá (`achartemas.com`).
