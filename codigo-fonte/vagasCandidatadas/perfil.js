document.addEventListener('DOMContentLoaded', () => {
    const sessao = sessionStorage.getItem('usuarioCorrente')
    if (!sessao) {
        alert('Você precisa estar logado para acessar seu perfil.')
        window.location.href = '../login/index.html'
        return
    }

    const usuarioCorrente = JSON.parse(sessao)
    const dbData = localStorage.getItem('db_usuarios')
    const db = dbData ? JSON.parse(dbData) : { usuarios: [] }
    const usuarioIndex = db.usuarios.findIndex(u => u.id === usuarioCorrente.id)

    if (usuarioIndex < 0) {
        alert('Usuário não encontrado. Faça login novamente.')
        sessionStorage.removeItem('usuarioCorrente')
        window.location.href = '../login/index.html'
        return
    }

    const usuario = db.usuarios[usuarioIndex]
    const nomeInput = document.getElementById('nome')
    const emailInput = document.getElementById('email')
    const tipoContaInput = document.getElementById('tipoConta')
    const form = document.getElementById('perfil-form')
    const mensagem = document.getElementById('perfil-mensagem')

    nomeInput.value = usuario.nome || ''
    emailInput.value = usuario.email || ''
    tipoContaInput.value = usuario.empresa ? 'Empresa' : 'Candidato'

    form.addEventListener('submit', event => {
        event.preventDefault()

        const nome = nomeInput.value.trim()
        const email = emailInput.value.trim()

        if (!nome || !email) {
            alert('Preencha nome e e-mail para atualizar seu perfil.')
            return
        }

        const emailEmUso = db.usuarios.some((u, index) => index !== usuarioIndex && u.email === email)
        if (emailEmUso) {
            alert('Este e-mail já está em uso por outro usuário.')
            return
        }

        db.usuarios[usuarioIndex].nome = nome
        db.usuarios[usuarioIndex].email = email

        localStorage.setItem('db_usuarios', JSON.stringify(db))

        const usuarioAtualizado = {
            id: usuario.id,
            nome: nome,
            email: email,
            empresa: usuario.empresa
        }

        sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioAtualizado))

        mensagem.textContent = 'Perfil atualizado com sucesso!'
        mensagem.style.display = 'block'
    })
})

function toggleMenu(event) {
    event.stopPropagation()
    const menuBalao = document.getElementById('menuBalao')
    if (menuBalao) menuBalao.classList.toggle('ativo')
}

window.addEventListener('click', event => {
    const menuBalao = document.getElementById('menuBalao')
    if (menuBalao && menuBalao.classList.contains('ativo')) {
        menuBalao.classList.remove('ativo')
    }
})

document.getElementById('menuBalao').addEventListener('click', event => {
    event.stopPropagation()
})

function logout() {
    sessionStorage.removeItem('usuarioCorrente')
    window.location.href = '../login/index.html'
}
