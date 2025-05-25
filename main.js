
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
        const media = item.media_type === 'video'
            ? `<iframe src="${item.url}" frameborder="0" allowfullscreen
            style="width:100%;height:180px;border:none;border-radius:8px 8px 0 0"></iframe>`
            : `<img src="${item.url}" alt="${item.title}"
            style="width:100%;height:180px;object-fit:cover;display:block">`;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
      ${media}
      <div class="card-content">
        <h2>${item.title}</h2>
        <small>${item.date}</small>
        <p>${item.explanation}</p>
      </div>
    `;
        gallery.appendChild(card);
    });
}

fetchAndRender();