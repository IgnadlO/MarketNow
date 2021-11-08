import { Router, Request } from "express";
import * as controlador from "./controladores/controlador";
import * as comercio from "./controladores/comercioControl";
import * as proveedor from "./controladores/proveedorControl";
import * as auth from "./controladores/auth";
import multer from "multer";
import path from "path";

const ruta = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname , '..' , '/public/upload'))
    },
    
    filename: function (req: any, file: any, cb: any) {
        cb(null, Date.now() + '.png')
    }
});

const upload = multer({
	storage: storage,
});

//sin Iniciar sesion
ruta.get("/", controlador.index);
ruta.get("/dev/:page", controlador.devPage);
ruta.get("/home/:page", controlador.home);
ruta.get("/logOut", auth.logOut);
ruta.get("/recuperePass/:token", auth.recuperePass);
ruta.post("/enviarEmail", auth.enviarCambioContra);
ruta.post("/singIn", auth.singIn);
ruta.post("/singUp", auth.singUp);
ruta.post("/nuevaPass/:token", auth.nuevaPass);

//Comercio
ruta.get("/comercio/productos", auth.verifyLogged, comercio.verProductos);
ruta.get("/comercio/reporteDiario", auth.verifyLogged, comercio.reporteDiario);
ruta.get("/comercio/ventas", auth.verifyLogged, comercio.verVentas);
ruta.get("/comercio/ventas/:idPedido/detalles", auth.verifyLogged, comercio.verDetallesVentas);
ruta.get("/comercio/verFaltantes", auth.verifyLogged, comercio.verFaltantes);
ruta.get("/comercio/entregas-pendientes", auth.verifyLogged, comercio.verEntregasPendientes);
ruta.get("/comercio/verBalance", auth.verifyLogged, comercio.verBalance)
ruta.get("/comercio/indexComercio", auth.verifyLogged, comercio.inicio)
ruta.get("/comercio/:page", auth.verifyLogged, comercio.comercio);
ruta.get("/comercio/notificaciones", auth.verifyLogged, comercio.notificaciones)
ruta.post("/comercio/egresoVario", auth.verifyLogged, comercio.egresoVario)
ruta.post("/comercio/nuevoProducto", auth.verifyLogged, comercio.nuevoProducto);
ruta.post("/comercio/venderProducto", auth.verifyLogged, comercio.venderProducto);
ruta.post("/comercio/agregarProducto", auth.verifyLogged, comercio.agregarProducto);

//Proveedor
ruta.get("/proveedor/metodos", auth.verifyLogged, proveedor.verMetodos);
ruta.get("/proveedor/productos", auth.verifyLogged, proveedor.verProductos);
ruta.get("/proveedor/pagos", auth.verifyLogged, proveedor.verPagos);
ruta.get("/proveedor/indexProveedor", auth.verifyLogged, proveedor.inicio);
ruta.get("/proveedor/entregas-pendientes", auth.verifyLogged, proveedor.verEntregasPendientes);
ruta.get("/proveedor/:page", auth.verifyLogged, proveedor.proveedor);
ruta.post("/proveedor/nuevoProducto", upload.single("imagen"), proveedor.nuevoProducto);
ruta.post("/proveedor/imagen", upload.single("imagen"), proveedor.imagen);
ruta.post("/proveedor/nuevoMetodo", auth.verifyLogged, proveedor.nuevoMetodo);

//Mercado
ruta.get("/mercado", controlador.mercado)
ruta.get("/mercado/:producto", auth.verifyLogged, controlador.mercado);
ruta.get("/mercado/productos/:valor", controlador.verMercado);
ruta.get('/mercado/verProducto/:idProducto', controlador.verProducto);
ruta.post('/mercado/comprarProducto', controlador.comprarProducto);
ruta.post("/mercado/pagoPedido", upload.single("imagen"), controlador.pagoPedido);
ruta.put('/mercado/pagoVerificado', controlador.pagoVerificado);
ruta.put('/mercado/calificarProducto', controlador.calificarProducto);


//Cajero
ruta.get('/cajero/vender-producto', auth.verifyLogged, controlador.vistaVender)


export default ruta;