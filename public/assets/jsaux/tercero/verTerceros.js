function eliminarTercero(terceroid, nombre) {
  Swal.fire({
    title: `Quieres eliminar a ${nombre}?`,
    showDenyButton: true,
    confirmButtonText: 'Aceptar',
    denyButtonText: `Cancelar`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      window.location = `/tercero/eliminar/${terceroid}`
    }
  })
}