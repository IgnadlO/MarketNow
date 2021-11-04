import { Request, Response } from "express";
import pool from "../modulos/conexion";
import { OkPacket, RowDataPacket, ResultSetHeader } from "mysql2";

const promisePool = pool.promise();

export const index = (req: Request, res: Response) => {
	const loged = req.session.loggedin == undefined ? false : true;
	res.render("home/index.html", {
		loged: loged,
		rol: req.session.rol ? req.session.rol : null,
	});
};

export const home = (req: Request, res: Response) => {
	const param = req.params.page;
	const loged = req.session.loggedin == undefined ? false : true;
	const permitidas = [
		"Iniciar-sesion",
		"nosotros",
		"Nueva-contaseña",
		"registrarse",
		"Restablecer-Contraseña",
	];
	if (typeof param === "string" && permitidas.includes(param))
		res.render("home/" + param + ".html", {
			loged: loged,
			rol: req.session.rol ? req.session.rol : null,
		});
	else res.redirect("/home/Iniciar-sesion");
};

export const devPage = (req: Request, res: Response) => {
	const param = req.params.page;
	const loged = req.session.loggedin == undefined ? false : true;
	res.render(param + ".html", {
		loged: loged,
		nombre: "admin",
		rol: req.session.rol ? req.session.rol : null,
	});
};

export const vistaVender = (req: Request, res: Response) => {
	res.render("vender-producto.html", {
		nombre: req.session.name,
		rol: req.session.rol,
	});
};

export const verMercado = async (req: Request, res: Response) => {
	// const valores = req.params.valor.split(" ");
	// const resultado = [];
	// const ids: number[] = [];
	// for (let valor of valores) {
	// 	const buscar = "%" + valor + "%";
	// 	console.log(valor);
	// 	const [result, fields] = await promisePool.query(
	// 		"SELECT * FROM articuloproveedor where nombre like ?",
	// 		buscar
	// 	);
	// 	const rows = <RowDataPacket>result;
	// 	if (rows.length != 0 && !ids.includes(rows[0].idArtProv)) {
	// 		ids.push(rows[0].idArtProv);
	// 		resultado.push(rows[0]);
	// 	}
	// }
	const valor = req.params.valor;
	const buscar = "%" + valor + "%";
	console.log(buscar);
	const [result, fields] = await promisePool.query(
		"SELECT * FROM articuloproveedor where nombre like ?",
		buscar
	);
	const resultado = <RowDataPacket>result;
	res.json(resultado);
};

export const verProducto = async (req: Request, res: Response) => {
	const id = req.params.idProducto;
	const [result, fields] = await promisePool.query(
		"SELECT *, (puntos/puntuadores) AS calificacion FROM articuloproveedor where idArtProv = ?",
		id
	);
	const rows = <RowDataPacket>result;
	console.log(rows[0])
	res.render("detalle-producto.html", {
		nombre: req.session.name,
		rol: req.session.rol,
		row: rows[0],
		idComercio: req.session.idUser,
	});
};

export const mercado = async (req: Request, res: Response) => {
	const valor =
		req.params.producto != undefined ? "%" + req.params.producto + "%" : "";
	res.render("Mercado-Distribucion.html", {
		nombre: req.session.name,
		rol: req.session.rol,
		valor: req.params.producto,
	});
};

export const esperarProducto = (req: Request, res: Response) => {
	const row = req.body;
	res.render("avisos/esperarProv.html", {
		nombre: req.session.name,
		rol: req.session.rol,
		row,
	});
};

export const comprarProducto = async (req: Request, res: Response) => {
	const post = req.body;
	const [result, fields] = await promisePool.query(
		"SELECT * FROM articuloproveedor WHERE idArtProv = ?",
		post.idProducto
	);
	const producto = <RowDataPacket>result;
	const montoTotal = parseFloat(producto[0].precio) * parseInt(post.cantidad);
	const [result1, fields1] = await promisePool.query(
		"SELECT * FROM infodepago WHERE idUsuario = ?",
		producto[0].idProveedor
	);
	const rows = <RowDataPacket>result1;
	res.render("comprar-producto.html", {
		nombre: req.session.name,
		rol: req.session.rol,
		row: producto[0],
		cantidad: post.cantidad,
		montoTotal: montoTotal,
		idComercio: req.session.idUser,
		metodos: rows,
	});
};

export const pagoPedido = async (req: Request, res: Response) => {
	const post = req.body;
	if (!req.file) {
		res.status(500).redirect("/comercio/indexComercio");
		return 0;
	}
	const [result, fields] = await promisePool.query(
		"INSERT INTO pedido(monto, estado, fecha, hora, tipo, comprobante, idUsuario, idComercio) VALUES (?,?,CURDATE(),CURTIME(),?,?,?,?)",
		[
			post.monto,
			"pagado",
			1,
			"/static/upload/" + req.file.filename,
			post.idProveedor,
			req.session.idUser,
		]
	);
	const row = <ResultSetHeader>result;
	pool.query(
		"INSERT INTO registrocompra(cantidad,precio,cdb,idProducto,idPedido) VALUES (?,?,?,?,?)",
		[
			post.cantidad,
			post.precioVenta,
			post.cdb,
			post.idArticulo,
			row.insertId,
		],
		async (error, result) => {
			if (error) {
				const [result, fields] = await promisePool.query(
					"UPDATE pedido set estado = ? WHERE idPedido = ?",
					["error", row.insertId]
				);
				throw error;
				res.status(500);
			}
		}
	);
	res.redirect("/comercio/entregas-pendientes");
};

export const pagoVerificado = (req: Request, res: Response) => {
	const put = req.body;
	pool.query(
		"UPDATE pedido SET estado = ? WHERE idPedido = ?",
		[put.estado, put.id],
		(err, result) => {
			if (err) res.status(500).json(err);
			else {
				console.log("pago " + put.id + " " + put.estado);
				res.status(204).json(result);
			}
		}
	);
};

export const calificarProducto = (req: Request, res: Response) => {
	const put = req.body;
	console.log(put)
	pool.query(
		"UPDATE articuloproveedor SET puntos = puntos + ?, puntuadores = puntuadores + 1  WHERE idArtProv = ?",
		[put.puntos, put.id],
		(err, result) => {
			if (err) res.status(500).json(err);
			else {
				console.log("puntos " + put.puntos + " id: " + put.id);
				res.status(204).json(result);
			}
		}
	);
};
