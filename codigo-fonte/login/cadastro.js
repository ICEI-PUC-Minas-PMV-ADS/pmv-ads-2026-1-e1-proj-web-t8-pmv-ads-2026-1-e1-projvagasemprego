const LOGIN_URL = "index.html"
const HOME_URL = "../Cadastro-de-Oportunidades/lista_oportunidades.html"
let db_usuarios = {}
const usuarioCorrente = {}
let idNumber = 1

const dadosIniciais = {
    usuarios: [
        { "id": generateUUID(), "nome": "Administrador", "email": "admin@uaitrampo.com", "senha": "123", "empresa": true },
        { "id": generateUUID(), "nome": "Candidato Teste", "email": "candidato@uaitrampo.com", "senha": "123", "empresa": false }
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
    for (let i = 0; i < db_usuarios.usuarios.length; i++) {
        let usuario = db_usuarios.usuarios[i]

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


function addUser(nome, email, senha, empresa) {
    var novoUsuario = {
        "id": generateUUID(),
        "nome": nome,
        "email": email,
        "senha": senha,
        "empresa": empresa
    }
    db_usuarios.usuarios.push(novoUsuario)
    localStorage.setItem('db_usuarios', JSON.stringify(db_usuarios))
}


function processaFormLogin(event) {
    event.preventDefault()

    const email = document.getElementById('inputEmail').value
    const senha = document.getElementById('inputSenha').value

    if (!email || !senha) {
        alert('Preencha o e-mail e a senha.')
        return
    }

    const loginOk = loginUser(email, senha)

    if (loginOk) {
        window.location.href = HOME_URL
    } else {
        alert('E-mail ou senha incorretos. Tente novamente.')
    }
}


function processaFormCadastro(event) {
    event.preventDefault()

    const nome  = document.getElementById('inputNome').value.trim()
    const email = document.getElementById('inputEmailCad').value.trim()
    const senha = document.getElementById('inputSenhaCad').value
    const senha2 = document.getElementById('inputConfirmaSenha').value
    const usuarioEmpresa = document.getElementById('inputEmpresa')

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

    const empresa = usuarioEmpresa.checked ? true : false

    let emailJaExiste = db_usuarios.usuarios.some(u => u.email === email)
    if (emailJaExiste) {
        alert('Este e-mail já está cadastrado. Faça login ou use outro e-mail.')
        return
    }


    addUser(nome, email, senha, empresa)
    alert('Cadastro realizado com sucesso! Faça login para continuar.')
    window.location.href = LOGIN_URL
}


initLoginApp()


const formLogin = document.getElementById('login-form')
if (formLogin) {
    formLogin.addEventListener('submit', processaFormLogin)
}


const formCadastro = document.getElementById('cadastro-form')
if (formCadastro) {
    formCadastro.addEventListener('submit', processaFormCadastro)
}


function generateUUID() {
    return idNumber++
}