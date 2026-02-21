// ═══════════════════════════════════════════════
//  WikiLaura — index.js
// ═══════════════════════════════════════════════


// ── Lista de artigos ────────────────────────────
//
//  caminho: relativo à raiz do projeto (WikiLaura/)
//  destaque: true  → aparece na secao de destaque (escolha manual)
//            false → aparece somente na grade geral
//
const artigos = [
    {
        id:       'fuzz-the-cat',
        titulo:   'Fuzz The Cat',
        tags:     ['Personagem', 'LGBT', 'Felino/Canino', 'Furry'],
        resumo:   'Fuzz The Cat (ou, carinhosamente: Gato das Cinzas) é um personagem da série de Jogo De Realidade Alternativa The June Archive and Restoration Project.',
        imagem:   'img/fuzzy.jpg',
        caminho:  'wiki/psr/Fuzz_The_Cat_(june archive).html',
        destaque: true,
    },
    {
        id:       'pikachu',
        titulo:   'Pikachu',
        tags:     ['Personagem', 'Pokemon'],
        resumo:   'coelhinho da nintendo',
        imagem:   'img/pikachu.jpg',
        caminho:  'wiki/psr/Pikachu_(pokemon).html',
        destaque: false,
    },
    {
        id:       'boom-boom-boom',
        titulo:   'Boom! Boom! Boom!',
        tags:     ['Animation Meme', 'Ship Global'],
        resumo:   'Meme de animação presente em todas as fandoms. Famoso pela batida e pela coreografia.',
        imagem:   'https://c.tenor.com/On0HlgirUlQAAAAC/tenor.gif',
        caminho:  'wiki/animation_memes/Boom!_Boom!_Boom!',
        destaque: false,
    },
    {
        id:      'creeper-x-enderman',
        titulo:  'Creeper X Enderman',
        tags:    ['Minecraft', 'Brotheragem'],
        resumo:  'ele é pituchinho, enquanto o outro é maior que ele.',
        imagem:  'img/creeper_enderman.jpg',
        caminho: 'wiki/shp/Creeper_X_Enderman_(minecraft).html',
        destaque: false,
    },

    {
        id: 'kris-x-ralsei',
        titulo: 'Kris Dreemur X Ralsei Dreemur',
        tags: ['incesto', 'Brotheragem'],
        resumo: 'fluffy boy + gótico emo = casal canonico (deveria ser)',
        imagem: 'img/smoke.jpg',
        caminho: 'wiki/shp/Kris_X_Ralsei_(deltarune).html',
        destaque: false,
    }
    // ── adicione novos artigos aqui ──
];


// ── Tela de aviso ───────────────────────────────

const warningScreen = document.getElementById('warning-screen');
const okButton      = document.getElementById('ok-button-warning-screen');

okButton.addEventListener('click', () => {
    warningScreen.classList.add('hidden');
    warningScreen.addEventListener('animationend', () => {
        warningScreen.remove();
    }, { once: true });
});


// ── Navegacao ───────────────────────────────────

/**
 * Redireciona para o HTML do artigo.
 * O .html some da URL via cleanUrls no firebase.json.
 * @param {string} caminho
 */
function abrirArtigo(caminho) {
    window.location.href = caminho;
}


// ── Templates de card ───────────────────────────

/**
 * Card de destaque — layout horizontal, grande.
 * @param {object} artigo
 * @returns {HTMLElement}
 */
function criarCardDestaque(artigo) {
    const card = document.createElement('div');
    card.className = 'card-destaque';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Abrir artigo: ${artigo.titulo}`);

    card.innerHTML = `
        <img src="${artigo.imagem}" alt="${artigo.titulo}">
        <div class="card-destaque-info">
            <span class="card-tags">${artigo.tags.join(', ')}</span>
            <h3 class="card-titulo">${artigo.titulo}</h3>
            <p class="card-resumo">${artigo.resumo}</p>
        </div>
    `;

    card.addEventListener('click', () => abrirArtigo(artigo.caminho));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') abrirArtigo(artigo.caminho);
    });

    return card;
}

/**
 * Card simples para a grade geral.
 * @param {object} artigo
 * @returns {HTMLElement}
 */
function criarCardGrade(artigo) {
    const card = document.createElement('div');
    card.className = 'card-grade';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Abrir artigo: ${artigo.titulo}`);

    card.innerHTML = `
        <img src="${artigo.imagem}" alt="${artigo.titulo}">
        <div class="card-grade-info">
            <span class="card-tags">${artigo.tags.join(', ')}</span>
            <h3 class="card-titulo">${artigo.titulo}</h3>
        </div>
    `;

    card.addEventListener('click', () => abrirArtigo(artigo.caminho));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') abrirArtigo(artigo.caminho);
    });

    return card;
}


// ── Renderizacao ────────────────────────────────

const secaoDestaque = document.getElementById('artigos-destaque');
const secaoGrade    = document.getElementById('artigos-grade');

artigos.forEach((artigo) => {
    if (artigo.destaque) {
        secaoDestaque.appendChild(criarCardDestaque(artigo));
    } else {
        secaoGrade.appendChild(criarCardGrade(artigo));
    }
});