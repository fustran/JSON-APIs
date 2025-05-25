const API_URL = '/api/apod';

async function fetchAndRender() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const item = await res.json();
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
        card.innerHTML = `
      <img src="${item.url}" alt="${item.title}">
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