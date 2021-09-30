import { Request, Response } from "express";
import pool from "../modulos/conexion";
import { OkPacket, RowDataPacket } from "mysql2";

const promisePool = pool.promise();

export const index = (req: Request, res: Response) => {
	const loged = (req.session.loggedin == undefined)? false: true;
	res.render("index.html", ({loged: loged, rol: (req.session.rol)? req.session.rol: null}));
};

export const home = (req: Request, res: Response) => {
	const param = req.params.page;
	const loged = (req.session.loggedin == undefined)? false: true;
	const permitidas = ["Iniciar-sesion","nosotros","Nueva-contaseña","registrarse","Restablecer-Contraseña"];
	if (typeof param === "string" && permitidas.includes(param))
		res.render(param + ".html", ({loged: loged, rol: (req.session.rol)? req.session.rol: null}));
	else res.redirect("/home/Iniciar-sesion");
};

export const devPage = (req: Request, res: Response) => {
	const param = req.params.page;
	const loged = (req.session.loggedin == undefined)? false: true;
	res.render(param + ".html", ({loged: loged, nombre: 'admin', rol: (req.session.rol)? req.session.rol: null}));
};

export const vistaVender = (req: Request, res: Response) => {
	res.render("vender-producto.html", {
			nombre: req.session.name,
			rol: req.session.rol
		});
};

export const verMercado = async (req: Request, res: Response) => {
	const valores = req.params.valor.split(" ");
	const resultado = [];
	const ids: number[] = [];
	for (let valor of valores) {
		const buscar = "%" + valor + "%";
		console.log(valor);
		const [result, fields] = await promisePool.query("SELECT * FROM articuloproveedor where nombre like ?",buscar);
		const rows = <RowDataPacket>result;
		if (rows.length != 0 && !ids.includes(rows[0].idArtProv)) {
			ids.push(rows[0].idArtProv);
			resultado.push(rows[0]);
		}
	}
	res.json(resultado);
};

export const verProducto = async (req: Request, res: Response) => {
	const id = req.params.idProducto;
	const [result, fields] = await promisePool.query("SELECT * FROM articuloproveedor where idArtProv = ?", id);
	const rows = <RowDataPacket>result;
	res.render('detalle-producto.html', {
		nombre: req.session.name,
		rol: req.session.rol,
		row: rows[0]
	})
}

export const mercado = async (req: Request, res: Response) => {
	const valor = (req.params.producto != undefined)? '%' + req.params.producto + '%' : '';
	res.render('Mercado-Distribucion.html', {
		nombre: req.session.name,
		rol: req.session.rol,
		valor: req.params.producto})
}

export const comprarProducto = async (req: Request, res: Response) => {
	const post = req.body;
	const montoTotal = parseFloat(post.precio) * parseInt(post.cantidad);
	const [result, fields] = await promisePool.query(
		"SELECT * FROM infodepago WHERE idUsuario = ?",
		post.idProveedor
	);
	const rows = <RowDataPacket>result;

	res.render('comprar-producto.html', {
		nombre: req.session.name,
		rol: req.session.rol,
		producto: post.producto,
		cantidad: post.cantidad,
		montoTotal: montoTotal,
		metodos: rows})
}

