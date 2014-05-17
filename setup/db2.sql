-- MySQL dump 10.13  Distrib 5.6.13, for osx10.8 (x86_64)
--
-- Host: localhost    Database: api
-- ------------------------------------------------------
-- Server version	5.6.13

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
-- Table structure for table `api_action`
--

DROP TABLE IF EXISTS `api_action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_action` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(255) COLLATE utf8_bin NOT NULL,
  `description` longtext COLLATE utf8_bin,
  `data` longtext COLLATE utf8_bin,
  `created` datetime(6) NOT NULL,
  `modified` datetime(6) NOT NULL,
  `key` varchar(36) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_action_2caeaf6c` (`community_id`),
  KEY `api_action_6340c63c` (`user_id`),
  KEY `api_action_e7c54ddc` (`action`),
  KEY `api_action_c0d4be93` (`key`),
  CONSTRAINT `community_id_refs_id_9a8f1af3` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`),
  CONSTRAINT `user_id_refs_id_091d2cd7` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_action`
--

LOCK TABLES `api_action` WRITE;
/*!40000 ALTER TABLE `api_action` DISABLE KEYS */;
INSERT INTO `api_action` VALUES (1,2,1,'add text file',NULL,'{\"file\":\"Fairfax.xml\"}','2014-05-17 13:06:35.000000','2014-05-17 13:06:35.000000','b1b76b23-88ec-44d0-be19-4c34206c5a73'),(2,2,1,'add image zip',NULL,'{\"doc\":\"urn:det:TCUSask:BD01:document=Fairfax\"}','2014-05-17 13:12:59.000000','2014-05-17 13:12:59.000000','25f1a177-1500-41b9-81ca-d0f23be329f5'),(3,2,1,'add text file',NULL,'{\"file\":\"Bodley.xml\"}','2014-05-17 13:13:18.000000','2014-05-17 13:13:18.000000','fad6fc89-c26e-4d23-aa44-d32cc9235e85'),(4,2,1,'add image zip',NULL,'{\"doc\":\"urn:det:TCUSask:BD01:document=Bodley\"}','2014-05-17 13:13:55.000000','2014-05-17 13:13:55.000000','b51ea527-0a09-4a78-9cd8-1717bd96f977'),(5,2,1,'add image zip',NULL,'{\"doc\":\"urn:det:TCUSask:BD01:document=Fairfax\"}','2014-05-17 13:19:14.000000','2014-05-17 13:19:14.000000','dd21bec6-b50d-4590-989e-e1250e5084bc'),(6,2,1,'add image zip',NULL,'{\"doc\":\"urn:det:TCUSask:BD01:document=Bodley\"}','2014-05-17 13:19:24.000000','2014-05-17 13:19:24.000000','c2827793-27af-4054-bb9b-4e444aac8a6d'),(7,2,1,'add image zip',NULL,'{\"doc\":\"urn:det:TCUSask:BD01:document=Fairfax\"}','2014-05-17 13:20:15.000000','2014-05-17 13:20:15.000000','35712ba0-3468-45ec-ad22-2931839db19d'),(8,2,1,'add image zip',NULL,'{\"doc\":\"urn:det:TCUSask:BD01:document=Fairfax\"}','2014-05-17 14:24:57.000000','2014-05-17 14:24:57.000000','4d23ba67-6d3e-41d3-92c4-a85cdb277b3b'),(9,2,1,'add image zip',NULL,'{\"doc\":\"urn:det:TCUSask:BD01:document=Fairfax\"}','2014-05-17 14:26:04.000000','2014-05-17 14:26:04.000000','35500d34-8d60-4d17-ba5c-9cd93b7e2221'),(10,2,1,'add image zip',NULL,'{\"doc\":\"urn:det:TCUSask:BD01:document=Fairfax\"}','2014-05-17 14:26:57.000000','2014-05-17 14:26:57.000000','e8584cde-3211-4d3c-a5e5-93337884df12');
/*!40000 ALTER TABLE `api_action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_attr`
--

DROP TABLE IF EXISTS `api_attr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_attr` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text_id` int(11) NOT NULL,
  `name` varchar(63) COLLATE utf8_bin NOT NULL,
  `value` varchar(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `text_id` (`text_id`,`name`),
  KEY `api_attr_377be151` (`text_id`),
  CONSTRAINT `text_id_refs_id_280245bd` FOREIGN KEY (`text_id`) REFERENCES `api_text` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_attr`
--

LOCK TABLES `api_attr` WRITE;
/*!40000 ALTER TABLE `api_attr` DISABLE KEYS */;
INSERT INTO `api_attr` VALUES (1,3,'n','130r'),(2,3,'facs','FF130R.JPG'),(3,5,'n','Book of the Duchess'),(4,6,'place','tm'),(5,6,'type','pageNum'),(6,7,'type','ed'),(7,7,'resp','PR'),(8,8,'n','Title'),(9,202,'place','margin-right'),(10,10,'n','1'),(11,12,'n','2'),(12,14,'n','3'),(13,16,'n','4'),(14,18,'n','5'),(15,20,'n','6'),(16,22,'n','7'),(17,24,'n','8'),(18,26,'n','9'),(19,28,'n','10'),(20,30,'n','11'),(21,32,'n','12'),(22,34,'n','13'),(23,36,'n','14'),(24,38,'n','15'),(25,40,'n','16'),(26,42,'n','17'),(27,44,'n','18'),(28,46,'n','19'),(29,48,'n','20'),(30,50,'n','21'),(31,52,'n','22'),(32,54,'n','23'),(33,56,'n','24'),(34,58,'n','25'),(35,60,'n','26'),(36,62,'n','27'),(37,64,'n','28'),(38,66,'n','29'),(39,68,'n','30'),(40,70,'n','31'),(41,72,'n','32'),(42,74,'n','33'),(43,76,'n','34'),(44,78,'n','35'),(45,80,'n','36'),(46,82,'n','37'),(47,84,'n','38'),(48,85,'n','130v'),(49,85,'facs','FF130V.JPG'),(50,87,'n','39'),(51,89,'n','40'),(52,91,'n','41'),(53,93,'n','42'),(54,95,'n','43'),(55,97,'n','44'),(56,99,'n','45'),(57,101,'n','46'),(58,103,'n','47'),(59,105,'n','48'),(60,107,'n','49'),(61,109,'n','50'),(62,111,'n','51'),(63,113,'n','52'),(64,115,'n','53'),(65,117,'n','54'),(66,119,'n','55'),(67,121,'n','56'),(68,123,'n','57'),(69,125,'n','58'),(70,127,'n','59'),(71,129,'n','60'),(72,131,'n','61'),(73,133,'n','62'),(74,135,'n','63'),(75,137,'n','64'),(76,139,'n','65'),(77,141,'n','66'),(78,143,'n','67'),(79,145,'n','68'),(80,147,'n','69'),(81,149,'n','70'),(82,151,'n','71'),(83,153,'n','72'),(84,155,'n','73'),(85,157,'n','74'),(86,159,'n','75'),(87,161,'n','76'),(88,163,'n','77'),(89,165,'n','78'),(90,167,'n','79'),(91,169,'n','80'),(92,171,'n','81'),(93,173,'n','82'),(94,175,'n','83'),(95,177,'n','84'),(96,179,'n','85'),(97,181,'n','86'),(98,183,'n','87'),(99,185,'n','88'),(100,187,'n','89'),(101,189,'n','90'),(102,191,'n','91'),(103,193,'n','92'),(104,195,'n','93'),(105,197,'n','94'),(106,199,'n','95'),(107,201,'n','96'),(108,203,'type','catch'),(109,203,'place','br'),(110,206,'n','110v'),(111,206,'facs','BD110V.JPG'),(112,208,'n','Book of the Duchess'),(113,209,'n','Title'),(114,211,'n','1'),(115,213,'n','2'),(116,215,'n','3'),(117,217,'n','4'),(118,219,'n','5'),(119,221,'n','6'),(120,223,'n','7'),(121,225,'n','8'),(122,227,'n','9'),(123,229,'n','10'),(124,231,'n','11'),(125,233,'n','12'),(126,235,'n','13'),(127,237,'n','14'),(128,239,'n','15'),(129,241,'n','16'),(130,243,'n','17'),(131,245,'n','18'),(132,247,'n','19'),(133,249,'n','20'),(134,251,'n','21'),(135,253,'n','22'),(136,255,'n','23');
/*!40000 ALTER TABLE `api_attr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_community`
--

DROP TABLE IF EXISTS `api_community`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_community` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8_bin NOT NULL,
  `abbr` varchar(4) COLLATE utf8_bin NOT NULL,
  `long_name` varchar(80) COLLATE utf8_bin NOT NULL,
  `description` longtext COLLATE utf8_bin NOT NULL,
  `font` varchar(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `abbr` (`abbr`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_community`
--

LOCK TABLES `api_community` WRITE;
/*!40000 ALTER TABLE `api_community` DISABLE KEYS */;
INSERT INTO `api_community` VALUES (1,'Textual Communities','TC','The home of all Textual Communities','The Textual Communities project aims to establish a new model of partnership between scholars and readers everywhere in exploring texts.  Increasingly, the base materials for research into texts are available on the internet: especially, as images of manuscripts, books and other documents.  The huge volume of material now available, even for just one work (such as the 84 manuscripts of the Canterbury Tales) requires many people to research them:  to identify the documents, to make copies of them, to annotate them, to make transcripts of them, to compare and analyze them.  This project will provide an infrastructure and tools to allow anyone, anywhere, interested in a text to contribute to its study, as part of a community working together. ',''),(2,'SpecimenBD','BD01','Book of the Duchess Specimen','A simple specimen to show what TC can do','');
/*!40000 ALTER TABLE `api_community` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_community_docs`
--

DROP TABLE IF EXISTS `api_community_docs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_community_docs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` int(11) NOT NULL,
  `doc_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_id` (`community_id`,`doc_id`),
  KEY `api_community_docs_2caeaf6c` (`community_id`),
  KEY `api_community_docs_fbbb6049` (`doc_id`),
  CONSTRAINT `doc_id_refs_id_e9419884` FOREIGN KEY (`doc_id`) REFERENCES `api_doc` (`id`),
  CONSTRAINT `community_id_refs_id_fe9e389d` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_community_docs`
--

LOCK TABLES `api_community_docs` WRITE;
/*!40000 ALTER TABLE `api_community_docs` DISABLE KEYS */;
INSERT INTO `api_community_docs` VALUES (1,2,1),(2,2,101);
/*!40000 ALTER TABLE `api_community_docs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_community_entities`
--

DROP TABLE IF EXISTS `api_community_entities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_community_entities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` int(11) NOT NULL,
  `entity_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_id` (`community_id`,`entity_id`),
  KEY `api_community_entities_2caeaf6c` (`community_id`),
  KEY `api_community_entities_c096cf48` (`entity_id`),
  CONSTRAINT `entity_id_refs_id_a6ed2bc0` FOREIGN KEY (`entity_id`) REFERENCES `api_entity` (`id`),
  CONSTRAINT `community_id_refs_id_b6f05088` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_community_entities`
--

LOCK TABLES `api_community_entities` WRITE;
/*!40000 ALTER TABLE `api_community_entities` DISABLE KEYS */;
INSERT INTO `api_community_entities` VALUES (1,2,1);
/*!40000 ALTER TABLE `api_community_entities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_community_refsdecls`
--

DROP TABLE IF EXISTS `api_community_refsdecls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_community_refsdecls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` int(11) NOT NULL,
  `refsdecl_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_id` (`community_id`,`refsdecl_id`),
  KEY `api_community_refsdecls_2caeaf6c` (`community_id`),
  KEY `api_community_refsdecls_15be22b0` (`refsdecl_id`),
  CONSTRAINT `refsdecl_id_refs_id_491d34ee` FOREIGN KEY (`refsdecl_id`) REFERENCES `api_refsdecl` (`id`),
  CONSTRAINT `community_id_refs_id_b6740060` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_community_refsdecls`
--

LOCK TABLES `api_community_refsdecls` WRITE;
/*!40000 ALTER TABLE `api_community_refsdecls` DISABLE KEYS */;
INSERT INTO `api_community_refsdecls` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(6,1,6);
/*!40000 ALTER TABLE `api_community_refsdecls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_doc`
--

DROP TABLE IF EXISTS `api_doc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_doc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lft` int(10) unsigned NOT NULL,
  `rgt` int(10) unsigned NOT NULL,
  `tree_id` int(10) unsigned NOT NULL,
  `depth` int(10) unsigned NOT NULL,
  `name` varchar(63) COLLATE utf8_bin NOT NULL,
  `label` varchar(63) COLLATE utf8_bin NOT NULL,
  `cur_rev_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cur_rev_id` (`cur_rev_id`),
  KEY `api_doc_f777e2bb` (`lft`),
  KEY `api_doc_deca00cf` (`rgt`),
  KEY `api_doc_f391089a` (`tree_id`),
  KEY `api_doc_21c3f5f4` (`depth`),
  CONSTRAINT `cur_rev_id_refs_id_7779d53a` FOREIGN KEY (`cur_rev_id`) REFERENCES `api_revision` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_doc`
--

LOCK TABLES `api_doc` WRITE;
/*!40000 ALTER TABLE `api_doc` DISABLE KEYS */;
INSERT INTO `api_doc` VALUES (1,1,200,1,1,'Fairfax','document',NULL),(2,2,81,1,2,'130r','Folio',NULL),(3,82,199,1,2,'130v','Folio',NULL),(4,3,4,1,3,'1','Line',NULL),(5,5,6,1,3,'2','Line',NULL),(6,7,8,1,3,'3','Line',NULL),(7,9,10,1,3,'4','Line',NULL),(8,11,12,1,3,'5','Line',NULL),(9,13,14,1,3,'6','Line',NULL),(10,15,16,1,3,'7','Line',NULL),(11,17,18,1,3,'8','Line',NULL),(12,19,20,1,3,'9','Line',NULL),(13,21,22,1,3,'10','Line',NULL),(14,23,24,1,3,'11','Line',NULL),(15,25,26,1,3,'12','Line',NULL),(16,27,28,1,3,'13','Line',NULL),(17,29,30,1,3,'14','Line',NULL),(18,31,32,1,3,'15','Line',NULL),(19,33,34,1,3,'16','Line',NULL),(20,35,36,1,3,'17','Line',NULL),(21,37,38,1,3,'18','Line',NULL),(22,39,40,1,3,'19','Line',NULL),(23,41,42,1,3,'20','Line',NULL),(24,43,44,1,3,'21','Line',NULL),(25,45,46,1,3,'22','Line',NULL),(26,47,48,1,3,'23','Line',NULL),(27,49,50,1,3,'24','Line',NULL),(28,51,52,1,3,'25','Line',NULL),(29,53,54,1,3,'26','Line',NULL),(30,55,56,1,3,'27','Line',NULL),(31,57,58,1,3,'28','Line',NULL),(32,59,60,1,3,'29','Line',NULL),(33,61,62,1,3,'30','Line',NULL),(34,63,64,1,3,'31','Line',NULL),(35,65,66,1,3,'32','Line',NULL),(36,67,68,1,3,'33','Line',NULL),(37,69,70,1,3,'34','Line',NULL),(38,71,72,1,3,'35','Line',NULL),(39,73,74,1,3,'36','Line',NULL),(40,75,76,1,3,'37','Line',NULL),(41,77,78,1,3,'38','Line',NULL),(42,79,80,1,3,'39','Line',NULL),(43,83,84,1,3,'1','Line',NULL),(44,85,86,1,3,'2','Line',NULL),(45,87,88,1,3,'3','Line',NULL),(46,89,90,1,3,'4','Line',NULL),(47,91,92,1,3,'5','Line',NULL),(48,93,94,1,3,'6','Line',NULL),(49,95,96,1,3,'7','Line',NULL),(50,97,98,1,3,'8','Line',NULL),(51,99,100,1,3,'9','Line',NULL),(52,101,102,1,3,'10','Line',NULL),(53,103,104,1,3,'11','Line',NULL),(54,105,106,1,3,'12','Line',NULL),(55,107,108,1,3,'13','Line',NULL),(56,109,110,1,3,'14','Line',NULL),(57,111,112,1,3,'15','Line',NULL),(58,113,114,1,3,'16','Line',NULL),(59,115,116,1,3,'17','Line',NULL),(60,117,118,1,3,'18','Line',NULL),(61,119,120,1,3,'19','Line',NULL),(62,121,122,1,3,'20','Line',NULL),(63,123,124,1,3,'21','Line',NULL),(64,125,126,1,3,'22','Line',NULL),(65,127,128,1,3,'23','Line',NULL),(66,129,130,1,3,'24','Line',NULL),(67,131,132,1,3,'25','Line',NULL),(68,133,134,1,3,'26','Line',NULL),(69,135,136,1,3,'27','Line',NULL),(70,137,138,1,3,'28','Line',NULL),(71,139,140,1,3,'29','Line',NULL),(72,141,142,1,3,'30','Line',NULL),(73,143,144,1,3,'31','Line',NULL),(74,145,146,1,3,'32','Line',NULL),(75,147,148,1,3,'33','Line',NULL),(76,149,150,1,3,'34','Line',NULL),(77,151,152,1,3,'35','Line',NULL),(78,153,154,1,3,'36','Line',NULL),(79,155,156,1,3,'37','Line',NULL),(80,157,158,1,3,'38','Line',NULL),(81,159,160,1,3,'39','Line',NULL),(82,161,162,1,3,'40','Line',NULL),(83,163,164,1,3,'41','Line',NULL),(84,165,166,1,3,'42','Line',NULL),(85,167,168,1,3,'43','Line',NULL),(86,169,170,1,3,'44','Line',NULL),(87,171,172,1,3,'45','Line',NULL),(88,173,174,1,3,'46','Line',NULL),(89,175,176,1,3,'47','Line',NULL),(90,177,178,1,3,'48','Line',NULL),(91,179,180,1,3,'49','Line',NULL),(92,181,182,1,3,'50','Line',NULL),(93,183,184,1,3,'51','Line',NULL),(94,185,186,1,3,'52','Line',NULL),(95,187,188,1,3,'53','Line',NULL),(96,189,190,1,3,'54','Line',NULL),(97,191,192,1,3,'55','Line',NULL),(98,193,194,1,3,'56','Line',NULL),(99,195,196,1,3,'57','Line',NULL),(100,197,198,1,3,'58','Line',NULL),(101,1,52,2,1,'Bodley','document',NULL),(102,2,51,2,2,'110v','Folio',NULL),(103,3,4,2,3,'1','Line',NULL),(104,5,6,2,3,'2','Line',NULL),(105,7,8,2,3,'3','Line',NULL),(106,9,10,2,3,'4','Line',NULL),(107,11,12,2,3,'5','Line',NULL),(108,13,14,2,3,'6','Line',NULL),(109,15,16,2,3,'7','Line',NULL),(110,17,18,2,3,'8','Line',NULL),(111,19,20,2,3,'9','Line',NULL),(112,21,22,2,3,'10','Line',NULL),(113,23,24,2,3,'11','Line',NULL),(114,25,26,2,3,'12','Line',NULL),(115,27,28,2,3,'13','Line',NULL),(116,29,30,2,3,'14','Line',NULL),(117,31,32,2,3,'15','Line',NULL),(118,33,34,2,3,'16','Line',NULL),(119,35,36,2,3,'17','Line',NULL),(120,37,38,2,3,'18','Line',NULL),(121,39,40,2,3,'19','Line',NULL),(122,41,42,2,3,'20','Line',NULL),(123,43,44,2,3,'21','Line',NULL),(124,45,46,2,3,'22','Line',NULL),(125,47,48,2,3,'23','Line',NULL),(126,49,50,2,3,'24','Line',NULL);
/*!40000 ALTER TABLE `api_doc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_entity`
--

DROP TABLE IF EXISTS `api_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_entity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lft` int(10) unsigned NOT NULL,
  `rgt` int(10) unsigned NOT NULL,
  `tree_id` int(10) unsigned NOT NULL,
  `depth` int(10) unsigned NOT NULL,
  `name` varchar(63) COLLATE utf8_bin NOT NULL,
  `label` varchar(63) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_entity_f777e2bb` (`lft`),
  KEY `api_entity_deca00cf` (`rgt`),
  KEY `api_entity_f391089a` (`tree_id`),
  KEY `api_entity_21c3f5f4` (`depth`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_entity`
--

LOCK TABLES `api_entity` WRITE;
/*!40000 ALTER TABLE `api_entity` DISABLE KEYS */;
INSERT INTO `api_entity` VALUES (1,1,196,1,1,'Book of the Duchess','entity'),(2,2,3,1,2,'Title','head'),(3,4,5,1,2,'1','verse'),(4,6,7,1,2,'2','verse'),(5,8,9,1,2,'3','verse'),(6,10,11,1,2,'4','verse'),(7,12,13,1,2,'5','verse'),(8,14,15,1,2,'6','verse'),(9,16,17,1,2,'7','verse'),(10,18,19,1,2,'8','verse'),(11,20,21,1,2,'9','verse'),(12,22,23,1,2,'10','verse'),(13,24,25,1,2,'11','verse'),(14,26,27,1,2,'12','verse'),(15,28,29,1,2,'13','verse'),(16,30,31,1,2,'14','verse'),(17,32,33,1,2,'15','verse'),(18,34,35,1,2,'16','verse'),(19,36,37,1,2,'17','verse'),(20,38,39,1,2,'18','verse'),(21,40,41,1,2,'19','verse'),(22,42,43,1,2,'20','verse'),(23,44,45,1,2,'21','verse'),(24,46,47,1,2,'22','verse'),(25,48,49,1,2,'23','verse'),(26,50,51,1,2,'24','verse'),(27,52,53,1,2,'25','verse'),(28,54,55,1,2,'26','verse'),(29,56,57,1,2,'27','verse'),(30,58,59,1,2,'28','verse'),(31,60,61,1,2,'29','verse'),(32,62,63,1,2,'30','verse'),(33,64,65,1,2,'31','verse'),(34,66,67,1,2,'32','verse'),(35,68,69,1,2,'33','verse'),(36,70,71,1,2,'34','verse'),(37,72,73,1,2,'35','verse'),(38,74,75,1,2,'36','verse'),(39,76,77,1,2,'37','verse'),(40,78,79,1,2,'38','verse'),(41,80,81,1,2,'39','verse'),(42,82,83,1,2,'40','verse'),(43,84,85,1,2,'41','verse'),(44,86,87,1,2,'42','verse'),(45,88,89,1,2,'43','verse'),(46,90,91,1,2,'44','verse'),(47,92,93,1,2,'45','verse'),(48,94,95,1,2,'46','verse'),(49,96,97,1,2,'47','verse'),(50,98,99,1,2,'48','verse'),(51,100,101,1,2,'49','verse'),(52,102,103,1,2,'50','verse'),(53,104,105,1,2,'51','verse'),(54,106,107,1,2,'52','verse'),(55,108,109,1,2,'53','verse'),(56,110,111,1,2,'54','verse'),(57,112,113,1,2,'55','verse'),(58,114,115,1,2,'56','verse'),(59,116,117,1,2,'57','verse'),(60,118,119,1,2,'58','verse'),(61,120,121,1,2,'59','verse'),(62,122,123,1,2,'60','verse'),(63,124,125,1,2,'61','verse'),(64,126,127,1,2,'62','verse'),(65,128,129,1,2,'63','verse'),(66,130,131,1,2,'64','verse'),(67,132,133,1,2,'65','verse'),(68,134,135,1,2,'66','verse'),(69,136,137,1,2,'67','verse'),(70,138,139,1,2,'68','verse'),(71,140,141,1,2,'69','verse'),(72,142,143,1,2,'70','verse'),(73,144,145,1,2,'71','verse'),(74,146,147,1,2,'72','verse'),(75,148,149,1,2,'73','verse'),(76,150,151,1,2,'74','verse'),(77,152,153,1,2,'75','verse'),(78,154,155,1,2,'76','verse'),(79,156,157,1,2,'77','verse'),(80,158,159,1,2,'78','verse'),(81,160,161,1,2,'79','verse'),(82,162,163,1,2,'80','verse'),(83,164,165,1,2,'81','verse'),(84,166,167,1,2,'82','verse'),(85,168,169,1,2,'83','verse'),(86,170,171,1,2,'84','verse'),(87,172,173,1,2,'85','verse'),(88,174,175,1,2,'86','verse'),(89,176,177,1,2,'87','verse'),(90,178,179,1,2,'88','verse'),(91,180,181,1,2,'89','verse'),(92,182,183,1,2,'90','verse'),(93,184,185,1,2,'91','verse'),(94,186,187,1,2,'92','verse'),(95,188,189,1,2,'93','verse'),(96,190,191,1,2,'94','verse'),(97,192,193,1,2,'95','verse'),(98,194,195,1,2,'96','verse');
/*!40000 ALTER TABLE `api_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_header`
--

DROP TABLE IF EXISTS `api_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_header` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `xml` longtext COLLATE utf8_bin NOT NULL,
  `text_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_header_377be151` (`text_id`),
  CONSTRAINT `text_id_refs_id_c0a1916f` FOREIGN KEY (`text_id`) REFERENCES `api_text` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_header`
--

LOCK TABLES `api_header` WRITE;
/*!40000 ALTER TABLE `api_header` DISABLE KEYS */;
INSERT INTO `api_header` VALUES (1,'<teiHeader xmlns=\"http://www.tei-c.org/ns/1.0\" xmlns:det=\"http://textualcommunities.usask.ca/\">\n 		<fileDesc>\n 			<titleStmt>\n 				<title>Fairfax</title>\n 			</titleStmt>\n 			<publicationStmt>\n 				<p>Draft for Textual Communities site</p>\n 			</publicationStmt>\n 			<sourceDesc>\n 				<bibl det:document=\"Fairfax\"/>\n 			</sourceDesc>\n 		</fileDesc>\n 		<encodingDesc>\n   			<refsDecl det:documentRefsDecl=\"Manuscript\" det:entityRefsDecl=\"Simple Poetry\">\n 	 			<p>Textual Communities declarations</p>\n 	 		</refsDecl>\n 		</encodingDesc>\n 	</teiHeader>\n	',1),(2,'<teiHeader xmlns=\"http://www.tei-c.org/ns/1.0\" xmlns:det=\"http://textualcommunities.usask.ca/\">\n 		<fileDesc>\n 			<titleStmt><title>Bodley</title></titleStmt>\n 			<publicationStmt><p>Draft for Textual Communities site</p></publicationStmt>\n 			<sourceDesc><bibl det:document=\"Bodley\"/></sourceDesc>\n 		</fileDesc>\n 		<encodingDesc>\n   			<refsDecl det:documentRefsDecl=\"Manuscript\" det:entityRefsDecl=\"Simple Poetry\">\n 	 			<p>Textual Communities declarations</p>\n 	 		</refsDecl>\n 		</encodingDesc>\n 	</teiHeader>\n	',204);
/*!40000 ALTER TABLE `api_header` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_invitation`
--

DROP TABLE IF EXISTS `api_invitation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_invitation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invitor_id` int(11) NOT NULL,
  `invitee_id` int(11) NOT NULL,
  `email_content` longtext COLLATE utf8_bin NOT NULL,
  `code` varchar(32) COLLATE utf8_bin NOT NULL,
  `invited_date` datetime(6) NOT NULL,
  `accepted_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invitee_id` (`invitee_id`),
  KEY `api_invitation_4507cf05` (`invitor_id`),
  KEY `api_invitation_09bb5fb3` (`code`),
  CONSTRAINT `invitee_id_refs_id_999e66ac` FOREIGN KEY (`invitee_id`) REFERENCES `api_membership` (`id`),
  CONSTRAINT `invitor_id_refs_id_999e66ac` FOREIGN KEY (`invitor_id`) REFERENCES `api_membership` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_invitation`
--

LOCK TABLES `api_invitation` WRITE;
/*!40000 ALTER TABLE `api_invitation` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_invitation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_js`
--

DROP TABLE IF EXISTS `api_js`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_js` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` int(11) NOT NULL,
  `js` varchar(100) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_js_2caeaf6c` (`community_id`),
  CONSTRAINT `community_id_refs_id_caf42a96` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_js`
--

LOCK TABLES `api_js` WRITE;
/*!40000 ALTER TABLE `api_js` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_js` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_membership`
--

DROP TABLE IF EXISTS `api_membership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_membership` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `community_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `create_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_membership_6340c63c` (`user_id`),
  KEY `api_membership_2caeaf6c` (`community_id`),
  KEY `api_membership_278213e1` (`role_id`),
  CONSTRAINT `community_id_refs_id_05229630` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`),
  CONSTRAINT `role_id_refs_id_a66b692c` FOREIGN KEY (`role_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `user_id_refs_id_44af110c` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_membership`
--

LOCK TABLES `api_membership` WRITE;
/*!40000 ALTER TABLE `api_membership` DISABLE KEYS */;
INSERT INTO `api_membership` VALUES (1,1,1,1,'2014-05-17'),(2,1,2,1,'2014-05-17');
/*!40000 ALTER TABLE `api_membership` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_refsdecl`
--

DROP TABLE IF EXISTS `api_refsdecl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_refsdecl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin NOT NULL,
  `description` longtext COLLATE utf8_bin NOT NULL,
  `type` int(11) NOT NULL,
  `text_id` int(11) DEFAULT NULL,
  `xml` longtext COLLATE utf8_bin NOT NULL,
  `template` longtext COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_refsdecl_377be151` (`text_id`),
  CONSTRAINT `text_id_refs_id_e615e8b6` FOREIGN KEY (`text_id`) REFERENCES `api_text` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_refsdecl`
--

LOCK TABLES `api_refsdecl` WRITE;
/*!40000 ALTER TABLE `api_refsdecl` DISABLE KEYS */;
INSERT INTO `api_refsdecl` VALUES (1,'Print','',0,NULL,'<refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Page=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references a pb element for each page.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Page=(.+):Column=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a cb element within a pb element for each page.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Page=(.+):Column=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\']/following::lb[@n=\'$3\'])\">\n    <p>This pointer pattern extracts and references a lb element within cb element within a pb element for each page.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Page=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::lb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a lb element within a pb element for each page.</p>\n  </cRefPattern>\n</refsDecl>\n',''),(2,'Manuscript','',0,NULL,'<refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Folio=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Folio=(.+):Column=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a cb element within a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Folio=(.+):Column=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\']/following::lb[@n=\'$3\'])\">\n    <p>This pointer pattern extracts and references a lb element within cb element within a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Folio=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::lb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a lb element within a pb element for each folio.</p>\n  </cRefPattern>\n</refsDecl>\n',''),(3,'Simple Poetry','',1,NULL,'<refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references each top-level unit of text, as  a top-level div,  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):head=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/head[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each head element contained in a div  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):verse=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/l[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each l element contained in a div as an entity</p>\n  </cRefPattern>\n</refsDecl>\n','<text><body>\n <div n=\"Unique identifier for this poem. Could be Poem 1 \">\n <lb/><head n=\"1\">Transcribe the title</head>\n <lb/><l n=\"1\">Transcribe the first verse of the text here (specify a \'n\' attribute)\n <lb/>rest of line goes here, etc, if the line of poetry happens to run to two lines in the document</l>\n <lb/><l n=\"2\">Second line of poetry occupies this writing space</l>\n </div>\n</body>\n</text>'),(4,'Simple Prose','',1,NULL,'<refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references each top-level unit of text, as  a top-level div,  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):head=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/head[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each head element contained in a div  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):para=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/p[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each p element contained in a div as an entity</p>\n  </cRefPattern>\n</refsDecl>\n','<text><body>\n <!--> what appears below will appear as the template for each transcription page in the document (simple prose) </!-->\n <lb/>\n <div n=\"Unique identifier for this entity. Could be Sermon_1.  Use underscore to separate words \">\n <head>Transcribe the title (you can specify a \'n\' attribute or allow the system to allocate this for you)</head>\n <lb/><p>Transcribe the first line of the text here ((you can specify a \'n\' attribute or allow the system to allocate this for you))\n <lb/>Second line goes here, etc</p>\n </div>\n <lb/>\n <div n=\"Unique identifier for this entity. Could be Sermon_2.  Use underscore to separate words \">\n <head>Transcribe the title (you can specify a \'n\' attribute or allow the system to allocate this for you)</head>\n <lb/><p>Transcribe the first line of the text here ((you can specify a \'n\' attribute or allow the system to allocate this for you))\n <lb/>Second line goes here, etc</p>\n </div>\n</body>\n</text>'),(5,'Complex Prose','',1,NULL,'<refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references each top-level unit of text, as  a top-level div,  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):head=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/head[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each head element contained in a div  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):para=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/p[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each p element contained in a div as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):section=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/div[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references the each second-level unit of text, as a section div contained in a div,  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):section=(.+):head=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/div[@n=\'$2\']/head[@n=\'$3\'])\">\n    <p>This pointer pattern extracts and references each head element, as a head contained in a section div contained in a div, as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):section=(.+):para=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/div[@n=\'$2\']/p[@n=\'$3\'])\">\n    <p>This pointer pattern extracts and references each para element, as  a p contained in a section div contained in a div,  as an entity</p>\n  </cRefPattern>\n</refsDecl>\n','<text><body>\n <div n=\"1\"> <!--> outer containing div, say for section 1. Must be repeated at beginning of each page containing this section </!-->\n <!--> what appears below will appear as the template for each transcription page in the document (simple prose) </!-->\n <lb/>\n <div n=\"Unique identifier for this entity. Could be Sermon_1.  Use underscore to separate words \">\n <head>Transcribe the title (you can specify a \'n\' attribute or allow the system to allocate this for you)</head>\n <lb/><p>Transcribe the first line of the text here ((you can specify a \'n\' attribute or allow the system to allocate this for you))\n <lb/>Second line goes here, etc</p>\n </div>\n <lb/>\n <div n=\"Unique identifier for this entity. Could be Sermon_2.  Use underscore to separate words \">\n <head>Transcribe the title (you can specify a \'n\' attribute or allow the system to allocate this for you)</head>\n <lb/><p>Transcribe the first line of the text here ((you can specify a \'n\' attribute or allow the system to allocate this for you))\n <lb/>Second line goes here, etc</p>\n </div>\n </div>\n</body></text>'),(6,'Complex Poetry','',1,NULL,'<refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references each top-level unit of text, as  a top-level div,  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):head=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/head[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each head element contained in a div  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):verse=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/l[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each l element contained in a div as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):stanza=(.+):verse=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/lg[@n=\'$2\']/l[@n=\'$3\'])\">\n    <p>This pointer pattern extracts and references each l element contained in a lg contained in div as an entity</p>\n  </cRefPattern>\n</refsDecl>\n','<text><body>\n <!--> what appears below will appear as the template for each transcription page in the document (simple prose) </!--> \n <lb/>\n <div n=\"Unique identifier for this poem. Could be Poem_1.  Use underscore to separate words \">\n <head>Transcribe the title (you can specify a \'n\' attribute or allow the system to allocate this for you)</head>\n <lg n=\"1\">\n <lb/><l n=\"1\">Transcribe the first verse of the text here (you should specify a \'n\' attribute but you could allow the system to allocate this for you)\n <lb/>rest of verse goes here, etc, if the line of poetry happens to run to two lines in the document</l>\n <lb/><l n=\"2\">Second verse of poetry occupies this writing space</l>\n </lg>\n <lg n=\"2\">\n <lb/><l n=\"1\">Transcribe the first verse of the text here (you should specify a \'n\' attribute but you could allow the system to allocate this for you)\n <lb/>rest of line goes here, etc, if the verse of poetry happens to run to two lines in the document</l>\n <lb/><l n=\"2\">Second verse of poetry occupies this writing space</l>\n </lg>\n </div>\n <lb/>\n <div n=\"Unique identifier for this entity. Could be Poem_2.  Use underscore to separate words \">\n <head>Transcribe the title (you can specify a \'n\' attribute or allow the system to allocate this for you)</head>\n <head>Transcribe the title (you can specify a \'n\' attribute or allow the system to allocate this for you)</head>\n <lb/><l n=\"1\">Transcribe the first line of the text here (you should specify a \'n\' attribute but you could allow the system to allocate this for you)\n <lb/>rest of line goes here, etc, if the line of poetry happens to run to two lines in the document</l>\n <lb/><l n=\"2\">Second line of poetry occupies this writing space</l>\n </div>\n</body></text>'),(7,'','',2,1,'<refsDecl><refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Fairfax:Folio=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Fairfax:Folio=(.+):Column=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a cb element within a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Fairfax:Folio=(.+):Column=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\']/following::lb[@n=\'$3\'])\">\n    <p>This pointer pattern extracts and references a lb element within cb element within a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Fairfax:Folio=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::lb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a lb element within a pb element for each folio.</p>\n  </cRefPattern>\n</refsDecl><refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:entity=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references each top-level unit of text, as  a top-level div,  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:entity=(.+):head=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/head[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each head element contained in a div  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:entity=(.+):verse=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/l[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each l element contained in a div as an entity</p>\n  </cRefPattern>\n</refsDecl></refsDecl>','<text><body>\n <div n=\"Unique identifier for this poem. Could be Poem 1 \">\n <lb/><head n=\"1\">Transcribe the title</head>\n <lb/><l n=\"1\">Transcribe the first verse of the text here (specify a \'n\' attribute)\n <lb/>rest of line goes here, etc, if the line of poetry happens to run to two lines in the document</l>\n <lb/><l n=\"2\">Second line of poetry occupies this writing space</l>\n </div>\n</body>\n</text>'),(8,'','',2,204,'<refsDecl><refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Bodley:Folio=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Bodley:Folio=(.+):Column=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a cb element within a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Bodley:Folio=(.+):Column=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\']/following::lb[@n=\'$3\'])\">\n    <p>This pointer pattern extracts and references a lb element within cb element within a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Bodley:Folio=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::lb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a lb element within a pb element for each folio.</p>\n  </cRefPattern>\n</refsDecl><refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:entity=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references each top-level unit of text, as  a top-level div,  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:entity=(.+):head=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/head[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each head element contained in a div  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:entity=(.+):verse=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/l[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each l element contained in a div as an entity</p>\n  </cRefPattern>\n</refsDecl></refsDecl>','<text><body>\n <div n=\"Unique identifier for this poem. Could be Poem 1 \">\n <lb/><head n=\"1\">Transcribe the title</head>\n <lb/><l n=\"1\">Transcribe the first verse of the text here (specify a \'n\' attribute)\n <lb/>rest of line goes here, etc, if the line of poetry happens to run to two lines in the document</l>\n <lb/><l n=\"2\">Second line of poetry occupies this writing space</l>\n </div>\n</body>\n</text>');
/*!40000 ALTER TABLE `api_refsdecl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_revision`
--

DROP TABLE IF EXISTS `api_revision`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_revision` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doc_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `prev_id` int(11) DEFAULT NULL,
  `create_date` datetime(6) NOT NULL,
  `commit_date` datetime(6) DEFAULT NULL,
  `text` longtext COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_revision_fbbb6049` (`doc_id`),
  KEY `api_revision_6340c63c` (`user_id`),
  KEY `api_revision_8af18ff9` (`prev_id`),
  CONSTRAINT `prev_id_refs_id_01ffac0f` FOREIGN KEY (`prev_id`) REFERENCES `api_revision` (`id`),
  CONSTRAINT `doc_id_refs_id_98a1df75` FOREIGN KEY (`doc_id`) REFERENCES `api_doc` (`id`),
  CONSTRAINT `user_id_refs_id_5512d657` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_revision`
--

LOCK TABLES `api_revision` WRITE;
/*!40000 ALTER TABLE `api_revision` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_revision` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_schema`
--

DROP TABLE IF EXISTS `api_schema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_schema` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` int(11) NOT NULL,
  `schema` varchar(100) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_id` (`community_id`,`schema`),
  KEY `api_schema_2caeaf6c` (`community_id`),
  CONSTRAINT `community_id_refs_id_a93159fb` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_schema`
--

LOCK TABLES `api_schema` WRITE;
/*!40000 ALTER TABLE `api_schema` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_schema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_task`
--

DROP TABLE IF EXISTS `api_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doc_id` int(11) NOT NULL,
  `membership_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doc_id` (`doc_id`,`membership_id`),
  KEY `api_task_fbbb6049` (`doc_id`),
  KEY `api_task_1818c0ae` (`membership_id`),
  CONSTRAINT `doc_id_refs_id_981d7fb7` FOREIGN KEY (`doc_id`) REFERENCES `api_doc` (`id`),
  CONSTRAINT `membership_id_refs_id_2d3f6cbf` FOREIGN KEY (`membership_id`) REFERENCES `api_membership` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_task`
--

LOCK TABLES `api_task` WRITE;
/*!40000 ALTER TABLE `api_task` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_text`
--

DROP TABLE IF EXISTS `api_text`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_text` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lft` int(10) unsigned NOT NULL,
  `rgt` int(10) unsigned NOT NULL,
  `tree_id` int(10) unsigned NOT NULL,
  `depth` int(10) unsigned NOT NULL,
  `tag` varchar(15) COLLATE utf8_bin NOT NULL,
  `text` longtext COLLATE utf8_bin NOT NULL,
  `tail` longtext COLLATE utf8_bin NOT NULL,
  `doc_id` int(11) DEFAULT NULL,
  `entity_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doc_id` (`doc_id`),
  KEY `api_text_f777e2bb` (`lft`),
  KEY `api_text_deca00cf` (`rgt`),
  KEY `api_text_f391089a` (`tree_id`),
  KEY `api_text_21c3f5f4` (`depth`),
  KEY `api_text_c096cf48` (`entity_id`),
  CONSTRAINT `doc_id_refs_id_68959a5d` FOREIGN KEY (`doc_id`) REFERENCES `api_doc` (`id`),
  CONSTRAINT `entity_id_refs_id_9bc08a5e` FOREIGN KEY (`entity_id`) REFERENCES `api_entity` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_text`
--

LOCK TABLES `api_text` WRITE;
/*!40000 ALTER TABLE `api_text` DISABLE KEYS */;
INSERT INTO `api_text` VALUES (1,1,406,1,1,'text','','',1,NULL),(2,2,405,1,2,'body','\n		','\n	',NULL,NULL),(3,3,4,1,3,'pb','','\n			',2,NULL),(4,5,6,1,3,'lb','','',4,NULL),(5,7,404,1,3,'div','\n	','\n  	',NULL,1),(6,8,9,1,4,'fw','130','',NULL,NULL),(7,10,11,1,4,'note','Pencil foliation','\n',NULL,NULL),(8,12,15,1,4,'head','The booke of the Duchesse','\n',NULL,2),(9,16,17,1,4,'lb','','',5,NULL),(10,18,19,1,4,'l','I Haue grete wonder/ be this lyghte','\n',NULL,3),(11,20,21,1,4,'lb','','',6,NULL),(12,22,23,1,4,'l','How that I lyve/ for day ne nyghte','\n',NULL,4),(13,24,25,1,4,'lb','','',7,NULL),(14,26,27,1,4,'l','I may nat slepe/ wel nygh noght','\n',NULL,5),(15,28,29,1,4,'lb','','',8,NULL),(16,30,31,1,4,'l','I have so many/ an ydel thoght','\n',NULL,6),(17,32,33,1,4,'lb','','',9,NULL),(18,34,35,1,4,'l','Purely/ for defaulte of slepe','\n',NULL,7),(19,36,37,1,4,'lb','','',10,NULL),(20,38,39,1,4,'l','That by my trouthe/ I take no kepe','\n',NULL,8),(21,40,41,1,4,'lb','','',11,NULL),(22,42,43,1,4,'l','Of noo thinge/ how hyt cometh or gooth','\n',NULL,9),(23,44,45,1,4,'lb','','',12,NULL),(24,46,47,1,4,'l','Ne me nys no thynge/ leve nor looth','\n',NULL,10),(25,48,49,1,4,'lb','','',13,NULL),(26,50,51,1,4,'l','Al is ylyche goode/ to me','\n',NULL,11),(27,52,53,1,4,'lb','','',14,NULL),(28,54,55,1,4,'l','Ioy or sorowe/ wherso hyt be','\n',NULL,12),(29,56,57,1,4,'lb','','',15,NULL),(30,58,59,1,4,'l','ffor I haue felynge/ in no thynge','\n',NULL,13),(31,60,61,1,4,'lb','','',16,NULL),(32,62,63,1,4,'l','But as yt were/ a mased thynge','\n',NULL,14),(33,64,65,1,4,'lb','','',17,NULL),(34,66,67,1,4,'l','Alway in poynt/ to falle a dovun\'','\n',NULL,15),(35,68,69,1,4,'lb','','',18,NULL),(36,70,71,1,4,'l','ffor sorwful/ ymagynacioun\'','\n',NULL,16),(37,72,73,1,4,'lb','','',19,NULL),(38,74,75,1,4,'l','Ys alway hooly/ in my mynde','\n',NULL,17),(39,76,77,1,4,'lb','','',20,NULL),(40,78,79,1,4,'l','And wel ye woote/ agaynes kynde','\n',NULL,18),(41,80,81,1,4,'lb','','',21,NULL),(42,82,83,1,4,'l','Hyt were to lyven\'/ in thys wyse','\n',NULL,19),(43,84,85,1,4,'lb','','',22,NULL),(44,86,87,1,4,'l','ffor nature/ wolde nat suffyse','\n',NULL,20),(45,88,89,1,4,'lb','','',23,NULL),(46,90,91,1,4,'l','To noon\' ertherly/ creature','\n',NULL,21),(47,92,93,1,4,'lb','','',24,NULL),(48,94,95,1,4,'l','Nat longe tyme/ to endure','\n',NULL,22),(49,96,97,1,4,'lb','','',25,NULL),(50,98,99,1,4,'l','With oute slepe/ and be in sorwe','\n',NULL,23),(51,100,101,1,4,'lb','','',26,NULL),(52,102,103,1,4,'l','And I ne may/ no nyght ne morwe','\n',NULL,24),(53,104,105,1,4,'lb','','',27,NULL),(54,106,107,1,4,'l','Slepe/ and thys Melancolye','\n',NULL,25),(55,108,109,1,4,'lb','','',28,NULL),(56,110,111,1,4,'l','And drede I haue/ for to dye','\n',NULL,26),(57,112,113,1,4,'lb','','',29,NULL),(58,114,115,1,4,'l','Defaulte of slepe/ and hevynesse','\n',NULL,27),(59,116,117,1,4,'lb','','',30,NULL),(60,118,119,1,4,'l','Hath my spirite/ of quyknesse','\n',NULL,28),(61,120,121,1,4,'lb','','',31,NULL),(62,122,123,1,4,'l','That I haue loste/ al lustyhede','\n',NULL,29),(63,124,125,1,4,'lb','','',32,NULL),(64,126,127,1,4,'l','Suche fantasies/ ben in myn\' hede','\n',NULL,30),(65,128,129,1,4,'lb','','',33,NULL),(66,130,131,1,4,'l','So I not what/ is best too doo','\n',NULL,31),(67,132,133,1,4,'lb','','',34,NULL),(68,134,135,1,4,'l','But men\' myght axeme/ why soo','\n  ',NULL,32),(69,136,137,1,4,'lb','','',35,NULL),(70,138,139,1,4,'l','I may not sleepe, and what me is','\n  ',NULL,33),(71,140,141,1,4,'lb','','',36,NULL),(72,142,143,1,4,'l','But nathles, whoe aske this','\n  ',NULL,34),(73,144,145,1,4,'lb','','',37,NULL),(74,146,147,1,4,'l','Leseth his asking trewly','\n  ',NULL,35),(75,148,149,1,4,'lb','','',38,NULL),(76,150,151,1,4,'l','My seluen can not tell why','\n  ',NULL,36),(77,152,153,1,4,'lb','','',39,NULL),(78,154,155,1,4,'l','The southe, but trewly as I gesse','\n  ',NULL,37),(79,156,157,1,4,'lb','','',40,NULL),(80,158,159,1,4,'l','I hold it be a sicknes','\n  ',NULL,38),(81,160,161,1,4,'lb','','',41,NULL),(82,162,163,1,4,'l','That I haue suffred this eight yeere','\n  ',NULL,39),(83,164,165,1,4,'lb','','',42,NULL),(84,166,167,1,4,'l','And yet my boote is neuer the nere','\n',NULL,40),(85,168,169,1,4,'pb','','            \n  ',3,NULL),(86,170,171,1,4,'lb','','',43,NULL),(87,172,173,1,4,'l','For there is phisicien but one','\n  ',NULL,41),(88,174,175,1,4,'lb','','',44,NULL),(89,176,177,1,4,'l','That may me heale, but that is done','\n  ',NULL,42),(90,178,179,1,4,'lb','','',45,NULL),(91,180,181,1,4,'l','Passe we ouer vntill efte','\n  ',NULL,43),(92,182,183,1,4,'lb','','',46,NULL),(93,184,185,1,4,'l','That will not be, mote nedes be lefte','\n  ',NULL,44),(94,186,187,1,4,'lb','','',47,NULL),(95,188,189,1,4,'l','Our first mater is good to kepe','\n  ',NULL,45),(96,190,191,1,4,'lb','','',48,NULL),(97,192,193,1,4,'l','Soe when I sawe I might not slepe','\n  ',NULL,46),(98,194,195,1,4,'lb','','',49,NULL),(99,196,197,1,4,'l','Til now late, this other night','\n  ',NULL,47),(100,198,199,1,4,'lb','','',50,NULL),(101,200,201,1,4,'l','Vpon my bedde I sate vpright','\n  ',NULL,48),(102,202,203,1,4,'lb','','',51,NULL),(103,204,205,1,4,'l','And bade one reche me a booke','\n  ',NULL,49),(104,206,207,1,4,'lb','','',52,NULL),(105,208,209,1,4,'l','A Romaunce, and it me toke','\n  ',NULL,50),(106,210,211,1,4,'lb','','',53,NULL),(107,212,213,1,4,'l','To rede, and driue the night away','\n  ',NULL,51),(108,214,215,1,4,'lb','','',54,NULL),(109,216,217,1,4,'l','For me thought it beter play','\n  ',NULL,52),(110,218,219,1,4,'lb','','',55,NULL),(111,220,221,1,4,'l','Then play either at Chesse or tables','\n  ',NULL,53),(112,222,223,1,4,'lb','','',56,NULL),(113,224,225,1,4,'l','And in this boke were written fables','\n  ',NULL,54),(114,226,227,1,4,'lb','','',57,NULL),(115,228,229,1,4,'l','That Clerkes had in olde tyme','\n  ',NULL,55),(116,230,231,1,4,'lb','','',58,NULL),(117,232,233,1,4,'l','And other poets put in rime','\n  ',NULL,56),(118,234,235,1,4,'lb','','',59,NULL),(119,236,237,1,4,'l','To rede, and for to be in minde','\n  ',NULL,57),(120,238,239,1,4,'lb','','',60,NULL),(121,240,241,1,4,'l','While men loued the lawe in kinde','\n  ',NULL,58),(122,242,243,1,4,'lb','','',61,NULL),(123,244,245,1,4,'l','This boke ne speake, but of such thinges','\n  ',NULL,59),(124,246,247,1,4,'lb','','',62,NULL),(125,248,249,1,4,'l','Of quenes liues, and of kings','\n  ',NULL,60),(126,250,251,1,4,'lb','','',63,NULL),(127,252,253,1,4,'l','And many other things smalle','\n  ',NULL,61),(128,254,255,1,4,'lb','','',64,NULL),(129,256,257,1,4,'l','Amonge all this I fonde a tale','\n  ',NULL,62),(130,258,259,1,4,'lb','','',65,NULL),(131,260,261,1,4,'l','That me thought a wonder thing.','\n  ',NULL,63),(132,262,263,1,4,'lb','','',66,NULL),(133,264,265,1,4,'l','This was the tale: There was a king','\n  ',NULL,64),(134,266,267,1,4,'lb','','',67,NULL),(135,268,269,1,4,'l','That hight Seyes, and had a wife','\n  ',NULL,65),(136,270,271,1,4,'lb','','',68,NULL),(137,272,273,1,4,'l','The best that might beare lyfe','\n  ',NULL,66),(138,274,275,1,4,'lb','','',69,NULL),(139,276,277,1,4,'l','And this quene hight Alcyone','\n  ',NULL,67),(140,278,279,1,4,'lb','','',70,NULL),(141,280,281,1,4,'l','Soe it befill, thereafter soone','\n  ',NULL,68),(142,282,283,1,4,'lb','','',71,NULL),(143,284,285,1,4,'l','This king woll wenden ouer see','\n  ',NULL,69),(144,286,287,1,4,'lb','','',72,NULL),(145,288,289,1,4,'l','To tellen shortly, whan that he','\n  ',NULL,70),(146,290,291,1,4,'lb','','',73,NULL),(147,292,293,1,4,'l','Was in the see, thus in this wise','\n  ',NULL,71),(148,294,295,1,4,'lb','','',74,NULL),(149,296,297,1,4,'l','Soche a tempest gan to rise','\n  ',NULL,72),(150,298,299,1,4,'lb','','',75,NULL),(151,300,301,1,4,'l','That brake her maste, and made it fal','\n  ',NULL,73),(152,302,303,1,4,'lb','','',76,NULL),(153,304,305,1,4,'l','And cleft ther ship, and dreint hem all','\n  ',NULL,74),(154,306,307,1,4,'lb','','',77,NULL),(155,308,309,1,4,'l','That neuer was founde, as it telles','\n  ',NULL,75),(156,310,311,1,4,'lb','','',78,NULL),(157,312,313,1,4,'l','Borde ne man, ne nothing elles','\n  ',NULL,76),(158,314,315,1,4,'lb','','',79,NULL),(159,316,317,1,4,'l','Right thus this king Seyes loste his life','\n  ',NULL,77),(160,318,319,1,4,'lb','','',80,NULL),(161,320,321,1,4,'l','Now for to speake of Alcyone his wife','\n  ',NULL,78),(162,322,323,1,4,'lb','','',81,NULL),(163,324,325,1,4,'l','This Lady that was left at home','\n  ',NULL,79),(164,326,327,1,4,'lb','','',82,NULL),(165,328,329,1,4,'l','Hath wonder, that the king ne come','\n  ',NULL,80),(166,330,331,1,4,'lb','','',83,NULL),(167,332,333,1,4,'l','Home, for it was a long terme','\n  ',NULL,81),(168,334,335,1,4,'lb','','',84,NULL),(169,336,337,1,4,'l','Anone her herte began to yerne','\n  ',NULL,82),(170,338,339,1,4,'lb','','',85,NULL),(171,340,341,1,4,'l','And for that her thought euermo','\n  ',NULL,83),(172,342,343,1,4,'lb','','',86,NULL),(173,344,345,1,4,'l','It was not wele, her thought soe','\n  ',NULL,84),(174,346,347,1,4,'lb','','',87,NULL),(175,348,349,1,4,'l','She longed soe after the king','\n  ',NULL,85),(176,350,351,1,4,'lb','','',88,NULL),(177,352,353,1,4,'l','That certes it were a pitous thing','\n  ',NULL,86),(178,354,355,1,4,'lb','','',89,NULL),(179,356,357,1,4,'l','To tell her hartely sorowfull life','\n  ',NULL,87),(180,358,359,1,4,'lb','','',90,NULL),(181,360,361,1,4,'l','That she had, this noble wife','\n  ',NULL,88),(182,362,363,1,4,'lb','','',91,NULL),(183,364,365,1,4,'l','For him alas, she loued alderbeste','\n  ',NULL,89),(184,366,367,1,4,'lb','','',92,NULL),(185,368,369,1,4,'l','Anone she sent both eeste and weste','\n  ',NULL,90),(186,370,371,1,4,'lb','','',93,NULL),(187,372,373,1,4,'l','To seke him, but they founde nought','\n  ',NULL,91),(188,374,375,1,4,'lb','','',94,NULL),(189,376,377,1,4,'l','Alas (quoth shee) that I was wrought','\n  ',NULL,92),(190,378,379,1,4,'lb','','',95,NULL),(191,380,381,1,4,'l','And where my lord my loue be deed:','\n  ',NULL,93),(192,382,383,1,4,'lb','','',96,NULL),(193,384,385,1,4,'l','Certes I will neuer eate breede','\n  ',NULL,94),(194,386,387,1,4,'lb','','',97,NULL),(195,388,389,1,4,'l','I make a uowe to my god here','\n  ',NULL,95),(196,390,391,1,4,'lb','','',98,NULL),(197,392,393,1,4,'l','But I mowe of my Lord here.','\n  ',NULL,96),(198,394,395,1,4,'lb','','',99,NULL),(199,396,397,1,4,'l','Soche sorowe this Lady to her toke','\n  ',NULL,97),(200,398,399,1,4,'lb','','',100,NULL),(201,400,403,1,4,'l','That trewly I which made this booke','\n  ',NULL,98),(202,13,14,1,5,'note','made by Geffrey\nChawcyer','',NULL,NULL),(203,401,402,1,5,'fw','[Catchword:]Had such','',NULL,NULL),(204,1,104,2,1,'text','','',101,NULL),(205,2,103,2,2,'body','\n		','\n	',NULL,NULL),(206,3,4,2,3,'pb','','\n			',102,NULL),(207,5,6,2,3,'lb','','',103,NULL),(208,7,102,2,3,'div','\n				','\n		',NULL,1),(209,8,9,2,4,'head','The Boke of the Duchesse','\n				',NULL,2),(210,10,11,2,4,'lb','','',104,NULL),(211,12,13,2,4,'l','I haue grete wondir be this light','\n				',NULL,3),(212,14,15,2,4,'lb','','',105,NULL),(213,16,17,2,4,'l','how that I leue for day ne nyght','\n				',NULL,4),(214,18,19,2,4,'lb','','',106,NULL),(215,20,21,2,4,'l','I may not slepe wel nygh nought','\n				',NULL,5),(216,22,23,2,4,'lb','','',107,NULL),(217,24,25,2,4,'l','I haue so many an ydell thought ','\n				',NULL,6),(218,26,27,2,4,'lb','','',108,NULL),(219,28,29,2,4,'l','Purely for defaulte of slepe','\n				',NULL,7),(220,30,31,2,4,'lb','','',109,NULL),(221,32,33,2,4,'l','That bi my trouth I take no kepe','\n				',NULL,8),(222,34,35,2,4,'lb','','',110,NULL),(223,36,37,2,4,'l','Of no thinge how hit comyth or goth','\n				',NULL,9),(224,38,39,2,4,'lb','','',111,NULL),(225,40,41,2,4,'l','Ne me nys\' no thinge leue nor loth','\n				',NULL,10),(226,42,43,2,4,'lb','','',112,NULL),(227,44,45,2,4,'l','Alis I lich good\' to me ','\n				',NULL,11),(228,46,47,2,4,'lb','','',113,NULL),(229,48,49,2,4,'l','Ioye or sorwe wherso it be','\n				',NULL,12),(230,50,51,2,4,'lb','','',114,NULL),(231,52,53,2,4,'l','ffor I haue felynge yn no thynge','\n				',NULL,13),(232,54,55,2,4,'lb','','',115,NULL),(233,56,57,2,4,'l','But as it were a mased\' thynge ','\n				',NULL,14),(234,58,59,2,4,'lb','','',116,NULL),(235,60,61,2,4,'l','Alway yn poynte to falle a doun\'','\n				',NULL,15),(236,62,63,2,4,'lb','','',117,NULL),(237,64,65,2,4,'l','ffor sorwefull ymagynatioun\'','\n				',NULL,16),(238,66,67,2,4,'lb','','',118,NULL),(239,68,69,2,4,'l','Is alwey holely yn my mynde','\n				',NULL,17),(240,70,71,2,4,'lb','','',119,NULL),(241,72,73,2,4,'l','And well ye wote a geyns kynde','\n				',NULL,18),(242,74,75,2,4,'lb','','',120,NULL),(243,76,77,2,4,'l','hit were to lyuen yn this\' wyse','\n				',NULL,19),(244,78,79,2,4,'lb','','',121,NULL),(245,80,81,2,4,'l','ffor Nature wolde nat suffyse','\n				',NULL,20),(246,82,83,2,4,'lb','','',122,NULL),(247,84,85,2,4,'l','To non\' erthly creature ','\n				',NULL,21),(248,86,87,2,4,'lb','','',123,NULL),(249,88,89,2,4,'l','Nat longe tyme to endure','\n				',NULL,22),(250,90,91,2,4,'lb','','',124,NULL),(251,92,93,2,4,'l','Without slepe & be yn sorwe','\n				',NULL,23),(252,94,95,2,4,'lb','','',125,NULL),(253,96,97,2,4,'l','And I ne may ne nyght ne morwe','\n				',NULL,24),(254,98,99,2,4,'lb','','',126,NULL),(255,100,101,2,4,'l','Slepe & this Melancolye','\n			',NULL,25);
/*!40000 ALTER TABLE `api_text` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
INSERT INTO `auth_group` VALUES (2,'Co Leader'),(1,'Leader'),(4,'Member'),(3,'Transcriber');
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_id` (`group_id`,`permission_id`),
  KEY `auth_group_permissions_5f412f9a` (`group_id`),
  KEY `auth_group_permissions_83d7f98b` (`permission_id`),
  CONSTRAINT `group_id_refs_id_f4b32aac` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `permission_id_refs_id_6ba0f519` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_bin NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `content_type_id` (`content_type_id`,`codename`),
  KEY `auth_permission_37ef4eb4` (`content_type_id`),
  CONSTRAINT `content_type_id_refs_id_d043b34a` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add permission',1,'add_permission'),(2,'Can change permission',1,'change_permission'),(3,'Can delete permission',1,'delete_permission'),(4,'Can add group',2,'add_group'),(5,'Can change group',2,'change_group'),(6,'Can delete group',2,'delete_group'),(7,'Can add user',3,'add_user'),(8,'Can change user',3,'change_user'),(9,'Can delete user',3,'delete_user'),(10,'Can add content type',4,'add_contenttype'),(11,'Can change content type',4,'change_contenttype'),(12,'Can delete content type',4,'delete_contenttype'),(13,'Can add session',5,'add_session'),(14,'Can change session',5,'change_session'),(15,'Can delete session',5,'delete_session'),(16,'Can add site',6,'add_site'),(17,'Can change site',6,'change_site'),(18,'Can delete site',6,'delete_site'),(19,'Can add log entry',7,'add_logentry'),(20,'Can change log entry',7,'change_logentry'),(21,'Can delete log entry',7,'delete_logentry'),(22,'Can add community',8,'add_community'),(23,'Can change community',8,'change_community'),(24,'Can delete community',8,'delete_community'),(25,'Can add membership',9,'add_membership'),(26,'Can change membership',9,'change_membership'),(27,'Can delete membership',9,'delete_membership'),(28,'Can add entity',10,'add_entity'),(29,'Can change entity',10,'change_entity'),(30,'Can delete entity',10,'delete_entity'),(31,'Can add doc',11,'add_doc'),(32,'Can change doc',11,'change_doc'),(33,'Can delete doc',11,'delete_doc'),(34,'Can add text',12,'add_text'),(35,'Can change text',12,'change_text'),(36,'Can delete text',12,'delete_text'),(37,'Can add attr',13,'add_attr'),(38,'Can change attr',13,'change_attr'),(39,'Can delete attr',13,'delete_attr'),(40,'Can add header',14,'add_header'),(41,'Can change header',14,'change_header'),(42,'Can delete header',14,'delete_header'),(43,'Can add revision',15,'add_revision'),(44,'Can change revision',15,'change_revision'),(45,'Can delete revision',15,'delete_revision'),(46,'Can add tiler image',16,'add_tilerimage'),(47,'Can change tiler image',16,'change_tilerimage'),(48,'Can delete tiler image',16,'delete_tilerimage'),(49,'Can add tile',17,'add_tile'),(50,'Can change tile',17,'change_tile'),(51,'Can delete tile',17,'delete_tile'),(52,'Can add css',18,'add_css'),(53,'Can change css',18,'change_css'),(54,'Can delete css',18,'delete_css'),(55,'Can add schema',19,'add_schema'),(56,'Can change schema',19,'change_schema'),(57,'Can delete schema',19,'delete_schema'),(58,'Can add js',20,'add_js'),(59,'Can change js',20,'change_js'),(60,'Can delete js',20,'delete_js'),(61,'Can add refs decl',21,'add_refsdecl'),(62,'Can change refs decl',21,'change_refsdecl'),(63,'Can delete refs decl',21,'delete_refsdecl'),(64,'Can add api user',3,'add_apiuser'),(65,'Can change api user',3,'change_apiuser'),(66,'Can delete api user',3,'delete_apiuser'),(67,'Can add task',22,'add_task'),(68,'Can change task',22,'change_task'),(69,'Can delete task',22,'delete_task'),(70,'Can add partner',23,'add_partner'),(71,'Can change partner',23,'change_partner'),(72,'Can delete partner',23,'delete_partner'),(73,'Can add community mapping',24,'add_communitymapping'),(74,'Can change community mapping',24,'change_communitymapping'),(75,'Can delete community mapping',24,'delete_communitymapping'),(76,'Can add user mapping',25,'add_usermapping'),(77,'Can change user mapping',25,'change_usermapping'),(78,'Can delete user mapping',25,'delete_usermapping'),(79,'Can add invitation',26,'add_invitation'),(80,'Can change invitation',26,'change_invitation'),(81,'Can delete invitation',26,'delete_invitation'),(82,'Can add action',27,'add_action'),(83,'Can change action',27,'change_action'),(84,'Can delete action',27,'delete_action');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8_bin NOT NULL,
  `last_login` datetime(6) NOT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(30) COLLATE utf8_bin NOT NULL,
  `first_name` varchar(30) COLLATE utf8_bin NOT NULL,
  `last_name` varchar(30) COLLATE utf8_bin NOT NULL,
  `email` varchar(75) COLLATE utf8_bin NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$12000$V1PsiivCT59W$18jqiqcz4QsDKLAsCMuP5bNwvE9YHPGUrMkHiqhFdqU=','2014-05-17 12:18:53.975192',1,'admin','','','admin@admin.com',1,1,'2014-05-17 12:18:16.093854');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`group_id`),
  KEY `auth_user_groups_6340c63c` (`user_id`),
  KEY `auth_user_groups_5f412f9a` (`group_id`),
  CONSTRAINT `user_id_refs_id_40c41112` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `group_id_refs_id_274b862c` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`permission_id`),
  KEY `auth_user_user_permissions_6340c63c` (`user_id`),
  KEY `auth_user_user_permissions_83d7f98b` (`permission_id`),
  CONSTRAINT `user_id_refs_id_4dc23c39` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `permission_id_refs_id_35d9ac25` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_communitymapping`
--

DROP TABLE IF EXISTS `community_communitymapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `community_communitymapping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `partner_id` int(11) NOT NULL,
  `mapping_id` int(11) NOT NULL,
  `community_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_id` (`community_id`),
  KEY `community_communitymapping_42b53b76` (`partner_id`),
  CONSTRAINT `partner_id_refs_id_8413bf6e` FOREIGN KEY (`partner_id`) REFERENCES `community_partner` (`id`),
  CONSTRAINT `community_id_refs_id_b9870869` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_communitymapping`
--

LOCK TABLES `community_communitymapping` WRITE;
/*!40000 ALTER TABLE `community_communitymapping` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_communitymapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_partner`
--

DROP TABLE IF EXISTS `community_partner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `community_partner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) COLLATE utf8_bin NOT NULL,
  `sso_url` varchar(200) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_partner`
--

LOCK TABLES `community_partner` WRITE;
/*!40000 ALTER TABLE `community_partner` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_partner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_usermapping`
--

DROP TABLE IF EXISTS `community_usermapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `community_usermapping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `partner_id` int(11) NOT NULL,
  `mapping_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `community_usermapping_42b53b76` (`partner_id`),
  CONSTRAINT `partner_id_refs_id_25e7283b` FOREIGN KEY (`partner_id`) REFERENCES `community_partner` (`id`),
  CONSTRAINT `user_id_refs_id_8a2346f5` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_usermapping`
--

LOCK TABLES `community_usermapping` WRITE;
/*!40000 ALTER TABLE `community_usermapping` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_usermapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `det_css`
--

DROP TABLE IF EXISTS `det_css`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `det_css` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` int(11) NOT NULL,
  `css` varchar(100) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `det_css_2caeaf6c` (`community_id`),
  CONSTRAINT `community_id_refs_id_4c5cd089` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `det_css`
--

LOCK TABLES `det_css` WRITE;
/*!40000 ALTER TABLE `det_css` DISABLE KEYS */;
/*!40000 ALTER TABLE `det_css` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `det_tile`
--

DROP TABLE IF EXISTS `det_tile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `det_tile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_id` int(11) NOT NULL,
  `zoom` int(11) NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `blob` blob NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `image_id` (`image_id`,`zoom`,`x`,`y`),
  KEY `det_tile_06df7330` (`image_id`),
  CONSTRAINT `image_id_refs_id_cb2bc44c` FOREIGN KEY (`image_id`) REFERENCES `det_tilerimage` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `det_tile`
--

LOCK TABLES `det_tile` WRITE;
/*!40000 ALTER TABLE `det_tile` DISABLE KEYS */;
/*!40000 ALTER TABLE `det_tile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `det_tilerimage`
--

DROP TABLE IF EXISTS `det_tilerimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `det_tilerimage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image` varchar(100) COLLATE utf8_bin NOT NULL,
  `doc_id` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doc_id` (`doc_id`),
  CONSTRAINT `doc_id_refs_id_03528240` FOREIGN KEY (`doc_id`) REFERENCES `api_doc` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `det_tilerimage`
--

LOCK TABLES `det_tilerimage` WRITE;
/*!40000 ALTER TABLE `det_tilerimage` DISABLE KEYS */;
INSERT INTO `det_tilerimage` VALUES (6,'tiler_image/10/2/image/bd110v_1.jpg',102,2048,3072),(13,'tiler_image/2/image/ff130r_3.jpg',2,2048,3072),(14,'tiler_image/3/image/ff130v_3.jpg',3,2048,3072);
/*!40000 ALTER TABLE `det_tilerimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `object_id` longtext COLLATE utf8_bin,
  `object_repr` varchar(200) COLLATE utf8_bin NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL,
  `change_message` longtext COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_6340c63c` (`user_id`),
  KEY `django_admin_log_37ef4eb4` (`content_type_id`),
  CONSTRAINT `content_type_id_refs_id_93d2d1f8` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `user_id_refs_id_c0d12874` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2014-05-17 12:19:23.929653',1,2,'1','Leader',1,''),(2,'2014-05-17 12:19:29.819533',1,2,'2','Co Leader',1,''),(3,'2014-05-17 12:19:34.957615',1,2,'3','Transcriber',1,''),(4,'2014-05-17 12:19:39.696332',1,2,'4','Member',1,''),(5,'2014-05-17 12:20:22.543456',1,8,'1','Textual Communities',1,''),(6,'2014-05-17 12:20:39.258949',1,9,'1','Textual Communities Leader admin',1,'');
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_bin NOT NULL,
  `app_label` varchar(100) COLLATE utf8_bin NOT NULL,
  `model` varchar(100) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `app_label` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'permission','auth','permission'),(2,'group','auth','group'),(3,'user','auth','user'),(4,'content type','contenttypes','contenttype'),(5,'session','sessions','session'),(6,'site','sites','site'),(7,'log entry','admin','logentry'),(8,'community','api','community'),(9,'membership','api','membership'),(10,'entity','api','entity'),(11,'doc','api','doc'),(12,'text','api','text'),(13,'attr','api','attr'),(14,'header','api','header'),(15,'revision','api','revision'),(16,'tiler image','api','tilerimage'),(17,'tile','api','tile'),(18,'css','api','css'),(19,'schema','api','schema'),(20,'js','api','js'),(21,'refs decl','api','refsdecl'),(22,'task','api','task'),(23,'partner','api','partner'),(24,'community mapping','api','communitymapping'),(25,'user mapping','api','usermapping'),(26,'invitation','api','invitation'),(27,'action','api','action'),(28,'api user','api','apiuser');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8_bin NOT NULL,
  `session_data` longtext COLLATE utf8_bin NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_b7b81f0c` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('kc9tot635aybaoxzihaq0er37nrmccar','ZmI3ODQ4Y2IyMWFlYTc4ZmY2ODA0ZjlhN2ZlNWFkMDdmZDlmOTk3ZDp7Il9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9pZCI6MX0=','2014-05-31 12:18:53.997151');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_site`
--

DROP TABLE IF EXISTS `django_site`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_site` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` varchar(100) COLLATE utf8_bin NOT NULL,
  `name` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_site`
--

LOCK TABLES `django_site` WRITE;
/*!40000 ALTER TABLE `django_site` DISABLE KEYS */;
INSERT INTO `django_site` VALUES (1,'example.com','example.com');
/*!40000 ALTER TABLE `django_site` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-05-17  9:55:42
