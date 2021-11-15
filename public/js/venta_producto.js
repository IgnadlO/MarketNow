/*----------Variables----------*/
const cdb = document.getElementById('cdb');
const cuerpo = document.getElementById('cuerpo');
const cuerpo2 = document.getElementById('cuerpo2');
const subtotal = document.getElementById('subtotal');
let cuerpo3 = document.getElementById('cuerpo3');
const nom = document.getElementById('Nombre_producto');
let monto =0;
let p2 = [];
let idsAcumulados = [];
const cant = document.getElementById("cant");
nom.addEventListener("keyup", filtrador_nombre);
document.getElementById('terminarVenta')
.addEventListener("click", subirVenta);
document.getElementById("cdb")
.addEventListener("keyup",pepe);
document.getElementById('cancelarVenta')
.addEventListener("click",cancelarcompra);
document.getElementById('cant')
.addEventListener("keyup", actSubtotal);

let info;
fetch('/comercio/productos')
    .then((resp) => resp.json())
    .then(function(data){
      info = data;
      console.log(info)
      for(let i = 0; i < info.length; i++) {
        cuerpo.insertAdjacentHTML('beforeend', `
        <tr onclick="seleccionarProducto(${info[i].cdb}, '${info[i].nombre}', ${info[i].precioVenta})"><td>${info[i].nombre}</td><td>${info[i].precioVenta}</td></tr>`)
        }
    })
    .catch((error) => {
      console.log(error);
    });

let actPrecio = 0;

function seleccionarProducto(cdb, nombre, precio){
  const codigo = document.getElementById('cdb');
  nom.value = nombre;
  subtotal.innerHTML = precio;
  actPrecio = precio;
  codigo.value = cdb;
  document.getElementById('cant').focus();
}

function presionoTeclaBody(e){
  if(e.key != 'Enter') return 0;
  const codigo = document.getElementById('cdb');
  if(codigo.value != null && codigo.value != undefined && codigo.value != ''){
    productos();
    filtrador_nombre();
  }
}

function actSubtotal(){
  if(document.getElementById('cdb').value == '') return 0;
  const valor = document.getElementById('cant').value;
  if(valor == '') subtotal.innerText = actPrecio;
  if(isNaN(valor) || valor == '') return 0;
  const subOld = parseInt(subtotal.innerText, 10);
  const nValor = (parseInt(valor, 10) * actPrecio);
  subtotal.innerText = nValor;
}


/*----------Funciones----------*/
function filtrador_nombre(e) {
  var input, filter, table, tr, td, i, j, visible,precio,producto;
  input = document.getElementById('Nombre_producto');
  filter = input.value.toUpperCase();
  tr = cuerpo.getElementsByTagName("tr");
  const visibles = [];

  for (i = 0; i < tr.length; i++) {
    visible = false;
    td = tr[i].getElementsByTagName("td");
    for (j = 0; j < td.length; j++) {
      if (td[j] && td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
        visible = true;
        producto=td[j];
      }
    }
    if (visible === true) {
      tr[i].style.display = "";
      precio = td[1];
      if(e != undefined && e.key == 'ArrowRight') {
        tr[i].onclick();
        break;
      }
    } else {
      tr[i].style.display = "none";
    }
  }
  console.log(visibles)
}
function cancelarcompra(){
  let total = document.getElementById("total");
  let cant = document.getElementById("cant");
  cuerpo2.innerHTML="";
  total.innerText = 0;
  actPrecio = 0;
  monto = 0;
  p2 = [];
  idsAcumulados = [];
  location.reload();
}

function pepe(e){
  if (e.key=="Enter") productos();
}


function borrar_product(product, precio) {
  let elmtTable = document.getElementById('cuerpo2');
  let tableRows = document.getElementById('tr' + product);
  const cantidad = document.getElementById('cant' + product);
  const oldMonto = parseInt(cantidad.innerText, 10) * precio;
  const oldTotal = document.getElementById("total").innerText;
  const nuevoMonto = (parseInt(oldTotal, 10) - oldMonto)
  document.getElementById("total").innerText = nuevoMonto;
  monto = nuevoMonto;
  idsAcumulados.splice(idsAcumulados.indexOf(product), 1);
  p2.splice(idsAcumulados.indexOf(product), 1);  
  elmtTable.removeChild(tableRows)
}


function productos(){
  var total = document.getElementById("total");
  let nuevaCantidad = 1;
  const codigoB = parseInt(cdb.value);
  let datosProducto;
  if(cant.value != '' || cant.value != 0) nuevaCantidad = parseInt(cant.value);
  if(idsAcumulados.includes(codigoB)) {
    p2.forEach(val => {
      if (val.cdb == codigoB) {
      val.cantidad += nuevaCantidad;
      monto += parseInt(val.precioVenta) * nuevaCantidad;
    }
    })
  } else {
  datosProducto = info.filter(val=>{
    if (val.cdb == codigoB){
      val.cantidad=nuevaCantidad;
      return true;}
  })
  p2.push(datosProducto[0]);
  idsAcumulados.push(datosProducto[0].cdb)
  monto += parseInt(datosProducto[0].precioVenta) * nuevaCantidad;
  }

  if(document.getElementById('td' + codigoB) != undefined) {
    const cantidad = document.getElementById('cant' + codigoB);
    const oldCant = parseInt(cantidad.innerText);
    cantidad.innerText = oldCant + nuevaCantidad;
    const oldReg = document.getElementById('tr' + codigoB)
  } else {
    tr = cuerpo.getElementsByTagName("tr");
    const regTabla = `<tr id='tr${datosProducto[0].cdb}'>
      <td id="td${datosProducto[0].cdb}">${datosProducto[0].cdb}</td>
      <td>${datosProducto[0].nombre}</td>
      <td>$${datosProducto[0].precioVenta}</td>
      <td id="cant${datosProducto[0].cdb}">${nuevaCantidad}</td>
      <td><i class="fas fa-times-circle quitar" onclick="borrar_product(${datosProducto[0].cdb}, ${datosProducto[0].precioVenta})"></i></td>
      </tr>`;
   cuerpo2.insertAdjacentHTML('beforeend', regTabla)
  }
  total.innerText = monto;
  cdb.value = '';
  subtotal.innerHTML = 0;
  document.getElementById('Nombre_producto').value = '';
  document.getElementById('cant').value = '';
  actPrecio = 0;
}

function subirVenta() {
  const ventas = p2;
  console.log(ventas)
  fetch("http://localhost:3000/comercio/venderProducto", {
    method: "POST",
    body: JSON.stringify({ monto, ventas, idCliente }),
    headers: { "Content-type": "application/json" },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
    })
    .catch((err) => console.log(err));
    cancelarcompra();
}
