# Galeria Web

Uma aplicação web moderna para gerenciar e visualizar galerias de imagens com suporte a armazenamento local utilizando IndexedDB.

## 📋 Características

- **Gerenciamento de Imagens**: Adicione, visualize e delete imagens
- **Armazenamento Local**: Utiliza IndexedDB para persistência de dados
- **Seleção Múltipla**: Selecione e delete várias imagens em uma ação
- **Visualização em Banner**: Clique em uma imagem para visualizar em tela cheia
- **Navegação com Gestos**: Use setas do teclado ou gestos de swipe para navegar entre imagens
- **Personalização de Cores**: Altere as cores de fundo e destaque da aplicação
- **Design Responsivo**: Layout adaptável para diferentes tamanhos de tela

## 🗂️ Estrutura do Projeto

```
Galeria-Web/
├── index.html          # Arquivo HTML principal
├── css/
│   └── dom.css         # Estilos da aplicação
└── js/
    ├── main.js         # Lógica principal
    ├── api.js          # Gerenciador de IndexedDB
    └── dom.js          # Manipulação do DOM e interações
```

## 🚀 Como Usar

1. Abra o arquivo `index.html` em um navegador moderno
2. Clique no botão **+** para adicionar imagens
3. Selecione as fotos desejadas e clique em **Carregar Imagens**
4. Para visualizar uma imagem em tela cheia, clique nela
5. Use as setas do teclado (← →) ou gestos de swipe para navegar
6. Pressione **ESC** para fechar a visualização em tela cheia
7. Use **Selecionar tudo** para marcar/desmarcar todas as imagens
8. Clique em **delete** para remover as imagens selecionadas

## 📁 Descrição dos Arquivos

### index.html
Arquivo HTML principal que carrega os estilos CSS e o script JS principal.

### css/dom.css
Define os estilos visuais da aplicação:
- Grid responsivo para galeria
- Estilos do banner de visualização
- Animações e efeitos hover
- Variáveis CSS para personalização de cores

### js/api.js
Classe `DataBase` que gerencia operações com IndexedDB:
- `create(table)`: Cria/inicializa a base de dados
- `get(table, index)`: Obtém uma imagem pelo índice
- `getAll(table)`: Obtém todas as imagens
- `put(table, data)`: Adiciona novas imagens
- `delete(table, key)`: Remove uma imagem
- `length(table)`: Conta o número de registros

### js/dom.js
Contém:
- **DomManipulator**: Classe para criar elementos HTML
  - `Main()`: Layout principal
  - `Figure()`: Card de imagem
  - `Banner()`: Modal de visualização
  - `Form()`: Formulário de upload
  - `Colors()`: Controles de personalização
  
- **Iteractions**: Gerencia eventos e interações do usuário
  - `Figure()`: Gestos e navegação de imagens
  - `Button()`: Ações dos botões
  - `Colors()`: Alteração de tema

### js/main.js
Lógica principal da aplicação:
- Inicialização da interface
- Gerenciamento de eventos customizados
- Controle de adição/remoção de imagens
- Seleção em massa

## 🎨 Personalização

As cores podem ser alteradas através do botão de cores na barra superior:
- **Cor de Fundo**: Altera o `--background-color`
- **Cor da Barra**: Altera o `--front-color`

## 🌐 Navegadores Compatíveis

- Chrome/Edge (v24+)
- Firefox (v16+)
- Safari (v10+)
- Opera (v15+)

Requer suporte a **IndexedDB** e **ES6 Modules**.

## 📝 Notas

- As imagens são armazenadas como Blobs no IndexedDB
- URLs de objeto são geradas para cada imagem
- O armazenamento é local e persiste entre sessões
- Máximo de armazenamento depende do navegador (geralmente 50MB)