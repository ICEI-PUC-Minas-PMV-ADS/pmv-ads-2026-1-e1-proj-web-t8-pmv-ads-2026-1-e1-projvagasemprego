function updatePassword(e) {
    event.preventDefault()
    const newPass = document.querySelector("#newPass").value
    const confirmPass = document.querySelector("#confirmPass").value
    const email = document.querySelector("#email").value

    if (newPass === confirmPass) {
        alert("Senha ajustada com sucesso!")
        updateDBPass(newPass, email)
    } else {
        alert("As senhas não coincidem!")
    }
}


function updateDBPass(newPass, email) {
    const dbUser = localStorage.getItem("db_usuarios")
    const dados = JSON.parse(dbUser) || []

    const usuarios = dados.usuarios

    for (let usuario of usuarios) {
        if (usuario.email === email) {
            usuario.senha = newPass
            localStorage.setItem
        }
    }

    localStorage.setItem("db_usuarios", JSON.stringify(dados))

    window.location.replace("../login/index.html")
}