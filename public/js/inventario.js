/*-------------Variables----------*/
const cuerpo = document.getElementById('cuerpo');
const buscador = document.getElementById('text_busacador')
buscador.addEventListener("keypress", filtrador);

let info;
fetch('/comercio/productos')
    .then((resp) => resp.json())
    .then(function(data){
      info = data;
      for(let i = 0; i < info.length; i++) {
        cuerpo.insertAdjacentHTML('beforeend', `
        <tr><td>${info[i].nombre}</td><td>$${info[i].precioVenta}</td><td>$${info[i].precioUnitario}</td><td>${info[i].cantidad}</td><td>${info[i].cantIdeal}</td></tr>`)
        }
    })
    .catch((error) => {
      console.log(error);
    });
/*-------------Filtrador----------*/
function filtrador() { 
  var input, filter, table, tr, td, i, j, visible;
  input = document.getElementById("text_busacador");
  filter = input.value.toUpperCase();
  table = document.getElementById("cuerpo");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    visible = false;
    td = tr[i].getElementsByTagName("td");
    for (j = 0; j < td.length; j++) {
      if (td[j] && td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
        visible = true;
      }
    }
    if (visible === true) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}
/*-------------Botones----------*/
function Barra_accion(){
	console.log(document.getElementById('tabla'));
	/*if (document.getElementById('nada').selected == true) 
	{console.log("que trolo, man")}*/
   if (document.getElementById('ord_a-z').selected == true ){
 	info.producto.sort((a, b) =>{
 	if (a.nombre < b.nombre)
 	return -1; 
   })
   }
   if (document.getElementById('ord_z-a').selected == true ){
 	info.producto.sort((a, b) =>{
 	if (a.nombre > b.nombre)
 	return -1;
   }) 
   }
 	if (document.getElementById('ord_pre_as').selected == true ){
 	info.producto.sort((a, b) => a.precio - b.precio)
   }
   if (document.getElementById('ord_pre_des').selected == true ){
 	info.producto.sort((a, b) => b.precio - a.precio)
   }
console.log(info);
 }
