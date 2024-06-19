function compraPack(){

    const radioPack = document.getElementById('comprapack')
    const cantpack = document.getElementById('cantpack')

    if(radioPack.checked){
        cantpack.disabled= false
    }else{
        cantpack.disabled = true
    }
}