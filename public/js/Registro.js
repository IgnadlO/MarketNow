let validacion = [0,0,0,0,0,0,0,0];

/*---------------Barra de Menu de roles-------------------*/
function Barra_Roles() {
  if (document.getElementById('comerciante').selected  || document.getElementById('proveedor').selected == true ) 
    document.getElementById('activacion').style.display="block";

  if (document.getElementById('usuario').selected ==true) 
    document.getElementById('activacion').style.display="none";

  if (document.getElementById('nada').selected ==true) 
    document.getElementById('activacion').style.display="none";
} 

/*---------------Validacion de Datos-------------------*/
function validar_nombre(nombre) {
  let cb = document.getElementById("colorborde0");
  if (nombre.value == "") validacion_incorrecta(0, cb);
  else if (nombre.value != "") validacion_correcta(0, cb);
  return false;
}
function validar_mail(mail) {
  let cb = document.getElementById("colorborde1");
  var mailRevi = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  if (mail.value == "") {
    validacion_incorrecta(1, cb);
  } else if (mailRevi.test(mail.value)) {
    validacion_correcta(1, cb);
  } else if (mail.value != mailRevi || mail.value == /^[-\w.%+]{1,64}/
  ) {
    validacion_incorrecta(1, cb);
  }
  return false;
}
function validar_contra(contra){
  var cb=document.getElementById('colorborde2');
  var revi_contra=/^[a-z0-9_-]{4,20}$/;
  if (contra.value == "" || contra.value == "0" ) {
    validacion_incorrecta(2,cb);
  }
  if (revi_contra.test(contra.value)){
    validacion_correcta(2,cb);
  }
  else{
    validacion_incorrecta(2,cb);
  }
  return false;
}
function validar_contra2(contra2){
  var cb=document.getElementById('colorborde3');
  var contra = document.getElementById('contra');
    if ((contra2.value == "") || (contra2.value != contra.value)) {
    validacion_incorrecta(3,cb);
    }
    else if (contra2.value == contra.value){
    validacion_correcta(3,cb);
    }
    return false;
}
function validar_telefono(telefono){
   var cb=document.getElementById('colorborde4');
   var telefono_revi = /^\d{8,11}$/;
   const telefonoValidado = telefono_revi.test(telefono.value);
    if ((telefono.value == "") || !telefonoValidado) validacion_incorrecta(4,cb);
    else validacion_correcta(4,cb);
  return false;
}
function validar_dni(dni){
  var cb=document.getElementById('colorborde5');
  var revi_dni = /^\d{7,8}$/;
  const dniValidado = revi_dni.test(dni.value)
    if ((dni.value == "") || !dniValidado) {
    validacion_incorrecta(5,cb);
    }
  else {
    validacion_correcta(5,cb);
  }
  return false;
}
function validar_direccion(direccion){
  var cb=document.getElementById('colorborde6');
  var revi_direc=/^[a-z0-9_-]{4,50}$/;
  const direccionValidado = revi_direc.test(direccion.value);
    if ((direccion.value == "") || !direccionValidado) {
    validacion_incorrecta(6,cb);
    }
  else {
    validacion_correcta(6,cb);
  }
  return false;
}
function validar_nombre_local(nombre_local){
  var cb = document.getElementById('colorborde7');
  var nombre_local=document.getElementById('nombre_local');
  if (nombre_local.value == "") {
    validacion_incorrecta(7,cb);
  }
  else if (nombre_local.value!="") 
    {
    validacion_correcta(7,cb);
  }
  return false;
}

function EnviarFormulario(){
  if (document.getElementById('usuario').selected == true && validacion.reduce((a, b) => a + b, 0) >= 4)
    document.getElementById('form').submit();
  else if (((document.getElementById('comerciante').selected == true) || (document.getElementById('proveedor').selected == true )) && validacion.reduce((a, b) => a + b, 0) >= 8)
    document.getElementById('form').submit();
  return false;
}

function validacion_correcta(n,cb){
  document.getElementById('texto-error'+ n).style.display="none";
  document.getElementById('incorrecto'+ n).style.display="none";
  document.getElementById('correcto'+ n).style.display="inline-block";
  cb.style.borderColor= 'green';
  if (validacion[n] == 0) validacion[n] = 1;
}

function validacion_incorrecta(n,cb){
  document.getElementById('texto-error'+ n).style.display="inline-block";
  document.getElementById('incorrecto'+ n).style.display="inline-block";
  document.getElementById('correcto'+ n).style.display="none";
  cb.style.borderColor= 'red';
  validacion[n] = 0;
}
