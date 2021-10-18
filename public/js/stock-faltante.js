const cuerpo = document.getElementById('cuerpo')

let info;
const urlFetch = '/comercio/verFaltantes';
fetch(urlFetch)
    .then((resp) => resp.json())
    .then(function(data){
      info = data;
      const convertirFecha = fecha => {
        const fechaD = new Date(fecha);
        return fechaD.getDate() + '/' + fechaD.getMonth() + '/' + fechaD.getFullYear();
      }
      const productos = info.length;
      let monto = 0, urgente = 0, paltas = 0;
      info.forEach(val => {
        monto += val.precioUnitario * (val.cantIdeal - val.cantidad);
        if(val.cantidad >= 0) monto++;
        if(val.cantidad <= 0) urgente++;
        if(val.nombre.includes('palta')) paltas++;
      });

      document.getElementById('info__productos').innerText = productos;
      document.getElementById('info__monto').innerText = '$' + monto;
      document.getElementById('info__urgente').innerText = urgente;
      document.getElementById('info__paltas').innerText = paltas;

      for(let i = 0; i < info.length; i++) {
        const estado = (info[i].cantidad <= 0)? 'Vacio': 'Poco';
        const color = (estado == 'Vacio')? 'red': 'orange';
        const htmlInsert = `
        <tr>
          <td><label>${info[i].cantidad}</label></td>
          <td><label>${info[i].nombre}</label></td>
          <td><label>${info[i].cantMinima}</label></td>
          <td><label>${info[i].cantIdeal}</label></td>
          <td><div class="contenedor-status">
            <i class="fas fa-circle icon-status" style="color: ${color};"></i><label class="label-status">${estado}</label>
          </div></td>
          <td><i class="fas fa-search buscador" id="${info[i].nombre}" style="color: var(--doradoLg)"></i></td>
        </tr>`;
        cuerpo.insertAdjacentHTML('beforeend', htmlInsert)
        }
        const buscadores = document.querySelectorAll('.buscador');
        for (buscador of buscadores){
          buscador.addEventListener('click', buscarProducto)
        }
    })
    .catch((error) => {
      console.log(error);
    });

function buscarProducto(e){
  window.location = '/mercado/' + e.target.id;
}