
const API_URL = '/api/apod';

async function fetchAndRender() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
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
        const c = document.createElement('div');
        c.className = 'card';
        c.innerHTML = `
      <img src="${item.url}" alt="${item.title}">
      <div class="card-content">
        <h2>${item.title}</h2>
        <small>${item.date}</small>
        <p>${item.explanation}</p>
      </div>
    `;
        gallery.appendChild(c);
    });
}

// Arranca la app
fetchAndRender();