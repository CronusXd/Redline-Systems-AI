# 📖 Guia de Uso - AI WhatsApp Recovery Matrix Edition

## 🚀 Como Usar

### 1. Abrir o Projeto

#### Opção A: Localmente
```bash
# Abra o arquivo index.html no seu navegador
# Duplo clique no arquivo ou
# Arraste para o navegador
```

#### Opção B: Servidor Local
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (http-server)
npx http-server

# Acesse: http://localhost:8000
```

#### Opção C: Live Server (VS Code)
```
1. Instale a extensão "Live Server"
2. Clique com botão direito em index.html
3. Selecione "Open with Live Server"
```

### 2. Usar o Simulador

#### Passo 1: Selecionar Idioma
- Clique no seletor de idioma no canto superior direito
- Escolha entre: 🇧🇷 PT-BR ou 🇺🇸 EN
- A interface será traduzida automaticamente

#### Passo 2: Inserir Número
- Digite um número de telefone no formato:
  - Brasil: +55 11 99999-9999
  - EUA: +1 (555) 123-4567
  - Outros: +XX XXX XXX XXXX
- O formato é automático conforme você digita

#### Passo 3: Iniciar Análise
- Clique no botão "Iniciar Análise"
- Aguarde o processo (aproximadamente 23 segundos)
- Observe os efeitos Matrix durante a análise

#### Passo 4: Ver Resultados
- Após a análise, veja:
  - **Conversas**: Nomes e mensagens aleatórias
  - **Imagens**: 3-10 imagens com tipos variados
  - **Vídeos**: 2-6 vídeos com tipos variados
  - **Comentários**: 3-5 comentários de usuários

#### Passo 5: Visualizar Conteúdo
- Clique em "Visualizar Conteúdo"
- Leia o aviso educacional
- Veja as dicas de segurança
- Clique em "Nova Análise" para recomeçar

## 🎨 Efeitos Visuais

### Matrix Rain
- **Caracteres caindo**: Katakana japonês + números/letras
- **Velocidade**: Variável (5-15 segundos)
- **Atualização**: A cada 100ms
- **Posição**: Aleatória em colunas

### Scanline
- **Linha verde**: Percorre a tela de cima para baixo
- **Duração**: 4 segundos por ciclo
- **Efeito**: Glow neon
- **Loop**: Infinito

### CRT Effect
- **Linhas horizontais**: Simulam monitor antigo
- **Opacidade**: 15%
- **Espaçamento**: 2px
- **Fixo**: Não se move

### Glow Effects
- **Bordas**: Brilho verde neon
- **Textos**: Sombra luminosa
- **Hover**: Intensificação do brilho
- **Transições**: Suaves (0.3s)

## 📊 Conteúdo Gerado

### Conversas (Aleatório)
```
Quantidade: 2-5 conversas
Mensagens: 1-4 por conversa
Nomes: 15 opções diferentes
Templates: 12 mensagens comuns
```

### Imagens (Aleatório)
```
Quantidade: 3-10 imagens
Tipos: 8 categorias
Data: 1-90 dias atrás
Visual: Ícone + shimmer effect
```

### Vídeos (Aleatório)
```
Quantidade: 2-6 vídeos
Tipos: 6 categorias
Data: 1-120 dias atrás
Visual: Ícone play + glow
```

### Comentários (Aleatório)
```
Quantidade: 3-5 comentários
Idiomas: PT-BR e EN
Avaliação: 4-5 estrelas
Datas: Variadas
```

## ⏱️ Fases da Análise

### Fase 1: Conectando com IA (4s)
- Animação de loading dots
- Texto: "Estabelecendo conexão segura..."
- Progresso: 0-20%

### Fase 2: Análise de Criptografia (6s)
- Efeito Matrix com caracteres
- Mensagens técnicas rotativas
- Progresso: 20-50%

### Fase 3: Varredura de Dados (5s)
- Animação de scan
- Contadores animados
- Progresso: 50-75%

### Fase 4: Classificação de Conteúdo (4.5s)
- Preview de tipos de mídia
- Ícones animados
- Progresso: 75-90%

### Fase 5: Resultados da Análise (3.5s)
- Cards com conteúdo
- Comentários de usuários
- Progresso: 90-100%

## 🎯 Interações

### Hover Effects
- **Botões**: Glow intensificado + elevação
- **Cards**: Sombra aumentada + escala
- **Mensagens**: Background alterado
- **Mídias**: Escala 1.05

### Click Events
- **Iniciar Análise**: Inicia simulação
- **Visualizar Conteúdo**: Abre modal
- **Fechar Modal**: Fecha modal
- **Nova Análise**: Reinicia processo
- **Seletor de Idioma**: Troca idioma

### Keyboard Navigation
- **Tab**: Navega entre elementos
- **Enter**: Ativa botão focado
- **Esc**: Fecha modal (se implementado)

## 🔧 Personalização

### Alterar Cores
```css
/* Em styles.css */
--primary-color: #00ff41;  /* Verde Matrix */
--secondary-color: #ff0055; /* Vermelho */
```

### Alterar Velocidade
```javascript
// Em script.js
const phases = [
    { duration: 4000, phase: 1 },  // Ajuste aqui
    { duration: 6000, phase: 2 },
    // ...
];
```

### Adicionar Comentários
```javascript
// Em script.js
const userComments = {
    'pt-BR': [
        { 
            author: 'Seu Nome', 
            date: 'hoje', 
            text: 'Seu comentário', 
            rating: 5 
        },
        // ...
    ]
};
```

### Adicionar Tipos de Mídia
```javascript
// Em script.js
const mediaTypes = {
    images: ['Novo Tipo', ...],
    videos: ['Novo Tipo', ...]
};
```

## 📱 Responsividade

### Desktop (1200px+)
- Layout completo
- 3 colunas de cards
- Todos os efeitos ativos

### Tablet (768px-1199px)
- Layout adaptado
- 2 colunas de cards
- Efeitos mantidos

### Mobile (até 767px)
- Layout vertical
- 1 coluna de cards
- Efeitos otimizados

## ⚠️ Avisos Importantes

### Educacional
- Este é um **simulador educacional**
- Nenhum dado real é acessado
- WhatsApp usa E2E (impossível quebrar)
- Apenas para fins educativos

### Segurança
- Nunca compartilhe códigos de verificação
- Use verificação em duas etapas
- Mantenha apps atualizados
- Use senhas fortes

### Performance
- Funciona melhor em navegadores modernos
- Chrome, Firefox, Safari, Edge
- JavaScript deve estar habilitado
- Recomendado: conexão estável

## 🐛 Solução de Problemas

### Efeitos não aparecem
- Verifique se JavaScript está habilitado
- Atualize a página (F5)
- Limpe o cache do navegador

### Animações lentas
- Feche outras abas do navegador
- Verifique uso de CPU
- Desative extensões pesadas

### Conteúdo não carrega
- Verifique console do navegador (F12)
- Veja se há erros JavaScript
- Recarregue a página

### Idioma não muda
- Clique novamente no seletor
- Recarregue a página
- Verifique se há erros no console

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique este guia
2. Leia o README.md
3. Consulte o FEATURES.md
4. Abra uma issue no repositório

---

**Aproveite o simulador Matrix! 💚**
