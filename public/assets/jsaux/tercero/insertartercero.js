function cambiarCliaProv(){

    const radioCli = document.getElementById('escliente')
    const selectEmpresa= document.getElementById('selectEmpresa')

    if(radioCli.checked){
        selectEmpresa.disabled = true
    }else{
        selectEmpresa.disabled= false
    }
}