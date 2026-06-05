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


function getCurriculums() {
    const curData = localStorage.getItem("vagas_oportunidades")
    const dadosTratados = JSON.parse(curData)

    
}