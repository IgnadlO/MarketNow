import pool from "../modulos/conexion";
import { Request, Response, NextFunction } from "express";
import * as bcryptjs from "bcrypt";
import { RowDataPacket, OkPacket, ResultSetHeader } from "mysql2";
import * as jwt from 'jsonwebtoken';
import transporter from '../modulos/emailer'
import "express-session";

declare module "express-session" {
	interface SessionData {
		idUser: number;
		email: string;
		name: string;
		rol: number;
		loggedin: boolean;
	}
}

const promisePool = pool.promise();

const enviarEmail = async (dest: string, asunto: string, mensaje:string) => {
	transporter.sendMail({
		from: "MarketNow <" + process.env.NM_EMAIL + ">",
		to: dest,
		subject: asunto,
		html: mensaje,
	});
};

export const singUp = async (req: Request, res: Response) => {
	const pass = await bcryptjs.hash(req.body.contra, 8);
	const post = req.body;
	pool.query(
		"INSERT INTO usuarios(nombre, email, clave, fechaReg, rol) VALUES (?,?,?,CURDATE(),?)",
		[post.nombre, post.email, pass, post.rol], (error, result) => {
			if (error){ 
				if (error.errno == 1062) res.send('este email ya esta registrado');
				else throw error;
			}
			else {
			const row = <ResultSetHeader>result;
			const insertSQL = (sql: string, valores:any[]) => {
				pool.query(sql,valores,(error, rowDos) => {
						if (error) throw error;
						res.redirect("/");
					}
				);
			}
			if (post.rol == 1) //comercio
				insertSQL("INSERT INTO comercio(dni, direccion, estado, telefono, nombreLocal, idUsuario) VALUES (?,?,?,?,?,?)",
			 	[post.dni, post.direccion, true, post.telefono, post.nombreLocal, row.insertId])
			else if (post.rol == 2) //proveedor
				insertSQL("INSERT INTO proveedor(dni, direccion, telefono, nombreLocal, idUsuario) VALUES (?,?,?,?,?)",
			 	[post.dni, post.direccion, post.telefono, post.nombreLocal, row.insertId])
			else if (post.rol == 3) //cliente
				insertSQL("insert into clientes(idUsuario) values(?)",
					[row.insertId])
			else if (post.rol == 4)
				insertSQL("INSERT INTO cajero(idComercio, idUsuario) values(?,?)",
					[post.idComercio, row.insertId])
			}	
		}
	);
};

export const singIn = async (req: Request, res: Response) => {
	const pass = req.body.contra;
	const email = req.body.email;
	const [result, fields] = await promisePool.query("SELECT * FROM usuarios WHERE email = ?", email);
	const rows = <RowDataPacket>result;
	if (rows.length == 0) res.json("El usuario no existe");
	else if (await bcryptjs.compare(pass, rows[0].clave)) {
		req.session.loggedin = true;
		req.session.email = email;
		req.session.name = rows[0].nombre;
		req.session.rol = rows[0].rol;
		req.session.idUser = rows[0].idUsuario;
		const urlRedirect = (rows[0].rol == 2)? '/proveedor/indexProveedor': '/comercio/indexComercio';
		res.json(urlRedirect);
	} else res.json("Contraseña incorrecta");
};

export const logOut = (req: Request, res: Response) => {
	req.session.destroy(() => res.redirect("/"));
};

export const verifyLogged = (req: Request, res: Response, next: NextFunction) => {
	const verificar = (process.env.LOGIN == 'false')? false: true;
	if(!verificar) next();
	if (req.session.loggedin) next();
	else {
		res.status(401).render('avisos/noLogueado.html');
	}
}

export const enviarCambioContra = async (req: Request, res: Response) => {
	const email = req.body.email;
	const verificar = (process.env.NM_ACT == 'true')? true: false;
	const [result, fields] = await promisePool.query("SELECT * FROM usuarios WHERE email = ?", email);
	const rows = <RowDataPacket>result;
	if (rows.length == 0) res.json("El email no posee cuenta");
	else {
		jwt.sign({user:email},'secretkey', {expiresIn: '10m'}, (err, token) => {
			const mensaje = `
				<h3>Buenas tardes ${rows[0].nombre}</h3>
        		<b> Para poder cambiar su contraseña presione el siguiente link</b><br>
        		<a href="http://localhost:3000/recuperePass/${token}">Click Aqui</a>
        		`;
			if (verificar) {
				enviarEmail(email, 'Cambiar Contraseña', mensaje)
				res.render('avisos/seEnvioEmail.html', ({email: email, dato: ''}));
			} else {
			res.render('avisos/seEnvioEmail.html', ({email: email,
			dato: '<label>Lo siguiente es el mensaje que llegaria si la opcion de mandar emails estuviera activada: </label>' + mensaje}));
		}
		});
	}
}

export const recuperePass = (req: Request, res: Response) => {
	const token = req.params.token;
	jwt.verify(token, 'secretkey', (error, authData) => {
		if(error){
			res.send('token no valido');
		}
		else
			res.render('home/Nueva-Contraseña.html', {loged: false, token: token});
		});
}

export const nuevaPass = (req: Request, res: Response) => {
	jwt.verify(req.params.token, "secretkey", async (error, authData) => {
		if (error) 
			res.send("token no valido");
		else {
			let encript = await bcryptjs.hash(req.body.contra, 8);
			const data = { clave: encript };
			pool.query("UPDATE usuarios set ? WHERE email = ?", [data, authData!.user], (err, row) => {
				if (err) throw err;
				res.redirect('/home/Iniciar-sesion');
			});	
		}
	});
};