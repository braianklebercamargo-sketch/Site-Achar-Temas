# Guia de Migração para cPanel / WordPress

Para usar este Aplicativo feito em React diretamente no seu domínio utilizando o WordPress em sua hospedagem (HostGator ou cPanel), siga estas etapas cuidadosamente.

## Etapa 1: Instalar o WordPress no seu cPanel

1. Acesse sua conta e faça login no **cPanel** da sua hospedagem.
2. Com o cPanel aberto, localize a seção **"Softaculous Apps Installer"** ou **"Instalador de Aplicativos"** e clique no ícone do **WordPress**.
3. Clique no botão **"Instalar Agora" (Install Now)**.
4. **Configuração da Instalação:**
   - **Choose Installation URL:** Selecione o protocolo (preferencialmente `https://`) e escolha seu domínio (`achartemas.com.br`). *Importante: Se você quiser que o site abra direto no seu domínio, deixe o campo `In Directory` (Diretório) VAZIO.*
   - **Configurações do Site:** Crie o Nome e a Descrição do site.
   - **Conta de Administrador:** Defina um Nome de Usuário (admin), uma Senha forte e o Email do Administrador. Memorize esses dados para fazer login!
   - Clique no botão **"Instalar"** no final da página.
5. Após concluir, você pode acessar seu painel do WordPress através do link informado, geralmente `https://achartemas.com.br/wp-admin/`.

## Etapa 2: Gerar o Arquivo do Tema React e enviá-lo

Este repositório contém os seus arquivos e scripts configurados para gerar um "Tema WordPress".

Nós deixamos o arquivo `achar-temas.zip` já pronto (se ainda não existir, você pode baixá-lo pelas Opções aqui no AI Studio via Download).

## Etapa 3: Instalar e Ativar o Tema no WordPress

Há duas maneiras de enviar o arquivo `achar-temas.zip`: **Via Painel do WP** ou **Via cPanel**.
A maneira mais fácil e recomendada:

**Via Painel do WordPress (Mais fácil)**
1. Acesse o painel Administrador do seu WordPress (`https://achartemas.com.br/wp-admin/`).
2. No menu esquerdo vá em **Aparência -> Temas**.
3. Clique no botão **Adicionar Novo Tema** e logo a seguir em **Enviar Tema**.
4. Faça o upload do arquivo `achar-temas.zip`.
5. Após o envio ser concluído, clique no botão **Ativar**.

**Via cPanel (Como Alternativa)**
1. Entre no **Gerenciador de Arquivos** no cPanel.
2. Navegue até a pasta de instalação do seu WordPress (geralmente `public_html`).
3. Entre nos diretórios: `wp-content` -> `themes`.
4. Clique no botão **Carregar (Upload)** no topo e selecione o arquivo `achar-temas.zip`.
5. Volte para a pasta `themes`, clique com o botão direito no arquivo `achar-temas.zip` recém enviado e escolha **Extrair (Extract)**. Isso criará a pasta `achar-temas`.
6. Retorne ao seu Painel do WordPress (`wp-admin`), vá em **Aparência -> Temas** e clique em **Ativar** no "Achar Temas".

## Etapa 4: Como Fazer o Upload de Imagens do Tema / Dados 

Como utilizamos as imagens mockadas locais que foram processadas no React para a pasta `/wp-images/` ou `/regenerated_...png`, você tem duas opções para mantê-las vivas no novo servidor:

**Copiando as imagens locais públicas para a raiz do seu site no cPanel**
1. Entre no cPanel -> **Gerenciador de Arquivos**.
2. Vá até a pasta do seu site (geralmente `public_html`).
3. Crie uma pasta chamada `wp-images`.
4. Faça o upload de todas as imagens que estão na pasta `public/wp-images` local deste repositório direto para dentro dessa pasta no seu Host.
5. Faça o upload dos arquivos `regenerated_image_XXXXX.png` que estão na pasta `public/` diretamente para a raiz do seu Hospedeiro (`public_html`). 

Pronto! Ao carregar seu site, o roteamento do React assumirá o controle da página de seu WordPress e trará seu site maravilhoso, unindo todo o conteúdo!
