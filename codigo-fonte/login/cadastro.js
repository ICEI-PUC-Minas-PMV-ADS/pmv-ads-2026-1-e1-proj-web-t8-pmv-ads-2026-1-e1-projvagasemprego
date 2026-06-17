const LOGIN_URL = "index.html"
const HOME_URL = "../Cadastro-de-Oportunidades/lista_oportunidades.html"
let db_usuarios = {}
const usuarioCorrente = {}
let idNumber = 1
const divCNPJ = document.querySelector(".divCNPJ")
const divCPF = document.querySelector(".divCPF")

const dadosIniciais = {
    usuarios: [
        { 
            "id": generateUUID(), 
            "nome": "Administrador", 
            "email": "admin@uaitrampo.com", 
            "senha": "123", 
            "empresa": true, 
            "telefone": "31999999999",
            "cpf_cnpj": "00011122233344"
        },
        { 
            "id": generateUUID(), 
            "nome": "Candidato Teste", 
            "email": "candidato@uaitrampo.com", 
            "senha": "123", 
            "empresa": false, 
            "telefone": "31999999999",
            "cpf_cnpj": "00011122233"
        }
    ]
}


document.addEventListener("DOMContentLoaded", function() {
    divCNPJ.style.display = "none"
})


function initLoginApp() {
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente')
    if (usuarioCorrenteJSON) {
        usuarioCorrente = JSON.parse(usuarioCorrenteJSON)
    }

    const usuariosJSON = localStorage.getItem('db_usuarios')

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


function addUser({ nome, email, senha, empresa, telefone, cpfCnpj }) {
    const novoUsuario = {
        "id": generateUUID(),
        "nome": nome,
        "email": email,
        "senha": senha,
        "empresa": empresa,
        "telefone": telefone,
        "cpf_cnpj": cpfCnpj
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
    const telefone = Number(document.querySelector("#inputTelefoneCad").value)
    const cpfCnpj = document.querySelector("#inputCPF").value.trim()
    const senha = document.getElementById('inputSenhaCad').value
    const senha2 = document.getElementById('inputConfirmaSenha').value
    const usuarioEmpresa = document.getElementById('inputEmpresa')

    if (!nome || !email || !senha || !telefone || !cpfCnpj) {
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

    const userData = {
        nome,
        email,
        senha,
        empresa,
        telefone,
        cpfCnpj
    }

    addUser(userData)

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

const checkboxUserType = document.querySelector("#inputEmpresa")
checkboxUserType.addEventListener("change", function() {
    const inputCNPJ = document.querySelector("#inputCNPJ")
    const inputCPF = document.querySelector("#inputCPF")

    if (checkboxUserType.checked) {
        divCNPJ.style.display = "flex"
        divCNPJ.required = true
        divCPF.style.display = "none"
        inputCPF.value = ""

    } else {
        divCNPJ.style.display = "none"
        divCPF.style.display = "flex"
        inputCNPJ.value = ""
    }
})