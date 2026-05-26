document.addEventListener("DOMContentLoaded", function () {

    const dadosSessao = sessionStorage.getItem("usuarioCorrente")
    const addVaga = document.querySelector("#cadastraVaga")
    const gerenciaVaga = document.querySelector("#gerenciaVaga")

    if (!dadosSessao) {
        alert("Acesso Negado! Realize seu login primeiro!")
        window.location.href = "../login/index.html"
        return
    }

    const usuarioLogado = JSON.parse(dadosSessao)

    if (!usuarioLogado.empresa) {
        addVaga.style.display = "none"
        gerenciaVaga.style.display = "none"
    }
})


let db_oportunidades_inicial = {
    "oportunidades": [
        {
            "id": 1,
            "titulo": "Desenvolvedor Front-end Junior",
            "empresa": "TechSolutions",
            "area": "tecnologia",
            "cidade": "Belo Horizonte",
            "salario": "R$ 2.500,00",
            "tipo": "CLT",
            "descricao": "Vaga para desenvolvedor front-end com conhecimentos em HTML, CSS e JavaScript.",
            "data_encerramento": "2026-06-30",
            candidatos: []
        },
        {
            "id": 2,
            "titulo": "Analista de Marketing Digital",
            "empresa": "Agência Criativa",
            "area": "marketing",
            "cidade": "São Paulo",
            "salario": "R$ 3.000,00",
            "tipo": "CLT",
            "descricao": "Responsável por campanhas nas redes sociais e gestão de tráfego pago.",
            "data_encerramento": "2026-05-31",
            candidatos: []
        },
        {
            "id": 3,
            "titulo": "Estagiário de Recursos Humanos",
            "empresa": "RH Consultoria",
            "area": "rh",
            "cidade": "Betim",
            "salario": "R$ 800,00",
            "tipo": "Estágio",
            "descricao": "Apoio ao setor de recrutamento e seleção de candidatos.",
            "data_encerramento": "2026-06-15",
            candidatos: []
        }
    ]
}


function initDbOportunidades() {
    const db_oportunity = localStorage.getItem("vagas_oportunidades")

    if (!db_oportunity) {
        const dadosFormat = JSON.stringify(db_oportunidades_inicial)
        localStorage.setItem("vagas_oportunidades", dadosFormat)
    }
}

initDbOportunidades()


let db = JSON.parse(localStorage.getItem('db_oportunidade'))
if (!db) {
    db = db_oportunidades_inicial
}


function displayMessage(msg) {
    $('#msg').html('<div class="alert alert-warning">' + msg + '</div>')
}


function insertOportunidade(oportunidade) {
    let novoId = 1
    if (db.oportunidades.length != 0)
        novoId = db.oportunidades[db.oportunidades.length - 1].id + 1

    let novaOportunidade = {
        "id": novoId,
        "titulo": oportunidade.titulo,
        "empresa": oportunidade.empresa,
        "area": oportunidade.area,
        "cidade": oportunidade.cidade,
        "salario": oportunidade.salario,
        "tipo": oportunidade.tipo,
        "descricao": oportunidade.descricao,
        "data_encerramento": oportunidade.data_encerramento,
        "candidatos": oportunidade.candidatos
    }

    db.oportunidades.push(novaOportunidade)
    displayMessage("Oportunidade inserida com sucesso!")
    localStorage.setItem('db_oportunidade', JSON.stringify(db))
}


function updateOportunidade(id, oportunidade) {
    let index = db.oportunidades.map(obj => obj.id).indexOf(id)

    db.oportunidades[index].titulo = oportunidade.titulo
    db.oportunidades[index].empresa = oportunidade.empresa
    db.oportunidades[index].area = oportunidade.area;
    db.oportunidades[index].cidade = oportunidade.cidade
    db.oportunidades[index].salario = oportunidade.salario
    db.oportunidades[index].tipo = oportunidade.tipo;
    db.oportunidades[index].descricao = oportunidade.descricao
    db.oportunidades[index].data_encerramento = oportunidade.data_encerramento

    displayMessage("Oportunidade alterada com sucesso!")
    localStorage.setItem('db_oportunidade', JSON.stringify(db))
}

function deleteOportunidade(id) {
    db.oportunidades = db.oportunidades.filter(function (element) { return element.id != id })
    displayMessage("Oportunidade removida com sucesso!")
    localStorage.setItem('db_oportunidade', JSON.stringify(db))
}


function logout() {
    window.location.replace("../login/index.html")
    sessionStorage.removeItem("usuarioCorrente")

    alert("Você foi desconectado com sucesso!")
}


function listaOportunidades() {
    let oportunidades = db.oportunidades

    let filtroTitulo = document.getElementById('filtro_titulo').value.toLowerCase()
    let filtroCidade = document.getElementById('filtro_cidade').value.toLowerCase()
    let filtroArea = document.getElementById('filtro_area').value
    let filtroTipo = document.getElementById('filtro_tipo').value

    let resultado = oportunidades.filter(op => {
        let bateTitulo = filtroTitulo === '' || op.titulo.toLowerCase().includes(filtroTitulo) || op.empresa.toLowerCase().includes(filtroTitulo)
        let bateCidade = filtroCidade === '' || op.cidade.toLowerCase().includes(filtroCidade)
        let bateArea = filtroArea === '' || op.area === filtroArea
        let bateTipo = filtroTipo === '' || op.tipo === filtroTipo
        return bateTitulo && bateCidade && bateArea && bateTipo
    })

    let total = resultado.length
    $("#total-vagas").text(total + (total === 1 ? ' vaga encontrada' : ' vagas encontradas'))
    $("#cards-oportunidades").empty()

    if (total === 0) {
        $("#cards-oportunidades").append('<p class="sem-resultados">Nenhuma vaga encontrada para os filtros selecionados.</p>')
        return
    }

    resultado.forEach(op => {
        let dataFormatada = op.data_encerramento ? 'Encerra em ' + op.data_encerramento : ''
        $("#cards-oportunidades").append(`
            <div class="vaga-card" onclick="window.location.href='../vagas/vaga_detalhes.html?id=${op.id}'">
                <h5>${op.titulo}</h5>
                <div class="empresa">🏢 ${op.empresa} — ${op.cidade}</div>
                <div class="descricao">${op.descricao}</div>
                <div class="badges">
                    <span class="badge-tipo">${op.tipo}</span>
                    <span class="badge-area">${op.area}</span>
                </div>
                <div class="rodape">
                    <span class="salario">${op.salario || 'Salário a combinar'}</span>
                    <span>${dataFormatada}</span>
                </div>
            </div>
        `)
    })
}


window.onload = () => listaOportunidades()


function toggleMenu(event) {

    event.stopPropagation()
    const menuBalao = document.getElementById('menuBalao')
    menuBalao.classList.toggle('ativo')
}


window.addEventListener('click', function (event) {
    const menuBalao = document.getElementById('menuBalao')
    if (menuBalao && menuBalao.classList.contains('ativo')) {
        menuBalao.classList.remove('ativo')
    }
})


document.getElementById('menuBalao').addEventListener('click', function (event) {
    event.stopPropagation()
})