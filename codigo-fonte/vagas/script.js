document.addEventListener('DOMContentLoaded', () => {
    const conteudoVaga = document.getElementById('conteudo-vaga')

    const sessao = sessionStorage.getItem("usuarioCorrente")
    let usuarioLogado = sessao ? JSON.parse(sessao) : null

    const urlParams = new URLSearchParams(window.location.search)
    const idDaVaga = urlParams.get('id')

    const bancoDeDados = JSON.parse(localStorage.getItem("vagas_oportunidades"))
    let vaga = null

    if (bancoDeDados && bancoDeDados.oportunidades) {
        vaga = bancoDeDados.oportunidades.find(v => String(v.id) === String(idDaVaga))
    }

    if (!vaga) {
        conteudoVaga.innerHTML = `
            <div class="detalhes-container">
                <h2 style="text-align: center; color: #555;">Vaga não encontrada.</h2>
            </div>`
        return
    }

    let jaCandidatou = false
    if (usuarioLogado && !usuarioLogado.empresa) {
        if (vaga.candidatos && vaga.candidatos.includes(usuarioLogado.id)) {
            jaCandidatou = true
        }
    }

    function renderizarTela() {
        let statusAcaoHtml = ''

        if (!usuarioLogado) {
            statusAcaoHtml = `
                        <div class="alerta-erro">
                            Você precisa estar logado para se candidatar.<br><br>
                            <a href="../login/index.html" class="btn-nav-blue">Fazer Login</a>
                        </div>`;
        } else if (usuarioLogado.empresa) {
            statusAcaoHtml = `
                        <div class="alerta-erro">
                            Contas do tipo <strong>Empresa</strong> não podem se candidatar a vagas.
                        </div>`;
        } else if (jaCandidatou) {
            statusAcaoHtml = `
                        <div class="alerta-sucesso">
                            ✅ Você já está candidatado a esta vaga! Boa sorte!
                        </div>`
        } else {
            statusAcaoHtml = `
                        <div style="text-align: center; margin-top: 30px;">
                            <button id="btn-candidatar" class="btn-nav-green" style="width: 250px; padding: 15px; font-size: 1.1rem;">
                                Candidatar-se Agora
                            </button>
                        </div>`
        }

        conteudoVaga.innerHTML = `
                    <div class="detalhes-container">
                        <div class="detalhes-header">
                            <h2>${vaga.titulo}</h2>
                            <div class="badges">
                                <span class="badge-tipo">${vaga.tipo}</span>
                                <span class="badge-area">${vaga.area}</span>
                            </div>
                        </div>

                        <div class="info-bloco">
                            <h4>Empresa</h4>
                            <p>🏢 ${vaga.empresa} — ${vaga.cidade}</p>
                        </div>

                        <div class="info-bloco">
                            <h4>Descrição da Vaga</h4>
                            <p>${vaga.descricao}</p>
                        </div>

                        ${statusAcaoHtml}
                    </div>
                `;

        const btnCandidatar = document.getElementById('btn-candidatar')
        if (btnCandidatar) {
            btnCandidatar.addEventListener('click', confirmarCandidatura)
        }
    }

    renderizarTela()

    function confirmarCandidatura() {
        const bd = JSON.parse(localStorage.getItem("vagas_oportunidades"))
        const idUrl = new URLSearchParams(window.location.search)
        const idCap = idUrl.get('id')

        const indiceVaga = bd.oportunidades.findIndex(f => f.id === Number(idCap))

        if (indiceVaga === []) return
        
        bd.oportunidades[indiceVaga].candidatos.push(usuarioLogado.id)
        localStorage.setItem("vagas_oportunidades", JSON.stringify(bd))

        jaCandidatou = true

        renderizarTela()
        alert("Candidatura realizada com sucesso!")
    }
})