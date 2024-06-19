function validarContrasenia() {

    const contrasenia = document.getElementById('password').value
    const checkcontrasenia = document.getElementById('checkpassword').value

    if (contrasenia !== checkcontrasenia) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Las contraseñas no coinciden`
        })
    }
}

document.getElementById('changepass').value = 0

function onclickCheck() {
    const checkPass = document.getElementById('changepass')
    const oldPass = document.getElementById('password')
    const newPass = document.getElementById('checkpassword')

    if (checkPass.checked) {
        oldPass.disabled = false
        newPass.disabled = false
        checkPass.value = 1
    } else {
        oldPass.disabled = true
        newPass.disabled = true
        checkPass.value = 0
    }
}