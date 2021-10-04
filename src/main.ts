import express, { Application } from "express";
import { createServer } from 'http';
import { Server } from 'socket.io';
import rutas from "./rutas";
import path from "path";
import mySqlSession from "express-mysql-session";
import favicon from 'serve-favicon';
require("dotenv").config({ path: ".env.default" });

class App {
	private app: Application;
	private puerto?: number;
	private httpServer;
	private io: any;

	constructor(puerto: number) {
		this.puerto = puerto;
		this.app = express();
		this.httpServer = createServer(this.app)
		this.io = new Server(this.httpServer);
		this.config();
		this.middlewars();
		this.sesiones();
		this.rutas();
		this.sockets()
	}

	config() {
		this.app.set("port", this.puerto || 3000);
		this.app.set("views", path.join(__dirname, "..", "views"));
		this.app.engine("html", require("ejs").renderFile);
		this.app.set("view engine", "ejs");
	}

	middlewars() {
		this.app.use(favicon(path.join(__dirname, '..', '/public/img/favicon.ico'))); 
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.json());
		this.app.use(
			"/static",
			express.static(path.join(__dirname, "..", "public"))
		);
	}

	sesiones() {
		const session = require("express-session");
		const MySQLStore = mySqlSession(session);
		const opciones = {
			host: "localhost",
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: "prueba_session",
		};
		const sessionStore = new MySQLStore(opciones);
		this.app.use(
			session({
				key: "session_cookie",
				secret: "Peron",
				resave: false,
				saveUninitialized: true,
				cookie: {
					maxAge: 1000 * 60 * 1000,
				},
			})
		);
	}

	rutas() {
		this.app.use("/", rutas);
	}

	sockets() {
		let proveedores: number[] = [];
		let socketsProv: string[] = [];

		this.io.on("connection", (socket: any) => {
			console.log('alguien se conecto con sockets')
			socket.on('nuevo-pedido', (val: any) => {
				console.log('nuevo-pedido')
				console.log(val)
				if(proveedores.includes(parseInt(val))){
					const indexVal = proveedores.indexOf(parseInt(val))
					this.io.to(socketsProv[indexVal]).emit('validar-pedido', val)
					console.log('pedido enviado')
				} else {
					console.log('no se encontro al proveedor')
				}
				this.io.to(socket.id).emit('pedido-visto')
			})
			socket.on('nuevo-proveedor', (val: number) => {
				if(proveedores.includes(val)){
					const indexVal = proveedores.indexOf(val)
					socketsProv[indexVal] = socket.id;
				}
				else {
				proveedores.push(val);
				socketsProv.push(socket.id);
				}	
			})
		})
	}

	prender() {
		this.httpServer.listen(this.app.get("port"), () => {
			console.log("Servidor escuchando en puerto", this.app.get("port"));
		});
	}
}

function main() {
	const servidor = new App(3000);
	servidor.prender();
}

main();