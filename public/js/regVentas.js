const cuerpo = document.getElementById('cuerpo');
const bodyDetalles = document.getElementById('detalles_body');

const granCont = document.getElementsByTagName('main')
granCont[0].addEventListener('click', () => {bodyDetalles.innerHTML = ''})

let info;
const pathname = window.location.pathname;
const urlFetch = '/comercio/ventas'
fetch(urlFetch)
    .then((resp) => resp.json())
    .then(function(data){
      info = data;
      const convertirFecha = fecha => {
        const fechaD = new Date(fecha);
        return fechaD.getDate() + '/' + fechaD.getMonth() + '/' + fechaD.getFullYear();
      }
      for(let i = info.length - 1; i >= 0; i--) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${info[i].idPedido}</td><td>$${info[i].monto}</td><td>${convertirFecha(info[i].fecha)}</td><td>${info[i].hora}</td><td>${info[i].idComercio}</td>`;
        tr.id = info[i].idPedido;
        tr.addEventListener('click', verDetalles);
        cuerpo.appendChild(tr);
        }
    })
    .catch((error) => {
      console.log(error);
    });

    function verDetalles(e){
      e.stopPropagation();
      const idPedido = e.target.parentNode.id;
      if (idPedido == 'cuerpo') return 0;
      fetch('/comercio/ventas/' + idPedido + '/detalles')
      .then((resp) => resp.json())
      .then(function(data){
      bodyDetalles.innerHTML = '';
      info = data;
      for(let i = 0; i < info.length; i++){
        const reg = document.createElement('tr')
        reg.innerHTML = `<td>${info[i].nombre}</td><td>${info[i].cantidad}</td><td>$${info[i].precio}</td>`;
        bodyDetalles.appendChild(reg);
      }
      
      })
      .catch((error) => {
        console.log(error);
      });
    }