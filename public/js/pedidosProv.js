const socket = io();
const idProveedor = parseInt(document.getElementById('idProveedor').innerText);
console.log(idProveedor)

socket.on("connect", () => {
    console.log(socket.id);
});

socket.emit("nuevo-proveedor", idProveedor)

socket.on("validar-pedido", val => {
    console.log('llego pedido')
    setTimeout(recargar(),4000);
})

const urlFetch = '/proveedor/pagos';
fetch(urlFetch)
    .then((resp) => resp.json())
    .then(function(data){
        console.log(data)
          for(let dato of data){
              crearRegPago(dato)
          }
      })
    .catch((error) => {
      console.log(error);
    });

function crearRegPago(dato) {
    const producto = document.createElement('div');
        producto.classList.add('palta-1', 'noCursor')
        producto.id = dato.idPedido;
        producto.innerHTML = `
          <div class="contenedor-imagen" id="${dato.comprobante}" onclick="verImagen(this)"><img class="palta-img" src="${dato.comprobante}" width="100%"></div>
          <div class="monto"><label><b>Monto: $${dato.monto}</b></label></div>
          <div class="descripcion"><label>N° de Pedido: ${dato.idPedido}</label></div>
          <div>
          <button class="button_verde" onclick="verificarPago(${dato.idPedido}, 'verificado')">Aceptar</button>
          <button class="button_verde rojo" onclick="verificarPago(${dato.idPedido}, 'denegado')">Denegar</button>
          </div>`;
    document.getElementById('cuerpo').appendChild(producto)
}

function verImagen(e) {
    const id = e.id;
    window.open(id);
}

function verificarPago(id, estado) {
    const url = "/mercado/pagoVerificado";
    fetch(url, {
        method: "PUT",
        body: JSON.stringify({ id, estado }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res)
        .then((response) => {
            console.log("Success:", response);
            recargar();
        })
        .catch((error) => console.error("Error:", error));
}

function recargar() {
    location.reload();
}