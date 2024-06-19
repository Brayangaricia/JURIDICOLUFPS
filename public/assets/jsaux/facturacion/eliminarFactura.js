function eliminarFactura(facturaid, codigo) {
  Swal.fire({
    title: `Quieres eliminar la factura ${codigo}?`,
    showDenyButton: true,
    confirmButtonText: 'Aceptar',
    denyButtonText: `Cancelar`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      window.location = `/factura/eliminar/${facturaid}`
    }
  })
}

function eliminarFacturaCompra(facturaid, codigo) {
  Swal.fire({
    title: `Quieres eliminar la factura ${codigo}?`,
    showDenyButton: true,
    confirmButtonText: 'Aceptar',
    denyButtonText: `Cancelar`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      window.location = `/facturacompra/eliminar/${facturaid}`
    }
  })
}