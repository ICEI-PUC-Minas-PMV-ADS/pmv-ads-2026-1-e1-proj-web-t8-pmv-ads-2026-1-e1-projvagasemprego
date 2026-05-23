function initDB() {
    const dbData = localStorage.getItem("db_usuarios")

    if (!dbData) {
        const dadosIniciais = {
            usuarios: [
                {
                    "id": "1",
                    "nome": "Administrador",
                    "email": "admin@uaitrampo.com",
                    "senha": "123",
                    "empresa": true
                },
                {
                    "id": "2",
                    "nome": "Candidato Teste",
                    "email": "candidato@uaitrampo.com",
                    "senha": "123",
                    "empresa": false
                }
            ]
        }

        localStorage.setItem("db_usuarios", JSON.stringify(dadosIniciais))
    }
}


function logarEGuardarSessao(id, email, nome, permEmpresa) {
    const usuarioCorrente = {
        id: id,
        email: email,
        nome: nome,
        empresa: permEmpresa
    }

    sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente))
}


function Login() {
    const inputEmail = document.querySelector("#inputBtt").value
    const inputPass = document.querySelector("#inputPass").value

    if (!inputEmail || !inputPass) {
        alert("Por favor, preencha o campo de e-mail e senha!")
        return
    }

    const validate = validateLogin(inputEmail, inputPass)

    if (validate) {
        window.location.replace("../cadastro-vagas/index.html")
    } else {
        alert("E-mail ou senha incorretos!")
    }
}

initDB()

function validateLogin(email, pass) {
    const dbData = localStorage.getItem("db_usuarios")
    const dados = JSON.parse(dbData) || { usuarios: [] }

    const usuarios = dados.usuarios || []

    for (let usuario of usuarios) {
        if (usuario.email === email && usuario.senha === pass) {
            logarEGuardarSessao(usuario.id, email, usuario.nome, usuario.empresa)
            return true
        }
    }

    return false
}