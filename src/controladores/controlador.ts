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
	const result2 = await promisePool.query(
		"SELECT count(*) AS cantidad FROM puntuadores where idComercio = ? and idArticulo = ?",
		[req.session.idUser, id]
	);
	const pun = <RowDataPacket>result2;
	res.render("detalle-producto.html", {
		nombre: req.session.name,
		rol: req.session.rol,
		row: rows[0],
		idComercio: req.session.idUser,
		puntuado: pun[0][0].cantidad,
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
	console.log(post);
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
	console.log(post);
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
		"INSERT INTO egresovario(tipo, cantidad, fecha, idComercio) VALUES(?,?,CURDATE(),?)",
		["compras", post.monto, req.session.idUser],
		(err, result) => {
			if (err) res.status(500).json(err);
		}
	);
	pool.query(
		"INSERT INTO registrocompra(cantidad,precio,cdb,idProducto,idPedido) VALUES (?,?,?,?,?)",
		[
			parseInt(post.cantidad, 10),
			Number(post.precio),
			parseInt(post.cdb, 10),
			parseInt(post.idArticulo, 10),
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
				if (put.estado != "entregado") res.status(204).json(result);
			}
		}
	);

	type regCompra = {
		cantidad: number;
		idProducto: number;
		cdb: number;
	};

	if (put.estado == "entregado") {
		pool.query(
			"SELECT * FROM registrocompra WHERE idPedido = ?",
			put.id,
			async (err, result: any) => {
				if (err) res.status(500).json(err);
				else {
					const reg = <regCompra>result[0];
					pool.query(
						"UPDATE articuloproveedor SET cantidad = cantidad - ? WHERE idArtProv = ?",
						[reg.cantidad, reg.idProducto],
						(err, result) => {
							if (err) throw err;
						}
					);

					const articulosCON = await promisePool.query(
						"SELECT count(*) AS cantidad FROM articulocliente where idComercio = ? and cdb = ?",
						[req.session.idUser, reg.cdb]
						);
					const articulosC = <RowDataPacket>articulosCON[0];
					console.log(articulosC[0])
					if(articulosC[0].cantidad == 0){
						const nombreArtCON = await promisePool.query(
							"SELECT nombre, precio FROM articuloproveedor where idArtProv = ?",
							[reg.idProducto]
							);
						const nombreArt = <RowDataPacket>nombreArtCON[0];
						res.json({
							info: 'no se ha encontrado',
							datos: { 
								nombre: nombreArt[0].nombre,
								cantidad: reg.cantidad,
								cdb: reg.cdb,
								nPedido: put.id,
								precio: nombreArt[0].precio,
								}
						});
					} else {
						pool.query(
						"UPDATE articulocliente SET cantidad = cantidad + ? WHERE idComercio = ? and cdb = ?",
						[reg.cantidad, req.session.idUser, reg.cdb],
						(err, result) => {
							if (err) throw err;
							res.json({info: 'se ha actualizado'});
					})
				}
			}
		});
	}
};

export const calificarProducto = (req: Request, res: Response) => {
	const put = req.body;
	console.log(put);
	pool.query(
		"UPDATE articuloproveedor SET puntos = puntos + ?, puntuadores = puntuadores + 1  WHERE idArtProv = ?",
		[put.puntos, put.id],
		(err, result) => {
			if (err) res.status(500).json(err);
			else {
				pool.query(
					"INSERT INTO puntuadores(idComercio, idArticulo) values(?,?)",
					[req.session.idUser, put.id],
					(err, result) => {
						if (err) res.status(500).json(err);
					}
				);
				console.log("puntos " + put.puntos + " id: " + put.id);
				res.status(204).json(result);
			}
		}
	);
};
