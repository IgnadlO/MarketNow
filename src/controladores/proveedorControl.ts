import { Request, Response } from "express";
import pool from "../modulos/conexion";
import { OkPacket, RowDataPacket } from "mysql2";

const promisePool = pool.promise();

export const proveedor = (req: Request, res: Response) => {
	const param = req.params.page;
	const permitidas = [
		"cargaProveedor",
		"Inventario",
		"nuevoMetodo",
		"indexProveedor",
		"pedidosProv",
	];
	if (typeof param === "string" && permitidas.includes(param))
		res.render(param + ".html", {
			nombre: req.session.name,
			rol: req.session.rol,
			idProveedor: req.session.idUser,
		});
	else res.redirect("/proveedor/indexProveedor");
};

export const verMetodos = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query(
		"SELECT * FROM infodepago WHERE idUsuario = ?",
		req.session.idUser
	);
	const rows = <RowDataPacket>result;
	res.render("verMetodos.html", {
		nombre: req.session.name,
		rol: req.session.rol,
		datos: rows,
	});
};

export const nuevoMetodo = (req: Request, res: Response) => {
	const post = req.body;
	console.log(post);
	pool.query(
		"INSERT INTO infodepago(metodo, cuil, cvu, alias, idUsuario) VALUES (?,?,?,?,?)",
		[
			post.metodo,
			post.cuil,
			parseInt(post.cvu, 10),
			post.alias,
			req.session.idUser,
		],
		async (error, resp) => {
			if (error) throw error;
			else {
				const row = <OkPacket>resp;
				res.status(201).redirect("/proveedor/indexProveedor");
			}
		}
	);
};

export const verProductos = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query(
		"SELECT * FROM articuloproveedor WHERE idProveedor = ?",
		req.session.idUser
	);
	const rows = <RowDataPacket>result;
	res.json(rows);
};

export const nuevoProducto = (req: Request, res: Response) => {
	const post = req.body;
	if (!req.file) {
		res.status(500).redirect("/proveedor/cargaProveedor");
		return 0;
	}
	console.log(post.descripcion);
	pool.query(
		"INSERT INTO ArticuloProveedor(nombre, descripcion, puntos, puntuadores, precio, cantidad, cdb, imagen, idProveedor) VALUES (?,?,?,?,?,?,?,?,?)",
		[
			post.nombre,
			post.descripcion,
			0,
			0,
			parseInt(post.precio, 10),
			parseInt(post.cantidad, 10),
			parseInt(post.cdb, 10),
			"/static/upload/" + req.file.filename,
			req.session.idUser,
		],
		async (error, resp) => {
			if (error) throw error;
			else {
				const row = <OkPacket>resp;
				res.status(201).redirect("/proveedor/cargaProveedor");
			}
		}
	);
};

export const verPagos = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query(
		"SELECT * FROM pedido WHERE idUsuario = ? AND estado = 'pagado'",
		req.session.idUser
	);
	const rows = <RowDataPacket>result;
	res.json(rows);
};

export const imagen = async (req: Request, res: Response) => {
	console.log("img");
	if (!req.file) {
		console.log("error no req.file");
		res.status(500).redirect("/proveedor/indexProveedor");
		return 0;
	}
	const [result, fields] = await promisePool.query(
		"UPDATE proveedor SET logo = ? WHERE idUsuario = ?",
		["/static/upload/" + req.file.filename, req.session.idUser]
	);
	console.log("foto perfil actualizada");
	res.status(204).redirect("back");
};

export const inicio = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query(
		"SELECT * FROM pedido WHERE idUsuario = ? AND estado = 'pagado'",
		req.session.idUser
	);
	const pedidos = <RowDataPacket>result;
	res.render("indexProveedor.html", {
		nombre: req.session.name,
		rol: req.session.rol,
		idProveedor: req.session.idUser,
		pedidos,
	});
};

export const verEntregasPendientes = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query(
		"SELECT * FROM pedido WHERE idUsuario = ? and tipo = 1 and estado like 'verificado'",
		req.session.idUser
	);
	const rowsPedido = <RowDataPacket>result;
	const proveedores: number[] = [];
	const nombresProv: string[] = [];
	const rowsProv = [];
	let monto = 0;
	let verificados = 0;
	for (let i in rowsPedido) {
		monto += rowsPedido[i].monto;
		if (rowsPedido[i].estado == "verificado") verificados++;
		if (proveedores.includes(rowsPedido[i].idUsuario)) {
			rowsPedido[i].nombreProv =
				nombresProv[proveedores.indexOf(rowsPedido[i].idUsuario)];
			continue;
		}
		const [resultD, fieldsD] = await promisePool.query(
			"select A.nombre,A.email,B.nombreLocal,B.direccion,B.telefono,B.logo from usuarios A left join comercio B on A.idUsuario=B.idUsuario WHERE B.idUsuario = ?",
			rowsPedido[i].idComercio
		);
		const prov = <RowDataPacket>resultD;
		rowsProv.push(prov[0]);
		rowsPedido[i].nombreProv = prov[0].nombre;
		rowsPedido[i].direccion = prov[0].direccion;
		proveedores.push(rowsPedido[i].idUsuario);
		nombresProv.push(prov[0].nombreLocal);
	}
	const info = {
		pedidos: rowsPedido.length,
		monto,
		verificados,
		proveedores: rowsProv.length,
	};
	res.render("stock-faltante.html", {
		nombre: req.session.name,
		rol: req.session.rol,
		rowsPedido: rowsPedido,
		rowsProv: rowsProv,
		info,
	});
};

export const actStock = (req: Request, res: Response) => {
	const put = req.body;
	if(put.cantidad == null) res.json({ info: "error", error: 'valor null' });
	pool.query(
		"UPDATE articuloproveedor SET cantidad = ? WHERE idArtProv = ?",
		[put.cantidad, put.id],
		async (error, resp) => {
			if (error) {
				res.json({ info: "error", error });
				throw error;
			} else {
				res.json({ info: "ok" });
			}
		}
	);
};

export const actPrecio = (req: Request, res: Response) => {
	const put = req.body;
	if(put.cantidad == null) res.json({ info: "error", error: 'valor null' });
	pool.query(
		"UPDATE articuloproveedor SET precio = ? WHERE idArtProv = ?",
		[put.cantidad, put.id],
		async (error, resp) => {
			if (error) {
				res.json({ info: "error", error });
				throw error;
			} else {
				res.json({ info: "ok" });
			}
		}
	);
};