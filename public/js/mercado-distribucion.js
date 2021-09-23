const cuerpo = document.getElementById('contenedor-paltero');
const buscador = document.getElementById('buscador');
const ordenarPor = document.getElementById('tipo');
ordenarPor.addEventListener('change', Barra_accion)
buscador.addEventListener('keyup', cambiarUrl)
if(buscador.value != '') buscarProducto();

let info;

function cambiarUrl(e) {
  if(e.key != 'Enter') return 0;
  if(buscador.value == '') return 0;
  window.location = '/mercado/' + buscador.value;
}

function buscarProducto(e) {
  if(buscador.value == '') return 0;
  const urlFetch = '/mercado/productos/' + buscador.value;
  fetch(urlFetch)
    .then((resp) => resp.json())
    .then(function(data){
      info = data;
      cuerpo.innerHTML = '';
      if(info.length == 0){
        cuerpo.innerHTML = 'No se encontro ningun producto compatible'
      } else {
        crearTabla(info => { return info })
        }
       }
    )
    .catch((error) => {
      console.log(error);
    });
}

function verProducto(e) {
  const codigo = (e.target.id == '')? e.target.parentNode.id : e.target.id;
  window.location = '/mercado/verProducto/' + codigo;
}

const crearTabla = cb => {
    cuerpo.innerHTML = "";
    const ord = cb(info);
    for(let i = 0; i < ord.length; i++) {
        const producto = document.createElement('div');
        producto.classList.add('palta-1')
        producto.id = ord[i].idArtProv;
        producto.innerHTML = `
          <div class="contenedor-imagen" id="${ord[i].idArtProv}"><img class="palta-img" src="${ord[i].imagen}" width="100%"></div>
          <div class="monto"><label id="${ord[i].idArtProv}"><b>$${ord[i].precio}</b></label></div>
          <div class="descripcion" id="${ord[i].idArtProv}"><label>${ord[i].descripcion}</label></div>`;
        producto.addEventListener('click', verProducto);
        cuerpo.appendChild(producto)
    }
  };

function Barra_accion(e){
  const ordenamiento = {
    0: array => { return info },
    1: array => array.sort((a, b) => a.precio < b.precio ? -1 : 1),
    2: array => array.sort((a, b) => a.precio > b.precio ? -1 : 1)
  }
  crearTabla(ordenamiento[e.target.options.selectedIndex]);
}