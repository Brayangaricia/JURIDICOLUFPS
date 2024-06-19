class Excel {
  constructor(content) {
    this.content = content
  }
  header() {
    return this.content[0]
  }
  rows() {
    return new RowCollection(this.content.slice(1, this.content.length))
  }
}

class RowCollection {
  constructor(rows) {
    this.rows = rows
  }
  first() {
    return new Row(this.rows[0])
  }
  get(index) {
    return new Row(this.rows[index])
  }
  count() {
    return this.rows.length
  }
}



class Row {
  constructor(row) {
    this.row = row
  }
  codigo() {
    return this.row[0]
  }
  preciov() {
    return this.row[1]
  }
  precioc() {
    return this.row[2]
  }
  comprapack() {
    return this.row[3]
  }
  cantidad() {
    return this.row[4]
  }
  nombre() {
    return this.row[5]
  }
  cantmax() {
    return this.row[6]
  }
  cantmin() {
    return this.row[7]
  }
  selectGrupo() {
    return this.row[8]
  }
}

class Producto {
  constructor(row){
    this.row = row
  }

  create(){
    return {
      codigo: this.row.codigo(),
      preciov: this.row.preciov(),
      precioc: this.row.precioc(),
      radio1: this.row.comprapack(),
      cantidad: this.row.cantidad(),
      sucid: parseInt(document.getElementById('sucid').textContent),
      nombre: this.row.nombre(),
      cantmax: this.row.cantmax(),
      cantmin: this.row.cantmin(),
      selectGrupo: this.row.selectGrupo()
    }
  }
}

const productos = []

class ExcelPrinter {
  static print(tableId, excel) {
    const table = document.getElementById(tableId)
    excel.header().forEach(title => {
      table.querySelector("thead>tr").innerHTML += `<td>${title}</td >`
    })
    for (let index = 0; index < excel.rows().count(); index++) {
      const row = excel.rows().get(index);
      const prodcuto = new Producto(row);
      productos.push(prodcuto.create())
      table.querySelector('tbody').innerHTML += `
        <tr>
          <td> ${row.codigo()} </td>
          <td> ${row.preciov()} </td>
          <td> ${row.precioc()}</td>
          <td> ${row.comprapack()}</td>
          <td> ${row.cantidad()}</td>
          <td> ${row.nombre()}</td>
          <td> ${row.cantmax()}</td>
          <td> ${row.cantmin()}</td>
          <td> ${row.selectGrupo()}</td>
        </tr>
          `
    }
    subirBack(productos);
  }
}

async function subirBack(prodcutos) {

  for(var i = 0; i < prodcutos.length; i++) {

    await fetch('http://tiendasbambam.com:3000/articulo/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prodcutos[i])
    }).then(data => data.json())

  }
}

const excelInput = document.getElementById('excel-input')
excelInput.addEventListener('change', async function () {
  const content = await readXlsxFile(excelInput.files[0])
  const excel = new Excel(content)
  ExcelPrinter.print('excel-table', excel)
})