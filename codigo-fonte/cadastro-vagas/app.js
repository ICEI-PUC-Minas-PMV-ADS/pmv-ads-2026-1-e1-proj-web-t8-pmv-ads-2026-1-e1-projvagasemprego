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
            "data_encerramento": "2026-06-30"
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
            "data_encerramento": "2026-05-31"
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
            "data_encerramento": "2026-06-15"
        }
    ]
}

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
        "data_encerramento": oportunidade.data_encerramento
    }

    db.oportunidades.push(novaOportunidade);
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
