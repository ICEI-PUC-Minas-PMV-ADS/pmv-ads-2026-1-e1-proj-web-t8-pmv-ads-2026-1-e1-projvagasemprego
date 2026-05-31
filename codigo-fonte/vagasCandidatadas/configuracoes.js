document.addEventListener('DOMContentLoaded', () => {
    const sessao = sessionStorage.getItem('usuarioCorrente')
    if (!sessao) {
        alert('Você precisa estar logado para acessar configurações.')
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
    const senhaAtualInput = document.getElementById('senhaAtual')
    const novaSenhaInput = document.getElementById('novaSenha')
    const confirmaSenhaInput = document.getElementById('confirmaSenha')
    const notificacoesInput = document.getElementById('notificacoes')
    const form = document.getElementById('configuracoes-form')
    const mensagem = document.getElementById('config-mensagem')

    notificacoesInput.checked = usuario.configuracoes ? !!usuario.configuracoes.notificacoes : true

    form.addEventListener('submit', event => {
        event.preventDefault()

        const senhaAtual = senhaAtualInput.value.trim()
        const novaSenha = novaSenhaInput.value.trim()
        const confirmaSenha = confirmaSenhaInput.value.trim()
        const notificacoes = notificacoesInput.checked

        if (novaSenha || confirmaSenha) {
            if (!senhaAtual) {
                alert('Digite sua senha atual para alterar a senha.')
                return
            }
            if (senhaAtual !== usuario.senha) {
                alert('Senha atual incorreta.')
                return
            }
            if (novaSenha.length < 4) {
                alert('A nova senha deve ter pelo menos 4 caracteres.')
                return
            }
            if (novaSenha !== confirmaSenha) {
                alert('A nova senha e a confirmação não coincidem.')
                return
            }
            db.usuarios[usuarioIndex].senha = novaSenha
        }

        db.usuarios[usuarioIndex].configuracoes = {
            notificacoes: notificacoes
        }

        localStorage.setItem('db_usuarios', JSON.stringify(db))

        senhaAtualInput.value = ''
        novaSenhaInput.value = ''
        confirmaSenhaInput.value = ''

        mensagem.textContent = 'Configurações salvas com sucesso!'
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
