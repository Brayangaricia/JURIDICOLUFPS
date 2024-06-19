//#region funciones necesarias

function currencyToDecimal(valor) {
    valor = valor.replace('$', '')
    while(valor.includes('.')){
        valor = valor.replace('.', '')
    }
    valor = valor.trim()
    return valor
}
const fechaFormat = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

var send = []
var eliminar = []

var countTable = parseInt(document.getElementById('cantData').textContent)
console.log(countTable)
var recive = document.getElementById('dataUse').textContent
recive = JSON.parse(recive)

const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
});

//#endregion

cambiarLotes()

function cambiarLotes() {
    const producto = document.getElementById('seleccionProducto').value
    const unidades = document.getElementById('numeroUnidades').value
    const productos = recive.productos.filter(x => x.codigo === producto.split('/')[0].trim())[0]
    const lotes = recive.lotes.filter(l => l.articuloid === productos.articuloid && l.cantidad >= parseInt(unidades))
    const seleccionLote = document.getElementById('seleccionLote')
    seleccionLote.innerHTML = ''
    lotes.forEach(l => {
        const option = document.createElement('option')
        option.innerHTML = `${l.codigo} / ${new Date(l.fechavenc).toLocaleDateString('es-CO', fechaFormat)}`
        seleccionLote.append(option)
    })
}

function insertarProducto() {

    //#region declarando componentes

    const producto = document.getElementById('seleccionProducto').value
    const unidades = document.getElementById('numeroUnidades').value
    const valorUnit = document.getElementById('valorVenta').value
    const lote = document.getElementById('seleccionLote').value

    if (lote === '' || unidades === '' || unidades == 0 || valorUnit === '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Los datos estan incompletos`
        })
    } else {
        const trProducto = document.createElement('tr')
        trProducto.id = countTable

        const tdDeId = document.createElement('td')
        const tdCodigo = document.createElement('td')
        const tdLote = document.createElement('td')
        const tdProducto = document.createElement('td')
        const tdUnidades = document.createElement('td')
        const tdValorunit = document.createElement('td')
        const tdValorTotal = document.createElement('td')
        const tdAcciones = document.createElement('td')
        tdDeId.hidden = true
        //#endregion

        //#region insertando componentes

        tdDeId.id = `detallefac${countTable}`
        tdCodigo.append(producto.split('/')[0].trim())
        tdLote.append(lote.split('/')[0].trim())
        tdLote.id = `loteProducto${countTable}`
        tdProducto.append(producto.split('/')[1].trim())
        tdUnidades.append(unidades)
        tdUnidades.id = `cantUnidad${countTable}`
        tdValorunit.append(formatter.format(valorUnit))
        tdValorTotal.append(formatter.format(unidades * valorUnit))
        tdValorTotal.id = `totalProducto${countTable}`
        tdAcciones.innerHTML = `<a onclick="eliminarProducto(${countTable})" class="btn btn-danger"><i >X</i></a>`
        tdAcciones.id = `accion${countTable}`

        tdCodigo.classList = "text-center"
        tdLote.classList = "text-center"
        tdProducto.classList = "text-center"
        tdUnidades.classList = "text-center"
        tdValorunit.classList = "text-center"
        tdValorTotal.classList = "text-center"
        tdAcciones.classList = "text-center"

        trProducto.append(tdDeId)
        trProducto.append(tdCodigo)
        trProducto.append(tdLote)
        trProducto.append(tdProducto)
        trProducto.append(tdUnidades)
        trProducto.append(tdValorunit)
        trProducto.append(tdValorTotal)
        trProducto.append(tdAcciones)

        //#endregion

        const tbody = document.getElementById('tablaProductos')
        tbody.append(trProducto)

        var totalFactura = document.getElementById('valorTotalFactura').value
        totalFactura = currencyToDecimal(totalFactura)
        document.getElementById('valorTotalFactura').value = formatter.format((parseInt(totalFactura) + (unidades * valorUnit)))

        var productoSend = recive.productos.filter(x => x.codigo === producto.split('/')[0].trim())[0]
        var loteSend = recive.lotes.filter(x => (
            x.codigo === lote.split('/')[0].trim() && x.articuloid === productoSend.articuloid))[0]

        send.push({
            producto: productoSend,
            lote: loteSend,
            detalle: {
                valor: valorUnit,
                cantidad: unidades
            }
        })

        console.log(send)

        var posi = recive.lotes.indexOf(loteSend)
        recive.lotes[posi].cantidad = parseInt(parseInt(recive.lotes[posi].cantidad, 10) - parseInt(unidades, 10))
        cambiarLotes()

        countTable++
    }
}

function eliminarProducto(id) {
    const tr = document.getElementById(`${id}`)
    const tbody = document.getElementById('tablaProductos')

    var contadorAux = id

    var totalRestar = document.getElementById(`totalProducto${contadorAux}`).textContent
    totalRestar = currencyToDecimal(totalRestar)
    var totalFactura = document.getElementById('valorTotalFactura').value
    totalFactura = currencyToDecimal(totalFactura)
    document.getElementById('valorTotalFactura').value = formatter.format((parseInt(totalFactura) - parseInt(totalRestar)))

    const unidadesArt = document.getElementById(`cantUnidad${contadorAux}`).textContent
    var lote = document.getElementById(`loteProducto${contadorAux}`).textContent
    lote = recive.lotes.filter(x => x.codigo === lote)
    var posi = recive.lotes.indexOf(lote[0])
    recive.lotes[posi].cantidad = parseInt(recive.lotes[posi].cantidad, 10) + parseInt(unidadesArt, 10)

    cambiarLotes()

    const defacturaId = document.getElementById(`detallefac${contadorAux}`).textContent
    if(defacturaId !== '') eliminar.push(defacturaId)
    send.splice(id, 1)

    while (contadorAux < countTable) {
        const trAux = document.getElementById(`${contadorAux + 1}`)
        if (trAux !== null) {
            document.getElementById(`detallefac${contadorAux + 1}`).id = `detallefac${contadorAux}`
            document.getElementById(`accion${contadorAux +1}`).innerHTML = `<a onclick="eliminarProducto(${contadorAux})" class="btn btn-danger"><i >X</i></a>`
            document.getElementById(`accion${contadorAux +1}`).id = `accion${contadorAux}`
            document.getElementById(`totalProducto${contadorAux + 1}`).id = `totalProducto${contadorAux}`
            document.getElementById(`cantUnidad${contadorAux + 1}`).id = `cantUnidad${contadorAux}`
            document.getElementById(`loteProducto${contadorAux + 1}`).id = `loteProducto${contadorAux}`
            trAux.id = contadorAux
            contadorAux++
        } else {
            break
        }
    }
    console.log(eliminar)
    countTable--

    tbody.removeChild(tr)
}

async function insertarFactura() {

    const tercero = document.getElementById('selectTercero').value
    const observacion = document.getElementById('observacion').value
    const total = document.getElementById('valorTotalFactura').value
    const facturaid = parseInt(document.getElementById('facturaid').textContent)

    const factura = {
        tercero: tercero.split('/')[1].trim(),
        codtercero: tercero.split('/')[0].trim(),
        observacion,
        sucid: parseInt(document.getElementById('sucid').textContent),
        total: currencyToDecimal(total),
        detalle: send,
        detalleDelete: eliminar
    }

    console.log(factura)

    const response = await fetch(`http://tiendasbambam.com:3001/factura/${facturaid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(factura)
    }).then( data => data.json())

    window.location = '/factura'
}