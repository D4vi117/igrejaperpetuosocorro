const path = window.location.pathname;
const parts = path.split('/').filter(Boolean);

// esperado: ["midias","video","abc123"]
const videoParam = parts[2] ?? null;

if (!videoParam) {
    console.warn("Nenhum vídeo informado");
} else {
    carregarVideo(videoParam);
    console.log("Carregando vídeo:", videoParam);
}

async function carregarVideo(param) {
    try {

        const res = await fetch(`https://igrejaperpetuosocorro.com/midias/video/video.php?video=${param}`);
        const json = await res.json();
        console.log(json);
        if (!json.success) {
            document.querySelector('.video-title').innerText = 'Vídeo não encontrado';
            return;
        }

        const v = json.data;

        document.querySelector('.video-title').innerText = v.titulo;
        document.querySelector('.description').innerText = v.description ?? '';
        const videoId = v.path.replace('video/', '');
        document.getElementById('player').src =
            `https://www.youtube.com/embed/${videoId}`;


        const anteriores = json.relacionados.anteriores || [];
        const proximos   = json.relacionados.proximos   || [];
        let atual     = v    || {};
        // lista final: [anteriores][atual][proximos]
        const listaFinal = [
            ...anteriores,
            { ...atual, __atual: true },
            ...proximos

        ];

        renderizarRelacionados(listaFinal);

    } catch (e) {
        console.error(e);
    }
}

function renderizarRelacionados(lista) {
    const container = document.querySelector('.related-videos');
    container.innerHTML = '';
    lista.reverse();
    lista.forEach(item => {
        const videoId = item.path.replace('video/', '');

        const div = document.createElement('div');
        div.className = 'related-video-item';

        if (item.__atual) {
            div.classList.add('current-video');
        }

        div.innerHTML = `
            <a href="/midias/video/${item.titulo}">
                <img 
                    src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg"
                    alt="${item.titulo}
                    class="thumbnail"
                />
                <p>${item.titulo}</p>
                ${item.__atual ? '<span class="badge">Assistindo</span>' : ''}
            </a>
        `;

        container.appendChild(div);
    });
}
function otherVideos() {
    window.location.href = '/midias/video';
}
