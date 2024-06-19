//#region controller view ver terceros

function eliminarUsuarios(terceroid, nombre) {
  Swal.fire({
    title: `Quieres eliminar a ${nombre}?`,
    showDenyButton: true,
    confirmButtonText: 'Aceptar',
    denyButtonText: `Cancelar`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      const algo = window.location = `/usuario/eliminar/${terceroid}`
      Swal.fire('Eliminado', '', 'success')
    }
  })
}

//#endregion

//#region controller view actualizar tercero

function onclickCheck() {
  const checkPass = document.getElementById('checkPass')
  const oldPass = document.getElementById('oldPass')
  const newPass = document.getElementById('newPass')

  if (checkPass.checked) {
    oldPass.disabled = false
    newPass.disabled = false
  } else {
    oldPass.disabled = true
    newPass.disabled = true
  }
}

//#endregion