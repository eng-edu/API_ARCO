-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: localhost    Database: bd
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `arco`
--

LOCK TABLES `arco` WRITE;
/*!40000 ALTER TABLE `arco` DISABLE KEYS */;
INSERT INTO `arco` VALUES (74,13,1,'27/3/2019 - 23:18:51',1,'74hxv');
/*!40000 ALTER TABLE `arco` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `classificacao`
--

LOCK TABLES `classificacao` WRITE;
/*!40000 ALTER TABLE `classificacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `classificacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `curtida`
--

LOCK TABLES `curtida` WRITE;
/*!40000 ALTER TABLE `curtida` DISABLE KEYS */;
INSERT INTO `curtida` VALUES (62,1,84,'1'),(63,1,85,'1'),(64,11,84,'1'),(65,11,85,'2');
/*!40000 ALTER TABLE `curtida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `denuncia_opiniao`
--

LOCK TABLES `denuncia_opiniao` WRITE;
/*!40000 ALTER TABLE `denuncia_opiniao` DISABLE KEYS */;
/*!40000 ALTER TABLE `denuncia_opiniao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `equipe`
--

LOCK TABLES `equipe` WRITE;
/*!40000 ALTER TABLE `equipe` DISABLE KEYS */;
INSERT INTO `equipe` VALUES (146,'74hxv',1,2),(147,'74hxv',7,2),(148,'74hxv',11,2);
/*!40000 ALTER TABLE `equipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `escolaridade`
--

LOCK TABLES `escolaridade` WRITE;
/*!40000 ALTER TABLE `escolaridade` DISABLE KEYS */;
INSERT INTO `escolaridade` VALUES (3,'UFPA','Engenharia de ComputaÃ§Ã£o','2019','grupo de pesquisa e desenvolvimento de sistemas, NDAE PPCA TucuruÃ­','Desenvolvedor mobile ðŸ“´',1),(4,'Ana Pontes ','nada ','8ano','NÃ£o ','um pilote de fuga',7);
/*!40000 ALTER TABLE `escolaridade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `especialidade`
--

LOCK TABLES `especialidade` WRITE;
/*!40000 ALTER TABLE `especialidade` DISABLE KEYS */;
/*!40000 ALTER TABLE `especialidade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `especialidade_do_usuario`
--

LOCK TABLES `especialidade_do_usuario` WRITE;
/*!40000 ALTER TABLE `especialidade_do_usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `especialidade_do_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `estrela`
--

LOCK TABLES `estrela` WRITE;
/*!40000 ALTER TABLE `estrela` DISABLE KEYS */;
INSERT INTO `estrela` VALUES (70,1,84,2),(71,1,85,2),(72,11,85,5),(73,11,84,5);
/*!40000 ALTER TABLE `estrela` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `etapa`
--

LOCK TABLES `etapa` WRITE;
/*!40000 ALTER TABLE `etapa` DISABLE KEYS */;
INSERT INTO `etapa` VALUES (341,74,'OBSERVAÃ‡ÃƒO DA REALIDADE','-',2,1,'-'),(342,74,'PONTOS CHAVES','-',1,2,'-'),(343,74,'TEORIZAÃ‡ÃƒO','-',3,3,'-'),(344,74,'HIPÃ“TESES DE SOLUÃ‡ÃƒO','-',3,4,'-'),(345,74,'APLICAÃ‡ÃƒO A REALIDADE','-',3,5,'-');
/*!40000 ALTER TABLE `etapa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `notificacao`
--

LOCK TABLES `notificacao` WRITE;
/*!40000 ALTER TABLE `notificacao` DISABLE KEYS */;
INSERT INTO `notificacao` VALUES (119,74,1,'VocÃª possui uma solicitaÃ§Ã£o de participaÃ§Ã£o!','27/3/2019 - 23:19:42',2),(120,74,7,'VocÃª faz parte de um novo arco!','27/3/2019 - 23:19:47',3),(121,74,1,'VocÃª possui uma solicitaÃ§Ã£o de participaÃ§Ã£o!','27/3/2019 - 23:39:48',2),(122,74,11,'VocÃª faz parte de um novo arco!','27/3/2019 - 23:39:52',3);
/*!40000 ALTER TABLE `notificacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `opiniao`
--

LOCK TABLES `opiniao` WRITE;
/*!40000 ALTER TABLE `opiniao` DISABLE KEYS */;
INSERT INTO `opiniao` VALUES (84,341,7,'27/3/2019 - 23:37:46',2,'teste etapa 1'),(85,341,11,'27/3/2019 - 23:40:10',2,'testanto....');
/*!40000 ALTER TABLE `opiniao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tematica`
--

LOCK TABLES `tematica` WRITE;
/*!40000 ALTER TABLE `tematica` DISABLE KEYS */;
INSERT INTO `tematica` VALUES (13,'A','aaaa',10);
/*!40000 ALTER TABLE `tematica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Eduardo','Lima Nascimento','Superior','029.425.012-35','03/12/1996','edu@gmail.com','12345','M','fminha biogrÃ¡fia ðŸ’“ teste testando teste 1 teste 2 teste 3 teste 4 teste 5',1,NULL,1),(6,'Elane','Lima Nascimento','MÃ©dio',' - ','28/03/1994','elane@gmail.com','12345','F','sou nova aquiðŸ˜˜',2,NULL,0),(7,'leonardo','lima','Fundamental',' - ','19/02/2006','leo@gmail.com','12345','M','aaaa',2,NULL,0),(11,'teste ','teste ','Fundamental',' - ','03/08/2013','teste@gmail.com','12345','M','aaaa',2,NULL,0);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'bd'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-28 14:15:10
