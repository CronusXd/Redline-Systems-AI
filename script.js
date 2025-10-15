// ===== GLOBAL VARIABLES =====
let currentLanguage = 'pt-BR';
let currentPhase = 0;
let isAnalysisRunning = false;

// ===== MATRIX CHARACTERS =====
const matrixChars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// ===== REALISTIC USER COMMENTS =====
const userComments = {
    'pt-BR': [
        { author: 'Carlos M.', date: '2 dias atrás', text: 'Funcionou perfeitamente! Consegui recuperar todas as conversas que precisava. Incrível!', rating: 5 },
        { author: 'Ana Paula', date: '5 dias atrás', text: 'No começo fiquei com medo, mas é totalmente seguro. Recomendo!', rating: 5 },
        { author: 'Roberto Silva', date: '1 semana atrás', text: 'Impressionante a tecnologia de IA. Recuperou até fotos antigas.', rating: 4 },
        { author: 'Juliana Costa', date: '2 semanas atrás', text: 'Melhor ferramenta que já usei. Vale cada segundo!', rating: 5 },
        { author: 'Pedro Santos', date: '3 semanas atrás', text: 'Rápido e eficiente. Encontrou tudo que eu procurava.', rating: 5 },
        { author: 'Mariana L.', date: '1 mês atrás', text: 'A interface é muito profissional. Parece coisa de filme!', rating: 5 },
        { author: 'Fernando R.', date: '1 mês atrás', text: 'Recuperei mensagens de anos atrás. Tecnologia impressionante!', rating: 5 },
        { author: 'Beatriz S.', date: '2 meses atrás', text: 'Funciona mesmo! Não acreditei no começo mas é real.', rating: 4 }
    ],
    'en': [
        { author: 'John D.', date: '2 days ago', text: 'Worked perfectly! Got all my conversations back. Amazing!', rating: 5 },
        { author: 'Sarah M.', date: '5 days ago', text: 'Was skeptical at first, but it\'s totally safe. Highly recommend!', rating: 5 },
        { author: 'Mike Johnson', date: '1 week ago', text: 'Impressive AI technology. Even recovered old photos.', rating: 4 },
        { author: 'Emily Brown', date: '2 weeks ago', text: 'Best tool I\'ve ever used. Worth every second!', rating: 5 },
        { author: 'David Wilson', date: '3 weeks ago', text: 'Fast and efficient. Found everything I was looking for.', rating: 5 },
        { author: 'Jessica T.', date: '1 month ago', text: 'The interface looks so professional. Like something from a movie!', rating: 5 },
        { author: 'Robert K.', date: '1 month ago', text: 'Recovered messages from years ago. Impressive technology!', rating: 5 },
        { author: 'Amanda P.', date: '2 months ago', text: 'It really works! Didn\'t believe it at first but it\'s real.', rating: 4 }
    ]
};

// ===== REALISTIC MEDIA DATA =====
const mediaTypes = {
    images: ['Selfie', 'Paisagem', 'Documento', 'Screenshot', 'Meme', 'Foto de Família', 'Pet', 'Comida'],
    videos: ['Status', 'Vídeo Pessoal', 'Clip Curto', 'Tutorial', 'Gravação', 'Momento']
};

// ===== REALISTIC CONVERSATION NAMES =====
const conversationNames = [
    'Mãe ❤️', 'Pai', 'Trabalho 💼', 'Amigos 🎉', 'Família', 'João Silva', 
    'Maria Santos', 'Grupo Faculdade', 'Melhor Amigo', 'Namorada(o) 💕',
    'Chefe', 'Colega Trabalho', 'Vizinho', 'Academia 💪', 'Delivery'
];

// ===== REALISTIC MESSAGE PREVIEWS =====
const messageTemplates = [
    'Oi, tudo bem?', 'Vamos marcar algo?', 'Que horas você chega?',
    'Não esqueça de...', 'Obrigado!', 'Até logo', 'Combinado!',
    'Estou chegando', 'Pode ser', 'Perfeito!', 'Entendi', 'Beleza'
];

// ===== TRANSLATIONS =====
const translations = {
    'pt-BR': {
        'title': 'AI WhatsApp Recovery',
        'subtitle': 'Simulador Educacional de Análise de Dados',
        'phone-label': 'Número do WhatsApp:',
        'start-button': 'Iniciar Análise',
        'disclaimer': '⚠️ Este é um simulador educacional. WhatsApp usa criptografia E2E que é impossível de quebrar. Este site é apenas para fins educacionais sobre segurança digital.',
        'analysis-title': 'Análise em Andamento',
        'phase1-title': 'Conectando com IA',
        'phase1-text': 'Estabelecendo conexão segura com servidores de IA...',
        'phase2-title': 'Análise de Criptografia',
        'phase2-text': 'Analisando protocolo Signal e descriptografando chaves...',
        'phase3-title': 'Varredura de Dados',
        'phase3-text': 'Escaneando conversas e mídias...',
        'conversations-label': 'Conversas',
        'media-label': 'Mídias',
        'phase4-title': 'Classificação de Conteúdo',
        'phase4-text': 'Analisando conteúdo com IA...',
        'images-detected': 'Imagens detectadas',
        'videos-detected': 'Vídeos detectados',
        'sensitive-content': 'Conteúdo sensível +18',
        'phase5-title': 'Resultados da Análise',
        'conversations-title': 'Conversas',
        'images-title': 'Imagens',
        'videos-title': 'Vídeos',
        'view-content-button': 'Visualizar Conteúdo',
        'modal-title': 'Aviso Educacional',
        'modal-text1': 'Este simulador demonstra conceitos de segurança digital de forma educativa.',
        'modal-text2': 'O WhatsApp utiliza criptografia de ponta a ponta (E2E) que é matematicamente impossível de quebrar.',
        'modal-text3': 'Nenhum dado real foi acessado ou comprometido. Este é apenas um exercício educacional.',
        'security-tips-title': 'Dicas de Segurança:',
        'tip1': 'Mantenha seu WhatsApp sempre atualizado',
        'tip2': 'Ative a verificação em duas etapas',
        'tip3': 'Nunca compartilhe códigos de verificação',
        'tip4': 'Use senhas fortes e únicas',
        'close-button': 'Fechar',
        'restart-button': 'Nova Análise',
        'user-comments-title': 'Comentários de Usuários'
    },
    'en': {
        'title': 'AI WhatsApp Recovery',
        'subtitle': 'Educational Data Analysis Simulator',
        'phone-label': 'WhatsApp Number:',
        'start-button': 'Start Analysis',
        'disclaimer': '⚠️ This is an educational simulator. WhatsApp uses E2E encryption that is impossible to break. This site is for educational purposes about digital security only.',
        'analysis-title': 'Analysis in Progress',
        'phase1-title': 'Connecting to AI',
        'phase1-text': 'Establishing secure connection to AI servers...',
        'phase2-title': 'Cryptography Analysis',
        'phase2-text': 'Analyzing Signal protocol and decrypting keys...',
        'phase3-title': 'Data Scan',
        'phase3-text': 'Scanning conversations and media...',
        'conversations-label': 'Conversations',
        'media-label': 'Media',
        'phase4-title': 'Content Classification',
        'phase4-text': 'Analyzing content with AI...',
        'images-detected': 'Images detected',
        'videos-detected': 'Videos detected',
        'sensitive-content': 'Sensitive content +18',
        'phase5-title': 'Analysis Results',
        'conversations-title': 'Conversations',
        'images-title': 'Images',
        'videos-title': 'Videos',
        'view-content-button': 'View Content',
        'modal-title': 'Educational Notice',
        'modal-text1': 'This simulator demonstrates digital security concepts in an educational way.',
        'modal-text2': 'WhatsApp uses end-to-end encryption (E2E) that is mathematically impossible to break.',
        'modal-text3': 'No real data was accessed or compromised. This is just an educational exercise.',
        'security-tips-title': 'Security Tips:',
        'tip1': 'Keep your WhatsApp always updated',
        'tip2': 'Enable two-step verification',
        'tip3': 'Never share verification codes',
        'tip4': 'Use strong and unique passwords',
        'close-button': 'Close',
        'restart-button': 'New Analysis',
        'user-comments-title': 'User Comments'
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    detectLanguage();
    createMatrixRain();
    createScanline();
    setupEventListeners();
    updateTranslations();
    setupPhoneInput();
    displayInitialComments(); // Mostrar comentários na página inicial
}

// ===== MATRIX RAIN EFFECT =====
function createMatrixRain() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${i * 20}px`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${5 + Math.random() * 10}s`;
        particle.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        container.appendChild(particle);
        
        // Update character periodically
        setInterval(() => {
            particle.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        }, 100);
    }
}

// ===== SCANLINE EFFECT =====
function createScanline() {
    const scanline = document.createElement('div');
    scanline.className = 'scanline';
    document.body.appendChild(scanline);
}

// ===== LANGUAGE DETECTION & TRANSLATION =====
function detectLanguage() {
    const browserLang = navigator.language || navigator.languages[0];
    const supportedLangs = Object.keys(translations);
    
    if (supportedLangs.includes(browserLang)) {
        currentLanguage = browserLang;
    } else {
        const langPrefix = browserLang.split('-')[0];
        const matchingLang = supportedLangs.find(lang => lang.startsWith(langPrefix));
        if (matchingLang) {
            currentLanguage = matchingLang;
        }
    }
    
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
}

function updateTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    document.title = translations[currentLanguage]['title'] || 'AI WhatsApp Recovery';
}

// ===== PHONE INPUT FORMATTING =====
function setupPhoneInput() {
    const phoneInput = document.getElementById('phone-input');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.startsWith('55')) {
                value = value.replace(/(\d{2})(\d{2})(\d{4,5})(\d{4})/, '+$1 $2 $3-$4');
            } else if (value.startsWith('1')) {
                value = value.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
            } else {
                value = '+' + value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
            }
        }
        
        e.target.value = value;
    });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function(e) {
            currentLanguage = e.target.value;
            updateTranslations();
        });
    }
    
    const startButton = document.getElementById('start-analysis');
    if (startButton) {
        startButton.addEventListener('click', startAnalysis);
    }
    
    const viewContentButton = document.getElementById('view-content');
    if (viewContentButton) {
        viewContentButton.addEventListener('click', showEducationalModal);
    }
    
    const closeModalButton = document.getElementById('close-modal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeEducationalModal);
    }
    
    const restartButton = document.getElementById('restart-analysis');
    if (restartButton) {
        restartButton.addEventListener('click', restartAnalysis);
    }
    
    const modal = document.getElementById('educational-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeEducationalModal();
            }
        });
    }
}

// ===== ANALYSIS SIMULATION (SLOWER) =====
function startAnalysis() {
    if (isAnalysisRunning) return;
    
    const phoneInput = document.getElementById('phone-input');
    const phoneNumber = phoneInput.value.trim();
    
    if (!phoneNumber) {
        alert(translations[currentLanguage]['phone-label'] || 'Please enter a phone number');
        return;
    }
    
    isAnalysisRunning = true;
    currentPhase = 0;
    
    document.getElementById('initial-screen').classList.remove('active');
    document.getElementById('analysis-screen').classList.add('active');
    
    runAnalysisPhases();
}

function runAnalysisPhases() {
    // Análise MUITO mais lenta - duração dobrada
    const phases = [
        { duration: 8000, phase: 1 },   // 8 segundos
        { duration: 12000, phase: 2 },  // 12 segundos
        { duration: 10000, phase: 3 },  // 10 segundos
        { duration: 9000, phase: 4 },   // 9 segundos
        { duration: 7000, phase: 5 }    // 7 segundos
    ];
    
    let totalDuration = 0;
    phases.forEach(phase => totalDuration += phase.duration);
    
    let currentTime = 0;
    
    phases.forEach((phaseData, index) => {
        setTimeout(() => {
            showPhase(phaseData.phase);
            if (phaseData.phase === 2) {
                startMatrixEffect();
            }
            if (phaseData.phase === 3) {
                updateCounters(phaseData.phase);
            }
            if (phaseData.phase === 5) {
                generateRealisticContent();
                // Removido displayUserComments() - comentários apenas na página inicial
            }
        }, currentTime);
        
        currentTime += phaseData.duration;
    });
    
    // Update progress bar
    let progressTime = 0;
    const progressInterval = setInterval(() => {
        progressTime += 100;
        const progress = Math.min((progressTime / totalDuration) * 100, 100);
        updateProgress(progress);
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            isAnalysisRunning = false;
        }
    }, 100);
}

function showPhase(phaseNumber) {
    document.querySelectorAll('.phase').forEach(phase => {
        phase.classList.remove('active');
    });
    
    const currentPhaseElement = document.getElementById(`phase-${phaseNumber}`);
    if (currentPhaseElement) {
        currentPhaseElement.classList.add('active');
    }
    
    currentPhase = phaseNumber;
}

function updateProgress(percentage) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${Math.round(percentage)}%`;
    }
}

// ===== MATRIX EFFECT =====
function startMatrixEffect() {
    const matrixText = document.getElementById('matrix-text');
    if (!matrixText) return;
    
    const matrixLines = [
        '> Iniciando protocolo de descriptografia...',
        '> Analisando chaves RSA-2048...',
        '> Processando algoritmo AES-256...',
        '> Decodificando metadados...',
        '> Extraindo timestamps...',
        '> Mapeando estrutura de dados...',
        '> Identificando padrões...',
        '> Reconstruindo mensagens...'
    ];
    
    let lineIndex = 0;
    
    const interval = setInterval(() => {
        if (currentPhase !== 2) {
            clearInterval(interval);
            return;
        }
        
        const randomChars = Array.from({length: 40}, () => 
            matrixChars[Math.floor(Math.random() * matrixChars.length)]
        ).join('');
        
        matrixText.innerHTML = `<span class="matrix-char">${randomChars}</span><br>${matrixLines[lineIndex]}`;
        lineIndex = (lineIndex + 1) % matrixLines.length;
    }, 800);
}

// ===== COUNTERS ANIMATION =====
function updateCounters(phase) {
    if (phase === 3) {
        // Números aleatórios mais realistas
        const conversations = Math.floor(Math.random() * 50) + 30; // 30-80
        const media = Math.floor(Math.random() * 100) + 50; // 50-150
        
        animateCounter('conversations-count', 0, conversations, 3000);
        animateCounter('media-count', 0, media, 3000);
    }
}

function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startTime = Date.now();
    
    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (end - start) * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

// ===== GENERATE REALISTIC CONTENT =====
function generateRealisticContent() {
    // Gerar conversas realistas com quantidade aleatória
    const conversationsContainer = document.querySelector('.conversation-preview');
    if (conversationsContainer) {
        conversationsContainer.innerHTML = '';
        
        const numConversations = Math.floor(Math.random() * 4) + 2; // 2-5 conversas
        for (let i = 0; i < numConversations; i++) {
            const name = conversationNames[Math.floor(Math.random() * conversationNames.length)];
            const numMessages = Math.floor(Math.random() * 4) + 1; // 1-4 mensagens
            
            const contactDiv = document.createElement('div');
            contactDiv.className = 'contact-name';
            contactDiv.textContent = name;
            contactDiv.style.marginTop = i > 0 ? 'var(--spacing-md)' : '0';
            conversationsContainer.appendChild(contactDiv);
            
            for (let j = 0; j < numMessages; j++) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message-preview';
                messageDiv.textContent = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
                conversationsContainer.appendChild(messageDiv);
            }
        }
    }
    
    // Gerar imagens REAIS com blur
    const imageGrid = document.querySelector('.image-grid');
    if (imageGrid) {
        imageGrid.innerHTML = '';
        
        // URLs de imagens reais do Unsplash (placeholder)
        const realImages = [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400',
            'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400',
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400'
        ];
        
        const numImages = Math.floor(Math.random() * 8) + 3; // 3-10 imagens
        for (let i = 0; i < numImages; i++) {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'media-item';
            
            const thumbnail = document.createElement('div');
            thumbnail.className = 'media-thumbnail';
            const randomImage = realImages[Math.floor(Math.random() * realImages.length)];
            thumbnail.style.backgroundImage = `url('${randomImage}')`;
            thumbnail.style.backgroundSize = 'cover';
            thumbnail.style.backgroundPosition = 'center';
            thumbnail.style.filter = 'blur(15px)';
            
            const info = document.createElement('div');
            info.className = 'media-info';
            const daysAgo = Math.floor(Math.random() * 90) + 1;
            info.innerHTML = `
                <div class="media-type">${mediaTypes.images[Math.floor(Math.random() * mediaTypes.images.length)]}</div>
                <div class="media-count">${daysAgo} dias atrás</div>
            `;
            
            imageDiv.appendChild(thumbnail);
            imageDiv.appendChild(info);
            imageGrid.appendChild(imageDiv);
        }
    }
    
    // Gerar vídeos REAIS com blur
    const videoGrid = document.querySelector('.video-grid');
    if (videoGrid) {
        videoGrid.innerHTML = '';
        
        // URLs de thumbnails de vídeos reais
        const realVideoThumbs = [
            'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400',
            'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400',
            'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400',
            'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
            'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400'
        ];
        
        const numVideos = Math.floor(Math.random() * 5) + 2; // 2-6 vídeos
        for (let i = 0; i < numVideos; i++) {
            const videoDiv = document.createElement('div');
            videoDiv.className = 'media-item';
            
            const thumbnail = document.createElement('div');
            thumbnail.className = 'media-thumbnail video-thumb';
            const randomThumb = realVideoThumbs[Math.floor(Math.random() * realVideoThumbs.length)];
            thumbnail.style.backgroundImage = `url('${randomThumb}')`;
            thumbnail.style.backgroundSize = 'cover';
            thumbnail.style.backgroundPosition = 'center';
            thumbnail.style.filter = 'blur(15px)';
            
            // Adicionar ícone de play sobre o vídeo borrado
            const playIcon = document.createElement('i');
            playIcon.className = 'fas fa-play';
            playIcon.style.cssText = 'position: absolute; font-size: 2rem; color: var(--primary-color); text-shadow: 0 0 10px var(--primary-color); z-index: 1;';
            thumbnail.appendChild(playIcon);
            
            const info = document.createElement('div');
            info.className = 'media-info';
            const daysAgo = Math.floor(Math.random() * 120) + 1;
            info.innerHTML = `
                <div class="media-type">${mediaTypes.videos[Math.floor(Math.random() * mediaTypes.videos.length)]}</div>
                <div class="media-count">${daysAgo} dias atrás</div>
            `;
            
            videoDiv.appendChild(thumbnail);
            videoDiv.appendChild(info);
            videoGrid.appendChild(videoDiv);
        }
    }
}

// ===== DISPLAY INITIAL COMMENTS (Main Page) =====
function displayInitialComments() {
    const commentsContainer = document.getElementById('initial-comments');
    if (!commentsContainer) return;
    
    const title = document.createElement('h3');
    title.textContent = translations[currentLanguage]['user-comments-title'] || 'Comentários de Usuários';
    commentsContainer.appendChild(title);
    
    const comments = userComments[currentLanguage] || userComments['pt-BR'];
    const numComments = Math.floor(Math.random() * 3) + 4; // 4-6 comentários
    
    for (let i = 0; i < numComments && i < comments.length; i++) {
        const comment = comments[i];
        
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.style.animationDelay = `${i * 0.15}s`;
        
        commentDiv.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
            <div class="comment-rating">${'⭐'.repeat(comment.rating)}</div>
        `;
        
        commentsContainer.appendChild(commentDiv);
    }
}

// Função displayUserComments removida - comentários apenas na página inicial

// ===== MODAL FUNCTIONS =====
function showEducationalModal() {
    const modal = document.getElementById('educational-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeEducationalModal() {
    const modal = document.getElementById('educational-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function restartAnalysis() {
    closeEducationalModal();
    
    document.getElementById('analysis-screen').classList.remove('active');
    document.getElementById('initial-screen').classList.add('active');
    
    // Reset progress
    updateProgress(0);
    currentPhase = 0;
    isAnalysisRunning = false;
    
    // Clear phone input
    const phoneInput = document.getElementById('phone-input');
    if (phoneInput) {
        phoneInput.value = '';
    }
}
