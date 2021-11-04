import { Request, Response } from "express";
import pool from "../modulos/conexion";
import { OkPacket, RowDataPacket } from "mysql2";

const promisePool = pool.promise();

export const proveedor = (req: Request, res: Response) => {
	const param = req.params.page;
	const permitidas = ["cargaProveedor", "Inventario", 'nuevoMetodo', 'indexProveedor','pedidosProv'];
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
	console.log(post)
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
	if(!req.file) {
		res.status(500).redirect("/proveedor/cargaProveedor");
		return 0;
	}
	console.log(post.descripcion)
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
			'/static/upload/' + req.file.filename,
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
