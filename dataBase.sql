CREATE DATABASE  IF NOT EXISTS `marketnow` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `marketnow`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: marketnow
-- ------------------------------------------------------
-- Server version	5.1.45-community

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `articulocliente`
--

DROP TABLE IF EXISTS `articulocliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `articulocliente` (
  `idArticulo` int(6) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `cdb` int(14) DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `iva` int(4) DEFAULT NULL,
  `PdeGanancia` int(4) DEFAULT NULL,
  `precioUnitario` float DEFAULT NULL,
  `precioVenta` float DEFAULT NULL,
  `cantidad` int(6) DEFAULT NULL,
  `cantMinima` int(6) DEFAULT NULL,
  `cantIdeal` int(6) DEFAULT NULL,
  `idComercio` int(6) DEFAULT NULL,
  PRIMARY KEY (`idArticulo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articulocliente`
--

LOCK TABLES `articulocliente` WRITE;
/*!40000 ALTER TABLE `articulocliente` DISABLE KEYS */;
INSERT INTO `articulocliente` VALUES (1,'Kerosen',312451,'Combustible',21,20,75,108,-7,3,15,1),(2,'Palta Albina',3123123,'Frutas',21,32,75,120,18,5,25,1),(3,'Armando',3131,'Frutas',21,12,12,16,-26,10,20,1),(4,'Cacholeta',4124123,'Cachos',21,30,100,157,-19,10,40,1),(5,'tomate monsi',523423,'Frutas',21,50,50,90,2,10,20,1);
/*!40000 ALTER TABLE `articulocliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `articuloproveedor`
--

DROP TABLE IF EXISTS `articuloproveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `articuloproveedor` (
  `idArtProv` int(6) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` varchar(300) DEFAULT NULL,
  `puntos` int(6) DEFAULT NULL,
  `puntuadores` int(6) DEFAULT NULL,
  `precio` float DEFAULT NULL,
  `cantidad` int(6) DEFAULT NULL,
  `cdb` int(14) DEFAULT NULL,
  `imagen` varchar(100) DEFAULT NULL,
  `idProveedor` int(6) DEFAULT NULL,
  PRIMARY KEY (`idArtProv`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articuloproveedor`
--

LOCK TABLES `articuloproveedor` WRITE;
/*!40000 ALTER TABLE `articuloproveedor` DISABLE KEYS */;
INSERT INTO `articuloproveedor` VALUES (1,'meme tercer lugar','Un meme de un sujeto que queda en tercer lugar, jajaj',0,0,3,-5,31231,'/static/upload/1635992896761.png',NULL),(2,'meme tercer lugar','meme tercer lugar',129,30,3,15,31231231,'/static/upload/1635992916806.png',2),(3,'textura vaca','un textura de una vaca re lechera',4,1,10,-7,4134123,'/static/upload/1636066937034.png',2),(4,'tomate','un tomate delicioso para los almuerzos del los argentinos',0,0,40,10,41431231,'/static/upload/1636323314176.png',2),(5,'tomate mucho','un cajon lleno de tomates deliciosos para que no pares de comer tomate',0,0,180,8,40980912,'/static/upload/1636323351165.png',2),(6,'tomate monsi','un tomate modificado geneticamente por Monsanto. Comestible.',5,1,50,16,523423,'/static/upload/1636323398963.png',2);
/*!40000 ALTER TABLE `articuloproveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `balancemesual`
--

DROP TABLE IF EXISTS `balancemesual`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `balancemesual` (
  `idBalance` int(6) NOT NULL AUTO_INCREMENT,
  `deudas` float DEFAULT NULL,
  `haber` float DEFAULT NULL,
  `ingresos` float DEFAULT NULL,
  `egresos` float DEFAULT NULL,
  `cantidadVentas` int(12) DEFAULT NULL,
  `ganancia` float DEFAULT NULL,
  `cantidadCompras` int(12) DEFAULT NULL,
  `egresoCompras` float DEFAULT NULL,
  `impuestos` float DEFAULT NULL,
  `salario` float DEFAULT NULL,
  `servicios` float DEFAULT NULL,
  `alquiler` float DEFAULT NULL,
  `otros` float DEFAULT NULL,
  `totalsinCompras` float DEFAULT NULL,
  `perdidas` float DEFAULT NULL,
  `topCmas` varchar(300) DEFAULT NULL,
  `topCmenos` varchar(300) DEFAULT NULL,
  `ventasPorCategoria` varchar(300) DEFAULT NULL,
  `idComercio` int(6) DEFAULT NULL,
  PRIMARY KEY (`idBalance`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `balancemesual`
--

LOCK TABLES `balancemesual` WRITE;
/*!40000 ALTER TABLE `balancemesual` DISABLE KEYS */;
/*!40000 ALTER TABLE `balancemesual` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cajero`
--

DROP TABLE IF EXISTS `cajero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cajero` (
  `idCajero` int(6) NOT NULL AUTO_INCREMENT,
  `idComercio` int(6) DEFAULT NULL,
  `idUsuario` int(6) DEFAULT NULL,
  PRIMARY KEY (`idCajero`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cajero`
--

LOCK TABLES `cajero` WRITE;
/*!40000 ALTER TABLE `cajero` DISABLE KEYS */;
INSERT INTO `cajero` VALUES (1,1,4);
/*!40000 ALTER TABLE `cajero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categoria` (
  `idCategoria` int(6) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `ventas` int(6) DEFAULT NULL,
  `idCliente` int(6) DEFAULT NULL,
  PRIMARY KEY (`idCategoria`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clientes` (
  `idCliente` int(6) NOT NULL AUTO_INCREMENT,
  `idUsuario` int(6) DEFAULT NULL,
  PRIMARY KEY (`idCliente`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comercio`
--

DROP TABLE IF EXISTS `comercio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comercio` (
  `idComercio` int(6) NOT NULL AUTO_INCREMENT,
  `dni` int(12) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `logo` varchar(100) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `telefono` int(12) DEFAULT NULL,
  `nombreLocal` varchar(100) DEFAULT NULL,
  `idUsuario` int(6) DEFAULT NULL,
  PRIMARY KEY (`idComercio`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comercio`
--

LOCK TABLES `comercio` WRITE;
/*!40000 ALTER TABLE `comercio` DISABLE KEYS */;
INSERT INTO `comercio` VALUES (1,33123123,'joseyalvaro3123',NULL,'1',1123424252,'EToro',1);
/*!40000 ALTER TABLE `comercio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cupon`
--

DROP TABLE IF EXISTS `cupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cupon` (
  `idCupon` int(6) NOT NULL AUTO_INCREMENT,
  `tipo` int(6) DEFAULT NULL,
  `descuento` int(6) DEFAULT NULL,
  `expirar` date DEFAULT NULL,
  `categoría` varchar(100) DEFAULT NULL,
  `idComercio` int(6) DEFAULT NULL,
  PRIMARY KEY (`idCupon`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cupon`
--

LOCK TABLES `cupon` WRITE;
/*!40000 ALTER TABLE `cupon` DISABLE KEYS */;
/*!40000 ALTER TABLE `cupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuponcliente`
--

DROP TABLE IF EXISTS `cuponcliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cuponcliente` (
  `idCuponCliente` int(6) NOT NULL AUTO_INCREMENT,
  `idCupon` int(6) DEFAULT NULL,
  `idCliente` int(6) DEFAULT NULL,
  PRIMARY KEY (`idCuponCliente`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuponcliente`
--

LOCK TABLES `cuponcliente` WRITE;
/*!40000 ALTER TABLE `cuponcliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `cuponcliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `egresovario`
--

DROP TABLE IF EXISTS `egresovario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `egresovario` (
  `idEgreso` int(6) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) DEFAULT NULL,
  `cantidad` int(6) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `idComercio` int(6) DEFAULT NULL,
  PRIMARY KEY (`idEgreso`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `egresovario`
--

LOCK TABLES `egresovario` WRITE;
/*!40000 ALTER TABLE `egresovario` DISABLE KEYS */;
INSERT INTO `egresovario` VALUES (1,'egresoCompras',908,'2021-08-26',1),(2,'egresoCompras',2723,'2021-08-26',1),(3,'egresoCompras',15,'2021-09-15',1),(4,'egresoCompras',0,'2021-09-20',1),(6,'servicios',5000,'2021-11-04',1),(7,'alquiler',3000,'2021-11-04',1),(8,'compras',15,'2021-11-05',1),(9,'compras',12,'2021-11-05',1),(10,'compras',30,'2021-11-05',1),(11,'compras',21,'2021-11-05',1),(12,'compras',20,'2021-11-07',1),(13,'compras',20,'2021-11-07',1),(14,'compras',20,'2021-11-07',1),(15,'compras',20,'2021-11-07',1),(16,'compras',250,'2021-11-07',1),(17,'compras',150,'2021-11-07',1),(18,'compras',250,'2021-11-07',1),(19,'compras',150,'2021-11-07',1),(20,'compras',150,'2021-11-07',1),(21,'compras',150,'2021-11-07',1),(22,'compras',150,'2021-11-07',1),(23,'compras',150,'2021-11-07',1),(24,'compras',150,'2021-11-07',1),(25,'compras',150,'2021-11-07',1),(26,'compras',100,'2021-11-07',1),(27,'compras',100,'2021-11-07',1),(28,'compras',100,'2021-11-07',1);
/*!40000 ALTER TABLE `egresovario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `infodepago`
--

DROP TABLE IF EXISTS `infodepago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `infodepago` (
  `idPago` int(6) NOT NULL AUTO_INCREMENT,
  `metodo` varchar(100) DEFAULT NULL,
  `cuil` varchar(14) DEFAULT NULL,
  `cvu` int(25) DEFAULT NULL,
  `alias` varchar(100) DEFAULT NULL,
  `idUsuario` int(6) DEFAULT NULL,
  PRIMARY KEY (`idPago`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `infodepago`
--

LOCK TABLES `infodepago` WRITE;
/*!40000 ALTER TABLE `infodepago` DISABLE KEYS */;
INSERT INTO `infodepago` VALUES (1,'Mercado Pago','12341241',31243141,'Armando',2),(2,'Santander','51341413',31412341,'Armando_Sant',2);
/*!40000 ALTER TABLE `infodepago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pedido` (
  `idPedido` int(6) NOT NULL AUTO_INCREMENT,
  `monto` int(10) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `tipo` int(2) DEFAULT NULL,
  `comprobante` varchar(100) DEFAULT NULL,
  `idUsuario` int(6) DEFAULT NULL,
  `idComercio` int(6) DEFAULT NULL,
  PRIMARY KEY (`idPedido`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES (1,500,'exitoso','2021-08-26','16:34:34',2,NULL,1,1),(2,500,'exitoso','2021-08-27','00:24:24',2,NULL,1,1),(3,500,'exitoso','2021-09-06','11:37:41',2,NULL,1,1),(4,108,'error','2021-09-23','10:42:38',2,NULL,NULL,1),(5,108,'error','2021-09-23','10:45:53',2,NULL,NULL,1),(6,324,'error','2021-09-23','10:52:39',2,NULL,NULL,1),(7,0,'exitoso','2021-09-23','10:57:20',2,NULL,NULL,1),(8,216,'error','2021-09-23','10:58:41',2,NULL,NULL,1),(9,216,'error','2021-09-23','11:01:57',2,NULL,NULL,1),(10,216,'exitoso','2021-09-23','11:07:07',2,NULL,NULL,1),(11,108,'exitoso','2021-09-23','11:10:33',2,NULL,NULL,1),(12,108,'exitoso','2021-09-23','11:12:22',2,NULL,NULL,1),(13,324,'exitoso','2021-09-23','11:13:08',2,NULL,NULL,1),(14,108,'exitoso','2021-09-23','11:14:45',2,NULL,NULL,1),(15,297,'exitoso','2021-09-23','11:40:34',2,NULL,NULL,1),(16,1200,'entregado','2021-09-30','20:26:04',1,'/static/upload/1633044364261.png',2,1),(17,12000,'entregado','2021-10-02','06:42:50',1,'/static/upload/1633167770429.png',2,1),(18,240,'verificado','2021-10-03','18:48:54',1,'/static/upload/1633297734794.png',2,1),(19,360,'denegado','2021-10-03','18:53:44',1,'/static/upload/1633298024054.png',2,1),(20,600,'entregado','2021-10-03','18:59:12',1,'/static/upload/1633298352302.png',2,1),(21,600,'entregado','2021-10-03','19:00:39',1,'/static/upload/1633298439585.png',2,1),(22,1200,'pagado','2021-10-04','11:21:14',1,'/static/upload/1633357274956.png',2,1),(23,1200,'entregado','2021-10-04','11:22:32',1,'/static/upload/1633357352562.png',2,1),(24,1800,'pagado','2021-10-04','11:23:09',1,'/static/upload/1633357389514.png',2,1),(25,600,'entregado','2021-10-18','10:17:30',1,'/static/upload/1634563050210.png',2,1),(26,15,'verificado','2021-11-03','23:45:22',1,'/static/upload/1635993922363.png',2,NULL),(27,160,'exitoso','2021-11-04','19:23:45',2,NULL,NULL,1),(28,15,'error','2021-11-05','15:15:35',1,'/static/upload/1636136135432.png',2,1),(29,12,'error','2021-11-05','15:20:20',1,'/static/upload/1636136420639.png',2,1),(30,30,'error','2021-11-05','15:28:07',1,'/static/upload/1636136887825.png',2,1),(31,21,'entregado','2021-11-05','15:34:04',1,'/static/upload/1636137244927.png',2,1),(32,1080,'exitoso','2021-11-06','16:11:28',2,NULL,NULL,1),(33,2124,'exitoso','2021-11-06','16:12:01',2,NULL,NULL,1),(34,942,'exitoso','2021-11-06','21:02:55',2,NULL,NULL,1),(35,20,'entregado','2021-11-07','15:12:47',1,'/static/upload/1636308767100.png',2,1),(36,20,'entregado','2021-11-07','15:13:59',1,'/static/upload/1636308839955.png',2,1),(37,20,'entregado','2021-11-07','15:18:20',1,'/static/upload/1636309100983.png',2,1),(38,20,'entregado','2021-11-07','15:20:03',1,'/static/upload/1636309203651.png',2,1),(39,250,'entregado','2021-11-07','19:46:26',1,'/static/upload/1636325186803.png',2,1),(40,150,'entregado','2021-11-07','19:59:21',1,'/static/upload/1636325961342.png',2,1),(41,250,'entregado','2021-11-07','20:25:11',1,'/static/upload/1636327511905.png',2,1),(42,150,'entregado','2021-11-07','20:44:34',1,'/static/upload/1636328674762.png',2,1),(43,150,'entregado','2021-11-07','20:46:08',1,'/static/upload/1636328768763.png',2,1),(44,150,'entregado','2021-11-07','20:46:41',1,'/static/upload/1636328801795.png',2,1),(45,150,'entregado','2021-11-07','20:46:55',1,'/static/upload/1636328815716.png',2,1),(46,150,'entregado','2021-11-07','21:11:17',1,'/static/upload/1636330277174.png',2,1),(47,150,'entregado','2021-11-07','21:16:44',1,'/static/upload/1636330604103.png',2,1),(48,150,'entregado','2021-11-07','21:17:44',1,'/static/upload/1636330664728.png',2,1),(49,100,'entregado','2021-11-07','21:19:20',1,'/static/upload/1636330760048.png',2,1),(50,100,'entregado','2021-11-07','21:20:49',1,'/static/upload/1636330849776.png',2,1),(51,100,'entregado','2021-11-07','21:22:28',1,'/static/upload/1636330948875.png',2,1);
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proveedor` (
  `idProveedor` int(6) NOT NULL AUTO_INCREMENT,
  `dni` int(12) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `logo` varchar(100) DEFAULT NULL,
  `telefono` int(12) DEFAULT NULL,
  `nombreLocal` varchar(100) DEFAULT NULL,
  `idUsuario` int(6) DEFAULT NULL,
  PRIMARY KEY (`idProveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedor`
--

LOCK TABLES `proveedor` WRITE;
/*!40000 ALTER TABLE `proveedor` DISABLE KEYS */;
INSERT INTO `proveedor` VALUES (1,23123123,'joseyalvaro3123','/static/upload/1636143341173.png',1123232323,'EToro',2),(2,23123123,'joseyalvaro3123','/static/upload/1636142566437.png',123411231,'JPepe',3);
/*!40000 ALTER TABLE `proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puntosporcomercio`
--

DROP TABLE IF EXISTS `puntosporcomercio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `puntosporcomercio` (
  `idPuntos` int(6) NOT NULL AUTO_INCREMENT,
  `cantidad` int(6) DEFAULT NULL,
  `idComercio` int(6) DEFAULT NULL,
  `idCliente` int(6) DEFAULT NULL,
  PRIMARY KEY (`idPuntos`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntosporcomercio`
--

LOCK TABLES `puntosporcomercio` WRITE;
/*!40000 ALTER TABLE `puntosporcomercio` DISABLE KEYS */;
INSERT INTO `puntosporcomercio` VALUES (1,15,1,1);
/*!40000 ALTER TABLE `puntosporcomercio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puntuadores`
--

DROP TABLE IF EXISTS `puntuadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `puntuadores` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `idComercio` int(3) DEFAULT NULL,
  `idArticulo` int(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntuadores`
--

LOCK TABLES `puntuadores` WRITE;
/*!40000 ALTER TABLE `puntuadores` DISABLE KEYS */;
INSERT INTO `puntuadores` VALUES (1,1,2),(2,1,3),(3,1,6);
/*!40000 ALTER TABLE `puntuadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registrocompra`
--

DROP TABLE IF EXISTS `registrocompra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registrocompra` (
  `idCompra` int(6) NOT NULL AUTO_INCREMENT,
  `cantidad` int(6) DEFAULT NULL,
  `precio` float DEFAULT NULL,
  `cdb` int(14) DEFAULT NULL,
  `idProducto` int(6) DEFAULT NULL,
  `idPedido` int(6) DEFAULT NULL,
  PRIMARY KEY (`idCompra`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registrocompra`
--

LOCK TABLES `registrocompra` WRITE;
/*!40000 ALTER TABLE `registrocompra` DISABLE KEYS */;
INSERT INTO `registrocompra` VALUES (1,2,200,312451,1,1),(2,4,25,3123123,2,1),(3,2,108,312451,1,2),(4,4,25,3123123,2,2),(5,2,108,312451,1,3),(6,4,25,3123123,2,3),(7,NULL,NULL,NULL,NULL,10),(8,NULL,NULL,NULL,NULL,10),(9,NULL,NULL,NULL,NULL,11),(10,NULL,NULL,NULL,NULL,12),(11,NULL,NULL,NULL,NULL,13),(12,NULL,NULL,NULL,NULL,13),(13,NULL,NULL,NULL,NULL,13),(14,NULL,NULL,NULL,NULL,14),(15,2,16,3131,3,15),(16,1,108,312451,1,15),(17,1,157,4124123,4,15),(18,10,NULL,NULL,1,16),(19,10,NULL,NULL,1,17),(20,10,NULL,NULL,1,18),(21,10,NULL,NULL,1,19),(22,10,NULL,NULL,1,20),(23,10,NULL,NULL,1,21),(24,10,NULL,NULL,1,22),(25,10,NULL,NULL,1,23),(26,10,NULL,NULL,1,24),(27,10,NULL,NULL,1,25),(28,15,NULL,NULL,2,26),(29,10,16,3131,3,27),(30,7,3,31231231,2,31),(31,10,108,312451,1,32),(32,12,157,4124123,4,33),(33,15,16,3131,3,33),(34,6,157,4124123,4,34),(35,2,10,4134123,3,35),(36,2,10,4134123,3,36),(37,2,10,4134123,3,37),(38,2,10,4134123,3,38),(39,5,50,523423,6,39),(40,3,50,523423,6,40),(41,5,50,523423,6,41),(42,3,50,523423,6,42),(43,3,50,523423,6,43),(44,3,50,523423,6,44),(45,3,50,523423,6,45),(46,3,50,523423,6,46),(47,3,50,523423,6,47),(48,3,50,523423,6,48),(49,2,50,523423,6,49),(50,2,50,523423,6,50),(51,2,50,523423,6,51);
/*!40000 ALTER TABLE `registrocompra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `idUsuario` int(6) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `apelllido` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `clave` varchar(100) DEFAULT NULL,
  `fechaReg` date DEFAULT NULL,
  `rol` int(4) DEFAULT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Cacho',NULL,'cachito@gmail.com','$2b$08$i9C714OoB38Mr5ufoaYRyOYQkQwgsr8iudDGHDmMNKDsUQmfHExO2','2021-08-26',1),(2,'Armando',NULL,'prove@gmail.com','$2b$08$VdU.gWAkIv.ZbrXFDKAs6OBbrmTB6qM.kI2KaeR10oqWh7QE7xAgu','2021-09-05',2),(3,'Pepe',NULL,'pepe@gmail.com','$2b$08$azc6D9ijRuf442crWAxQdOYfhWo54D0wWesrB/azvkhjfB3iTbiNC','2021-09-06',2),(4,'Hernesto',NULL,'hene@gmail.com','$2b$08$mPFibm3wss7UWIudxwPPAudnliNGy0s54D/sdWJu5Jv/PvRdTIY6K','2021-11-06',4);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-11-07 22:00:56
