import { Request, Response } from "express";
import pool from "../modulos/conexion";
import { OkPacket, RowDataPacket, ResultSetHeader } from "mysql2";

const promisePool = pool.promise();

export const comercio = (req: Request, res: Response) => {
	const param = req.params.page;
	const permitidas = [
		"cargaManual",
		"cupones",
		"Inventario",
		"reporteDiario",
		"regVentas",
		"stock-faltante",
		"entregas-pendientes",
		"registroCajero",
		"registro-proveedores",
		"indexComercio",
	];
	if (typeof param === "string" && permitidas.includes(param))
		res.render(param + ".html", {
			nombre: req.session.name,
			rol: req.session.rol,
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
						"compras",
						parseInt(post.precioUnitario, 10) *
							(parseInt(post.iva, 10) / 100 + 1) *
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
	console.log(req.session.idUser);
	const [result, fields] = await promisePool.query(
		"SELECT * FROM articulocliente WHERE idComercio = ?",
		req.session.idUser
	);
	const rows = <RowDataPacket>result;
	res.json(rows);
};

export const venderProducto = async (req: Request, res: Response) => {
	const ventas = req.body.ventas;
	const post = req.body;
	const idCliente =
		typeof post.idCliente != "number" ? null : parseInt(post.idCliente, 10);
	const [result, fields] = await promisePool.query(
		"INSERT INTO pedido(monto, estado, fecha, hora, tipo, idUsuario, idComercio) VALUES (?,?,CURDATE(),CURTIME(),?,?,?)",
		[parseInt(post.monto, 10), "exitoso", 2, idCliente, req.session.idUser]
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
					res.status(500);
				}
			}
		);
	}
	for (let i in ventas) {
		console.log("resta cantidad");
		const [result, fields] = await promisePool.query(
			"UPDATE articulocliente set cantidad = cantidad - ? WHERE idArticulo = ?",
			[ventas[i].cantidad, ventas[i].idArticulo]
		);
	}
	if (idCliente != null) {
		console.log("suma puntos");
		const puntos = parseInt(post.monto, 10) / 100;
		const subirPuntos = async (sql: string) => {
			const [result, fields] = await promisePool.query(sql, [
				puntos,
				req.session.idUser,
				idCliente,
			]);
		};
		const [result, fields] = await promisePool.query(
			"SELECT COUNT(*) as total FROM puntosporcomercio WHERE idComercio = ? AND idCliente = ?",
			[req.session.idUser, idCliente]
		);
		const row = <RowDataPacket>result;
		console.log(row);
		if (row[0].total >= 1)
			subirPuntos(
				"UPDATE puntosporcomercio SET cantidad = cantidad + ? WHERE idComercio = ? AND idCliente = ?"
			);
		else
			subirPuntos(
				"INSERT INTO puntosporcomercio(cantidad, idComercio, idCliente) VALUES (?,?,?)"
			);
	}
	res.status(201);
};

export const reporteDiario = async (req: Request, res: Response) => {
	const [result1] = await promisePool.query(
		"SELECT sum(cantidad) as totalGasto FROM egresovario WHERE idComercio = ? AND fecha = CURDATE()",
		req.session.idUser
	);
	const [result2] = await promisePool.query(
		"SELECT sum(monto) as totalGanancia FROM pedido WHERE idComercio = ? AND fecha = CURDATE() AND tipo = 2",
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
	const [result, fields] = await promisePool.query(
		"SELECT * FROM pedido WHERE idComercio = ? and tipo = 2",
		req.session.idUser
	);
	const rows = <RowDataPacket>result;
	res.json(rows);
};

export const verDetallesVentas = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query(
		"select A.cantidad,A.precio,B.nombre from registrocompra A left join articulocliente B on A.idProducto=B.idArticulo WHERE A.idPedido = ?",
		req.params.idPedido
	);
	const rows = <RowDataPacket>result;
	res.json(rows);
};

export const verFaltantes = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query(
		"SELECT * FROM articulocliente WHERE cantidad < cantMinima and idComercio = ?",
		req.session.idUser
	);
	const rows = <RowDataPacket>result;
	res.json(rows);
};

export const notificaciones = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query(
		"SELECT * FROM articulocliente WHERE cantidad < 1 and idComercio = ?",
		req.session.idUser
	);
	const productVacio = <RowDataPacket>result;
};

export const verEntregasPendientes = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query(
		"SELECT * FROM pedido WHERE idComercio = ? and tipo = ? and estado not like 'entregado'",
		[req.session.idUser, 1]
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
			"select A.nombre,A.email,B.nombreLocal,B.telefono,B.logo from usuarios A left join proveedor B on A.idUsuario=B.idUsuario WHERE B.idUsuario = ?",
			rowsPedido[i].idUsuario
		);
		const prov = <RowDataPacket>resultD;
		rowsProv.push(prov[0]);
		rowsPedido[i].nombreProv = prov[0].nombre;
		proveedores.push(rowsPedido[i].idUsuario);
		nombresProv.push(prov[0].nombre);
	}
	const info = {
		pedidos: rowsPedido.length,
		monto,
		verificados,
		proveedores: rowsProv.length,
	};
	res.render("entregas-pendientes.html", {
		nombre: req.session.name,
		rol: req.session.rol,
		rowsPedido,
		rowsProv,
		info,
	});
};

export const verBalance = async (req: Request, res: Response) => {
	const hoy = new Date(Date.now());
	const fecha = hoy.getFullYear() + "-" + hoy.getMonth() + "-" + hoy.getDay();

	const consulta = async (sql: string) => {
		const result = await promisePool.query(sql, [
			fecha,
			req.session.idUser,
		]);
		const resultado = <RowDataPacket>result;
		return resultado[0];
	};

	const informacion = {
		egresos: await consulta(
			"SELECT tipo, sum(cantidad) AS cantidad FROM egresovario WHERE fecha > ? and idComercio = ? GROUP BY tipo"
		),
		pedidos: await consulta(
			"SELECT tipo, count(tipo) AS cantidad, sum(monto) AS monto FROM pedido WHERE fecha > ? and idComercio = ? GROUP BY tipo"
		),
		ventasPorDia: await consulta(
			"SELECT fecha, count(fecha) AS cantidad  FROM pedido WHERE fecha > ? and idComercio = ?  and tipo = 2 GROUP BY fecha"
		),
		ventaPorductos: await consulta(
			"SELECT sum(rc.cantidad) AS cantidad,ac.nombre FROM registrocompra rc inner join articulocliente ac on rc.cdb = ac.cdb inner join pedido p on ac.idComercio = p.idComercio WHERE p.fecha > ? and p.idComercio = ? and p.tipo = 2 GROUP BY ac.nombre"
		),
		ventaPorCategoria: await consulta(
			"SELECT sum(rc.cantidad) AS cantidad,ac.categoria FROM registrocompra rc inner join articulocliente ac on rc.cdb = ac.cdb inner join pedido p on ac.idComercio = p.idComercio WHERE p.fecha > ? and p.idComercio = ? and p.tipo = 2 GROUP BY ac.categoria"
		),
	};
	console.log(informacion);

	const habersql = await promisePool.query(
		"SELECT sum(precioVenta  * cantidad) AS haber FROM articulocliente WHERE idComercio = ?",
		req.session.idUser
	);
	const haber = <RowDataPacket>habersql;

	let topMas = [],
		topMenos = [],
		ventasPorDia = [],
		dia = [],
		diaCantidad = [],
		cateTipo = [],
		cateCanti = [];
	const cantTop = informacion.ventaPorductos.length;
	const cantMax = cantTop >= 10 ? 5 : cantTop / 2;
	type ventaPro = {
		cantidad: number;
		nombre: string;
	};
	informacion.ventaPorductos.sort(function (a: ventaPro, b: ventaPro) {
		return b.cantidad - a.cantidad;
	});
	for (let i = 0; i < cantMax; i++)
		topMas.push(informacion.ventaPorductos[i].nombre);
	for (let i = cantTop - 1; i > cantMax; i--)
		topMenos.push(informacion.ventaPorductos[i].nombre);
	let egresos = [],
		egresosTotal = 0,
		gastoTotal = 0;
	for (let egreso of informacion.egresos) {
		egresos[egreso.tipo] = egreso.cantidad;
		gastoTotal += Number(egreso.cantidad);
		if (egreso.tipo != "compras") {
			egresosTotal += Number(egreso.cantidad);
		}
	}

	const ultimaFecha = new Date(Date.now());
	const ultimoDia = ultimaFecha.getDate();
	const ultimoMes = ultimaFecha.getMonth() + 1;

	for (let venta of informacion.ventasPorDia) {
		if (venta.fecha.getMonth() + 1 == ultimoMes) {
			dia.push(venta.fecha.getDate());
			diaCantidad.push(venta.cantidad);
		}
	}
	for (let i = ultimoDia - 1; i >= 0; i--) {
		ventasPorDia.push(
			diaCantidad[dia.indexOf(i + 1)] == undefined
				? 0
				: diaCantidad[dia.indexOf(i + 1)]
		);
	}

	console.log(ultimoDia)
	console.log(ventasPorDia)

	const ingresos = (informacion.pedidos[1] == undefined || informacion.pedidos[1].monto == null)? 0: informacion.pedidos[1].monto;
	const canVentas = (informacion.pedidos[1] == undefined || informacion.pedidos[1].cantidad == null)? 0: informacion.pedidos[1].cantidad;
	const canCompras = (informacion.pedidos[0] == undefined || informacion.pedidos[0].cantidad == null)? 0: informacion.pedidos[0].cantidad;

	for (let cate of informacion.ventaPorCategoria) {
		cateTipo.push(cate.categoria);
		cateCanti.push(cate.cantidad);
	}

	res.render("reporteBalance.html", {
		nombre: req.session.name,
		rol: req.session.rol,
		pedidos: informacion.pedidos,
		ingresos,
		egresos: egresos,
		gastoTotal,
		canVentas,
		canCompras,
		haber: haber[0][0].haber,
		egresosTotal,
		ventasPorDia: ventasPorDia,
		topMas,
		cateTipo: cateTipo,
		cateCanti: cateCanti,
		topMenos,
		ventaPorductos: informacion.ventaPorductos,
		ventaPorCategoria: informacion.ventaPorCategoria,
	});
};

export const egresoVario = async (req: Request, res: Response) => {
	const post = req.body;
	console.log(post);
	const [result, fields] = await promisePool.query(
		"INSERT INTO egresovario(tipo, cantidad, fecha, idComercio) VALUES(?,?,CURDATE(),?)",
		[post.tipo, post.monto, req.session.idUser]
	);
	res.status(200).redirect("back");
};

export const inicio = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query(
		"SELECT * FROM articulocliente WHERE cantidad < 1 and idComercio = ?",
		req.session.idUser
	);
	const [result1] = await promisePool.query(
		"SELECT sum(cantidad) as totalGasto FROM egresovario WHERE idComercio = ? AND fecha = CURDATE()",
		req.session.idUser
	);
	const [result2] = await promisePool.query(
		"SELECT sum(monto) as totalGanancia FROM pedido WHERE idComercio = ? AND fecha = CURDATE() AND tipo = 2",
		req.session.idUser
	);
	const faltante = <RowDataPacket>result;
	const row1 = <RowDataPacket>result1;
	const row2 = <RowDataPacket>result2;
	const balance = row2[0].totalGanancia - row1[0].totalGasto;
	res.render("indexComercio.html", {
		nombre: req.session.name,
		rol: req.session.rol,
		faltante,
		egreso: row1[0].totalGasto == null ? 0 : row1[0].totalGasto,
		ingreso: row2[0].totalGanancia == null ? 0 : row2[0].totalGanancia,
		balance: balance,
	});
};

export const agregarProducto = (req: Request, res: Response) => {
	const verificar = (dato: any) =>
		dato == undefined || dato == "" ? null : parseInt(dato, 10);
	const post = req.body;
	console.log(post)
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
				res.status(201).redirect("/comercio/entregas-pendientes");
			}
		}
	);
};

export const verRegistroProveedores = async (req: Request, res: Response) => {
	const [result, fields] = await promisePool.query(
		"SELECT pr.logo, us.nombre, pr.nombreLocal, pr.telefono, count(p.idUsuario) AS interacciones, us.email FROM pedido p inner join proveedor pr on p.idUsuario = pr.idUsuario inner join usuarios us on pr.idUsuario = us.idUsuario WHERE p.idComercio = ? and p.tipo = 1 GROUP BY p.idUsuario",
		req.session.idUser
	);
	const row = <RowDataPacket>result;
	console.log(row)
	res.render("registro-proveedores.html", {
			nombre: req.session.name,
			rol: req.session.rol,
			rows: row
		});
};
