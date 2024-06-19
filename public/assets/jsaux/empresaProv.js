function eliminarEmpresaProv(terceroid, nombre) {
  Swal.fire({
    title: `Quieres eliminar la empresa ${nombre}?`,
    showDenyButton: true,
    confirmButtonText: 'Aceptar',
    denyButtonText: `Cancelar`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      window.location = `/empresaProve/eliminar/${terceroid}`
    }
  })
}