function Login() {
    const inputEmail = document.querySelector("#inputBtt").value
    const inputPass = document.querySelector("#inputPass").value

    if (!inputEmail || !inputPass) return

    const validate = validateLogin(inputEmail, inputPass)

    if (validate) {
        window.location.replace("../cadastro-vagas/index.html")
    } else {
        alert("E-mail ou senha incorretos!")
    }
}

function validateLogin(email, pass) {
    const dbData = localStorage.getItem("db_usuarios")
    const dados = JSON.parse(dbData) || []

    const usuarios = dados.usuarios

    for (let usuario of usuarios) {
        if (usuario.email === email && usuario.senha === pass) return true
    }
}