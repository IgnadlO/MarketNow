import { Request, Response } from "express";
import pool from "../modulos/conexion";
import { OkPacket, RowDataPacket, ResultSetHeader } from "mysql2";

const promisePool = pool.promise();

export const comercio = (req: Request, res: Response) => {
	const param = req.params.page;
	const permitidas = ["cargaManual", "cupones", "Inventario", "reporteDiario", 'regVentas', 'stock-faltante', 'entregas-pendientes', 'indexComercio'];
	if (typeof param === "string" && permitidas.includes(param))
		res.render(param + ".html", {
			nombre: req.session.name,
			rol: req.session.rol
		});
	else res.redirect("/home/Iniciar-sesion");
};

export const nuevoProducto = (req: Request, res: Response) => {
	const verificar = (dato: any) =>
		dato == undefined || dato == "" ? null : parseInt(dato, 10);
	const post = req.body;
	pool.query(
		"INSERT INTO ArticuloCliente(nombre,cdb,categoria,iva,PdeGanancia,precioUnitario,precioVenta,cantidad,cantMinima,cantIdeal, idComercio) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
		[
			post.nombre,
			parseInt(post.cdb, 10),
			post.categoria,
			parseInt(post.iva, 10),
			parseInt(post.PdeGanancia, 10),
			parseInt(post.precioUnitario, 10),
			parseInt(post.precioVenta, 10),
			parseInt(post.cantidad, 10),
			verificar(post.cantMinima),
			verificar(post.cantIdeal),
			verificar(post.idComercio) == null
				? req.session.idUser
				: post.idComercio,
		],
		async (error, resp) => {
			if (error) throw error;
			else {
				const row = <OkPacket>resp;
				const [result, fields] = await promisePool.query(
					"INSERT INTO egresovario(tipo, cantidad, fecha, idComercio) VALUES (?,?,CURDATE(),?)",
					[
						"egresoCompras",
						parseInt(post.precioUnitario, 10) *
							((parseInt(post.iva, 10) / 100) + 1) *
							parseInt(post.cantidad, 10),
						req.session.idUser,
					]
				);
				res.status(201).redirect("/comercio/cargaManual");
			}
		}
	);
};

export const verProductos = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query("SELECT * FROM articulocliente WHERE idComercio = ?", req.session.idUser);
	const rows = <RowDataPacket>result;
	res.json(rows);
}

export const venderProducto = async (req: Request, res: Response) => {
	const ventas = req.body.ventas;
	const post = req.body;
	const idCliente = typeof post.idCliente != 'number' ? null : parseInt(post.idCliente, 10);
	const [result, fields] = await promisePool.query(
		"INSERT INTO pedido(monto, estado, fecha, hora, tipo, idUsuario, idComercio) VALUES (?,?,CURDATE(),CURTIME(),?,?,?)",
		[
			parseInt(post.monto, 10),
			"exitoso",
			2,
			idCliente,
			req.session.idUser,
		]
	);
	const row = <ResultSetHeader>result;
	for (let i in ventas) {
		pool.query(
			"INSERT INTO registrocompra(cantidad,precio,cdb,idProducto,idPedido) VALUES (?,?,?,?,?)",
			[
				ventas[i].cantidad,
				ventas[i].precioVenta,
				ventas[i].cdb,
				ventas[i].idArticulo,
				row.insertId,
			],
			async (error, result) => {
				if (error) {
					const [result, fields] = await promisePool.query(
						"UPDATE pedido set estado = ? WHERE idPedido = ?",
						["error", row.insertId]
					);
					throw error;
					res.status(500)
				}
			}
		);
	}
	for (let i in ventas) {
		console.log('resta cantidad')
		const [result, fields] = await promisePool.query(
			"UPDATE articulocliente set cantidad = cantidad - ? WHERE idArticulo = ?",
			[ventas[i].cantidad, ventas[i].idArticulo]
		);
	}
	if (idCliente != null) {
		console.log('suma puntos')
		const puntos = parseInt(post.monto, 10) / 100;
		const subirPuntos = async (sql: string) => {
			const [result, fields] = await promisePool.query(sql,
			[
				puntos,
				req.session.idUser,
				idCliente,
			]
			);
		}
		const [result, fields] = await promisePool.query('SELECT COUNT(*) as total FROM puntosporcomercio WHERE idComercio = ? AND idCliente = ?', 
			[req.session.idUser, idCliente]);
		const row = <RowDataPacket>result;
		console.log(row);
		if(row[0].total >= 1)
			subirPuntos("UPDATE puntosporcomercio SET cantidad = cantidad + ? WHERE idComercio = ? AND idCliente = ?")
		else
			 subirPuntos("INSERT INTO puntosporcomercio(cantidad, idComercio, idCliente) VALUES (?,?,?)")
	}
	res.status(201)
};

export const reporteDiario = async (req: Request, res: Response) => {
	const [result1] = await promisePool.query(
		"SELECT sum(cantidad) as totalGasto FROM egresovario WHERE idComercio = ? AND fecha = CURDATE()",
		req.session.idUser
	);
	const [result2] = await promisePool.query(
		"SELECT sum(monto) as totalGanancia FROM pedido WHERE idComercio = ? AND fecha = CURDATE()",
		req.session.idUser
	);
	const row1 = <RowDataPacket>result1;
	const row2 = <RowDataPacket>result2;
	const balance = row2[0].totalGanancia - row1[0].totalGasto;
	res.render("reporteDiario.html", {
		nombre: req.session.name,
		egreso: row1[0].totalGasto,
		ingreso: row2[0].totalGanancia,
		balance: balance,
	});
};

export const verVentas = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query("SELECT * FROM pedido WHERE idComercio = ?", req.session.idUser);
	const rows = <RowDataPacket>result;
	res.json(rows);
}

export const verDetallesVentas = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query("select A.cantidad,A.precio,B.nombre from registrocompra A left join articulocliente B on A.idProducto=B.idArticulo WHERE A.idPedido = ?", req.params.idPedido);
	const rows = <RowDataPacket>result;
	res.json(rows);
}

export const verFaltantes = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query("SELECT * FROM articulocliente WHERE cantidad < cantMinima and idComercio = ?", req.session.idUser);
	const rows = <RowDataPacket>result;
	res.json(rows);
}

export const notificaciones = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query("SELECT * FROM articulocliente WHERE cantidad < 1 and idComercio = ?", req.session.idUser);
	const productVacio = <RowDataPacket>result;
	
}
