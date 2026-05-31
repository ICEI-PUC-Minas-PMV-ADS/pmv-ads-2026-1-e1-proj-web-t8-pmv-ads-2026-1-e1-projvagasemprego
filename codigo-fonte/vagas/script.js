document.addEventListener('DOMContentLoaded', () => {
    const conteudoVaga = document.getElementById('conteudo-vaga')

    const sessao = sessionStorage.getItem("usuarioCorrente")
    let usuarioLogado = sessao ? JSON.parse(sessao) : null
    let formularioAtivo = false

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

    function candidatoEstaInscrito(candidatos = [], usuarioId) {
        return candidatos.some(c => {
            if (typeof c === 'object' && c !== null) {
                return c.idUsuario === usuarioId
            }
            return c === usuarioId
        })
    }

    let jaCandidatou = false
    if (usuarioLogado && !usuarioLogado.empresa) {
        if (candidatoEstaInscrito(vaga.candidatos || [], usuarioLogado.id)) {
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
        } else if (formularioAtivo) {
            statusAcaoHtml = `
                        <div class="form-candidatura">
                            <h3>Preencha seus dados para se candidatar</h3>
                            <form id="form-candidatura" class="form-candidatura-box">
                                <label for="input-nome">Nome completo</label>
                                <input id="input-nome" type="text" value="${usuarioLogado.nome || ''}" required>

                                <label for="input-email">E-mail</label>
                                <input id="input-email" type="email" value="${usuarioLogado.email || ''}" required>

                                <label for="input-telefone">Telefone</label>
                                <input id="input-telefone" type="tel" placeholder="(XX) XXXXX-XXXX" required>

                                <label for="input-mensagem">Mensagem de apresentação</label>
                                <textarea id="input-mensagem" rows="5" placeholder="Diga por que você é a pessoa certa para esta vaga." required></textarea>

                                <div class="form-actions">
                                    <button type="submit" class="btn-nav-green">Enviar candidatura</button>
                                    <button type="button" id="btn-cancelar" class="btn-nav-outline">Cancelar</button>
                                </div>
                            </form>
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
            btnCandidatar.addEventListener('click', () => {
                formularioAtivo = true
                renderizarTela()
            })
        }

        const formCandidatura = document.getElementById('form-candidatura')
        if (formCandidatura) {
            formCandidatura.addEventListener('submit', enviarCandidatura)
            const btnCancelar = document.getElementById('btn-cancelar')
            if (btnCancelar) {
                btnCancelar.addEventListener('click', () => {
                    formularioAtivo = false
                    renderizarTela()
                })
            }
        }
    }

    renderizarTela()

    function enviarCandidatura(event) {
        event.preventDefault()

        const nome = document.getElementById('input-nome').value.trim()
        const email = document.getElementById('input-email').value.trim()
        const telefone = document.getElementById('input-telefone').value.trim()
        const mensagem = document.getElementById('input-mensagem').value.trim()

        if (!nome || !email || !telefone || !mensagem) {
            alert('Preencha todos os campos para enviar sua candidatura.')
            return
        }

        const bd = JSON.parse(localStorage.getItem("vagas_oportunidades"))
        const idUrl = new URLSearchParams(window.location.search)
        const idCap = idUrl.get('id')

        const indiceVaga = bd.oportunidades.findIndex(f => f.id === Number(idCap))
        if (indiceVaga < 0) return

        const candidatos = bd.oportunidades[indiceVaga].candidatos || []
        candidatos.push({
            idUsuario: usuarioLogado.id,
            nome,
            email,
            telefone,
            mensagem,
            dataCandidatura: new Date().toISOString()
        })

        bd.oportunidades[indiceVaga].candidatos = candidatos
        localStorage.setItem("vagas_oportunidades", JSON.stringify(bd))

        jaCandidatou = true
        formularioAtivo = false
        renderizarTela()
        alert("Candidatura realizada com sucesso!")
    }
})
