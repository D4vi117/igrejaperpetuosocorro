const form = document.getElementById('formBusca');
const resultadosDiv = document.getElementById('resultadosBusca');
const paginacaoDiv = document.getElementById('paginacao');

let paginaAtual = 1;

form.addEventListener('submit', function (e) {
    e.preventDefault();
    paginaAtual = 1;
    buscarResultados();
});

function buscarResultados() {
    const formData = new FormData(form);
    const params = new URLSearchParams(formData);

    params.append('pagina', paginaAtual);

    fetch(`https://igrejaperpetuosocorro.com/midias/buscar.php?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                resultadosDiv.innerHTML = '<p>Erro ao buscar resultados.</p>';
                return;
            }

            renderResultados(data.data);
            renderPaginacao(data.total_paginas);
        })
        .catch(() => {
            resultadosDiv.innerHTML = '<p>Erro na requisição.</p>';
        });
}

function renderResultados(resultados) {
    if (!resultados.length) {
        resultadosDiv.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        return;
    }

    let html = '';
    resultados.forEach(item => {
        let path = '';
        
        if (item.tipo === 'video') {
            path = `video/${item.path.replace('video/', '')}`;
        } else if (item.tipo === 'artigo') {
            path = `${item.path}`;
        }
        
        console.log(path);
        html += `
            <li class="resultado-item">
            <img src="${item.image_path}" alt="${item.titulo}" />
            <a href="/midias/${path}"> 
                <div>
                    <h3>${item.titulo}</h3>
                    <p>${item.description?.substring(0, 200) ?? ''}...</p>
                </div>
            </a>
            </li>
            <hr>
        `;
    });

    resultadosDiv.innerHTML = html;
}

function renderPaginacao(totalPaginas) {
    if (totalPaginas <= 1) {
        paginacaoDiv.innerHTML = '';
        return;
    }

    const maxPaginasVisiveis = 10;
    let start = Math.max(1, paginaAtual - Math.floor(maxPaginasVisiveis / 2));
    let end = Math.min(totalPaginas, start + maxPaginasVisiveis - 1);

    // Ajusta o start caso estejamos nos últimos números
    start = Math.max(1, end - maxPaginasVisiveis + 1);

    let html = '';

    // Botão "Anterior" (uma página)
    if (paginaAtual > 1) {
        html += `
    <button class="nav-btn" onclick="mudarPagina(${paginaAtual - 1})">
        «
    </button>
`;
    }

    // Números de página
    for (let i = start; i <= end; i++) {
        html += `
            <button 
                class="${i === paginaAtual ? 'ativo' : ''}" 
                onclick="mudarPagina(${i})">
                ${i}
            </button>
        `;
    }

    // Botão "Próxima" (uma página)
    if (paginaAtual < totalPaginas) {
        html += `
    <button class="nav-btn" onclick="mudarPagina(${paginaAtual + 1})">
        »
    </button>
`;
    }

    paginacaoDiv.innerHTML = html;
}

function mudarPagina(pagina) {
    paginaAtual = pagina;
    buscarResultados();
}
buscarResultados();