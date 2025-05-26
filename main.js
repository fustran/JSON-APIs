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
        document.querySelector('.buttons').style.display = 'none';
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
                   frameBorder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen></iframe>`
            : `<img loading="lazy" src="${item.url}" alt="${item.title}">`;

        card.innerHTML = `
      ${mediaHTML}
      <div class="card-content">
        <h2>${item.title}</h2>
        <small>${item.date}</small>
        <p class="truncate">${item.explanation}</p>
      </div>
    `;

        gallery.appendChild(card);
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