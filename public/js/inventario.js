/*-------------Variables----------*/
const cuerpo = document.getElementById('tabla_tbody');
const buscador = document.getElementById('buscador')
const barra = document.getElementById('tipo');
buscador.addEventListener("keyup", buscar);
barra.addEventListener('change', Barra_accion);

let info;
const pathname = window.location.pathname;
const urlFetch = {
  '/comercio/Inventario' : '/comercio/productos',
  '/proveedor/Inventario' : '/proveedor/productos',
  '/comercio/regVentas' : '/comercio/ventas'
}
fetch(urlFetch[pathname])
    .then((resp) => resp.json())
    .then(function(data){
      info = data;
      const convertirFecha = fecha => {
        const fechaD = new Date(fecha);
        return fechaD.getDate() + '/' + fechaD.getMonth() + '/' + fechaD.getFullYear();
      }
      for(let i = 0; i < info.length; i++) {
        const htmlInsert = {
          '/comercio/Inventario' : `<tr><td>${info[i].nombre}</td><td>${info[i].categoria}</td><td>$${info[i].precioVenta}</td><td>$${info[i].precioUnitario}</td><td>${info[i].cantidad}</td><td>${info[i].cantIdeal}</td></tr>`,
          '/proveedor/Inventario' : `<tr><td><img style="object-fit: contain;" src="${info[i].imagen}" height="100" width="100"></td><td>${info[i].nombre}</td><td>${info[i].descripcion}</td><td>${info[i].precio}</td><td>${info[i].cantidad}</td></tr>`,
          '/comercio/regVentas' : `<tr><td>${info[i].idPedido}</td><td>$${info[i].monto}</td><td>${convertirFecha(info[i].fecha)}</td><td>${info[i].hora}</td><td>${info[i].idComercio}</td></tr>`
        }
        cuerpo.insertAdjacentHTML('beforeend', htmlInsert[pathname])
        }
    })
    .catch((error) => {
      console.log(error);
    });
/*-------------Filtrador----------*/

function buscar(e) {
  crearTabla(() => info.filter(v => v.nombre.includes(buscador.value)));
}

function Barra_accion(e){
 if (document.getElementById('ord_a-z').selected == true ){
    switching = true;
    while (switching) {
    switching = false;
    rows = cuerpo.rows;
    for (i = 0; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
    }
    }
  if (document.getElementById('ord_z-a').selected == true ){
    switching = true;
    while (switching) {
    switching = false;
    rows = cuerpo.rows;
    for (i = 0; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
    }
    }
  if (document.getElementById('ord_pre_as').selected == true ){
    cuerpo.innerHTML = '';
        let ord = info;
        ord.sort(function(a, b) {
        if (a.precioVenta < b.precioVenta)
         return -1;
        });
        for(let i = 0; i < ord.length; i++) {
          cuerpo.insertAdjacentHTML('beforeend',`<tr><td>${ord[i].nombre}</td><td>${ord[i].categoria}</td><td>$${ord[i].precioVenta}</td><td>$${ord[i].precioUnitario}</td><td>${ord[i].cantidad}</td><td>${ord[i].cantIdeal}</td></tr>`)
        } 
    }
  if (document.getElementById('ord_pre_des').selected == true ){
   cuerpo.innerHTML = '';
        let ord = info;
        ord.sort(function(a, b) {
        if (a.precioVenta > b.precioVenta)
         return -1;
        });
        for(let i = 0; i < ord.length; i++) {
          cuerpo.insertAdjacentHTML('beforeend',`<tr><td>${ord[i].nombre}</td><td>${ord[i].categoria}</td><td>$${ord[i].precioVenta}</td><td>$${ord[i].precioUnitario}</td><td>${ord[i].cantidad}</td><td>${ord[i].cantIdeal}</td></tr>`)
        } 
    }
}