/*----------Variables----------*/
const cdb = document.getElementById('cdb');
const cdc = document.getElementById('cdc');
const cuerpo = document.getElementById('cuerpo');
const cuerpo2 = document.getElementById('cuerpo2');
let cuerpo3 = document.getElementById('cuerpo3');
const nom = document.getElementById('Nombre_producto');
let monto =0;
let p2=[];
const cant = document.getElementById("cant");
nom.addEventListener("keyup", filtrador_nombre);
document.getElementById('terminarVenta')
.addEventListener("click", subirVenta);
document.getElementById("cdb")
.addEventListener("keyup",pepe);
document.getElementById('cancelarVenta')
.addEventListener("click",cancelarcompra);

let info;
fetch('/comercio/productos')
    .then((resp) => resp.json())
    .then(function(data){
      info = data;
      console.log(info)
      for(let i = 0; i < info.length; i++) {
        cuerpo.insertAdjacentHTML('beforeend', `
        <tr><td>${info[i].nombre}</td><td>${info[i].precioVenta}</td></tr>`)
        }
    })
    .catch((error) => {
      console.log(error);
    });
/*----------Funciones----------*/
function filtrador_nombre() {
  var input, filter, table, tr, td, i, j, visible,precio,producto;
  input = document.getElementById('Nombre_producto');
  filter = input.value.toUpperCase();
  tr = cuerpo.getElementsByTagName("tr");

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
    } else {
      tr[i].style.display = "none";
    }
  }
  console.log(precio);
  console.log(producto);}

function cancelarcompra(){
  let total =document.getElementById("total");
  let cant = document.getElementById("cant");
  cuerpo2.innerHTML="";
  total.innerText="Total:$ ";
  monto = 0;
}

function pepe(e){
  if (e.key=="Enter")productos();
}
function productos(){
  var total =document.getElementById("total");
  let nuevaCantidad = 1;
  if(cant.value != '' || cant.value != 0) nuevaCantidad = parseInt(cant.value);
  const caca = info.filter(val=>{
    if (val.cdb== cdb.value){
      val.cantidad=nuevaCantidad;
      return true;}
  })
  p2.push(caca);
  if(document.getElementById('td' + caca[0].cdb) != undefined) {
    const cantidad = document.getElementById('cant' + caca[0].cdb);
    const oldCant = parseInt(cantidad.innerText);
    cantidad.innerText = oldCant + nuevaCantidad;
  } else {
    tr = cuerpo.getElementsByTagName("tr");
   cuerpo2.insertAdjacentHTML('beforeend', `
      <tr><td id="td${caca[0].cdb}">${caca[0].cdb}</td><td>${caca[0].nombre}</td><td>$${caca[0].precioVenta}</td><td id="cant${caca[0].cdb}">${nuevaCantidad}</td><td><i class="fas fa-times-circle quitar"></i></td></tr>`)
  }
  monto += parseInt(caca[0].precioVenta) * nuevaCantidad;
  total.innerText = "Total:$ "+ monto;
  cdb.value = '';
}

function subirVenta(){
  const ventas = p2 ;
  const idCliente = cdc;

fetch('http://localhost:3000/comercio/venderProducto', {
  method: "POST",
  body: JSON.stringify({monto, ventas, idCliente}),
  headers: {"Content-type": "application/json"}
})
.then(response => response.json())
.then(json =>{
  console.log(json);
  monto=0;
cancelarcompra();})
.catch(err => console.log(err));


}