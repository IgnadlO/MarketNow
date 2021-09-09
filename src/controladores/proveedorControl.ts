import { Request, Response } from "express";
import pool from "../modulos/conexion";
import { OkPacket, RowDataPacket } from "mysql2";

const promisePool = pool.promise();

export const proveedor = (req: Request, res: Response) => {
	const param = req.params.page;
	const permitidas = ["cargaProveedor", "Inventario"];
	if (typeof param === "string" && permitidas.includes(param))
		res.render(param + ".html", {
			nombre: req.session.name,
			rol: req.session.rol,
		});
	else res.redirect("/home/Iniciar-sesion");
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
		"INSERT INTO ArticuloProveedor(nombre, descripcion, precio, cantidad, cdb, imagen, idProveedor) VALUES (?,?,?,?,?,?,?)",
		[
			post.nombre,
			post.descripcion,
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