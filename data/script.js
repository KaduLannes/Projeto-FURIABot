// Data
const nextMatches = [
    { opponent: 'GamerLegion', date: '2025-05-10', tournament: 'PGL Astana 2025' },
    { opponent: 'FaZe Clan', date: '2025-05-19', tournament: 'IEM Dallas 2025' }
];

const playerStats = [
    { name: 'Fallen', role: 'IGL', rating: '0.95'},
    { name: 'KSCERATO', role: 'Rifler', rating: '1.17'},
    { name: 'yuurih', role: 'Rifler', rating: '1.07'},
    { name: 'Molodoy', role: 'Awper', rating: '1.23'},
    { name: 'Yekindar', role: 'Rifler', rating: '1.13'}
];
  
const recentChanges = [
    { date: '2025-04-22', change: 'Novo jogador: Mareks "Yekindar" Galinskis se junta ao time' },
    { date: '2025-04-11', change: 'Novo jogador: Danil "Molodoy" Golubenko se junta ao time' }
];

// Elements
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const nextMatchesContainer = document.getElementById('nextMatches');
const playerStatsContainer = document.getElementById('playerStats');
const quickRepliesContainer = document.getElementById('quickReplies');

// Welcome Message
function initChat() {
    const welcomeMessage = {
      text: 'Olá! Eu sou o FURIABot! Como posso ajudar você hoje?\n\nVocê pode perguntar sobre:\n- Calendário\n- Estatísticas dos players\n- Últimas novidades\n- História da Fúria',
      sender: 'FURIABot',
      isBot: true
    };
    addMessage(welcomeMessage);
}

// Add Message to Chat
function addMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.isBot ? 'bot' : 'user'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const sender = document.createElement('div');
    sender.className = 'message-sender';
    sender.textContent = message.sender;
    
    const text = document.createElement('div');
    text.className = 'message-text';
    text.textContent = message.text;
    
    messageContent.appendChild(sender);
    messageContent.appendChild(text);
    messageElement.appendChild(messageContent);
    messagesContainer.appendChild(messageElement);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Sending message
function handleSend() {
    const text = messageInput.value.trim();
    if (!text) return;

    addMessage({
        text,
        sender: 'Você',
        isBot: false
    });

    messageInput.value = '';

    const lowerText = text.toLowerCase();
    let response = '';

    // Intenções
    const intents = {
        proximosJogos: {
            regex: /(próximo|jogo|partida|calendário|agenda|quando joga|próximos jogos)/i,
            response: `Próximas partidas da FURIA:\n\n${nextMatches.map(match => 
                `🎮 vs ${match.opponent}\n📅 ${match.date}\n🏆 ${match.tournament}\n`
            ).join('\n')}`
        },

        estatisticas: {
            regex: /(estatística|stats?|rating|desempenho|kda|performance|números?)/i,
            response: `Estatísticas atuais dos jogadores:\n\n${playerStats.map(player =>
                `👤 ${player.name}\n📋 ${player.role}\n⭐ Rating: ${player.rating}\n`
            ).join('\n')}`
        },

        historia: {
            regex: /(história|origem|fundação|quem é a furia|sobre a furia|histórico)/i,
            response: 'Uma organização de esports que nasceu do desejo de representar o Brasil no CS e conquistou muito mais que isso: expandimos nossas ligas, disputamos os principais títulos, adotamos novos objetivos e ganhamos um propósito maior. Somos muito mais que o sucesso competitivo. Somos um movimento sociocultural. Nossa história é de pioneirismo, grandes conquistas e tradição. Nosso presente é de desejo, garra e estratégia. A pantera estampada no peito estampa também nosso futuro de glória. Nossos pilares de performance, lifestyle, conteúdo, business, tecnologia e social são os principais constituintes do movimento FURIA, que representa uma unidade que respeita as individualidades e impacta positivamente os contextos em que se insere. Unimos pessoas e alimentamos sonhos dentro e fora dos jogos.'
        },

        ultimasMudancas: {
            regex: /(últimas?|mudanças?|novidades?|resultados?|atualizações?|transferências?)/i,
            response: `Últimas mudanças e resultados:\n\n${recentChanges.map(change =>
                `📅 ${change.date}\n📌 ${change.change}\n`
            ).join('\n')}`
        }
    };

    //Define a intenção
    let intentDetected = null;
    for (const [intent, data] of Object.entries(intents)) {
        if (data.regex.test(lowerText)) {
            intentDetected = intent;
            break;
        }
    }

    //Resposta com base na intenção
    response = intentDetected ? intents[intentDetected].response : 
    'Desculpe, não entendi sua pergunta. Você pode perguntar sobre próximas partidas, estatísticas dos jogadores, ou história do time!';

    setTimeout(() => {
        addMessage({
          text: response,
          sender: 'FURIABot',
          isBot: true
        });
    }, 500);
}

// Quick Reply
function handleQuickReply(event) {
    if (event.target.classList.contains('quick-reply-btn')) {
      const query = event.target.dataset.query;
      messageInput.value = query;
      handleSend();
    }
}

// Side Bar
function populateSidebar() {

    nextMatches.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.className = 'match-item';
        matchElement.innerHTML = `
          <div class="match-opponent">vs ${match.opponent}</div>
          <div class="match-date">${match.date}</div>
          <div class="match-tournament">${match.tournament}</div>
        `;
        nextMatchesContainer.appendChild(matchElement);
    });

    playerStats.forEach(player => {
        const playerElement = document.createElement('div');
        playerElement.className = 'player-item';
        playerElement.innerHTML = `
          <div class="player-name">${player.name}</div>
          <div class="player-info">
            <span class="player-role">${player.role}</span>
          </div>
        `;
        playerStatsContainer.appendChild(playerElement);
    });
}

sendButton.addEventListener('click', handleSend);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});
quickRepliesContainer.addEventListener('click', handleQuickReply);

initChat();
populateSidebar();