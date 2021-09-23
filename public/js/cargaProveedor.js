function validarImagen(obj) {
    var uploadFile = obj.files[0];

    if (!window.FileReader) {
        alert("El navegador no soporta la lectura de archivos");
        document.getElementById("imagen").value = "";
        return;
    }

    if (!/\.(jpg|png|gif)$/i.test(uploadFile.name)) {
        alert("El archivo a adjuntar no es una imagen");
        document.getElementById("imagen").value = "";
    } else {
        var img = new Image();
        img.onload = function () {
            if (uploadFile.size > 1000000) {
                alert("El peso de la imagen no puede exceder los 10mb");
                document.getElementById("imagen").value = "";
            } else {
                previsualizar(obj);
            }
        };
        img.src = URL.createObjectURL(uploadFile);
    }
}

function previsualizar(obj) {
    let reader = new FileReader();
    reader.readAsDataURL(obj.files[0]);
    reader.onload = function () {
        let preview = document.getElementById("cuadroImagen"),
            image = document.createElement("img");

        image.src = reader.result;
        image.id = "previsualizar";

        preview.innerHTML = "";
        preview.append(image);
    };
}