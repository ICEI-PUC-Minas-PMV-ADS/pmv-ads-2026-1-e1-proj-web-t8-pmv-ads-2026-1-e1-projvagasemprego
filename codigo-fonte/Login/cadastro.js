const LOGIN_URL = "index.html"

const HOME_URL = "../Cadastro-de-Oportunidades/lista_oportunidades.html"

var db_usuarios = {}

var usuarioCorrente = {}

function generateUUID() {
    var d = new Date().getTime()
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16
        if (d > 0) {
            r = (d + r) % 16 | 0
            d = Math.floor(d / 16)
        } else {
            r = (d2 + r) % 16 | 0
            d2 = Math.floor(d2 / 16)
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    })
}

const dadosIniciais = {
    usuarios: [
        { "id": generateUUID(), "nome": "Administrador", "email": "admin@uaitrampo.com", "senha": "123" },
        { "id": generateUUID(), "nome": "Candidato Teste", "email": "candidato@uaitrampo.com", "senha": "123" }
    ]
}

function initLoginApp() {
    var usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente')
    if (usuarioCorrenteJSON) {
        usuarioCorrente = JSON.parse(usuarioCorrenteJSON)
    }

    var usuariosJSON = localStorage.getItem('db_usuarios')

    if (!usuariosJSON) {
        db_usuarios = dadosIniciais
        localStorage.setItem('db_usuarios', JSON.stringify(dadosIniciais))
    } else {
        db_usuarios = JSON.parse(usuariosJSON)
    }
}


function loginUser(email, senha) {
    for (var i = 0; i < db_usuarios.usuarios.length; i++) {
        var usuario = db_usuarios.usuarios[i]

        if (email === usuario.email && senha === usuario.senha) {
            usuarioCorrente.id    = usuario.id
            usuarioCorrente.nome  = usuario.nome
            usuarioCorrente.email = usuario.email

            sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente))
            return true
        }
    }
    return false
}

function logoutUser() {
    usuarioCorrente = {}
    sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente))
    window.location.href = LOGIN_URL
}

function addUser(nome, email, senha) {
    var novoUsuario = {
        "id": generateUUID(),
        "nome": nome,
        "email": email,
        "senha": senha
    }
    db_usuarios.usuarios.push(novoUsuario)
    localStorage.setItem('db_usuarios', JSON.stringify(db_usuarios))
}

function processaFormLogin(event) {
    event.preventDefault()

    var email = document.getElementById('inputEmail').value
    var senha = document.getElementById('inputSenha').value

    if (!email || !senha) {
        alert('Preencha o e-mail e a senha.')
        return
    }

    var loginOk = loginUser(email, senha)

    if (loginOk) {
        window.location.href = HOME_URL
    } else {
        alert('E-mail ou senha incorretos. Tente novamente.')
    }
}


function processaFormCadastro(event) {
    event.preventDefault()

    var nome  = document.getElementById('inputNome').value.trim()
    var email = document.getElementById('inputEmailCad').value.trim()
    var senha = document.getElementById('inputSenhaCad').value
    var senha2 = document.getElementById('inputConfirmaSenha').value

    if (!nome || !email || !senha) {
        alert('Preencha todos os campos obrigatórios.')
        return
    }

    if (senha.length < 4) {
        alert('A senha deve ter no mínimo 4 caracteres.')
        return
    }

    if (senha !== senha2) {
        alert('As senhas não conferem. Tente novamente.')
        return
    }

    var emailJaExiste = db_usuarios.usuarios.some(u => u.email === email)
    if (emailJaExiste) {
        alert('Este e-mail já está cadastrado. Faça login ou use outro e-mail.')
        return
    }

    addUser(nome, email, senha);
    alert('Cadastro realizado com sucesso! Faça login para continuar.')
    window.location.href = LOGIN_URL
}

initLoginApp()

var formLogin = document.getElementById('login-form')
if (formLogin) {
    formLogin.addEventListener('submit', processaFormLogin)
}

var formCadastro = document.getElementById('cadastro-form')
if (formCadastro) {
    formCadastro.addEventListener('submit', processaFormCadastro)
}
