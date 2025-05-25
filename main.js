
const API_URL = '/api/apod';

async function translate(text) {
    try {
        const res = await fetch('https://translate.argosopentech.com/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: 'es',
                format: 'text'
            })
        });
        if (!res.ok) throw new Error(`Translate ${res.status}`);
        const { translatedText } = await res.json();
        return translatedText;
    } catch {
        return text;
    }
}

async function fetchAndRender() {
    try {
        const res  = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const item = await res.json();

        const [titleEs, explanationEs] = await Promise.all([
            translate(item.title),
            translate(item.explanation)
        ]);

        item.title       = titleEs;
        item.explanation = explanationEs;

        renderGallery([item]);
    } catch (err) {
        console.error(err);
        document.getElementById('gallery').innerHTML =
            `<p style="color:red;text-align:center;">Error: ${err.message}</p>`;
    }
}

function renderGallery(items) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        const mediaHTML = item.media_type === 'video'
            ? `<iframe
           src="${item.url}"
           frameborder="0"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           allowfullscreen
           style="width:100%; height:180px; border:none; border-radius:8px 8px 0 0;"
         ></iframe>`
            : `<img
           src="${item.url}"
           alt="${item.title}"
           style="width:100%; height:180px; object-fit:cover; display:block;"
         >`;

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
        const p   = card.querySelector('p');
        btn.addEventListener('click', () => {
            p.classList.toggle('open');
            btn.textContent = p.classList.contains('open')
                ? 'Leer menos'
                : 'Leer más';
        });
    });
}

fetchAndRender();