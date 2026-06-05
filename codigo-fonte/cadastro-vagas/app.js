function getSessionUser() {
    const dbUserData = sessionStorage.getItem("usuarioCorrente")
    const userData = dbUserData ? JSON.parse(dbUserData) : null
    return userData
}

let idEmpresa = 1
function generateIdEnterprise() {
    return idEmpresa++
}


let db_oportunidades_inicial = {
    "oportunidades": [
        {
            "id": 1,
            "titulo": "Desenvolvedor Front-end Junior",
            "id_empresa": 1,
            "empresa": "TechSolutions",
            "area": "tecnologia",
            "cidade": "Belo Horizonte",
            "salario": "R$ 2.500,00",
            "tipo": "CLT",
            "descricao": "Vaga para desenvolvedor front-end com conhecimentos em HTML, CSS e JavaScript.",
            "data_encerramento": "2026-06-30",
            "candidatos": []
        },
        {
            "id": 2,
            "titulo": "Analista de Marketing Digital",
            "id_empresa": 2,
            "empresa": "Agência Criativa",
            "area": "marketing",
            "cidade": "São Paulo",
            "salario": "R$ 3.000,00",
            "tipo": "CLT",
            "descricao": "Responsável por campanhas nas redes sociais e gestão de tráfego pago.",
            "data_encerramento": "2026-05-31",
            "candidatos": []
        },
        {
            "id": 3,
            "titulo": "Estagiário de Recursos Humanos",
            "id_empresa": 3,
            "empresa": "RH Consultoria",
            "area": "rh",
            "cidade": "Betim",
            "salario": "R$ 800,00",
            "tipo": "Estágio",
            "descricao": "Apoio ao setor de recrutamento e seleção de candidatos.",
            "data_encerramento": "2026-06-15",
            "candidatos": []
        }
    ]
}

function initDbOportunidades() {
    const db_oportunity = localStorage.getItem("vagas_oportunidades")
    if (!db_oportunity) {
        localStorage.setItem("vagas_oportunidades", JSON.stringify(db_oportunidades_inicial))
    }
}

initDbOportunidades()

let db = JSON.parse(localStorage.getItem('vagas_oportunidades'))
if (!db) {
    db = db_oportunidades_inicial
}


function displayMessage(msg) {
    const msgElement = document.getElementById('msg')
    if (msgElement) {
        msgElement.innerHTML = '<div class="alert alert-warning">' + msg + '</div>'
    }
}

function insertOportunidade(oportunidade) {
    let novoId = 1
    if (db.oportunidades.length != 0) {
        novoId = db.oportunidades[db.oportunidades.length - 1].id + 1
    }

    const usuarioLogado = getSessionUser()
    const idEmpresaLogada = usuarioLogado ? usuarioLogado.id : null

    let novaOportunidade = {
        "id": novoId,
        "titulo": oportunidade.titulo,
        "id_empresa": idEmpresaLogada,
        "empresa": oportunidade.empresa,
        "area": oportunidade.area,
        "cidade": oportunidade.cidade,
        "salario": oportunidade.salario,
        "tipo": oportunidade.tipo,
        "descricao": oportunidade.descricao,
        "data_encerramento": oportunidade.data_encerramento,
        "candidatos": []
    }

    db.oportunidades.push(novaOportunidade)
    localStorage.setItem('vagas_oportunidades', JSON.stringify(db))
    displayMessage("Oportunidade inserida com sucesso!")
}

function updateOportunidade(id, oportunidade) {
    let index = db.oportunidades.map(obj => obj.id).indexOf(id)
    if (index !== -1) {
        db.oportunidades[index].titulo = oportunidade.titulo
        db.oportunidades[index].empresa = oportunidade.empresa
        db.oportunidades[index].area = oportunidade.area
        db.oportunidades[index].cidade = oportunidade.cidade
        db.oportunidades[index].salario = oportunidade.salario
        db.oportunidades[index].tipo = oportunidade.tipo
        db.oportunidades[index].descricao = oportunidade.descricao
        db.oportunidades[index].data_encerramento = oportunidade.data_encerramento

        localStorage.setItem('vagas_oportunidades', JSON.stringify(db))
        displayMessage("Oportunidade alterada com sucesso!")
    }
}

function candidatarSe(idVaga) {
    const usuarioLogado = getSessionUser()
    if (!usuarioLogado) return

    let index = db.oportunidades.findIndex(o => o.id === parseInt(idVaga))
    if (index !== -1) {
        if (!db.oportunidades[index].candidatos) {
            db.oportunidades[index].candidatos = []
        }

        if (!db.oportunidades[index].candidatos.includes(usuarioLogado.id)) {
            db.oportunidades[index].candidatos.push(usuarioLogado.id)
            localStorage.setItem('vagas_oportunidades', JSON.stringify(db))
            alert("Inscrição realizada com sucesso!")
            listaOportunidades()
        }
    }
}

function listaOportunidades() {
    const gridCards = document.getElementById("cards-oportunidades")
    const totalVagasTxt = document.getElementById("total-vagas")
    if (!gridCards) return

    const usuarioLogado = getSessionUser()
    const idUsuario = usuarioLogado ? usuarioLogado.id : null
    const eEmpresa = usuarioLogado ? usuarioLogado.empresa : false

    const filtroTitulo = document.getElementById("filtro_titulo") ? document.getElementById("filtro_titulo").value.toLowerCase() : ""
    const filtroCidade = document.getElementById("filtro_cidade") ? document.getElementById("filtro_cidade").value.toLowerCase() : ""
    const filtroArea = document.getElementById("filtro_area") ? document.getElementById("filtro_area").value : ""
    const filtroTipo = document.getElementById("filtro_tipo") ? document.getElementById("filtro_tipo").value : ""

    let oportunidades = db.oportunidades || []
    let htmlCards = ""
    let contadorVagasExibidas = 0

    for (let i = 0; i < oportunidades.length; i++) {
        let op = oportunidades[i]

        const bateTitulo = op.titulo.toLowerCase().includes(filtroTitulo) || op.empresa.toLowerCase().includes(filtroTitulo)
        const bateCidade = op.cidade.toLowerCase().includes(filtroCidade)
        const bateArea = filtroArea === "" || op.area === filtroArea
        const bateTipo = filtroTipo === "" || op.tipo === filtroTipo

        if (bateTitulo && bateCidade && bateArea && bateTipo) {
            contadorVagasExibidas++

            let jaCandidatado = false
            if (op.candidatos && idUsuario) {
                for (let j = 0; j < op.candidatos.length; j++) {
                    if (op.candidatos[j] === idUsuario) {
                        jaCandidatado = true
                        break
                    }
                }
            }

            let htmlBotao = ""
            if (!eEmpresa) {
                let textoBotao = jaCandidatado ? "✔ Candidatado" : "Candidatar-se"
                let classeBotao = jaCandidatado ? "btn-candidatar ja-candidatado" : "btn-candidatar"
                let atributoDisabled = jaCandidatado ? "disabled" : ""
                let funcaoClique = jaCandidatado ? "" : `onclick="candidatarSe(${op.id})"`
                htmlBotao = `<button class="${classeBotao}" ${atributoDisabled} ${funcaoClique}>${textoBotao}</button>`
            }

            htmlCards += `
                <div class="vaga-card">
                    <h3>${op.titulo}</h3>
                    <p class="empresa-name">🏢 ${op.empresa}</p>
                    <div class="vaga-tags">
                        <span class="tag-tipo">${op.tipo}</span>
                        <span class="tag-area">${op.area.toUpperCase()}</span>
                    </div>
                    <p class="vaga-info">📍 <strong>Cidade:</strong> ${op.cidade}</p>
                    <p class="vaga-info">💰 <strong>Salário:</strong> ${op.salario || 'A combinar'}</p>
                    <p class="vaga-descricao">${op.descricao}</p>
                    <small class="vaga-encerramento">📅 Encerra em: ${op.data_encerramento}</small>
                    ${htmlBotao}
                </div>
            `
        }
    }

    if (totalVagasTxt) {
        totalVagasTxt.textContent = contadorVagasExibidas === 1
            ? "1 opportunity encontrada"
            : contadorVagasExibidas + " oportunidades encontradas"
    }

    if (contadorVagasExibidas === 0) {
        gridCards.innerHTML = '<div class="col-12 text-center text-muted p-5"><h5>Nenhuma vaga corresponde aos filtros aplicados.</h5></div>'
    } else {
        gridCards.innerHTML = htmlCards
    }
}

function deleteOportunidade(id) {
    db.oportunidades = db.oportunidades.filter(function (element) { return element.id != id })
    localStorage.setItem('vagas_oportunidades', JSON.stringify(db))
    displayMessage("Oportunidade removida com sucesso!")
}

function logout() {
    window.location.replace("../login/index.html")
    sessionStorage.removeItem("usuarioCorrente")
    alert("Você foi desconectado com sucesso!")
}

function exibeOportunidades() {
    const tabela = document.getElementById("table-oportunidades")
    if (!tabela) return

    let oportunidades = db.oportunidades || []
    let htmlLinhas = ""

    for (let i = 0; i < oportunidades.length; i++) {
        let op = oportunidades[i]
        htmlLinhas += "<tr>" +
            "<td>" + op.id + "</td>" +
            "<td>" + op.titulo + "</td>" +
            "<td>" + op.empresa + "</td>" +
            "<td>" + op.area + "</td>" +
            "<td>" + op.tipo + "</td>" +
            "<td>" + op.cidade + "</td>" +
            "<td>" + op.salario + "</td>" +
            "<td>" + op.data_encerramento + "</td>" +
            "</tr>"
    }

    tabela.innerHTML = htmlLinhas
}


function toggleMenu(event) {
    event.stopPropagation()
    const menuBalao = document.getElementById('menuBalao')
    if (menuBalao) menuBalao.classList.toggle('ativo')
}


document.addEventListener("DOMContentLoaded", function () {
    const dadosSessao = sessionStorage.getItem("usuarioCorrente")

    if (!dadosSessao) {
        alert("Acesso Negado! Realize seu login primeiro!")
        window.location.href = "../login/index.html"
        return
    }

    const usuarioLogado = JSON.parse(dadosSessao)
    const addVaga = document.querySelector("#cadastraVaga")
    const gerenciaVaga = document.querySelector("#gerenciaVaga")

    if (!usuarioLogado.empresa) {
        if (addVaga) addVaga.style.display = "none"
        if (gerenciaVaga) gerenciaVaga.style.display = "none"
    }

    const textButton = document.querySelector("#switchText")
    if (textButton) {
        usuarioLogado.empresa ? textButton.textContent = "Currículos Recebidos" : textButton.textContent = "Minhas Candidaturas"
    }
})


function init() {
    const empresaLogada = getSessionUser()

    const inputEmpresa = document.getElementById("inputEmpresa")
    if (inputEmpresa && empresaLogada) {
        inputEmpresa.value = empresaLogada.nome || empresaLogada.empresa || ""
        inputEmpresa.readOnly = true
    }

    const btnInsert = document.getElementById("btnInsert")
    if (btnInsert) {
        btnInsert.addEventListener("click", function () {
            const form = document.getElementById('form-oportunidade')
            
            if (!form.checkValidity()) {
                displayMessage("Preencha todos os campos obrigatórios (*).")
                return
            }

            let oportunidade = {
                titulo: document.getElementById("inputTitulo").value,
                empresa: document.getElementById("inputEmpresa").value,
                area: document.getElementById("inputArea").value,
                cidade: document.getElementById("inputCidade").value,
                salario: document.getElementById("inputSalario").value,
                tipo: document.getElementById("inputTipo").value,
                descricao: document.getElementById("inputDescricao").value,
                data_encerramento: document.getElementById("inputDataEncerramento").value
            }

            insertOportunidade(oportunidade)
            exibeOportunidades()
            form.reset()

            if (empresaLogada && inputEmpresa) {
                inputEmpresa.value = empresaLogada.nome || empresaLogada.empresa || ""
                inputEmpresa.readOnly = true
            }
        })
    }

    const btnUpdate = document.getElementById("btnUpdate")
    if (btnUpdate) {
        btnUpdate.addEventListener("click", function () {
            const idVal = document.getElementById("inputId").value
            if (!idVal) {
                displayMessage("Selecione uma oportunidade para ser alterada.")
                return
            }
            let campoId = parseInt(idVal)
            let oportunid = {
                titulo: document.getElementById("inputTitulo").value,
                empresa: document.getElementById("inputEmpresa").value,
                area: document.getElementById("inputArea").value,
                cidade: document.getElementById("inputCidade").value,
                salario: document.getElementById("inputSalario").value,
                tipo: document.getElementById("inputTipo").value,
                descricao: document.getElementById("inputDescricao").value,
                data_encerramento: document.getElementById("inputDataEncerramento").value
            }
            updateOportunidade(campoId, oportunid)
            exibeOportunidades()
            document.getElementById('form-oportunidade').reset()
            if (empresaLogada && inputEmpresa) {
                inputEmpresa.value = empresaLogada.nome || empresaLogada.empresa || ""
                inputEmpresa.readOnly = true
            }
        })
    }

    const btnDelete = document.getElementById("btnDelete")
    if (btnDelete) {
        btnDelete.addEventListener("click", function () {
            let campoId = document.getElementById("inputId").value
            if (campoId == "") {
                displayMessage("Selecione uma oportunidade a ser excluída.")
                return
            }
            deleteOportunidade(parseInt(campoId))
            exibeOportunidades()
            document.getElementById('form-oportunidade').reset()
            if (empresaLogada && inputEmpresa) {
                inputEmpresa.value = empresaLogada.nome || empresaLogada.empresa || ""
                inputEmpresa.readOnly = true
            }
        })
    }

    const btnClear = document.getElementById("btnClear")
    if (btnClear) {
        btnClear.addEventListener("click", function () {
            document.getElementById('form-oportunidade').reset()
            if (empresaLogada && inputEmpresa) {
                inputEmpresa.value = empresaLogada.nome || empresaLogada.empresa || ""
                inputEmpresa.readOnly = true
            }
        })
    }

    const gridOportunidades = document.getElementById("grid-oportunidades")
    if (gridOportunidades) {
        gridOportunidades.addEventListener("click", function (evento) {
            let linha = evento.target.closest('tr')
            if (!linha) return

            let colunas = linha.querySelectorAll("td")
            if (colunas.length === 0) return

            let id = parseInt(colunas[0].innerText)
            let op = db.oportunidades.find(o => o.id === id)
            if (!op) return

            document.getElementById("inputId").value = op.id
            document.getElementById("inputTitulo").value = op.titulo
            document.getElementById("inputEmpresa").value = op.empresa
            document.getElementById("inputArea").value = op.area
            document.getElementById("inputTipo").value = op.tipo
            document.getElementById("inputCidade").value = op.cidade
            document.getElementById("inputSalario").value = op.salario
            document.getElementById("inputDescricao").value = op.descricao
            document.getElementById("inputDataEncerramento").value = op.data_encerramento
        })
    }

    exibeOportunidades()
    listaOportunidades()
}


window.addEventListener('click', function () {
    const menuBalao = document.getElementById('menuBalao')
    if (menuBalao && menuBalao.classList.contains('ativo')) {
        menuBalao.classList.remove('ativo')
    }
})

const menuBalaoElement = document.getElementById('menuBalao')
if (menuBalaoElement) {
    menuBalaoElement.addEventListener('click', function (event) {
        event.stopPropagation()
    })
}


function redirectUser() {
    const userSession = getSessionUser()

    userSession.empresa ? window.location.replace("../curriculoRecebido/index.html") : window.location.replace("../vagasCandidatadas/index.html")
}