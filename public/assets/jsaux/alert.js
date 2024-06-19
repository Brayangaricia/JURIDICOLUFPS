const mostrarAlertSuccess = (mensaje) => {
    Swal.fire({
        icon: 'success',
        title: 'Bien hecho!',
        text: `${mensaje}`
      })
}

const mostrarAlertError = (mensaje) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${mensaje}`
      })
}

document.getElementById('llamado').click()