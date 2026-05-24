document.addEventListener('DOMContentLoaded', () => {
    const containerVagas = document.getElementById('grid-minhas-vagas');
    const contadorVagas = document.getElementById('contador-vagas');

    const sessao = sessionStorage.getItem("usuarioCorrente");
    if (!sessao) {
        alert("Você precisa estar logado para ver suas candidaturas!");
        window.location.href = "../login/index.html";
        return;
    }
    
    const usuarioLogado = JSON.parse(sessao);

    // 3. Busca o Banco de Dados no LocalStorage
    const dbData = localStorage.getItem("vagas_oportunidades");
    const bancoDeDados = dbData ? JSON.parse(dbData) : { oportunidades: [] };

    // 4. Lógica de Filtragem: Pega SÓ as vagas onde o usuário se inscreveu
    // O filter() varre todas as vagas e só guarda as que a condição for verdadeira
    const minhasVagas = bancoDeDados.oportunidades.filter(vaga => {
        // Se a vaga tiver a lista de candidatos e o id do meu usuário estiver nela, retorna true
        if (vaga.candidatos && vaga.candidatos.includes(usuarioLogado.id)) {
            return true;
        }
        return false;
    });

    // 5. Atualiza o contador de vagas na tela
    const total = minhasVagas.length;
    if (total === 0) {
        contadorVagas.textContent = "Você ainda não se candidatou a nenhuma vaga.";
        containerVagas.innerHTML = `
            <p class="sem-resultados" style="grid-column: 1 / -1; text-align: center;">
                Comece a explorar oportunidades e dê o próximo passo na sua carreira!<br><br>
                <a href="lista_oportunidades.html" class="btn-nav-green" style="display:inline-block; margin-top:15px; padding: 10px 20px;">Explorar Vagas</a>
            </p>`;
        return;
    }

    contadorVagas.textContent = total === 1 ? '1 candidatura encontrada' : `${total} candidaturas encontradas`;
    
    // Limpa o container caso tenha ficado algum lixo do HTML
    containerVagas.innerHTML = '';

    // 6. O famoso FOREACH para montar a estrutura HTML
    minhasVagas.forEach(vaga => {
        let dataFormatada = vaga.data_encerramento ? `Encerra em ${vaga.data_encerramento}` : '';

        let cardHtml = `
            <div class="vaga-card" onclick="window.location.href='vaga_detalhes.html?id=${vaga.id}'">
                <h5>${vaga.titulo}</h5>
                <div class="empresa">🏢 ${vaga.empresa} — ${vaga.cidade}</div>
                <div class="descricao">${vaga.descricao}</div>
                
                <div class="badges">
                    <span class="badge-tipo">${vaga.tipo}</span>
                    <span class="badge-area">${vaga.area}</span>
                </div>
                
                <div class="rodape">
                    <span class="salario" style="color: #1a9cd4;">Candidatura Registrada ✅</span>
                    <span>${dataFormatada}</span>
                </div>
            </div>
        `

        containerVagas.insertAdjacentHTML('beforeend', cardHtml)
    })
})


function toggleMenu(event) {
    event.stopPropagation(); 
    const menuBalao = document.getElementById('menuBalao');
    if(menuBalao) menuBalao.classList.toggle('ativo');
}

window.addEventListener('click', function(event) {
    const menuBalao = document.getElementById('menuBalao');
    if (menuBalao && menuBalao.classList.contains('ativo')) {
        menuBalao.classList.remove('ativo');
    }
});

const menuBalaoElement = document.getElementById('menuBalao');
if(menuBalaoElement) {
    menuBalaoElement.addEventListener('click', function(event) {
        event.stopPropagation();
    });
}

function logout() {
    sessionStorage.removeItem("usuarioCorrente");
    window.location.href = "../login/index.html";
}