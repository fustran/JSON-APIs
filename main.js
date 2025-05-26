const API_URL    = '/api/apod';
const BATCH_SIZE = 4;

let allItems = [];
let shown    = 0;

async function fetchAndRender() {
    try {

        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        allItems = await res.json();

        const loadMoreBtn = document.getElementById('load-more');
        const loadLessBtn = document.getElementById('load-less');
        const buttonsDiv  = document.querySelector('.buttons');

        loadMoreBtn.addEventListener('click', renderNextBatch);
        loadLessBtn.addEventListener('click', renderPrevBatch);

        renderNextBatch();


        buttonsDiv.style.display = 'flex';
    } catch (err) {
        console.error(err);
        document.getElementById('gallery').innerHTML =
            `<p style="color:red; text-align:center;">Error: ${err.message}</p>`;

        const buttonsDiv = document.querySelector('.buttons');
        if (buttonsDiv) buttonsDiv.style.display = 'none';
    }
}

function renderNextBatch() {
    const gallery = document.getElementById('gallery');
    const end     = Math.min(shown + BATCH_SIZE, allItems.length);

    for (let i = shown; i < end; i++) {
        const item = allItems[i];
        const card = document.createElement('div');
        card.className = 'card';

        const mediaHTML = item.media_type === 'video'
            ? `<iframe loading="lazy"
                   src="${item.url}"
                   frameborder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowfullscreen
                   style="width:100%; height:180px; border:none; border-radius:8px 8px 0 0;">
         </iframe>`
            : `<img loading="lazy"
              src="${item.url}"
              alt="${item.title}"
              style="width:100%; height:180px; object-fit:cover; display:block;">
         `;

        card.innerHTML = `
      ${mediaHTML}
      <div class="card-content">
        <h2>${item.title}</h2>
        <small>${item.date}</small>
        <p class="truncate">${item.explanation}</p>
        <button class="read-more">Leer más</button>
      </div>
    `;
        gallery.appendChild(card);


        const btn = card.querySelector('.read-more');
        const p   = card.querySelector('.truncate');
        btn.addEventListener('click', () => {
            p.classList.toggle('open');
            btn.textContent = p.classList.contains('open') ? 'Leer menos' : 'Leer más';
        });
    }

    shown = end;
    updateButtons();
}

function renderPrevBatch() {
    const gallery = document.getElementById('gallery');
    for (let i = 0; i < BATCH_SIZE; i++) {
        if (gallery.lastChild) gallery.removeChild(gallery.lastChild);
    }
    shown = Math.max(0, shown - BATCH_SIZE);
    updateButtons();
}

function updateButtons() {
    const loadMoreBtn = document.getElementById('load-more');
    const loadLessBtn = document.getElementById('load-less');

    loadMoreBtn.disabled = shown >= allItems.length;
    loadLessBtn.disabled = shown <= BATCH_SIZE;
}

fetchAndRender();