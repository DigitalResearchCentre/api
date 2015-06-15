-- MySQL dump 10.13  Distrib 5.6.20, for osx10.8 (x86_64)
--
-- Host: localhost    Database: apitest
-- ------------------------------------------------------
-- Server version	5.6.20

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_action`
--

LOCK TABLES `api_action` WRITE;
/*!40000 ALTER TABLE `api_action` DISABLE KEYS */;
INSERT INTO `api_action` VALUES (1,2,1,'add text file',NULL,'{\"file\": \"Fairfax.xml\"}','2015-06-15 06:29:51.000000','2015-06-15 06:29:51.000000','a4fa8c06-9024-43aa-98b5-d396597b83cc'),(2,2,1,'add text file',NULL,'{\"file\": \"DemoTranscript.xml\"}','2015-06-15 06:29:59.000000','2015-06-15 06:29:59.000000','ff6bb605-0c56-4eb2-9bf8-c2f24e15d4ff'),(3,2,1,'add image zip',NULL,'{\"doc\": \"urn:det:TCUSask:BD01:document=Fairfax\"}','2015-06-15 06:30:21.000000','2015-06-15 06:30:21.000000','84ce5fe9-bd44-440b-9e87-be08ad9eee8f');
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
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_attr`
--

LOCK TABLES `api_attr` WRITE;
/*!40000 ALTER TABLE `api_attr` DISABLE KEYS */;
INSERT INTO `api_attr` VALUES (1,3,'n','130r'),(2,3,'facs','FF130R.JPG'),(3,5,'n','Book of the Duchess'),(4,6,'place','tm'),(5,6,'type','pageNum'),(6,7,'type','ed'),(7,7,'resp','PR'),(8,8,'n','Title'),(9,202,'place','margin-right'),(10,10,'n','1'),(11,12,'n','2'),(12,14,'n','3'),(13,16,'n','4'),(14,18,'n','5'),(15,20,'n','6'),(16,22,'n','7'),(17,24,'n','8'),(18,26,'n','9'),(19,28,'n','10'),(20,30,'n','11'),(21,32,'n','12'),(22,34,'n','13'),(23,36,'n','14'),(24,38,'n','15'),(25,40,'n','16'),(26,42,'n','17'),(27,44,'n','18'),(28,46,'n','19'),(29,48,'n','20'),(30,50,'n','21'),(31,52,'n','22'),(32,54,'n','23'),(33,56,'n','24'),(34,58,'n','25'),(35,60,'n','26'),(36,62,'n','27'),(37,64,'n','28'),(38,66,'n','29'),(39,68,'n','30'),(40,70,'n','31'),(41,72,'n','32'),(42,74,'n','33'),(43,76,'n','34'),(44,78,'n','35'),(45,80,'n','36'),(46,82,'n','37'),(47,84,'n','38'),(48,85,'n','130v'),(49,85,'facs','FF130V.JPG'),(50,87,'n','39'),(51,89,'n','40'),(52,91,'n','41'),(53,93,'n','42'),(54,95,'n','43'),(55,97,'n','44'),(56,99,'n','45'),(57,101,'n','46'),(58,103,'n','47'),(59,105,'n','48'),(60,107,'n','49'),(61,109,'n','50'),(62,111,'n','51'),(63,113,'n','52'),(64,115,'n','53'),(65,117,'n','54'),(66,119,'n','55'),(67,121,'n','56'),(68,123,'n','57'),(69,125,'n','58'),(70,127,'n','59'),(71,129,'n','60'),(72,131,'n','61'),(73,133,'n','62'),(74,135,'n','63'),(75,137,'n','64'),(76,139,'n','65'),(77,141,'n','66'),(78,143,'n','67'),(79,145,'n','68'),(80,147,'n','69'),(81,149,'n','70'),(82,151,'n','71'),(83,153,'n','72'),(84,155,'n','73'),(85,157,'n','74'),(86,159,'n','75'),(87,161,'n','76'),(88,163,'n','77'),(89,165,'n','78'),(90,167,'n','79'),(91,169,'n','80'),(92,171,'n','81'),(93,173,'n','82'),(94,175,'n','83'),(95,177,'n','84'),(96,179,'n','85'),(97,181,'n','86'),(98,183,'n','87'),(99,185,'n','88'),(100,187,'n','89'),(101,189,'n','90'),(102,191,'n','91'),(103,193,'n','92'),(104,195,'n','93'),(105,197,'n','94'),(106,199,'n','95'),(107,201,'n','96'),(108,203,'type','catch'),(109,203,'place','br'),(110,206,'n','1'),(111,208,'n','Book of the Duchess'),(112,210,'n','55'),(113,213,'rend','ital'),(114,214,'rend','bold'),(115,215,'rend','ital bold'),(116,216,'rend','strike'),(117,217,'rend','sup'),(118,220,'rend','sup'),(119,261,'type','orig'),(120,262,'type','corrector 1'),(121,263,'type','lit'),(122,268,'rend','strike'),(123,269,'rend','il'),(124,231,'place','tr'),(125,231,'type','pageNum'),(126,233,'place','br'),(127,233,'type','catch'),(128,235,'place','bm'),(129,235,'type','sig'),(130,238,'place','margin-left'),(131,240,'place','bl'),(132,243,'resp','PMR'),(133,243,'type','ed'),(134,270,'cols','2'),(135,271,'rend','circsmall'),(136,272,'rend','squareborder'),(137,273,'cols','2'),(138,273,'rend','circlarge'),(139,273,'rows','2'),(140,248,'quantity','4'),(141,248,'reason','illegible'),(142,248,'unit','chars'),(143,250,'reason','damage'),(144,252,'agent','water'),(145,267,'quantity','4'),(146,267,'unit','chars'),(147,254,'quantity','1'),(148,254,'unit','chars'),(149,256,'rend','b');
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
  CONSTRAINT `community_id_refs_id_fe9e389d` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`),
  CONSTRAINT `doc_id_refs_id_e9419884` FOREIGN KEY (`doc_id`) REFERENCES `api_doc` (`id`)
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
  CONSTRAINT `community_id_refs_id_b6f05088` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`),
  CONSTRAINT `entity_id_refs_id_a6ed2bc0` FOREIGN KEY (`entity_id`) REFERENCES `api_entity` (`id`)
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
  CONSTRAINT `community_id_refs_id_b6740060` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`),
  CONSTRAINT `refsdecl_id_refs_id_491d34ee` FOREIGN KEY (`refsdecl_id`) REFERENCES `api_refsdecl` (`id`)
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
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_doc`
--

LOCK TABLES `api_doc` WRITE;
/*!40000 ALTER TABLE `api_doc` DISABLE KEYS */;
INSERT INTO `api_doc` VALUES (1,1,200,1,1,'Fairfax','document',NULL),(2,2,81,1,2,'130r','Folio',NULL),(3,82,199,1,2,'130v','Folio',NULL),(4,3,4,1,3,'1','Line',NULL),(5,5,6,1,3,'2','Line',NULL),(6,7,8,1,3,'3','Line',NULL),(7,9,10,1,3,'4','Line',NULL),(8,11,12,1,3,'5','Line',NULL),(9,13,14,1,3,'6','Line',NULL),(10,15,16,1,3,'7','Line',NULL),(11,17,18,1,3,'8','Line',NULL),(12,19,20,1,3,'9','Line',NULL),(13,21,22,1,3,'10','Line',NULL),(14,23,24,1,3,'11','Line',NULL),(15,25,26,1,3,'12','Line',NULL),(16,27,28,1,3,'13','Line',NULL),(17,29,30,1,3,'14','Line',NULL),(18,31,32,1,3,'15','Line',NULL),(19,33,34,1,3,'16','Line',NULL),(20,35,36,1,3,'17','Line',NULL),(21,37,38,1,3,'18','Line',NULL),(22,39,40,1,3,'19','Line',NULL),(23,41,42,1,3,'20','Line',NULL),(24,43,44,1,3,'21','Line',NULL),(25,45,46,1,3,'22','Line',NULL),(26,47,48,1,3,'23','Line',NULL),(27,49,50,1,3,'24','Line',NULL),(28,51,52,1,3,'25','Line',NULL),(29,53,54,1,3,'26','Line',NULL),(30,55,56,1,3,'27','Line',NULL),(31,57,58,1,3,'28','Line',NULL),(32,59,60,1,3,'29','Line',NULL),(33,61,62,1,3,'30','Line',NULL),(34,63,64,1,3,'31','Line',NULL),(35,65,66,1,3,'32','Line',NULL),(36,67,68,1,3,'33','Line',NULL),(37,69,70,1,3,'34','Line',NULL),(38,71,72,1,3,'35','Line',NULL),(39,73,74,1,3,'36','Line',NULL),(40,75,76,1,3,'37','Line',NULL),(41,77,78,1,3,'38','Line',NULL),(42,79,80,1,3,'39','Line',NULL),(43,83,84,1,3,'1','Line',NULL),(44,85,86,1,3,'2','Line',NULL),(45,87,88,1,3,'3','Line',NULL),(46,89,90,1,3,'4','Line',NULL),(47,91,92,1,3,'5','Line',NULL),(48,93,94,1,3,'6','Line',NULL),(49,95,96,1,3,'7','Line',NULL),(50,97,98,1,3,'8','Line',NULL),(51,99,100,1,3,'9','Line',NULL),(52,101,102,1,3,'10','Line',NULL),(53,103,104,1,3,'11','Line',NULL),(54,105,106,1,3,'12','Line',NULL),(55,107,108,1,3,'13','Line',NULL),(56,109,110,1,3,'14','Line',NULL),(57,111,112,1,3,'15','Line',NULL),(58,113,114,1,3,'16','Line',NULL),(59,115,116,1,3,'17','Line',NULL),(60,117,118,1,3,'18','Line',NULL),(61,119,120,1,3,'19','Line',NULL),(62,121,122,1,3,'20','Line',NULL),(63,123,124,1,3,'21','Line',NULL),(64,125,126,1,3,'22','Line',NULL),(65,127,128,1,3,'23','Line',NULL),(66,129,130,1,3,'24','Line',NULL),(67,131,132,1,3,'25','Line',NULL),(68,133,134,1,3,'26','Line',NULL),(69,135,136,1,3,'27','Line',NULL),(70,137,138,1,3,'28','Line',NULL),(71,139,140,1,3,'29','Line',NULL),(72,141,142,1,3,'30','Line',NULL),(73,143,144,1,3,'31','Line',NULL),(74,145,146,1,3,'32','Line',NULL),(75,147,148,1,3,'33','Line',NULL),(76,149,150,1,3,'34','Line',NULL),(77,151,152,1,3,'35','Line',NULL),(78,153,154,1,3,'36','Line',NULL),(79,155,156,1,3,'37','Line',NULL),(80,157,158,1,3,'38','Line',NULL),(81,159,160,1,3,'39','Line',NULL),(82,161,162,1,3,'40','Line',NULL),(83,163,164,1,3,'41','Line',NULL),(84,165,166,1,3,'42','Line',NULL),(85,167,168,1,3,'43','Line',NULL),(86,169,170,1,3,'44','Line',NULL),(87,171,172,1,3,'45','Line',NULL),(88,173,174,1,3,'46','Line',NULL),(89,175,176,1,3,'47','Line',NULL),(90,177,178,1,3,'48','Line',NULL),(91,179,180,1,3,'49','Line',NULL),(92,181,182,1,3,'50','Line',NULL),(93,183,184,1,3,'51','Line',NULL),(94,185,186,1,3,'52','Line',NULL),(95,187,188,1,3,'53','Line',NULL),(96,189,190,1,3,'54','Line',NULL),(97,191,192,1,3,'55','Line',NULL),(98,193,194,1,3,'56','Line',NULL),(99,195,196,1,3,'57','Line',NULL),(100,197,198,1,3,'58','Line',NULL),(101,1,56,2,1,'Demo','document',NULL),(102,2,55,2,2,'1','Folio',NULL),(103,3,4,2,3,'1','Line',NULL),(104,5,6,2,3,'2','Line',NULL),(105,7,8,2,3,'3','Line',NULL),(106,9,10,2,3,'4','Line',NULL),(107,11,12,2,3,'5','Line',NULL),(108,13,14,2,3,'6','Line',NULL),(109,15,16,2,3,'7','Line',NULL),(110,17,18,2,3,'8','Line',NULL),(111,19,20,2,3,'9','Line',NULL),(112,21,22,2,3,'10','Line',NULL),(113,23,24,2,3,'11','Line',NULL),(114,25,26,2,3,'12','Line',NULL),(115,27,28,2,3,'13','Line',NULL),(116,29,30,2,3,'14','Line',NULL),(117,31,32,2,3,'15','Line',NULL),(118,33,34,2,3,'16','Line',NULL),(119,35,36,2,3,'17','Line',NULL),(120,37,38,2,3,'18','Line',NULL),(121,39,40,2,3,'19','Line',NULL),(122,41,42,2,3,'20','Line',NULL),(123,43,44,2,3,'21','Line',NULL),(124,45,46,2,3,'22','Line',NULL),(125,47,48,2,3,'23','Line',NULL),(126,49,50,2,3,'24','Line',NULL),(127,51,52,2,3,'25','Line',NULL),(128,53,54,2,3,'26','Line',NULL);
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
INSERT INTO `api_header` VALUES (1,'<teiHeader xmlns=\"http://www.tei-c.org/ns/1.0\" xmlns:det=\"http://textualcommunities.usask.ca/\">\n 		<fileDesc>\n 			<titleStmt>\n 				<title>Fairfax</title>\n 			</titleStmt>\n 			<publicationStmt>\n 				<p>Draft for Textual Communities site</p>\n 			</publicationStmt>\n 			<sourceDesc>\n 				<bibl det:document=\"Fairfax\"/>\n 			</sourceDesc>\n 		</fileDesc>\n 		<encodingDesc>\n   			<refsDecl det:documentRefsDecl=\"Manuscript\" det:entityRefsDecl=\"Simple Poetry\">\n 	 			<p>Textual Communities declarations</p>\n 	 		</refsDecl>\n 		</encodingDesc>\n 	</teiHeader>\n	',1),(2,'<teiHeader xmlns=\"http://www.tei-c.org/ns/1.0\" xmlns:det=\"http://textualcommunities.usask.ca/\">\n     <fileDesc>\n       <titleStmt><title>Demonstration of transcription features</title></titleStmt>\n       <publicationStmt><p>Designed to show transcription features -- quite fake as a document</p></publicationStmt>\n       <sourceDesc><bibl det:document=\"Demo\"/></sourceDesc>\n     </fileDesc>\n     <encodingDesc>\n         <refsDecl det:documentRefsDecl=\"Manuscript\" det:entityRefsDecl=\"Simple Poetry\">\n          <p>Textual Communities declarations</p>\n        </refsDecl>\n     </encodingDesc>\n   </teiHeader>\n  ',204);
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
INSERT INTO `api_refsdecl` VALUES (1,'Print','',0,NULL,'<refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Page=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references a pb element for each page.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Page=(.+):Column=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a cb element within a pb element for each page.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Page=(.+):Column=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\']/following::lb[@n=\'$3\'])\">\n    <p>This pointer pattern extracts and references a lb element within cb element within a pb element for each page.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Page=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::lb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a lb element within a pb element for each page.</p>\n  </cRefPattern>\n</refsDecl>\n',''),(2,'Manuscript','',0,NULL,'<refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Folio=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Folio=(.+):Column=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a cb element within a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Folio=(.+):Column=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\']/following::lb[@n=\'$3\'])\">\n    <p>This pointer pattern extracts and references a lb element within cb element within a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:document={{ document_identifier }}:Folio=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::lb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a lb element within a pb element for each folio.</p>\n  </cRefPattern>\n</refsDecl>\n',''),(3,'Simple Poetry','',1,NULL,'<refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references each top-level unit of text, as  a top-level div,  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):head=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/head[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each head element contained in a div  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):verse=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/l[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each l element contained in a div as an entity</p>\n  </cRefPattern>\n</refsDecl>\n','<text><body>\n <div n=\"Unique identifier for this poem. Could be Poem 1 \">\n <lb/><head n=\"1\">Transcribe the title</head>\n <lb/><l n=\"1\">Transcribe the first verse of the text here (specify a \'n\' attribute)\n <lb/>rest of line goes here, etc, if the line of poetry happens to run to two lines in the document</l>\n <lb/><l n=\"2\">Second line of poetry occupies this writing space</l>\n </div>\n</body>\n</text>'),(4,'Simple Prose','',1,NULL,'<refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references each top-level unit of text, as  a top-level div,  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):head=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/head[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each head element contained in a div  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):para=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/p[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each p element contained in a div as an entity</p>\n  </cRefPattern>\n</refsDecl>\n','<text><body>\n <!--> what appears below will appear as the template for each transcription page in the document (simple prose) </!-->\n <lb/>\n <div n=\"Unique identifier for this entity. Could be Sermon_1.  Use underscore to separate words \">\n <head>Transcribe the title (you can specify a \'n\' attribute or allow the system to allocate this for you)</head>\n <lb/><p>Transcribe the first line of the text here ((you can specify a \'n\' attribute or allow the system to allocate this for you))\n <lb/>Second line goes here, etc</p>\n </div>\n <lb/>\n <div n=\"Unique identifier for this entity. Could be Sermon_2.  Use underscore to separate words \">\n <head>Transcribe the title (you can specify a \'n\' attribute or allow the system to allocate this for you)</head>\n <lb/><p>Transcribe the first line of the text here ((you can specify a \'n\' attribute or allow the system to allocate this for you))\n <lb/>Second line goes here, etc</p>\n </div>\n</body>\n</text>'),(5,'Complex Prose','',1,NULL,'<refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references each top-level unit of text, as  a top-level div,  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):head=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/head[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each head element contained in a div  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):para=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/p[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each p element contained in a div as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):section=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/div[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references the each second-level unit of text, as a section div contained in a div,  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):section=(.+):head=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/div[@n=\'$2\']/head[@n=\'$3\'])\">\n    <p>This pointer pattern extracts and references each head element, as a head contained in a section div contained in a div, as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):section=(.+):para=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/div[@n=\'$2\']/p[@n=\'$3\'])\">\n    <p>This pointer pattern extracts and references each para element, as  a p contained in a section div contained in a div,  as an entity</p>\n  </cRefPattern>\n</refsDecl>\n','<text><body>\n <div n=\"1\"> <!--> outer containing div, say for section 1. Must be repeated at beginning of each page containing this section </!-->\n <!--> what appears below will appear as the template for each transcription page in the document (simple prose) </!-->\n <lb/>\n <div n=\"Unique identifier for this entity. Could be Sermon_1.  Use underscore to separate words \">\n <head>Transcribe the title (you can specify a \'n\' attribute or allow the system to allocate this for you)</head>\n <lb/><p>Transcribe the first line of the text here ((you can specify a \'n\' attribute or allow the system to allocate this for you))\n <lb/>Second line goes here, etc</p>\n </div>\n <lb/>\n <div n=\"Unique identifier for this entity. Could be Sermon_2.  Use underscore to separate words \">\n <head>Transcribe the title (you can specify a \'n\' attribute or allow the system to allocate this for you)</head>\n <lb/><p>Transcribe the first line of the text here ((you can specify a \'n\' attribute or allow the system to allocate this for you))\n <lb/>Second line goes here, etc</p>\n </div>\n </div>\n</body></text>'),(6,'Complex Poetry','',1,NULL,'<refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references each top-level unit of text, as  a top-level div,  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):head=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/head[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each head element contained in a div  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):verse=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/l[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each l element contained in a div as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:{{ community_identifier }}:entity=(.+):stanza=(.+):verse=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/lg[@n=\'$2\']/l[@n=\'$3\'])\">\n    <p>This pointer pattern extracts and references each l element contained in a lg contained in div as an entity</p>\n  </cRefPattern>\n</refsDecl>\n','<text><body>\n <!--> what appears below will appear as the template for each transcription page in the document (simple prose) </!--> \n <lb/>\n <div n=\"Unique identifier for this poem. Could be Poem_1.  Use underscore to separate words \">\n <head>Transcribe the title (you can specify a \'n\' attribute or allow the system to allocate this for you)</head>\n <lg n=\"1\">\n <lb/><l n=\"1\">Transcribe the first verse of the text here (you should specify a \'n\' attribute but you could allow the system to allocate this for you)\n <lb/>rest of verse goes here, etc, if the line of poetry happens to run to two lines in the document</l>\n <lb/><l n=\"2\">Second verse of poetry occupies this writing space</l>\n </lg>\n <lg n=\"2\">\n <lb/><l n=\"1\">Transcribe the first verse of the text here (you should specify a \'n\' attribute but you could allow the system to allocate this for you)\n <lb/>rest of line goes here, etc, if the verse of poetry happens to run to two lines in the document</l>\n <lb/><l n=\"2\">Second verse of poetry occupies this writing space</l>\n </lg>\n </div>\n <lb/>\n <div n=\"Unique identifier for this entity. Could be Poem_2.  Use underscore to separate words \">\n <head>Transcribe the title (you can specify a \'n\' attribute or allow the system to allocate this for you)</head>\n <head>Transcribe the title (you can specify a \'n\' attribute or allow the system to allocate this for you)</head>\n <lb/><l n=\"1\">Transcribe the first line of the text here (you should specify a \'n\' attribute but you could allow the system to allocate this for you)\n <lb/>rest of line goes here, etc, if the line of poetry happens to run to two lines in the document</l>\n <lb/><l n=\"2\">Second line of poetry occupies this writing space</l>\n </div>\n</body></text>'),(7,'','',2,1,'<refsDecl><refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Fairfax:Folio=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Fairfax:Folio=(.+):Column=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a cb element within a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Fairfax:Folio=(.+):Column=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\']/following::lb[@n=\'$3\'])\">\n    <p>This pointer pattern extracts and references a lb element within cb element within a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Fairfax:Folio=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::lb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a lb element within a pb element for each folio.</p>\n  </cRefPattern>\n</refsDecl><refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:entity=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references each top-level unit of text, as  a top-level div,  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:entity=(.+):head=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/head[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each head element contained in a div  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:entity=(.+):verse=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/l[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each l element contained in a div as an entity</p>\n  </cRefPattern>\n</refsDecl></refsDecl>','<text><body>\n <div n=\"Unique identifier for this poem. Could be Poem 1 \">\n <lb/><head n=\"1\">Transcribe the title</head>\n <lb/><l n=\"1\">Transcribe the first verse of the text here (specify a \'n\' attribute)\n <lb/>rest of line goes here, etc, if the line of poetry happens to run to two lines in the document</l>\n <lb/><l n=\"2\">Second line of poetry occupies this writing space</l>\n </div>\n</body>\n</text>'),(8,'','',2,204,'<refsDecl><refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Demo:Folio=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Demo:Folio=(.+):Column=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a cb element within a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Demo:Folio=(.+):Column=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::cb[@n=\'$2\']/following::lb[@n=\'$3\'])\">\n    <p>This pointer pattern extracts and references a lb element within cb element within a pb element for each folio.</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:document=Demo:Folio=(.+):Line=(.+)\" replacementPattern=\"#xpath(//pb[@n=\'$1\']/following::lb[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references a lb element within a pb element for each folio.</p>\n  </cRefPattern>\n</refsDecl><refsDecl>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:entity=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\'])\">\n    <p>This pointer pattern extracts and references each top-level unit of text, as  a top-level div,  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:entity=(.+):head=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/head[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each head element contained in a div  as an entity</p>\n  </cRefPattern>\n  <cRefPattern matchPattern=\"urn:det:TCUSask:BD01:entity=(.+):verse=(.+)\" replacementPattern=\"#xpath(//body/div[@n=\'$1\']/l[@n=\'$2\'])\">\n    <p>This pointer pattern extracts and references each l element contained in a div as an entity</p>\n  </cRefPattern>\n</refsDecl></refsDecl>','<text><body>\n <div n=\"Unique identifier for this poem. Could be Poem 1 \">\n <lb/><head n=\"1\">Transcribe the title</head>\n <lb/><l n=\"1\">Transcribe the first verse of the text here (specify a \'n\' attribute)\n <lb/>rest of line goes here, etc, if the line of poetry happens to run to two lines in the document</l>\n <lb/><l n=\"2\">Second line of poetry occupies this writing space</l>\n </div>\n</body>\n</text>');
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
  `status` int(11) NOT NULL,
  `spent_time` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_revision_fbbb6049` (`doc_id`),
  KEY `api_revision_6340c63c` (`user_id`),
  KEY `api_revision_8af18ff9` (`prev_id`),
  CONSTRAINT `doc_id_refs_id_98a1df75` FOREIGN KEY (`doc_id`) REFERENCES `api_doc` (`id`),
  CONSTRAINT `prev_id_refs_id_01ffac0f` FOREIGN KEY (`prev_id`) REFERENCES `api_revision` (`id`),
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_schema`
--

LOCK TABLES `api_schema` WRITE;
/*!40000 ALTER TABLE `api_schema` DISABLE KEYS */;
INSERT INTO `api_schema` VALUES (1,1,'schema/1/TEI-transcr-TC_4.dtd');
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
) ENGINE=InnoDB AUTO_INCREMENT=274 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_text`
--

LOCK TABLES `api_text` WRITE;
/*!40000 ALTER TABLE `api_text` DISABLE KEYS */;
INSERT INTO `api_text` VALUES (1,1,406,1,1,'text','','',1,NULL),(2,2,405,1,2,'body','\n		','\n	',NULL,NULL),(3,3,4,1,3,'pb','','\n			',2,NULL),(4,5,6,1,3,'lb','','',4,NULL),(5,7,404,1,3,'div','\n	','\n  	',NULL,1),(6,8,9,1,4,'fw','130','',NULL,NULL),(7,10,11,1,4,'note','Pencil foliation','\n',NULL,NULL),(8,12,15,1,4,'head','The booke of the Duchesse','\n',NULL,2),(9,16,17,1,4,'lb','','',5,NULL),(10,18,19,1,4,'l','I Haue grete wonder/ be this lyghte','\n',NULL,3),(11,20,21,1,4,'lb','','',6,NULL),(12,22,23,1,4,'l','How that I lyve/ for day ne nyghte','\n',NULL,4),(13,24,25,1,4,'lb','','',7,NULL),(14,26,27,1,4,'l','I may nat slepe/ wel nygh noght','\n',NULL,5),(15,28,29,1,4,'lb','','',8,NULL),(16,30,31,1,4,'l','I have so many/ an ydel thoght','\n',NULL,6),(17,32,33,1,4,'lb','','',9,NULL),(18,34,35,1,4,'l','Purely/ for defaulte of slepe','\n',NULL,7),(19,36,37,1,4,'lb','','',10,NULL),(20,38,39,1,4,'l','That by my trouthe/ I take no kepe','\n',NULL,8),(21,40,41,1,4,'lb','','',11,NULL),(22,42,43,1,4,'l','Of noo thinge/ how hyt cometh or gooth','\n',NULL,9),(23,44,45,1,4,'lb','','',12,NULL),(24,46,47,1,4,'l','Ne me nys no thynge/ leve nor looth','\n',NULL,10),(25,48,49,1,4,'lb','','',13,NULL),(26,50,51,1,4,'l','Al is ylyche goode/ to me','\n',NULL,11),(27,52,53,1,4,'lb','','',14,NULL),(28,54,55,1,4,'l','Ioy or sorowe/ wherso hyt be','\n',NULL,12),(29,56,57,1,4,'lb','','',15,NULL),(30,58,59,1,4,'l','ffor I haue felynge/ in no thynge','\n',NULL,13),(31,60,61,1,4,'lb','','',16,NULL),(32,62,63,1,4,'l','But as yt were/ a mased thynge','\n',NULL,14),(33,64,65,1,4,'lb','','',17,NULL),(34,66,67,1,4,'l','Alway in poynt/ to falle a dovun\'','\n',NULL,15),(35,68,69,1,4,'lb','','',18,NULL),(36,70,71,1,4,'l','ffor sorwful/ ymagynacioun\'','\n',NULL,16),(37,72,73,1,4,'lb','','',19,NULL),(38,74,75,1,4,'l','Ys alway hooly/ in my mynde','\n',NULL,17),(39,76,77,1,4,'lb','','',20,NULL),(40,78,79,1,4,'l','And wel ye woote/ agaynes kynde','\n',NULL,18),(41,80,81,1,4,'lb','','',21,NULL),(42,82,83,1,4,'l','Hyt were to lyven\'/ in thys wyse','\n',NULL,19),(43,84,85,1,4,'lb','','',22,NULL),(44,86,87,1,4,'l','ffor nature/ wolde nat suffyse','\n',NULL,20),(45,88,89,1,4,'lb','','',23,NULL),(46,90,91,1,4,'l','To noon\' ertherly/ creature','\n',NULL,21),(47,92,93,1,4,'lb','','',24,NULL),(48,94,95,1,4,'l','Nat longe tyme/ to endure','\n',NULL,22),(49,96,97,1,4,'lb','','',25,NULL),(50,98,99,1,4,'l','With oute slepe/ and be in sorwe','\n',NULL,23),(51,100,101,1,4,'lb','','',26,NULL),(52,102,103,1,4,'l','And I ne may/ no nyght ne morwe','\n',NULL,24),(53,104,105,1,4,'lb','','',27,NULL),(54,106,107,1,4,'l','Slepe/ and thys Melancolye','\n',NULL,25),(55,108,109,1,4,'lb','','',28,NULL),(56,110,111,1,4,'l','And drede I haue/ for to dye','\n',NULL,26),(57,112,113,1,4,'lb','','',29,NULL),(58,114,115,1,4,'l','Defaulte of slepe/ and hevynesse','\n',NULL,27),(59,116,117,1,4,'lb','','',30,NULL),(60,118,119,1,4,'l','Hath my spirite/ of quyknesse','\n',NULL,28),(61,120,121,1,4,'lb','','',31,NULL),(62,122,123,1,4,'l','That I haue loste/ al lustyhede','\n',NULL,29),(63,124,125,1,4,'lb','','',32,NULL),(64,126,127,1,4,'l','Suche fantasies/ ben in myn\' hede','\n',NULL,30),(65,128,129,1,4,'lb','','',33,NULL),(66,130,131,1,4,'l','So I not what/ is best too doo','\n',NULL,31),(67,132,133,1,4,'lb','','',34,NULL),(68,134,135,1,4,'l','But men\' myght axeme/ why soo','\n  ',NULL,32),(69,136,137,1,4,'lb','','',35,NULL),(70,138,139,1,4,'l','I may not sleepe, and what me is','\n  ',NULL,33),(71,140,141,1,4,'lb','','',36,NULL),(72,142,143,1,4,'l','But nathles, whoe aske this','\n  ',NULL,34),(73,144,145,1,4,'lb','','',37,NULL),(74,146,147,1,4,'l','Leseth his asking trewly','\n  ',NULL,35),(75,148,149,1,4,'lb','','',38,NULL),(76,150,151,1,4,'l','My seluen can not tell why','\n  ',NULL,36),(77,152,153,1,4,'lb','','',39,NULL),(78,154,155,1,4,'l','The southe, but trewly as I gesse','\n  ',NULL,37),(79,156,157,1,4,'lb','','',40,NULL),(80,158,159,1,4,'l','I hold it be a sicknes','\n  ',NULL,38),(81,160,161,1,4,'lb','','',41,NULL),(82,162,163,1,4,'l','That I haue suffred this eight yeere','\n  ',NULL,39),(83,164,165,1,4,'lb','','',42,NULL),(84,166,167,1,4,'l','And yet my boote is neuer the nere','\n',NULL,40),(85,168,169,1,4,'pb','','            \n  ',3,NULL),(86,170,171,1,4,'lb','','',43,NULL),(87,172,173,1,4,'l','For there is phisicien but one','\n  ',NULL,41),(88,174,175,1,4,'lb','','',44,NULL),(89,176,177,1,4,'l','That may me heale, but that is done','\n  ',NULL,42),(90,178,179,1,4,'lb','','',45,NULL),(91,180,181,1,4,'l','Passe we ouer vntill efte','\n  ',NULL,43),(92,182,183,1,4,'lb','','',46,NULL),(93,184,185,1,4,'l','That will not be, mote nedes be lefte','\n  ',NULL,44),(94,186,187,1,4,'lb','','',47,NULL),(95,188,189,1,4,'l','Our first mater is good to kepe','\n  ',NULL,45),(96,190,191,1,4,'lb','','',48,NULL),(97,192,193,1,4,'l','Soe when I sawe I might not slepe','\n  ',NULL,46),(98,194,195,1,4,'lb','','',49,NULL),(99,196,197,1,4,'l','Til now late, this other night','\n  ',NULL,47),(100,198,199,1,4,'lb','','',50,NULL),(101,200,201,1,4,'l','Vpon my bedde I sate vpright','\n  ',NULL,48),(102,202,203,1,4,'lb','','',51,NULL),(103,204,205,1,4,'l','And bade one reche me a booke','\n  ',NULL,49),(104,206,207,1,4,'lb','','',52,NULL),(105,208,209,1,4,'l','A Romaunce, and it me toke','\n  ',NULL,50),(106,210,211,1,4,'lb','','',53,NULL),(107,212,213,1,4,'l','To rede, and driue the night away','\n  ',NULL,51),(108,214,215,1,4,'lb','','',54,NULL),(109,216,217,1,4,'l','For me thought it beter play','\n  ',NULL,52),(110,218,219,1,4,'lb','','',55,NULL),(111,220,221,1,4,'l','Then play either at Chesse or tables','\n  ',NULL,53),(112,222,223,1,4,'lb','','',56,NULL),(113,224,225,1,4,'l','And in this boke were written fables','\n  ',NULL,54),(114,226,227,1,4,'lb','','',57,NULL),(115,228,229,1,4,'l','That Clerkes had in olde tyme','\n  ',NULL,55),(116,230,231,1,4,'lb','','',58,NULL),(117,232,233,1,4,'l','And other poets put in rime','\n  ',NULL,56),(118,234,235,1,4,'lb','','',59,NULL),(119,236,237,1,4,'l','To rede, and for to be in minde','\n  ',NULL,57),(120,238,239,1,4,'lb','','',60,NULL),(121,240,241,1,4,'l','While men loued the lawe in kinde','\n  ',NULL,58),(122,242,243,1,4,'lb','','',61,NULL),(123,244,245,1,4,'l','This boke ne speake, but of such thinges','\n  ',NULL,59),(124,246,247,1,4,'lb','','',62,NULL),(125,248,249,1,4,'l','Of quenes liues, and of kings','\n  ',NULL,60),(126,250,251,1,4,'lb','','',63,NULL),(127,252,253,1,4,'l','And many other things smalle','\n  ',NULL,61),(128,254,255,1,4,'lb','','',64,NULL),(129,256,257,1,4,'l','Amonge all this I fonde a tale','\n  ',NULL,62),(130,258,259,1,4,'lb','','',65,NULL),(131,260,261,1,4,'l','That me thought a wonder thing.','\n  ',NULL,63),(132,262,263,1,4,'lb','','',66,NULL),(133,264,265,1,4,'l','This was the tale: There was a king','\n  ',NULL,64),(134,266,267,1,4,'lb','','',67,NULL),(135,268,269,1,4,'l','That hight Seyes, and had a wife','\n  ',NULL,65),(136,270,271,1,4,'lb','','',68,NULL),(137,272,273,1,4,'l','The best that might beare lyfe','\n  ',NULL,66),(138,274,275,1,4,'lb','','',69,NULL),(139,276,277,1,4,'l','And this quene hight Alcyone','\n  ',NULL,67),(140,278,279,1,4,'lb','','',70,NULL),(141,280,281,1,4,'l','Soe it befill, thereafter soone','\n  ',NULL,68),(142,282,283,1,4,'lb','','',71,NULL),(143,284,285,1,4,'l','This king woll wenden ouer see','\n  ',NULL,69),(144,286,287,1,4,'lb','','',72,NULL),(145,288,289,1,4,'l','To tellen shortly, whan that he','\n  ',NULL,70),(146,290,291,1,4,'lb','','',73,NULL),(147,292,293,1,4,'l','Was in the see, thus in this wise','\n  ',NULL,71),(148,294,295,1,4,'lb','','',74,NULL),(149,296,297,1,4,'l','Soche a tempest gan to rise','\n  ',NULL,72),(150,298,299,1,4,'lb','','',75,NULL),(151,300,301,1,4,'l','That brake her maste, and made it fal','\n  ',NULL,73),(152,302,303,1,4,'lb','','',76,NULL),(153,304,305,1,4,'l','And cleft ther ship, and dreint hem all','\n  ',NULL,74),(154,306,307,1,4,'lb','','',77,NULL),(155,308,309,1,4,'l','That neuer was founde, as it telles','\n  ',NULL,75),(156,310,311,1,4,'lb','','',78,NULL),(157,312,313,1,4,'l','Borde ne man, ne nothing elles','\n  ',NULL,76),(158,314,315,1,4,'lb','','',79,NULL),(159,316,317,1,4,'l','Right thus this king Seyes loste his life','\n  ',NULL,77),(160,318,319,1,4,'lb','','',80,NULL),(161,320,321,1,4,'l','Now for to speake of Alcyone his wife','\n  ',NULL,78),(162,322,323,1,4,'lb','','',81,NULL),(163,324,325,1,4,'l','This Lady that was left at home','\n  ',NULL,79),(164,326,327,1,4,'lb','','',82,NULL),(165,328,329,1,4,'l','Hath wonder, that the king ne come','\n  ',NULL,80),(166,330,331,1,4,'lb','','',83,NULL),(167,332,333,1,4,'l','Home, for it was a long terme','\n  ',NULL,81),(168,334,335,1,4,'lb','','',84,NULL),(169,336,337,1,4,'l','Anone her herte began to yerne','\n  ',NULL,82),(170,338,339,1,4,'lb','','',85,NULL),(171,340,341,1,4,'l','And for that her thought euermo','\n  ',NULL,83),(172,342,343,1,4,'lb','','',86,NULL),(173,344,345,1,4,'l','It was not wele, her thought soe','\n  ',NULL,84),(174,346,347,1,4,'lb','','',87,NULL),(175,348,349,1,4,'l','She longed soe after the king','\n  ',NULL,85),(176,350,351,1,4,'lb','','',88,NULL),(177,352,353,1,4,'l','That certes it were a pitous thing','\n  ',NULL,86),(178,354,355,1,4,'lb','','',89,NULL),(179,356,357,1,4,'l','To tell her hartely sorowfull life','\n  ',NULL,87),(180,358,359,1,4,'lb','','',90,NULL),(181,360,361,1,4,'l','That she had, this noble wife','\n  ',NULL,88),(182,362,363,1,4,'lb','','',91,NULL),(183,364,365,1,4,'l','For him alas, she loued alderbeste','\n  ',NULL,89),(184,366,367,1,4,'lb','','',92,NULL),(185,368,369,1,4,'l','Anone she sent both eeste and weste','\n  ',NULL,90),(186,370,371,1,4,'lb','','',93,NULL),(187,372,373,1,4,'l','To seke him, but they founde nought','\n  ',NULL,91),(188,374,375,1,4,'lb','','',94,NULL),(189,376,377,1,4,'l','Alas (quoth shee) that I was wrought','\n  ',NULL,92),(190,378,379,1,4,'lb','','',95,NULL),(191,380,381,1,4,'l','And where my lord my loue be deed:','\n  ',NULL,93),(192,382,383,1,4,'lb','','',96,NULL),(193,384,385,1,4,'l','Certes I will neuer eate breede','\n  ',NULL,94),(194,386,387,1,4,'lb','','',97,NULL),(195,388,389,1,4,'l','I make a uowe to my god here','\n  ',NULL,95),(196,390,391,1,4,'lb','','',98,NULL),(197,392,393,1,4,'l','But I mowe of my Lord here.','\n  ',NULL,96),(198,394,395,1,4,'lb','','',99,NULL),(199,396,397,1,4,'l','Soche sorowe this Lady to her toke','\n  ',NULL,97),(200,398,399,1,4,'lb','','',100,NULL),(201,400,403,1,4,'l','That trewly I which made this booke','\n  ',NULL,98),(202,13,14,1,5,'note','made by Geffrey\nChawcyer','',NULL,NULL),(203,401,402,1,5,'fw','[Catchword:]Had such','',NULL,NULL),(204,1,140,2,1,'text','','',101,NULL),(205,2,139,2,2,'body','\n    ','\n  ',NULL,NULL),(206,3,4,2,3,'pb','','\n      ',102,NULL),(207,5,6,2,3,'lb','','',103,NULL),(208,7,138,2,3,'div','\n        ','\n    ',NULL,1),(209,8,9,2,4,'lb','','',104,NULL),(210,10,137,2,4,'l','This is a misuse of this line of verse to show various transcription features.\n        ','\n      ',NULL,57),(211,11,12,2,5,'lb','','Text with various features: \n        ',105,NULL),(212,13,14,2,5,'lb','','  ',106,NULL),(213,15,16,2,5,'hi','italic',' ',NULL,NULL),(214,17,18,2,5,'hi','bold',' ',NULL,NULL),(215,19,20,2,5,'hi','bold italic',' ',NULL,NULL),(216,21,22,2,5,'hi','strike through',' ',NULL,NULL),(217,23,24,2,5,'hi','superscript','\n        ',NULL,NULL),(218,25,26,2,5,'lb','','Text useful for transcription of manuscripts:\n  ',107,NULL),(219,27,28,2,5,'lb','','  Abbr',108,NULL),(220,29,30,2,5,'am','et','',NULL,NULL),(221,31,32,2,5,'ex','eviations',' ',NULL,NULL),(222,33,38,2,5,'choice','',' ',NULL,NULL),(223,39,44,2,5,'choice','','\n        ',NULL,NULL),(224,45,46,2,5,'lb','','Text useful for recording alterations within the manuscript:\n  ',109,NULL),(225,47,48,2,5,'lb','','  ',110,NULL),(226,49,60,2,5,'app','','\n        ',NULL,NULL),(227,61,62,2,5,'lb','','Note: we deprecate the use of the TEI elements add and del, because they confuse representation with interpretation\n        ',111,NULL),(228,63,64,2,5,'lb','','The app system here suggested cleanly separates representation from interpretation.\n        ',112,NULL),(229,65,66,2,5,'lb','','Representation of page numbers and catch words: \n        ',113,NULL),(230,67,68,2,5,'lb','','',114,NULL),(231,69,70,2,5,'fw','1','-- a page number, top right\n        ',NULL,NULL),(232,71,72,2,5,'lb','','',115,NULL),(233,73,74,2,5,'fw','Catchword','-- a catchword, bottom right\n        ',NULL,NULL),(234,75,76,2,5,'lb','','',116,NULL),(235,77,78,2,5,'fw','Signature','-- a signature, in the bottom margin, centre\n        ',NULL,NULL),(236,79,80,2,5,'lb','','Marginalia:\n        ',117,NULL),(237,81,82,2,5,'lb','','',118,NULL),(238,83,84,2,5,'note','Marginalia',' -- left margin\n        ',NULL,NULL),(239,85,86,2,5,'lb','','',119,NULL),(240,87,88,2,5,'note','Marginalia',' -- bottom margin, left\n        ',NULL,NULL),(241,89,90,2,5,'lb','','Editorial notes:\n        ',120,NULL),(242,91,92,2,5,'lb','','Something to annotate',121,NULL),(243,93,94,2,5,'note','An editorial note','\n        ',NULL,NULL),(244,95,96,2,5,'lb','','Tables:\n        ',122,NULL),(245,97,112,2,5,'table','\n                  ','\n            ',NULL,NULL),(246,113,114,2,5,'lb','','Unreadable, unclear, supplied or damaged text:\n            ',123,NULL),(247,115,116,2,5,'lb','','',124,NULL),(248,117,118,2,5,'gap','',' -- you cannot read the text at all: (four characters unreadable)\n            ',NULL,NULL),(249,119,120,2,5,'lb','','You can read the ',125,NULL),(250,121,122,2,5,'unclear','damaged text',' but with difficulty\n            ',NULL,NULL),(251,123,124,2,5,'lb','','',126,NULL),(252,125,128,2,5,'damage','',' -- The document is damaged, and you cannot read it \n            ',NULL,NULL),(253,129,130,2,5,'lb','','',127,NULL),(254,131,132,2,5,'space','','-- empty space in the source text \n            ',NULL,NULL),(255,133,134,2,5,'lb','','See the Wikipedia entry on ',128,NULL),(256,135,136,2,5,'hi','Default Transcription Guidelines',' for more details.\n      ',NULL,NULL),(257,34,35,2,6,'sic','wrong','',NULL,NULL),(258,36,37,2,6,'corr','right','',NULL,NULL),(259,40,41,2,6,'orig','olde','',NULL,NULL),(260,42,43,2,6,'reg','old','',NULL,NULL),(261,50,51,2,6,'rdg','Original','',NULL,NULL),(262,52,53,2,6,'rdg','Altered','',NULL,NULL),(263,54,59,2,6,'rdg','','',NULL,NULL),(264,98,101,2,6,'row','','\n                  ',NULL,NULL),(265,102,107,2,6,'row','','\n                  ',NULL,NULL),(266,108,111,2,6,'row','','\n            ',NULL,NULL),(267,126,127,2,6,'gap','','',NULL,NULL),(268,55,56,2,7,'hi','Original','',NULL,NULL),(269,57,58,2,7,'hi','\\Altered/','',NULL,NULL),(270,99,100,2,7,'cell','occupies two columns','',NULL,NULL),(271,103,104,2,7,'cell','circle','',NULL,NULL),(272,105,106,2,7,'cell','square','',NULL,NULL),(273,109,110,2,7,'cell','large circle','',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add permission',1,'add_permission'),(2,'Can change permission',1,'change_permission'),(3,'Can delete permission',1,'delete_permission'),(4,'Can add group',2,'add_group'),(5,'Can change group',2,'change_group'),(6,'Can delete group',2,'delete_group'),(7,'Can add user',3,'add_user'),(8,'Can change user',3,'change_user'),(9,'Can delete user',3,'delete_user'),(10,'Can add content type',4,'add_contenttype'),(11,'Can change content type',4,'change_contenttype'),(12,'Can delete content type',4,'delete_contenttype'),(13,'Can add session',5,'add_session'),(14,'Can change session',5,'change_session'),(15,'Can delete session',5,'delete_session'),(16,'Can add site',6,'add_site'),(17,'Can change site',6,'change_site'),(18,'Can delete site',6,'delete_site'),(19,'Can add log entry',7,'add_logentry'),(20,'Can change log entry',7,'change_logentry'),(21,'Can delete log entry',7,'delete_logentry'),(22,'Can add community',8,'add_community'),(23,'Can change community',8,'change_community'),(24,'Can delete community',8,'delete_community'),(25,'Can add membership',9,'add_membership'),(26,'Can change membership',9,'change_membership'),(27,'Can delete membership',9,'delete_membership'),(28,'Can add entity',10,'add_entity'),(29,'Can change entity',10,'change_entity'),(30,'Can delete entity',10,'delete_entity'),(31,'Can add doc',11,'add_doc'),(32,'Can change doc',11,'change_doc'),(33,'Can delete doc',11,'delete_doc'),(34,'Can add text',12,'add_text'),(35,'Can change text',12,'change_text'),(36,'Can delete text',12,'delete_text'),(37,'Can add attr',13,'add_attr'),(38,'Can change attr',13,'change_attr'),(39,'Can delete attr',13,'delete_attr'),(40,'Can add header',14,'add_header'),(41,'Can change header',14,'change_header'),(42,'Can delete header',14,'delete_header'),(43,'Can add revision',15,'add_revision'),(44,'Can change revision',15,'change_revision'),(45,'Can delete revision',15,'delete_revision'),(46,'Can add tiler image',16,'add_tilerimage'),(47,'Can change tiler image',16,'change_tilerimage'),(48,'Can delete tiler image',16,'delete_tilerimage'),(49,'Can add tile',17,'add_tile'),(50,'Can change tile',17,'change_tile'),(51,'Can delete tile',17,'delete_tile'),(52,'Can add css',18,'add_css'),(53,'Can change css',18,'change_css'),(54,'Can delete css',18,'delete_css'),(55,'Can add schema',19,'add_schema'),(56,'Can change schema',19,'change_schema'),(57,'Can delete schema',19,'delete_schema'),(58,'Can add js',20,'add_js'),(59,'Can change js',20,'change_js'),(60,'Can delete js',20,'delete_js'),(61,'Can add refs decl',21,'add_refsdecl'),(62,'Can change refs decl',21,'change_refsdecl'),(63,'Can delete refs decl',21,'delete_refsdecl'),(64,'Can add api user',3,'add_apiuser'),(65,'Can change api user',3,'change_apiuser'),(66,'Can delete api user',3,'delete_apiuser'),(67,'Can add task',22,'add_task'),(68,'Can change task',22,'change_task'),(69,'Can delete task',22,'delete_task'),(70,'Can add partner',23,'add_partner'),(71,'Can change partner',23,'change_partner'),(72,'Can delete partner',23,'delete_partner'),(73,'Can add community mapping',24,'add_communitymapping'),(74,'Can change community mapping',24,'change_communitymapping'),(75,'Can delete community mapping',24,'delete_communitymapping'),(76,'Can add user mapping',25,'add_usermapping'),(77,'Can change user mapping',25,'change_usermapping'),(78,'Can delete user mapping',25,'delete_usermapping'),(79,'Can add invitation',26,'add_invitation'),(80,'Can change invitation',26,'change_invitation'),(81,'Can delete invitation',26,'delete_invitation'),(82,'Can add action',27,'add_action'),(83,'Can change action',27,'change_action'),(84,'Can delete action',27,'delete_action'),(85,'Can add modification',29,'add_modification'),(86,'Can change modification',29,'change_modification'),(87,'Can delete modification',29,'delete_modification'),(88,'Can add rule',30,'add_rule'),(89,'Can change rule',30,'change_rule'),(90,'Can delete rule',30,'delete_rule'),(91,'Can add alignment',31,'add_alignment'),(92,'Can change alignment',31,'change_alignment'),(93,'Can delete alignment',31,'delete_alignment'),(94,'Can add rule set',32,'add_ruleset'),(95,'Can change rule set',32,'change_ruleset'),(96,'Can delete rule set',32,'delete_ruleset'),(97,'Can add collate',33,'add_collate'),(98,'Can change collate',33,'change_collate'),(99,'Can delete collate',33,'delete_collate'),(100,'Can add witnesses cache',34,'add_witnessescache'),(101,'Can change witnesses cache',34,'change_witnessescache'),(102,'Can delete witnesses cache',34,'delete_witnessescache'),(103,'Can add task state',35,'add_taskmeta'),(104,'Can change task state',35,'change_taskmeta'),(105,'Can delete task state',35,'delete_taskmeta'),(106,'Can add saved group result',36,'add_tasksetmeta'),(107,'Can change saved group result',36,'change_tasksetmeta'),(108,'Can delete saved group result',36,'delete_tasksetmeta'),(109,'Can add interval',37,'add_intervalschedule'),(110,'Can change interval',37,'change_intervalschedule'),(111,'Can delete interval',37,'delete_intervalschedule'),(112,'Can add crontab',38,'add_crontabschedule'),(113,'Can change crontab',38,'change_crontabschedule'),(114,'Can delete crontab',38,'delete_crontabschedule'),(115,'Can add periodic tasks',39,'add_periodictasks'),(116,'Can change periodic tasks',39,'change_periodictasks'),(117,'Can delete periodic tasks',39,'delete_periodictasks'),(118,'Can add periodic task',40,'add_periodictask'),(119,'Can change periodic task',40,'change_periodictask'),(120,'Can delete periodic task',40,'delete_periodictask'),(121,'Can add worker',41,'add_workerstate'),(122,'Can change worker',41,'change_workerstate'),(123,'Can delete worker',41,'delete_workerstate'),(124,'Can add task',42,'add_taskstate'),(125,'Can change task',42,'change_taskstate'),(126,'Can delete task',42,'delete_taskstate'),(127,'Can add queue',43,'add_queue'),(128,'Can change queue',43,'change_queue'),(129,'Can delete queue',43,'delete_queue'),(130,'Can add message',44,'add_message'),(131,'Can change message',44,'change_message'),(132,'Can delete message',44,'delete_message');
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
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$15000$o2MHek2GjrCA$Ib+nFKYnEQE5Zjezxo9x5LLG6BW2DGYr7PwSUOs11FM=','2015-06-15 05:32:46.000000',1,'admin','','','admin@admin.com',1,1,'2014-05-17 12:18:16.093854');
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
  CONSTRAINT `group_id_refs_id_274b862c` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `user_id_refs_id_40c41112` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
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
  CONSTRAINT `permission_id_refs_id_35d9ac25` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `user_id_refs_id_4dc23c39` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
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
-- Table structure for table `celery_taskmeta`
--

DROP TABLE IF EXISTS `celery_taskmeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `celery_taskmeta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` varchar(255) COLLATE utf8_bin NOT NULL,
  `status` varchar(50) COLLATE utf8_bin NOT NULL,
  `result` longtext COLLATE utf8_bin,
  `date_done` datetime NOT NULL,
  `traceback` longtext COLLATE utf8_bin,
  `hidden` tinyint(1) NOT NULL,
  `meta` longtext COLLATE utf8_bin,
  PRIMARY KEY (`id`),
  UNIQUE KEY `task_id` (`task_id`),
  KEY `celery_taskmeta_2ff6b945` (`hidden`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `celery_taskmeta`
--

LOCK TABLES `celery_taskmeta` WRITE;
/*!40000 ALTER TABLE `celery_taskmeta` DISABLE KEYS */;
/*!40000 ALTER TABLE `celery_taskmeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `celery_tasksetmeta`
--

DROP TABLE IF EXISTS `celery_tasksetmeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `celery_tasksetmeta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskset_id` varchar(255) COLLATE utf8_bin NOT NULL,
  `result` longtext COLLATE utf8_bin NOT NULL,
  `date_done` datetime NOT NULL,
  `hidden` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `taskset_id` (`taskset_id`),
  KEY `celery_tasksetmeta_2ff6b945` (`hidden`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `celery_tasksetmeta`
--

LOCK TABLES `celery_tasksetmeta` WRITE;
/*!40000 ALTER TABLE `celery_tasksetmeta` DISABLE KEYS */;
/*!40000 ALTER TABLE `celery_tasksetmeta` ENABLE KEYS */;
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
  CONSTRAINT `community_id_refs_id_b9870869` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`),
  CONSTRAINT `partner_id_refs_id_8413bf6e` FOREIGN KEY (`partner_id`) REFERENCES `community_partner` (`id`)
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `det_tilerimage`
--

LOCK TABLES `det_tilerimage` WRITE;
/*!40000 ALTER TABLE `det_tilerimage` DISABLE KEYS */;
INSERT INTO `det_tilerimage` VALUES (1,'tiler_image/2/image/ff130r_SXtiSXS.jpg',2,2048,3072),(2,'tiler_image/3/image/ff130v_qQCLqsO.jpg',3,2048,3072);
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
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'permission','auth','permission'),(2,'group','auth','group'),(3,'user','auth','user'),(4,'content type','contenttypes','contenttype'),(5,'session','sessions','session'),(6,'site','sites','site'),(7,'log entry','admin','logentry'),(8,'community','api','community'),(9,'membership','api','membership'),(10,'entity','api','entity'),(11,'doc','api','doc'),(12,'text','api','text'),(13,'attr','api','attr'),(14,'header','api','header'),(15,'revision','api','revision'),(16,'tiler image','api','tilerimage'),(17,'tile','api','tile'),(18,'css','api','css'),(19,'schema','api','schema'),(20,'js','api','js'),(21,'refs decl','api','refsdecl'),(22,'task','api','task'),(23,'partner','api','partner'),(24,'community mapping','api','communitymapping'),(25,'user mapping','api','usermapping'),(26,'invitation','api','invitation'),(27,'action','api','action'),(28,'api user','api','apiuser'),(29,'modification','regularize','modification'),(30,'rule','regularize','rule'),(31,'alignment','regularize','alignment'),(32,'rule set','regularize','ruleset'),(33,'collate','regularize','collate'),(34,'witnesses cache','regularize','witnessescache'),(35,'task state','djcelery','taskmeta'),(36,'saved group result','djcelery','tasksetmeta'),(37,'interval','djcelery','intervalschedule'),(38,'crontab','djcelery','crontabschedule'),(39,'periodic tasks','djcelery','periodictasks'),(40,'periodic task','djcelery','periodictask'),(41,'worker','djcelery','workerstate'),(42,'task','djcelery','taskstate'),(43,'queue','djkombu','queue'),(44,'message','djkombu','message');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8_bin NOT NULL,
  `name` varchar(255) COLLATE utf8_bin NOT NULL,
  `applied` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2015-06-15 04:57:09'),(2,'auth','0001_initial','2015-06-15 04:57:29'),(3,'admin','0001_initial','2015-06-15 04:57:33'),(4,'api','0001_initial','2015-06-15 04:59:19'),(5,'sessions','0001_initial','2015-06-15 04:59:21'),(6,'sites','0001_initial','2015-06-15 04:59:22');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
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
INSERT INTO `django_session` VALUES ('kc9tot635aybaoxzihaq0er37nrmccar','ZmI3ODQ4Y2IyMWFlYTc4ZmY2ODA0ZjlhN2ZlNWFkMDdmZDlmOTk3ZDp7Il9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9pZCI6MX0=','2014-05-31 12:18:53.997151'),('x9rtytu5hg32n9h8lissd8c0732fr3ah','ZmE0NzhmNDYwOTgyZmFhOWJkZjU4ZTQ4NDI3OTZmNzM4MTViODBhNzp7Il9hdXRoX3VzZXJfaGFzaCI6IjBmNmJiMDI2MDRhMWVlOTdkNzZkNjhlYTcwYWU0YWM4YTVjZWQ3NDciLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjF9','2015-06-29 05:32:46.000000');
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

--
-- Table structure for table `djcelery_crontabschedule`
--

DROP TABLE IF EXISTS `djcelery_crontabschedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `djcelery_crontabschedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `minute` varchar(64) COLLATE utf8_bin NOT NULL,
  `hour` varchar(64) COLLATE utf8_bin NOT NULL,
  `day_of_week` varchar(64) COLLATE utf8_bin NOT NULL,
  `day_of_month` varchar(64) COLLATE utf8_bin NOT NULL,
  `month_of_year` varchar(64) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `djcelery_crontabschedule`
--

LOCK TABLES `djcelery_crontabschedule` WRITE;
/*!40000 ALTER TABLE `djcelery_crontabschedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `djcelery_crontabschedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `djcelery_intervalschedule`
--

DROP TABLE IF EXISTS `djcelery_intervalschedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `djcelery_intervalschedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `every` int(11) NOT NULL,
  `period` varchar(24) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `djcelery_intervalschedule`
--

LOCK TABLES `djcelery_intervalschedule` WRITE;
/*!40000 ALTER TABLE `djcelery_intervalschedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `djcelery_intervalschedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `djcelery_periodictask`
--

DROP TABLE IF EXISTS `djcelery_periodictask`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `djcelery_periodictask` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8_bin NOT NULL,
  `task` varchar(200) COLLATE utf8_bin NOT NULL,
  `interval_id` int(11) DEFAULT NULL,
  `crontab_id` int(11) DEFAULT NULL,
  `args` longtext COLLATE utf8_bin NOT NULL,
  `kwargs` longtext COLLATE utf8_bin NOT NULL,
  `queue` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `exchange` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `routing_key` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `expires` datetime DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL,
  `last_run_at` datetime DEFAULT NULL,
  `total_run_count` int(10) unsigned NOT NULL,
  `date_changed` datetime NOT NULL,
  `description` longtext COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `djcelery_periodictask_8905f60d` (`interval_id`),
  KEY `djcelery_periodictask_7280124f` (`crontab_id`),
  CONSTRAINT `crontab_id_refs_id_286da0d1` FOREIGN KEY (`crontab_id`) REFERENCES `djcelery_crontabschedule` (`id`),
  CONSTRAINT `interval_id_refs_id_1829f358` FOREIGN KEY (`interval_id`) REFERENCES `djcelery_intervalschedule` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `djcelery_periodictask`
--

LOCK TABLES `djcelery_periodictask` WRITE;
/*!40000 ALTER TABLE `djcelery_periodictask` DISABLE KEYS */;
/*!40000 ALTER TABLE `djcelery_periodictask` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `djcelery_periodictasks`
--

DROP TABLE IF EXISTS `djcelery_periodictasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `djcelery_periodictasks` (
  `ident` smallint(6) NOT NULL,
  `last_update` datetime NOT NULL,
  PRIMARY KEY (`ident`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `djcelery_periodictasks`
--

LOCK TABLES `djcelery_periodictasks` WRITE;
/*!40000 ALTER TABLE `djcelery_periodictasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `djcelery_periodictasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `djcelery_taskstate`
--

DROP TABLE IF EXISTS `djcelery_taskstate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `djcelery_taskstate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state` varchar(64) COLLATE utf8_bin NOT NULL,
  `task_id` varchar(36) COLLATE utf8_bin NOT NULL,
  `name` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `tstamp` datetime NOT NULL,
  `args` longtext COLLATE utf8_bin,
  `kwargs` longtext COLLATE utf8_bin,
  `eta` datetime DEFAULT NULL,
  `expires` datetime DEFAULT NULL,
  `result` longtext COLLATE utf8_bin,
  `traceback` longtext COLLATE utf8_bin,
  `runtime` double DEFAULT NULL,
  `retries` int(11) NOT NULL,
  `worker_id` int(11) DEFAULT NULL,
  `hidden` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `task_id` (`task_id`),
  KEY `djcelery_taskstate_5654bf12` (`state`),
  KEY `djcelery_taskstate_4da47e07` (`name`),
  KEY `djcelery_taskstate_abaacd02` (`tstamp`),
  KEY `djcelery_taskstate_cac6a03d` (`worker_id`),
  KEY `djcelery_taskstate_2ff6b945` (`hidden`),
  CONSTRAINT `worker_id_refs_id_6fd8ce95` FOREIGN KEY (`worker_id`) REFERENCES `djcelery_workerstate` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `djcelery_taskstate`
--

LOCK TABLES `djcelery_taskstate` WRITE;
/*!40000 ALTER TABLE `djcelery_taskstate` DISABLE KEYS */;
/*!40000 ALTER TABLE `djcelery_taskstate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `djcelery_workerstate`
--

DROP TABLE IF EXISTS `djcelery_workerstate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `djcelery_workerstate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hostname` varchar(255) COLLATE utf8_bin NOT NULL,
  `last_heartbeat` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hostname` (`hostname`),
  KEY `djcelery_workerstate_11e400ef` (`last_heartbeat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `djcelery_workerstate`
--

LOCK TABLES `djcelery_workerstate` WRITE;
/*!40000 ALTER TABLE `djcelery_workerstate` DISABLE KEYS */;
/*!40000 ALTER TABLE `djcelery_workerstate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `djkombu_message`
--

DROP TABLE IF EXISTS `djkombu_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `djkombu_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `visible` tinyint(1) NOT NULL,
  `sent_at` datetime DEFAULT NULL,
  `payload` longtext COLLATE utf8_bin NOT NULL,
  `queue_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `djkombu_message_5907bb86` (`visible`),
  KEY `djkombu_message_bc4c5ddc` (`sent_at`),
  KEY `djkombu_message_c80a9385` (`queue_id`),
  CONSTRAINT `queue_id_refs_id_88980102` FOREIGN KEY (`queue_id`) REFERENCES `djkombu_queue` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `djkombu_message`
--

LOCK TABLES `djkombu_message` WRITE;
/*!40000 ALTER TABLE `djkombu_message` DISABLE KEYS */;
INSERT INTO `djkombu_message` VALUES (1,0,'2015-06-15 06:21:17','{\"body\": \"gAJ9cQEoVQdleHBpcmVzcQJOVQN1dGNxA4hVBGFyZ3NxBFSoFwAAPD94bWwgdmVyc2lvbj0iMS4wIiA/PiAKPFRFSSB4bWxucz0iaHR0cDovL3d3dy50ZWktYy5vcmcvbnMvMS4wIiAgeG1sbnM6ZGV0PSJodHRwOi8vdGV4dHVhbGNvbW11bml0aWVzLnVzYXNrLmNhLyI+CiAJPHRlaUhlYWRlcj4KIAkJPGZpbGVEZXNjPgogCQkJPHRpdGxlU3RtdD4KIAkJCQk8dGl0bGU+RmFpcmZheDwvdGl0bGU+CiAJCQk8L3RpdGxlU3RtdD4KIAkJCTxwdWJsaWNhdGlvblN0bXQ+CiAJCQkJPHA+RHJhZnQgZm9yIFRleHR1YWwgQ29tbXVuaXRpZXMgc2l0ZTwvcD4KIAkJCTwvcHVibGljYXRpb25TdG10PgogCQkJPHNvdXJjZURlc2M+CiAJCQkJPGJpYmwgZGV0OmRvY3VtZW50PSJGYWlyZmF4Ij48L2JpYmw+CiAJCQk8L3NvdXJjZURlc2M+CiAJCTwvZmlsZURlc2M+CiAJCTxlbmNvZGluZ0Rlc2M+CiAgIAkJCTxyZWZzRGVjbCBkZXQ6ZG9jdW1lbnRSZWZzRGVjbD0iTWFudXNjcmlwdCIgIGRldDplbnRpdHlSZWZzRGVjbD0iU2ltcGxlIFBvZXRyeSI+CiAJIAkJCTxwPlRleHR1YWwgQ29tbXVuaXRpZXMgZGVjbGFyYXRpb25zPC9wPgogCSAJCTwvcmVmc0RlY2w+CiAJCTwvZW5jb2RpbmdEZXNjPgogCTwvdGVpSGVhZGVyPgoJPHRleHQ+CgkJPGJvZHk+CgkJPHBiIG49IjEzMHIiIGZhY3M9IkZGMTMwUi5KUEciLz4KCQkJPGxiLz48ZGl2IG49IkJvb2sgb2YgdGhlIER1Y2hlc3MiPgoJPGZ3IHBsYWNlPSJ0bSIgdHlwZT0icGFnZU51bSI+MTMwPC9mdz48bm90ZSAgdHlwZT0iZWQiIHJlc3A9IlBSIj5QZW5jaWwgZm9saWF0aW9uPC9ub3RlPgo8aGVhZCBuPSJUaXRsZSI+VGhlIGJvb2tlIG9mIHRoZSBEdWNoZXNzZTxub3RlIHBsYWNlPSJtYXJnaW4tcmlnaHQiPm1hZGUgYnkgR2VmZnJleQpDaGF3Y3llcjwvbm90ZT48L2hlYWQ+CjxsYi8+PGwgbj0iMSI+SSBIYXVlIGdyZXRlIHdvbmRlci8gYmUgdGhpcyBseWdodGU8L2w+CjxsYi8+PGwgbj0iMiI+SG93IHRoYXQgSSBseXZlLyBmb3IgZGF5IG5lIG55Z2h0ZTwvbD4KPGxiLz48bCBuPSIzIj5JIG1heSBuYXQgc2xlcGUvIHdlbCBueWdoIG5vZ2h0PC9sPgo8bGIvPjxsIG49IjQiPkkgaGF2ZSBzbyBtYW55LyBhbiB5ZGVsIHRob2dodDwvbD4KPGxiLz48bCBuPSI1Ij5QdXJlbHkvIGZvciBkZWZhdWx0ZSBvZiBzbGVwZTwvbD4KPGxiLz48bCBuPSI2Ij5UaGF0IGJ5IG15IHRyb3V0aGUvIEkgdGFrZSBubyBrZXBlPC9sPgo8bGIvPjxsIG49IjciPk9mIG5vbyB0aGluZ2UvIGhvdyBoeXQgY29tZXRoIG9yIGdvb3RoPC9sPgo8bGIvPjxsIG49IjgiPk5lIG1lIG55cyBubyB0aHluZ2UvIGxldmUgbm9yIGxvb3RoPC9sPgo8bGIvPjxsIG49IjkiPkFsIGlzIHlseWNoZSBnb29kZS8gdG8gbWU8L2w+CjxsYi8+PGwgbj0iMTAiPklveSBvciBzb3Jvd2UvIHdoZXJzbyBoeXQgYmU8L2w+CjxsYi8+PGwgbj0iMTEiPmZmb3IgSSBoYXVlIGZlbHluZ2UvIGluIG5vIHRoeW5nZTwvbD4KPGxiLz48bCBuPSIxMiI+QnV0IGFzIHl0IHdlcmUvIGEgbWFzZWQgdGh5bmdlPC9sPgo8bGIvPjxsIG49IjEzIj5BbHdheSBpbiBwb3ludC8gdG8gZmFsbGUgYSBkb3Z1bic8L2w+CjxsYi8+PGwgbj0iMTQiPmZmb3Igc29yd2Z1bC8geW1hZ3luYWNpb3VuJzwvbD4KPGxiLz48bCBuPSIxNSI+WXMgYWx3YXkgaG9vbHkvIGluIG15IG15bmRlPC9sPgo8bGIvPjxsIG49IjE2Ij5BbmQgd2VsIHllIHdvb3RlLyBhZ2F5bmVzIGt5bmRlPC9sPgo8bGIvPjxsIG49IjE3Ij5IeXQgd2VyZSB0byBseXZlbicvIGluIHRoeXMgd3lzZTwvbD4KPGxiLz48bCBuPSIxOCI+ZmZvciBuYXR1cmUvIHdvbGRlIG5hdCBzdWZmeXNlPC9sPgo8bGIvPjxsIG49IjE5Ij5UbyBub29uJyBlcnRoZXJseS8gY3JlYXR1cmU8L2w+CjxsYi8+PGwgbj0iMjAiPk5hdCBsb25nZSB0eW1lLyB0byBlbmR1cmU8L2w+CjxsYi8+PGwgbj0iMjEiPldpdGggb3V0ZSBzbGVwZS8gYW5kIGJlIGluIHNvcndlPC9sPgo8bGIvPjxsIG49IjIyIj5BbmQgSSBuZSBtYXkvIG5vIG55Z2h0IG5lIG1vcndlPC9sPgo8bGIvPjxsIG49IjIzIj5TbGVwZS8gYW5kIHRoeXMgTWVsYW5jb2x5ZTwvbD4KPGxiLz48bCBuPSIyNCI+QW5kIGRyZWRlIEkgaGF1ZS8gZm9yIHRvIGR5ZTwvbD4KPGxiLz48bCBuPSIyNSI+RGVmYXVsdGUgb2Ygc2xlcGUvIGFuZCBoZXZ5bmVzc2U8L2w+CjxsYi8+PGwgbj0iMjYiPkhhdGggbXkgc3Bpcml0ZS8gb2YgcXV5a25lc3NlPC9sPgo8bGIvPjxsIG49IjI3Ij5UaGF0IEkgaGF1ZSBsb3N0ZS8gYWwgbHVzdHloZWRlPC9sPgo8bGIvPjxsIG49IjI4Ij5TdWNoZSBmYW50YXNpZXMvIGJlbiBpbiBteW4nIGhlZGU8L2w+CjxsYi8+PGwgbj0iMjkiPlNvIEkgbm90IHdoYXQvIGlzIGJlc3QgdG9vIGRvbzwvbD4KPGxiLz48bCBuPSIzMCI+QnV0IG1lbicgbXlnaHQgYXhlbWUvIHdoeSBzb288L2w+CiAgPGxiLz48bCBuPSIzMSI+SSBtYXkgbm90IHNsZWVwZSwgYW5kIHdoYXQgbWUgaXM8L2w+CiAgPGxiLz48bCBuPSIzMiI+QnV0IG5hdGhsZXMsIHdob2UgYXNrZSB0aGlzPC9sPgogIDxsYi8+PGwgbj0iMzMiPkxlc2V0aCBoaXMgYXNraW5nIHRyZXdseTwvbD4KICA8bGIvPjxsIG49IjM0Ij5NeSBzZWx1ZW4gY2FuIG5vdCB0ZWxsIHdoeTwvbD4KICA8bGIvPjxsIG49IjM1Ij5UaGUgc291dGhlLCBidXQgdHJld2x5IGFzIEkgZ2Vzc2U8L2w+CiAgPGxiLz48bCBuPSIzNiI+SSBob2xkIGl0IGJlIGEgc2lja25lczwvbD4KICA8bGIvPjxsIG49IjM3Ij5UaGF0IEkgaGF1ZSBzdWZmcmVkIHRoaXMgZWlnaHQgeWVlcmU8L2w+CiAgPGxiLz48bCBuPSIzOCI+QW5kIHlldCBteSBib290ZSBpcyBuZXVlciB0aGUgbmVyZTwvbD4KPHBiIG49IjEzMHYiIGZhY3M9IkZGMTMwVi5KUEciLz4gICAgICAgICAgICAKICA8bGIvPjxsIG49IjM5Ij5Gb3IgdGhlcmUgaXMgcGhpc2ljaWVuIGJ1dCBvbmU8L2w+CiAgPGxiLz48bCBuPSI0MCI+VGhhdCBtYXkgbWUgaGVhbGUsIGJ1dCB0aGF0IGlzIGRvbmU8L2w+CiAgPGxiLz48bCBuPSI0MSI+UGFzc2Ugd2Ugb3VlciB2bnRpbGwgZWZ0ZTwvbD4KICA8bGIvPjxsIG49IjQyIj5UaGF0IHdpbGwgbm90IGJlLCBtb3RlIG5lZGVzIGJlIGxlZnRlPC9sPgogIDxsYi8+PGwgbj0iNDMiPk91ciBmaXJzdCBtYXRlciBpcyBnb29kIHRvIGtlcGU8L2w+CiAgPGxiLz48bCBuPSI0NCI+U29lIHdoZW4gSSBzYXdlIEkgbWlnaHQgbm90IHNsZXBlPC9sPgogIDxsYi8+PGwgbj0iNDUiPlRpbCBub3cgbGF0ZSwgdGhpcyBvdGhlciBuaWdodDwvbD4KICA8bGIvPjxsIG49IjQ2Ij5WcG9uIG15IGJlZGRlIEkgc2F0ZSB2cHJpZ2h0PC9sPgogIDxsYi8+PGwgbj0iNDciPkFuZCBiYWRlIG9uZSByZWNoZSBtZSBhIGJvb2tlPC9sPgogIDxsYi8+PGwgbj0iNDgiPkEgUm9tYXVuY2UsIGFuZCBpdCBtZSB0b2tlPC9sPgogIDxsYi8+PGwgbj0iNDkiPlRvIHJlZGUsIGFuZCBkcml1ZSB0aGUgbmlnaHQgYXdheTwvbD4KICA8bGIvPjxsIG49IjUwIj5Gb3IgbWUgdGhvdWdodCBpdCBiZXRlciBwbGF5PC9sPgogIDxsYi8+PGwgbj0iNTEiPlRoZW4gcGxheSBlaXRoZXIgYXQgQ2hlc3NlIG9yIHRhYmxlczwvbD4KICA8bGIvPjxsIG49IjUyIj5BbmQgaW4gdGhpcyBib2tlIHdlcmUgd3JpdHRlbiBmYWJsZXM8L2w+CiAgPGxiLz48bCBuPSI1MyI+VGhhdCBDbGVya2VzIGhhZCBpbiBvbGRlIHR5bWU8L2w+CiAgPGxiLz48bCBuPSI1NCI+QW5kIG90aGVyIHBvZXRzIHB1dCBpbiByaW1lPC9sPgogIDxsYi8+PGwgbj0iNTUiPlRvIHJlZGUsIGFuZCBmb3IgdG8gYmUgaW4gbWluZGU8L2w+CiAgPGxiLz48bCBuPSI1NiI+V2hpbGUgbWVuIGxvdWVkIHRoZSBsYXdlIGluIGtpbmRlPC9sPgogIDxsYi8+PGwgbj0iNTciPlRoaXMgYm9rZSBuZSBzcGVha2UsIGJ1dCBvZiBzdWNoIHRoaW5nZXM8L2w+CiAgPGxiLz48bCBuPSI1OCI+T2YgcXVlbmVzIGxpdWVzLCBhbmQgb2Yga2luZ3M8L2w+CiAgPGxiLz48bCBuPSI1OSI+QW5kIG1hbnkgb3RoZXIgdGhpbmdzIHNtYWxsZTwvbD4KICA8bGIvPjxsIG49IjYwIj5BbW9uZ2UgYWxsIHRoaXMgSSBmb25kZSBhIHRhbGU8L2w+CiAgPGxiLz48bCBuPSI2MSI+VGhhdCBtZSB0aG91Z2h0IGEgd29uZGVyIHRoaW5nLjwvbD4KICA8bGIvPjxsIG49IjYyIj5UaGlzIHdhcyB0aGUgdGFsZTogVGhlcmUgd2FzIGEga2luZzwvbD4KICA8bGIvPjxsIG49IjYzIj5UaGF0IGhpZ2h0IFNleWVzLCBhbmQgaGFkIGEgd2lmZTwvbD4KICA8bGIvPjxsIG49IjY0Ij5UaGUgYmVzdCB0aGF0IG1pZ2h0IGJlYXJlIGx5ZmU8L2w+CiAgPGxiLz48bCBuPSI2NSI+QW5kIHRoaXMgcXVlbmUgaGlnaHQgQWxjeW9uZTwvbD4KICA8bGIvPjxsIG49IjY2Ij5Tb2UgaXQgYmVmaWxsLCB0aGVyZWFmdGVyIHNvb25lPC9sPgogIDxsYi8+PGwgbj0iNjciPlRoaXMga2luZyB3b2xsIHdlbmRlbiBvdWVyIHNlZTwvbD4KICA8bGIvPjxsIG49IjY4Ij5UbyB0ZWxsZW4gc2hvcnRseSwgd2hhbiB0aGF0IGhlPC9sPgogIDxsYi8+PGwgbj0iNjkiPldhcyBpbiB0aGUgc2VlLCB0aHVzIGluIHRoaXMgd2lzZTwvbD4KICA8bGIvPjxsIG49IjcwIj5Tb2NoZSBhIHRlbXBlc3QgZ2FuIHRvIHJpc2U8L2w+CiAgPGxiLz48bCBuPSI3MSI+VGhhdCBicmFrZSBoZXIgbWFzdGUsIGFuZCBtYWRlIGl0IGZhbDwvbD4KICA8bGIvPjxsIG49IjcyIj5BbmQgY2xlZnQgdGhlciBzaGlwLCBhbmQgZHJlaW50IGhlbSBhbGw8L2w+CiAgPGxiLz48bCBuPSI3MyI+VGhhdCBuZXVlciB3YXMgZm91bmRlLCBhcyBpdCB0ZWxsZXM8L2w+CiAgPGxiLz48bCBuPSI3NCI+Qm9yZGUgbmUgbWFuLCBuZSBub3RoaW5nIGVsbGVzPC9sPgogIDxsYi8+PGwgbj0iNzUiPlJpZ2h0IHRodXMgdGhpcyBraW5nIFNleWVzIGxvc3RlIGhpcyBsaWZlPC9sPgogIDxsYi8+PGwgbj0iNzYiPk5vdyBmb3IgdG8gc3BlYWtlIG9mIEFsY3lvbmUgaGlzIHdpZmU8L2w+CiAgPGxiLz48bCBuPSI3NyI+VGhpcyBMYWR5IHRoYXQgd2FzIGxlZnQgYXQgaG9tZTwvbD4KICA8bGIvPjxsIG49Ijc4Ij5IYXRoIHdvbmRlciwgdGhhdCB0aGUga2luZyBuZSBjb21lPC9sPgogIDxsYi8+PGwgbj0iNzkiPkhvbWUsIGZvciBpdCB3YXMgYSBsb25nIHRlcm1lPC9sPgogIDxsYi8+PGwgbj0iODAiPkFub25lIGhlciBoZXJ0ZSBiZWdhbiB0byB5ZXJuZTwvbD4KICA8bGIvPjxsIG49IjgxIj5BbmQgZm9yIHRoYXQgaGVyIHRob3VnaHQgZXVlcm1vPC9sPgogIDxsYi8+PGwgbj0iODIiPkl0IHdhcyBub3Qgd2VsZSwgaGVyIHRob3VnaHQgc29lPC9sPgogIDxsYi8+PGwgbj0iODMiPlNoZSBsb25nZWQgc29lIGFmdGVyIHRoZSBraW5nPC9sPgogIDxsYi8+PGwgbj0iODQiPlRoYXQgY2VydGVzIGl0IHdlcmUgYSBwaXRvdXMgdGhpbmc8L2w+CiAgPGxiLz48bCBuPSI4NSI+VG8gdGVsbCBoZXIgaGFydGVseSBzb3Jvd2Z1bGwgbGlmZTwvbD4KICA8bGIvPjxsIG49Ijg2Ij5UaGF0IHNoZSBoYWQsIHRoaXMgbm9ibGUgd2lmZTwvbD4KICA8bGIvPjxsIG49Ijg3Ij5Gb3IgaGltIGFsYXMsIHNoZSBsb3VlZCBhbGRlcmJlc3RlPC9sPgogIDxsYi8+PGwgbj0iODgiPkFub25lIHNoZSBzZW50IGJvdGggZWVzdGUgYW5kIHdlc3RlPC9sPgogIDxsYi8+PGwgbj0iODkiPlRvIHNla2UgaGltLCBidXQgdGhleSBmb3VuZGUgbm91Z2h0PC9sPgogIDxsYi8+PGwgbj0iOTAiPkFsYXMgKHF1b3RoIHNoZWUpIHRoYXQgSSB3YXMgd3JvdWdodDwvbD4KICA8bGIvPjxsIG49IjkxIj5BbmQgd2hlcmUgbXkgbG9yZCBteSBsb3VlIGJlIGRlZWQ6PC9sPgogIDxsYi8+PGwgbj0iOTIiPkNlcnRlcyBJIHdpbGwgbmV1ZXIgZWF0ZSBicmVlZGU8L2w+CiAgPGxiLz48bCBuPSI5MyI+SSBtYWtlIGEgdW93ZSB0byBteSBnb2QgaGVyZTwvbD4KICA8bGIvPjxsIG49Ijk0Ij5CdXQgSSBtb3dlIG9mIG15IExvcmQgaGVyZS48L2w+CiAgPGxiLz48bCBuPSI5NSI+U29jaGUgc29yb3dlIHRoaXMgTGFkeSB0byBoZXIgdG9rZTwvbD4KICA8bGIvPjxsIG49Ijk2Ij5UaGF0IHRyZXdseSBJIHdoaWNoIG1hZGUgdGhpcyBib29rZTxmdyB0eXBlPSJjYXRjaCIgcGxhY2U9ImJyIj5bQ2F0Y2h3b3JkOl1IYWQgc3VjaDwvZnc+PC9sPgogIDwvZGl2PgogIAk8L2JvZHk+Cgk8L3RleHQ+CjwvVEVJPgpxBWNkamFuZ28uZGIubW9kZWxzLmJhc2UKbW9kZWxfdW5waWNrbGUKcQZVA2FwaXEHVQlDb21tdW5pdHlxCIZdY2RqYW5nby5kYi5tb2RlbHMuYmFzZQpzaW1wbGVfY2xhc3NfZmFjdG9yeQpxCYdScQp9cQsoVQtkZXNjcmlwdGlvbnEMWCgAAABBIHNpbXBsZSBzcGVjaW1lbiB0byBzaG93IHdoYXQgVEMgY2FuIGRvVQZfc3RhdGVxDWNkamFuZ28uZGIubW9kZWxzLmJhc2UKTW9kZWxTdGF0ZQpxDimBcQ99cRAoVQZhZGRpbmdxEYlVAmRicRJVB2RlZmF1bHRxE3ViVQlsb25nX25hbWVxFFgcAAAAQm9vayBvZiB0aGUgRHVjaGVzcyBTcGVjaW1lblUEYWJicnEVWAQAAABCRDAxVQRmb250cRZYAAAAAFUCaWRxF4oBAlUEbmFtZXEYWAoAAABTcGVjaW1lbkJEdWKGcRlVBWNob3JkcRpOVQljYWxsYmFja3NxG05VCGVycmJhY2tzcRxOVQd0YXNrc2V0cR1OaBdVJDYyMDQzMThjLTc2YWMtNGFhZC1iODE0LWZiNjU5MDc0OWY4OHEeVQdyZXRyaWVzcR9LAFUEdGFza3EgVRdhcGkudGFza3MuYWRkX3RleHRfZmlsZXEhVQl0aW1lbGltaXRxIk5OhlUDZXRhcSNOVQZrd2FyZ3NxJH1xJXUu\", \"headers\": {}, \"content-type\": \"application/x-python-serialize\", \"properties\": {\"body_encoding\": \"base64\", \"correlation_id\": \"6204318c-76ac-4aad-b814-fb6590749f88\", \"reply_to\": \"07b63b84-8d1a-3e2a-9e7e-11806a56d47f\", \"delivery_info\": {\"priority\": 0, \"routing_key\": \"celery\", \"exchange\": \"celery\"}, \"delivery_mode\": 2, \"delivery_tag\": \"5ec7005c-88a6-4c88-810a-edd67a2906a3\"}, \"content-encoding\": \"binary\"}',1),(2,1,'2015-06-15 06:21:21','{\"body\": \"gAJ9cQEoVQZzdGF0dXNxAlUHU1RBUlRFRHEDVQl0cmFjZWJhY2txBE5VBnJlc3VsdHEFfXEGKFUIaG9zdG5hbWVxB1UmY2VsZXJ5QFhpYW9oYW4tWmhhbmdzLU1hY0Jvb2tQcm8ubG9jYWxxCFUDcGlkcQlNyYJ1VQd0YXNrX2lkcQpVJDYyMDQzMThjLTc2YWMtNGFhZC1iODE0LWZiNjU5MDc0OWY4OHELVQhjaGlsZHJlbnEMXXUu\", \"headers\": {}, \"content-type\": \"application/x-python-serialize\", \"properties\": {\"body_encoding\": \"base64\", \"correlation_id\": \"6204318c-76ac-4aad-b814-fb6590749f88\", \"delivery_mode\": 2, \"delivery_info\": {\"priority\": 0, \"routing_key\": \"6204318c76ac4aadb814fb6590749f88\", \"exchange\": \"celeryresults\"}, \"delivery_tag\": \"e1d08266-3a5d-4e0f-ad9b-88c48c65bf31\"}, \"content-encoding\": \"binary\"}',3),(3,1,'2015-06-15 06:21:24','{\"body\": \"gAJ9cQEoVQZzdGF0dXNxAlUHU1VDQ0VTU3EDVQl0cmFjZWJhY2txBE5VBnJlc3VsdHEFTlUHdGFza19pZHEGVSQ2MjA0MzE4Yy03NmFjLTRhYWQtYjgxNC1mYjY1OTA3NDlmODhxB1UIY2hpbGRyZW5xCF11Lg==\", \"headers\": {}, \"content-type\": \"application/x-python-serialize\", \"properties\": {\"body_encoding\": \"base64\", \"correlation_id\": \"6204318c-76ac-4aad-b814-fb6590749f88\", \"delivery_mode\": 2, \"delivery_info\": {\"priority\": 0, \"routing_key\": \"6204318c76ac4aadb814fb6590749f88\", \"exchange\": \"celeryresults\"}, \"delivery_tag\": \"827a7824-e5d5-4398-8e3a-546bb2e6dbb2\"}, \"content-encoding\": \"binary\"}',3),(4,0,'2015-06-15 06:21:38','{\"body\": \"gAJ9cQEoVQdleHBpcmVzcQJOVQN1dGNxA4hVBGFyZ3NxBGNkamFuZ28uZGIubW9kZWxzLmJhc2UKbW9kZWxfdW5waWNrbGUKcQVVA2FwaXEGVQNEb2NxB4ZdY2RqYW5nby5kYi5tb2RlbHMuYmFzZQpzaW1wbGVfY2xhc3NfZmFjdG9yeQpxCIdScQl9cQooVQNyZ3RxC4oCyABVBG5hbWVxDFgHAAAARmFpcmZheFUKY3VyX3Jldl9pZHENTlUGX3N0YXRlcQ5jZGphbmdvLmRiLm1vZGVscy5iYXNlCk1vZGVsU3RhdGUKcQ8pgXEQfXERKFUGYWRkaW5ncRKJVQJkYnETVQdkZWZhdWx0cRR1YlUFbGFiZWxxFVgIAAAAZG9jdW1lbnRVA2xmdHEWigEBVQVkZXB0aHEXigEBVQd0cmVlX2lkcRiKAQFVAmlkcRmKAQF1YlU/L1VzZXJzL3h6aGFuZy9wcm9qZWN0L2FwaS1vbGQvc3RhdGljL21lZGlhLzEzODA2MzMwMDU4MzkxODQ1NDc4cRqGcRtVBWNob3JkcRxOVQljYWxsYmFja3NxHU5VCGVycmJhY2tzcR5OVQd0YXNrc2V0cR9OaBlVJGU3ZmYyZjNmLTU0OGUtNDhmYS1hODY1LWE0ZWIyNjE4MzdkN3EgVQdyZXRyaWVzcSFLAFUEdGFza3EiVRdhcGkudGFza3MuYWRkX2ltYWdlX3ppcHEjVQl0aW1lbGltaXRxJE5OhlUDZXRhcSVOVQZrd2FyZ3NxJn1xJ3Uu\", \"headers\": {}, \"content-type\": \"application/x-python-serialize\", \"properties\": {\"body_encoding\": \"base64\", \"correlation_id\": \"e7ff2f3f-548e-48fa-a865-a4eb261837d7\", \"reply_to\": \"07b63b84-8d1a-3e2a-9e7e-11806a56d47f\", \"delivery_info\": {\"priority\": 0, \"routing_key\": \"celery\", \"exchange\": \"celery\"}, \"delivery_mode\": 2, \"delivery_tag\": \"b04db832-6ec2-4ea3-aafa-8be03a2498de\"}, \"content-encoding\": \"binary\"}',1),(5,1,'2015-06-15 06:21:41','{\"body\": \"gAJ9cQEoVQZzdGF0dXNxAlUHU1RBUlRFRHEDVQl0cmFjZWJhY2txBE5VBnJlc3VsdHEFfXEGKFUIaG9zdG5hbWVxB1UmY2VsZXJ5QFhpYW9oYW4tWmhhbmdzLU1hY0Jvb2tQcm8ubG9jYWxxCFUDcGlkcQlNyoJ1VQd0YXNrX2lkcQpVJGU3ZmYyZjNmLTU0OGUtNDhmYS1hODY1LWE0ZWIyNjE4MzdkN3ELVQhjaGlsZHJlbnEMXXUu\", \"headers\": {}, \"content-type\": \"application/x-python-serialize\", \"properties\": {\"body_encoding\": \"base64\", \"correlation_id\": \"e7ff2f3f-548e-48fa-a865-a4eb261837d7\", \"delivery_mode\": 2, \"delivery_info\": {\"priority\": 0, \"routing_key\": \"e7ff2f3f548e48faa865a4eb261837d7\", \"exchange\": \"celeryresults\"}, \"delivery_tag\": \"fcbb76e1-8b81-4bd5-b0f4-0e06ae5b6939\"}, \"content-encoding\": \"binary\"}',4),(6,1,'2015-06-15 06:21:42','{\"body\": \"gAJ9cQEoVQZzdGF0dXNxAlUHU1VDQ0VTU3EDVQl0cmFjZWJhY2txBE5VBnJlc3VsdHEFTlUHdGFza19pZHEGVSRlN2ZmMmYzZi01NDhlLTQ4ZmEtYTg2NS1hNGViMjYxODM3ZDdxB1UIY2hpbGRyZW5xCF11Lg==\", \"headers\": {}, \"content-type\": \"application/x-python-serialize\", \"properties\": {\"body_encoding\": \"base64\", \"correlation_id\": \"e7ff2f3f-548e-48fa-a865-a4eb261837d7\", \"delivery_mode\": 2, \"delivery_info\": {\"priority\": 0, \"routing_key\": \"e7ff2f3f548e48faa865a4eb261837d7\", \"exchange\": \"celeryresults\"}, \"delivery_tag\": \"6a0f8dbf-7c25-4934-a679-27ee71c7a8fa\"}, \"content-encoding\": \"binary\"}',4),(7,0,'2015-06-15 06:29:51','{\"body\": \"gAJ9cQEoVQdleHBpcmVzcQJOVQN1dGNxA4hVBGFyZ3NxBFSoFwAAPD94bWwgdmVyc2lvbj0iMS4wIiA/PiAKPFRFSSB4bWxucz0iaHR0cDovL3d3dy50ZWktYy5vcmcvbnMvMS4wIiAgeG1sbnM6ZGV0PSJodHRwOi8vdGV4dHVhbGNvbW11bml0aWVzLnVzYXNrLmNhLyI+CiAJPHRlaUhlYWRlcj4KIAkJPGZpbGVEZXNjPgogCQkJPHRpdGxlU3RtdD4KIAkJCQk8dGl0bGU+RmFpcmZheDwvdGl0bGU+CiAJCQk8L3RpdGxlU3RtdD4KIAkJCTxwdWJsaWNhdGlvblN0bXQ+CiAJCQkJPHA+RHJhZnQgZm9yIFRleHR1YWwgQ29tbXVuaXRpZXMgc2l0ZTwvcD4KIAkJCTwvcHVibGljYXRpb25TdG10PgogCQkJPHNvdXJjZURlc2M+CiAJCQkJPGJpYmwgZGV0OmRvY3VtZW50PSJGYWlyZmF4Ij48L2JpYmw+CiAJCQk8L3NvdXJjZURlc2M+CiAJCTwvZmlsZURlc2M+CiAJCTxlbmNvZGluZ0Rlc2M+CiAgIAkJCTxyZWZzRGVjbCBkZXQ6ZG9jdW1lbnRSZWZzRGVjbD0iTWFudXNjcmlwdCIgIGRldDplbnRpdHlSZWZzRGVjbD0iU2ltcGxlIFBvZXRyeSI+CiAJIAkJCTxwPlRleHR1YWwgQ29tbXVuaXRpZXMgZGVjbGFyYXRpb25zPC9wPgogCSAJCTwvcmVmc0RlY2w+CiAJCTwvZW5jb2RpbmdEZXNjPgogCTwvdGVpSGVhZGVyPgoJPHRleHQ+CgkJPGJvZHk+CgkJPHBiIG49IjEzMHIiIGZhY3M9IkZGMTMwUi5KUEciLz4KCQkJPGxiLz48ZGl2IG49IkJvb2sgb2YgdGhlIER1Y2hlc3MiPgoJPGZ3IHBsYWNlPSJ0bSIgdHlwZT0icGFnZU51bSI+MTMwPC9mdz48bm90ZSAgdHlwZT0iZWQiIHJlc3A9IlBSIj5QZW5jaWwgZm9saWF0aW9uPC9ub3RlPgo8aGVhZCBuPSJUaXRsZSI+VGhlIGJvb2tlIG9mIHRoZSBEdWNoZXNzZTxub3RlIHBsYWNlPSJtYXJnaW4tcmlnaHQiPm1hZGUgYnkgR2VmZnJleQpDaGF3Y3llcjwvbm90ZT48L2hlYWQ+CjxsYi8+PGwgbj0iMSI+SSBIYXVlIGdyZXRlIHdvbmRlci8gYmUgdGhpcyBseWdodGU8L2w+CjxsYi8+PGwgbj0iMiI+SG93IHRoYXQgSSBseXZlLyBmb3IgZGF5IG5lIG55Z2h0ZTwvbD4KPGxiLz48bCBuPSIzIj5JIG1heSBuYXQgc2xlcGUvIHdlbCBueWdoIG5vZ2h0PC9sPgo8bGIvPjxsIG49IjQiPkkgaGF2ZSBzbyBtYW55LyBhbiB5ZGVsIHRob2dodDwvbD4KPGxiLz48bCBuPSI1Ij5QdXJlbHkvIGZvciBkZWZhdWx0ZSBvZiBzbGVwZTwvbD4KPGxiLz48bCBuPSI2Ij5UaGF0IGJ5IG15IHRyb3V0aGUvIEkgdGFrZSBubyBrZXBlPC9sPgo8bGIvPjxsIG49IjciPk9mIG5vbyB0aGluZ2UvIGhvdyBoeXQgY29tZXRoIG9yIGdvb3RoPC9sPgo8bGIvPjxsIG49IjgiPk5lIG1lIG55cyBubyB0aHluZ2UvIGxldmUgbm9yIGxvb3RoPC9sPgo8bGIvPjxsIG49IjkiPkFsIGlzIHlseWNoZSBnb29kZS8gdG8gbWU8L2w+CjxsYi8+PGwgbj0iMTAiPklveSBvciBzb3Jvd2UvIHdoZXJzbyBoeXQgYmU8L2w+CjxsYi8+PGwgbj0iMTEiPmZmb3IgSSBoYXVlIGZlbHluZ2UvIGluIG5vIHRoeW5nZTwvbD4KPGxiLz48bCBuPSIxMiI+QnV0IGFzIHl0IHdlcmUvIGEgbWFzZWQgdGh5bmdlPC9sPgo8bGIvPjxsIG49IjEzIj5BbHdheSBpbiBwb3ludC8gdG8gZmFsbGUgYSBkb3Z1bic8L2w+CjxsYi8+PGwgbj0iMTQiPmZmb3Igc29yd2Z1bC8geW1hZ3luYWNpb3VuJzwvbD4KPGxiLz48bCBuPSIxNSI+WXMgYWx3YXkgaG9vbHkvIGluIG15IG15bmRlPC9sPgo8bGIvPjxsIG49IjE2Ij5BbmQgd2VsIHllIHdvb3RlLyBhZ2F5bmVzIGt5bmRlPC9sPgo8bGIvPjxsIG49IjE3Ij5IeXQgd2VyZSB0byBseXZlbicvIGluIHRoeXMgd3lzZTwvbD4KPGxiLz48bCBuPSIxOCI+ZmZvciBuYXR1cmUvIHdvbGRlIG5hdCBzdWZmeXNlPC9sPgo8bGIvPjxsIG49IjE5Ij5UbyBub29uJyBlcnRoZXJseS8gY3JlYXR1cmU8L2w+CjxsYi8+PGwgbj0iMjAiPk5hdCBsb25nZSB0eW1lLyB0byBlbmR1cmU8L2w+CjxsYi8+PGwgbj0iMjEiPldpdGggb3V0ZSBzbGVwZS8gYW5kIGJlIGluIHNvcndlPC9sPgo8bGIvPjxsIG49IjIyIj5BbmQgSSBuZSBtYXkvIG5vIG55Z2h0IG5lIG1vcndlPC9sPgo8bGIvPjxsIG49IjIzIj5TbGVwZS8gYW5kIHRoeXMgTWVsYW5jb2x5ZTwvbD4KPGxiLz48bCBuPSIyNCI+QW5kIGRyZWRlIEkgaGF1ZS8gZm9yIHRvIGR5ZTwvbD4KPGxiLz48bCBuPSIyNSI+RGVmYXVsdGUgb2Ygc2xlcGUvIGFuZCBoZXZ5bmVzc2U8L2w+CjxsYi8+PGwgbj0iMjYiPkhhdGggbXkgc3Bpcml0ZS8gb2YgcXV5a25lc3NlPC9sPgo8bGIvPjxsIG49IjI3Ij5UaGF0IEkgaGF1ZSBsb3N0ZS8gYWwgbHVzdHloZWRlPC9sPgo8bGIvPjxsIG49IjI4Ij5TdWNoZSBmYW50YXNpZXMvIGJlbiBpbiBteW4nIGhlZGU8L2w+CjxsYi8+PGwgbj0iMjkiPlNvIEkgbm90IHdoYXQvIGlzIGJlc3QgdG9vIGRvbzwvbD4KPGxiLz48bCBuPSIzMCI+QnV0IG1lbicgbXlnaHQgYXhlbWUvIHdoeSBzb288L2w+CiAgPGxiLz48bCBuPSIzMSI+SSBtYXkgbm90IHNsZWVwZSwgYW5kIHdoYXQgbWUgaXM8L2w+CiAgPGxiLz48bCBuPSIzMiI+QnV0IG5hdGhsZXMsIHdob2UgYXNrZSB0aGlzPC9sPgogIDxsYi8+PGwgbj0iMzMiPkxlc2V0aCBoaXMgYXNraW5nIHRyZXdseTwvbD4KICA8bGIvPjxsIG49IjM0Ij5NeSBzZWx1ZW4gY2FuIG5vdCB0ZWxsIHdoeTwvbD4KICA8bGIvPjxsIG49IjM1Ij5UaGUgc291dGhlLCBidXQgdHJld2x5IGFzIEkgZ2Vzc2U8L2w+CiAgPGxiLz48bCBuPSIzNiI+SSBob2xkIGl0IGJlIGEgc2lja25lczwvbD4KICA8bGIvPjxsIG49IjM3Ij5UaGF0IEkgaGF1ZSBzdWZmcmVkIHRoaXMgZWlnaHQgeWVlcmU8L2w+CiAgPGxiLz48bCBuPSIzOCI+QW5kIHlldCBteSBib290ZSBpcyBuZXVlciB0aGUgbmVyZTwvbD4KPHBiIG49IjEzMHYiIGZhY3M9IkZGMTMwVi5KUEciLz4gICAgICAgICAgICAKICA8bGIvPjxsIG49IjM5Ij5Gb3IgdGhlcmUgaXMgcGhpc2ljaWVuIGJ1dCBvbmU8L2w+CiAgPGxiLz48bCBuPSI0MCI+VGhhdCBtYXkgbWUgaGVhbGUsIGJ1dCB0aGF0IGlzIGRvbmU8L2w+CiAgPGxiLz48bCBuPSI0MSI+UGFzc2Ugd2Ugb3VlciB2bnRpbGwgZWZ0ZTwvbD4KICA8bGIvPjxsIG49IjQyIj5UaGF0IHdpbGwgbm90IGJlLCBtb3RlIG5lZGVzIGJlIGxlZnRlPC9sPgogIDxsYi8+PGwgbj0iNDMiPk91ciBmaXJzdCBtYXRlciBpcyBnb29kIHRvIGtlcGU8L2w+CiAgPGxiLz48bCBuPSI0NCI+U29lIHdoZW4gSSBzYXdlIEkgbWlnaHQgbm90IHNsZXBlPC9sPgogIDxsYi8+PGwgbj0iNDUiPlRpbCBub3cgbGF0ZSwgdGhpcyBvdGhlciBuaWdodDwvbD4KICA8bGIvPjxsIG49IjQ2Ij5WcG9uIG15IGJlZGRlIEkgc2F0ZSB2cHJpZ2h0PC9sPgogIDxsYi8+PGwgbj0iNDciPkFuZCBiYWRlIG9uZSByZWNoZSBtZSBhIGJvb2tlPC9sPgogIDxsYi8+PGwgbj0iNDgiPkEgUm9tYXVuY2UsIGFuZCBpdCBtZSB0b2tlPC9sPgogIDxsYi8+PGwgbj0iNDkiPlRvIHJlZGUsIGFuZCBkcml1ZSB0aGUgbmlnaHQgYXdheTwvbD4KICA8bGIvPjxsIG49IjUwIj5Gb3IgbWUgdGhvdWdodCBpdCBiZXRlciBwbGF5PC9sPgogIDxsYi8+PGwgbj0iNTEiPlRoZW4gcGxheSBlaXRoZXIgYXQgQ2hlc3NlIG9yIHRhYmxlczwvbD4KICA8bGIvPjxsIG49IjUyIj5BbmQgaW4gdGhpcyBib2tlIHdlcmUgd3JpdHRlbiBmYWJsZXM8L2w+CiAgPGxiLz48bCBuPSI1MyI+VGhhdCBDbGVya2VzIGhhZCBpbiBvbGRlIHR5bWU8L2w+CiAgPGxiLz48bCBuPSI1NCI+QW5kIG90aGVyIHBvZXRzIHB1dCBpbiByaW1lPC9sPgogIDxsYi8+PGwgbj0iNTUiPlRvIHJlZGUsIGFuZCBmb3IgdG8gYmUgaW4gbWluZGU8L2w+CiAgPGxiLz48bCBuPSI1NiI+V2hpbGUgbWVuIGxvdWVkIHRoZSBsYXdlIGluIGtpbmRlPC9sPgogIDxsYi8+PGwgbj0iNTciPlRoaXMgYm9rZSBuZSBzcGVha2UsIGJ1dCBvZiBzdWNoIHRoaW5nZXM8L2w+CiAgPGxiLz48bCBuPSI1OCI+T2YgcXVlbmVzIGxpdWVzLCBhbmQgb2Yga2luZ3M8L2w+CiAgPGxiLz48bCBuPSI1OSI+QW5kIG1hbnkgb3RoZXIgdGhpbmdzIHNtYWxsZTwvbD4KICA8bGIvPjxsIG49IjYwIj5BbW9uZ2UgYWxsIHRoaXMgSSBmb25kZSBhIHRhbGU8L2w+CiAgPGxiLz48bCBuPSI2MSI+VGhhdCBtZSB0aG91Z2h0IGEgd29uZGVyIHRoaW5nLjwvbD4KICA8bGIvPjxsIG49IjYyIj5UaGlzIHdhcyB0aGUgdGFsZTogVGhlcmUgd2FzIGEga2luZzwvbD4KICA8bGIvPjxsIG49IjYzIj5UaGF0IGhpZ2h0IFNleWVzLCBhbmQgaGFkIGEgd2lmZTwvbD4KICA8bGIvPjxsIG49IjY0Ij5UaGUgYmVzdCB0aGF0IG1pZ2h0IGJlYXJlIGx5ZmU8L2w+CiAgPGxiLz48bCBuPSI2NSI+QW5kIHRoaXMgcXVlbmUgaGlnaHQgQWxjeW9uZTwvbD4KICA8bGIvPjxsIG49IjY2Ij5Tb2UgaXQgYmVmaWxsLCB0aGVyZWFmdGVyIHNvb25lPC9sPgogIDxsYi8+PGwgbj0iNjciPlRoaXMga2luZyB3b2xsIHdlbmRlbiBvdWVyIHNlZTwvbD4KICA8bGIvPjxsIG49IjY4Ij5UbyB0ZWxsZW4gc2hvcnRseSwgd2hhbiB0aGF0IGhlPC9sPgogIDxsYi8+PGwgbj0iNjkiPldhcyBpbiB0aGUgc2VlLCB0aHVzIGluIHRoaXMgd2lzZTwvbD4KICA8bGIvPjxsIG49IjcwIj5Tb2NoZSBhIHRlbXBlc3QgZ2FuIHRvIHJpc2U8L2w+CiAgPGxiLz48bCBuPSI3MSI+VGhhdCBicmFrZSBoZXIgbWFzdGUsIGFuZCBtYWRlIGl0IGZhbDwvbD4KICA8bGIvPjxsIG49IjcyIj5BbmQgY2xlZnQgdGhlciBzaGlwLCBhbmQgZHJlaW50IGhlbSBhbGw8L2w+CiAgPGxiLz48bCBuPSI3MyI+VGhhdCBuZXVlciB3YXMgZm91bmRlLCBhcyBpdCB0ZWxsZXM8L2w+CiAgPGxiLz48bCBuPSI3NCI+Qm9yZGUgbmUgbWFuLCBuZSBub3RoaW5nIGVsbGVzPC9sPgogIDxsYi8+PGwgbj0iNzUiPlJpZ2h0IHRodXMgdGhpcyBraW5nIFNleWVzIGxvc3RlIGhpcyBsaWZlPC9sPgogIDxsYi8+PGwgbj0iNzYiPk5vdyBmb3IgdG8gc3BlYWtlIG9mIEFsY3lvbmUgaGlzIHdpZmU8L2w+CiAgPGxiLz48bCBuPSI3NyI+VGhpcyBMYWR5IHRoYXQgd2FzIGxlZnQgYXQgaG9tZTwvbD4KICA8bGIvPjxsIG49Ijc4Ij5IYXRoIHdvbmRlciwgdGhhdCB0aGUga2luZyBuZSBjb21lPC9sPgogIDxsYi8+PGwgbj0iNzkiPkhvbWUsIGZvciBpdCB3YXMgYSBsb25nIHRlcm1lPC9sPgogIDxsYi8+PGwgbj0iODAiPkFub25lIGhlciBoZXJ0ZSBiZWdhbiB0byB5ZXJuZTwvbD4KICA8bGIvPjxsIG49IjgxIj5BbmQgZm9yIHRoYXQgaGVyIHRob3VnaHQgZXVlcm1vPC9sPgogIDxsYi8+PGwgbj0iODIiPkl0IHdhcyBub3Qgd2VsZSwgaGVyIHRob3VnaHQgc29lPC9sPgogIDxsYi8+PGwgbj0iODMiPlNoZSBsb25nZWQgc29lIGFmdGVyIHRoZSBraW5nPC9sPgogIDxsYi8+PGwgbj0iODQiPlRoYXQgY2VydGVzIGl0IHdlcmUgYSBwaXRvdXMgdGhpbmc8L2w+CiAgPGxiLz48bCBuPSI4NSI+VG8gdGVsbCBoZXIgaGFydGVseSBzb3Jvd2Z1bGwgbGlmZTwvbD4KICA8bGIvPjxsIG49Ijg2Ij5UaGF0IHNoZSBoYWQsIHRoaXMgbm9ibGUgd2lmZTwvbD4KICA8bGIvPjxsIG49Ijg3Ij5Gb3IgaGltIGFsYXMsIHNoZSBsb3VlZCBhbGRlcmJlc3RlPC9sPgogIDxsYi8+PGwgbj0iODgiPkFub25lIHNoZSBzZW50IGJvdGggZWVzdGUgYW5kIHdlc3RlPC9sPgogIDxsYi8+PGwgbj0iODkiPlRvIHNla2UgaGltLCBidXQgdGhleSBmb3VuZGUgbm91Z2h0PC9sPgogIDxsYi8+PGwgbj0iOTAiPkFsYXMgKHF1b3RoIHNoZWUpIHRoYXQgSSB3YXMgd3JvdWdodDwvbD4KICA8bGIvPjxsIG49IjkxIj5BbmQgd2hlcmUgbXkgbG9yZCBteSBsb3VlIGJlIGRlZWQ6PC9sPgogIDxsYi8+PGwgbj0iOTIiPkNlcnRlcyBJIHdpbGwgbmV1ZXIgZWF0ZSBicmVlZGU8L2w+CiAgPGxiLz48bCBuPSI5MyI+SSBtYWtlIGEgdW93ZSB0byBteSBnb2QgaGVyZTwvbD4KICA8bGIvPjxsIG49Ijk0Ij5CdXQgSSBtb3dlIG9mIG15IExvcmQgaGVyZS48L2w+CiAgPGxiLz48bCBuPSI5NSI+U29jaGUgc29yb3dlIHRoaXMgTGFkeSB0byBoZXIgdG9rZTwvbD4KICA8bGIvPjxsIG49Ijk2Ij5UaGF0IHRyZXdseSBJIHdoaWNoIG1hZGUgdGhpcyBib29rZTxmdyB0eXBlPSJjYXRjaCIgcGxhY2U9ImJyIj5bQ2F0Y2h3b3JkOl1IYWQgc3VjaDwvZnc+PC9sPgogIDwvZGl2PgogIAk8L2JvZHk+Cgk8L3RleHQ+CjwvVEVJPgpxBWNkamFuZ28uZGIubW9kZWxzLmJhc2UKbW9kZWxfdW5waWNrbGUKcQZVA2FwaXEHVQlDb21tdW5pdHlxCIZdY2RqYW5nby5kYi5tb2RlbHMuYmFzZQpzaW1wbGVfY2xhc3NfZmFjdG9yeQpxCYdScQp9cQsoVQtkZXNjcmlwdGlvbnEMWCgAAABBIHNpbXBsZSBzcGVjaW1lbiB0byBzaG93IHdoYXQgVEMgY2FuIGRvVQZfc3RhdGVxDWNkamFuZ28uZGIubW9kZWxzLmJhc2UKTW9kZWxTdGF0ZQpxDimBcQ99cRAoVQZhZGRpbmdxEYlVAmRicRJVB2RlZmF1bHRxE3ViVQlsb25nX25hbWVxFFgcAAAAQm9vayBvZiB0aGUgRHVjaGVzcyBTcGVjaW1lblUEYWJicnEVWAQAAABCRDAxVQRmb250cRZYAAAAAFUCaWRxF4oBAlUEbmFtZXEYWAoAAABTcGVjaW1lbkJEdWKGcRlVBWNob3JkcRpOVQljYWxsYmFja3NxG05VCGVycmJhY2tzcRxOVQd0YXNrc2V0cR1OaBdVJGE0ZmE4YzA2LTkwMjQtNDNhYS05OGI1LWQzOTY1OTdiODNjY3EeVQdyZXRyaWVzcR9LAFUEdGFza3EgVRdhcGkudGFza3MuYWRkX3RleHRfZmlsZXEhVQl0aW1lbGltaXRxIk5OhlUDZXRhcSNOVQZrd2FyZ3NxJH1xJXUu\", \"headers\": {}, \"content-type\": \"application/x-python-serialize\", \"properties\": {\"body_encoding\": \"base64\", \"correlation_id\": \"a4fa8c06-9024-43aa-98b5-d396597b83cc\", \"reply_to\": \"fc7f25f2-fcce-3d6e-8180-ad77e286ae10\", \"delivery_info\": {\"priority\": 0, \"routing_key\": \"celery\", \"exchange\": \"celery\"}, \"delivery_mode\": 2, \"delivery_tag\": \"a21016ee-687f-4cca-b922-c7835c99948e\"}, \"content-encoding\": \"binary\"}',1),(8,1,'2015-06-15 06:29:52','{\"body\": \"gAJ9cQEoVQZzdGF0dXNxAlUHU1RBUlRFRHEDVQl0cmFjZWJhY2txBE5VBnJlc3VsdHEFfXEGKFUIaG9zdG5hbWVxB1UmY2VsZXJ5QFhpYW9oYW4tWmhhbmdzLU1hY0Jvb2tQcm8ubG9jYWxxCFUDcGlkcQlNyYJ1VQd0YXNrX2lkcQpVJGE0ZmE4YzA2LTkwMjQtNDNhYS05OGI1LWQzOTY1OTdiODNjY3ELVQhjaGlsZHJlbnEMXXUu\", \"headers\": {}, \"content-type\": \"application/x-python-serialize\", \"properties\": {\"body_encoding\": \"base64\", \"correlation_id\": \"a4fa8c06-9024-43aa-98b5-d396597b83cc\", \"delivery_mode\": 2, \"delivery_info\": {\"priority\": 0, \"routing_key\": \"a4fa8c06902443aa98b5d396597b83cc\", \"exchange\": \"celeryresults\"}, \"delivery_tag\": \"18057d26-39a1-4f8e-9642-183b2b72e978\"}, \"content-encoding\": \"binary\"}',5),(9,1,'2015-06-15 06:29:56','{\"body\": \"gAJ9cQEoVQZzdGF0dXNxAlUHU1VDQ0VTU3EDVQl0cmFjZWJhY2txBE5VBnJlc3VsdHEFTlUHdGFza19pZHEGVSRhNGZhOGMwNi05MDI0LTQzYWEtOThiNS1kMzk2NTk3YjgzY2NxB1UIY2hpbGRyZW5xCF11Lg==\", \"headers\": {}, \"content-type\": \"application/x-python-serialize\", \"properties\": {\"body_encoding\": \"base64\", \"correlation_id\": \"a4fa8c06-9024-43aa-98b5-d396597b83cc\", \"delivery_mode\": 2, \"delivery_info\": {\"priority\": 0, \"routing_key\": \"a4fa8c06902443aa98b5d396597b83cc\", \"exchange\": \"celeryresults\"}, \"delivery_tag\": \"86d3451f-0a20-4ec1-af18-374a8bff5109\"}, \"content-encoding\": \"binary\"}',5),(10,0,'2015-06-15 06:29:59','{\"body\": \"gAJ9cQEoVQdleHBpcmVzcQJOVQN1dGNxA4hVBGFyZ3NxBFQ8DQAAPD94bWwgdmVyc2lvbj0iMS4wIiA/PiAKPCFET0NUWVBFIFRFSSBTWVNURU0gIi4uL2NvbW1vbi9jaGF1Y2VyVEMuZHRkIj4KPFRFSSB4bWxucz0iaHR0cDovL3d3dy50ZWktYy5vcmcvbnMvMS4wIiAgeG1sbnM6ZGV0PSJodHRwOi8vdGV4dHVhbGNvbW11bml0aWVzLnVzYXNrLmNhLyI+CiAgIDx0ZWlIZWFkZXI+CiAgICAgPGZpbGVEZXNjPgogICAgICAgPHRpdGxlU3RtdD48dGl0bGU+RGVtb25zdHJhdGlvbiBvZiB0cmFuc2NyaXB0aW9uIGZlYXR1cmVzPC90aXRsZT48L3RpdGxlU3RtdD4KICAgICAgIDxwdWJsaWNhdGlvblN0bXQ+PHA+RGVzaWduZWQgdG8gc2hvdyB0cmFuc2NyaXB0aW9uIGZlYXR1cmVzIC0tIHF1aXRlIGZha2UgYXMgYSBkb2N1bWVudDwvcD48L3B1YmxpY2F0aW9uU3RtdD4KICAgICAgIDxzb3VyY2VEZXNjPjxiaWJsIGRldDpkb2N1bWVudD0iRGVtbyI+PC9iaWJsPjwvc291cmNlRGVzYz4KICAgICA8L2ZpbGVEZXNjPgogICAgIDxlbmNvZGluZ0Rlc2M+CiAgICAgICAgIDxyZWZzRGVjbCBkZXQ6ZG9jdW1lbnRSZWZzRGVjbD0iTWFudXNjcmlwdCIgIGRldDplbnRpdHlSZWZzRGVjbD0iU2ltcGxlIFBvZXRyeSI+CiAgICAgICAgICA8cD5UZXh0dWFsIENvbW11bml0aWVzIGRlY2xhcmF0aW9uczwvcD4KICAgICAgICA8L3JlZnNEZWNsPgogICAgIDwvZW5jb2RpbmdEZXNjPgogICA8L3RlaUhlYWRlcj4KICA8dGV4dD48Ym9keT4KICAgIDxwYiBuPSIxIiAvPgogICAgICA8bGIvPjxkaXYgbj0iQm9vayBvZiB0aGUgRHVjaGVzcyI+CiAgICAgICAgPGxiLz48bCBuPSI1NSI+VGhpcyBpcyBhIG1pc3VzZSBvZiB0aGlzIGxpbmUgb2YgdmVyc2UgdG8gc2hvdyB2YXJpb3VzIHRyYW5zY3JpcHRpb24gZmVhdHVyZXMuCiAgICAgICAgPGxiLz5UZXh0IHdpdGggdmFyaW91cyBmZWF0dXJlczogCiAgICAgICAgPGxiLz4gIDxoaSByZW5kPSJpdGFsIj5pdGFsaWM8L2hpPiA8aGkgcmVuZD0iYm9sZCI+Ym9sZDwvaGk+IDxoaSByZW5kPSJpdGFsIGJvbGQiPmJvbGQgaXRhbGljPC9oaT4gPGhpIHJlbmQ9InN0cmlrZSI+c3RyaWtlIHRocm91Z2g8L2hpPiA8aGkgcmVuZD0ic3VwIj5zdXBlcnNjcmlwdDwvaGk+CiAgICAgICAgPGxiLz5UZXh0IHVzZWZ1bCBmb3IgdHJhbnNjcmlwdGlvbiBvZiBtYW51c2NyaXB0czoKICA8bGIvPiAgQWJicjxhbSByZW5kPSJzdXAiPmV0PC9hbT48ZXg+ZXZpYXRpb25zPC9leD4gPGNob2ljZT48c2ljPndyb25nPC9zaWM+PGNvcnI+cmlnaHQ8L2NvcnI+PC9jaG9pY2U+IDxjaG9pY2U+PG9yaWc+b2xkZTwvb3JpZz48cmVnPm9sZDwvcmVnPjwvY2hvaWNlPgogICAgICAgIDxsYi8+VGV4dCB1c2VmdWwgZm9yIHJlY29yZGluZyBhbHRlcmF0aW9ucyB3aXRoaW4gdGhlIG1hbnVzY3JpcHQ6CiAgPGxiLz4gIDxhcHA+PHJkZyB0eXBlPSJvcmlnIj5PcmlnaW5hbDwvcmRnPjxyZGcgdHlwZT0iY29ycmVjdG9yIDEiPkFsdGVyZWQ8L3JkZz48cmRnIHR5cGU9ImxpdCI+PGhpIHJlbmQ9InN0cmlrZSI+T3JpZ2luYWw8L2hpPjxoaSByZW5kPSJpbCI+XEFsdGVyZWQvPC9oaT48L3JkZz48L2FwcD4KICAgICAgICA8bGIvPk5vdGU6IHdlIGRlcHJlY2F0ZSB0aGUgdXNlIG9mIHRoZSBURUkgZWxlbWVudHMgYWRkIGFuZCBkZWwsIGJlY2F1c2UgdGhleSBjb25mdXNlIHJlcHJlc2VudGF0aW9uIHdpdGggaW50ZXJwcmV0YXRpb24KICAgICAgICA8bGIvPlRoZSBhcHAgc3lzdGVtIGhlcmUgc3VnZ2VzdGVkIGNsZWFubHkgc2VwYXJhdGVzIHJlcHJlc2VudGF0aW9uIGZyb20gaW50ZXJwcmV0YXRpb24uCiAgICAgICAgPGxiLz5SZXByZXNlbnRhdGlvbiBvZiBwYWdlIG51bWJlcnMgYW5kIGNhdGNoIHdvcmRzOiAKICAgICAgICA8bGIvPjxmdyBwbGFjZT0idHIiIHR5cGU9InBhZ2VOdW0iPjE8L2Z3Pi0tIGEgcGFnZSBudW1iZXIsIHRvcCByaWdodAogICAgICAgIDxsYi8+PGZ3IHBsYWNlPSJiciIgdHlwZT0iY2F0Y2giPkNhdGNod29yZDwvZnc+LS0gYSBjYXRjaHdvcmQsIGJvdHRvbSByaWdodAogICAgICAgIDxsYi8+PGZ3IHBsYWNlPSJibSIgdHlwZT0ic2lnIj5TaWduYXR1cmU8L2Z3Pi0tIGEgc2lnbmF0dXJlLCBpbiB0aGUgYm90dG9tIG1hcmdpbiwgY2VudHJlCiAgICAgICAgPGxiLz5NYXJnaW5hbGlhOgogICAgICAgIDxsYi8+PG5vdGUgcGxhY2U9Im1hcmdpbi1sZWZ0Ij5NYXJnaW5hbGlhPC9ub3RlPiAtLSBsZWZ0IG1hcmdpbgogICAgICAgIDxsYi8+PG5vdGUgcGxhY2U9ImJsIj5NYXJnaW5hbGlhPC9ub3RlPiAtLSBib3R0b20gbWFyZ2luLCBsZWZ0CiAgICAgICAgPGxiLz5FZGl0b3JpYWwgbm90ZXM6CiAgICAgICAgPGxiLz5Tb21ldGhpbmcgdG8gYW5ub3RhdGU8bm90ZSByZXNwPSJQTVIiIHR5cGU9ImVkIj5BbiBlZGl0b3JpYWwgbm90ZTwvbm90ZT4KICAgICAgICA8bGIvPlRhYmxlczoKICAgICAgICA8dGFibGU+CiAgICAgICAgICAgICAgICAgIDxyb3c+PGNlbGwgY29scz0iMiI+b2NjdXBpZXMgdHdvIGNvbHVtbnM8L2NlbGw+PC9yb3c+CiAgICAgICAgICAgICAgICAgIDxyb3c+PGNlbGwgcmVuZD0iY2lyY3NtYWxsIj5jaXJjbGU8L2NlbGw+PGNlbGwgcmVuZD0ic3F1YXJlYm9yZGVyIj5zcXVhcmU8L2NlbGw+PC9yb3c+CiAgICAgICAgICAgICAgICAgIDxyb3c+PGNlbGwgY29scz0iMiIgcmVuZD0iY2lyY2xhcmdlIiByb3dzPSIyIj5sYXJnZSBjaXJjbGU8L2NlbGw+PC9yb3c+CiAgICAgICAgICAgIDwvdGFibGU+CiAgICAgICAgICAgIDxsYi8+VW5yZWFkYWJsZSwgdW5jbGVhciwgc3VwcGxpZWQgb3IgZGFtYWdlZCB0ZXh0OgogICAgICAgICAgICA8bGIvPjxnYXAgcXVhbnRpdHk9IjQiIHJlYXNvbj0iaWxsZWdpYmxlIiB1bml0PSJjaGFycyIvPiAtLSB5b3UgY2Fubm90IHJlYWQgdGhlIHRleHQgYXQgYWxsOiAoZm91ciBjaGFyYWN0ZXJzIHVucmVhZGFibGUpCiAgICAgICAgICAgIDxsYi8+WW91IGNhbiByZWFkIHRoZSA8dW5jbGVhciByZWFzb249ImRhbWFnZSI+ZGFtYWdlZCB0ZXh0PC91bmNsZWFyPiBidXQgd2l0aCBkaWZmaWN1bHR5CiAgICAgICAgICAgIDxsYi8+PGRhbWFnZSBhZ2VudD0id2F0ZXIiPjxnYXAgcXVhbnRpdHk9IjQiIHVuaXQ9ImNoYXJzIi8+PC9kYW1hZ2U+IC0tIFRoZSBkb2N1bWVudCBpcyBkYW1hZ2VkLCBhbmQgeW91IGNhbm5vdCByZWFkIGl0IAogICAgICAgICAgICA8bGIvPjxzcGFjZSBxdWFudGl0eT0iMSIgdW5pdD0iY2hhcnMiLz4tLSBlbXB0eSBzcGFjZSBpbiB0aGUgc291cmNlIHRleHQgCiAgICAgICAgICAgIDxsYi8+U2VlIHRoZSBXaWtpcGVkaWEgZW50cnkgb24gPGhpIHJlbmQ9ImIiPkRlZmF1bHQgVHJhbnNjcmlwdGlvbiBHdWlkZWxpbmVzPC9oaT4gZm9yIG1vcmUgZGV0YWlscy4KICAgICAgPC9sPgogICAgICA8L2Rpdj4KICAgIDwvYm9keT4KICA8L3RleHQ+CjwvVEVJPnEFY2RqYW5nby5kYi5tb2RlbHMuYmFzZQptb2RlbF91bnBpY2tsZQpxBlUDYXBpcQdVCUNvbW11bml0eXEIhl1jZGphbmdvLmRiLm1vZGVscy5iYXNlCnNpbXBsZV9jbGFzc19mYWN0b3J5CnEJh1JxCn1xCyhVC2Rlc2NyaXB0aW9ucQxYKAAAAEEgc2ltcGxlIHNwZWNpbWVuIHRvIHNob3cgd2hhdCBUQyBjYW4gZG9VBl9zdGF0ZXENY2RqYW5nby5kYi5tb2RlbHMuYmFzZQpNb2RlbFN0YXRlCnEOKYFxD31xEChVBmFkZGluZ3ERiVUCZGJxElUHZGVmYXVsdHETdWJVCWxvbmdfbmFtZXEUWBwAAABCb29rIG9mIHRoZSBEdWNoZXNzIFNwZWNpbWVuVQRhYmJycRVYBAAAAEJEMDFVBGZvbnRxFlgAAAAAVQJpZHEXigECVQRuYW1lcRhYCgAAAFNwZWNpbWVuQkR1YoZxGVUFY2hvcmRxGk5VCWNhbGxiYWNrc3EbTlUIZXJyYmFja3NxHE5VB3Rhc2tzZXRxHU5oF1UkZmY2YmI2MDUtMGM1Ni00ZWIyLTliZjgtYzJmMjRlMTVkNGZmcR5VB3JldHJpZXNxH0sAVQR0YXNrcSBVF2FwaS50YXNrcy5hZGRfdGV4dF9maWxlcSFVCXRpbWVsaW1pdHEiTk6GVQNldGFxI05VBmt3YXJnc3EkfXEldS4=\", \"headers\": {}, \"content-type\": \"application/x-python-serialize\", \"properties\": {\"body_encoding\": \"base64\", \"correlation_id\": \"ff6bb605-0c56-4eb2-9bf8-c2f24e15d4ff\", \"reply_to\": \"fc7f25f2-fcce-3d6e-8180-ad77e286ae10\", \"delivery_info\": {\"priority\": 0, \"routing_key\": \"celery\", \"exchange\": \"celery\"}, \"delivery_mode\": 2, \"delivery_tag\": \"527172b3-5693-45cd-817e-45c7c27fd9b4\"}, \"content-encoding\": \"binary\"}',1),(11,1,'2015-06-15 06:30:02','{\"body\": \"gAJ9cQEoVQZzdGF0dXNxAlUHU1RBUlRFRHEDVQl0cmFjZWJhY2txBE5VBnJlc3VsdHEFfXEGKFUIaG9zdG5hbWVxB1UmY2VsZXJ5QFhpYW9oYW4tWmhhbmdzLU1hY0Jvb2tQcm8ubG9jYWxxCFUDcGlkcQlNyoJ1VQd0YXNrX2lkcQpVJGZmNmJiNjA1LTBjNTYtNGViMi05YmY4LWMyZjI0ZTE1ZDRmZnELVQhjaGlsZHJlbnEMXXUu\", \"headers\": {}, \"content-type\": \"application/x-python-serialize\", \"properties\": {\"body_encoding\": \"base64\", \"correlation_id\": \"ff6bb605-0c56-4eb2-9bf8-c2f24e15d4ff\", \"delivery_mode\": 2, \"delivery_info\": {\"priority\": 0, \"routing_key\": \"ff6bb6050c564eb29bf8c2f24e15d4ff\", \"exchange\": \"celeryresults\"}, \"delivery_tag\": \"71bbe908-34f3-4594-9468-77d1de296536\"}, \"content-encoding\": \"binary\"}',6),(12,1,'2015-06-15 06:30:03','{\"body\": \"gAJ9cQEoVQZzdGF0dXNxAlUHU1VDQ0VTU3EDVQl0cmFjZWJhY2txBE5VBnJlc3VsdHEFTlUHdGFza19pZHEGVSRmZjZiYjYwNS0wYzU2LTRlYjItOWJmOC1jMmYyNGUxNWQ0ZmZxB1UIY2hpbGRyZW5xCF11Lg==\", \"headers\": {}, \"content-type\": \"application/x-python-serialize\", \"properties\": {\"body_encoding\": \"base64\", \"correlation_id\": \"ff6bb605-0c56-4eb2-9bf8-c2f24e15d4ff\", \"delivery_mode\": 2, \"delivery_info\": {\"priority\": 0, \"routing_key\": \"ff6bb6050c564eb29bf8c2f24e15d4ff\", \"exchange\": \"celeryresults\"}, \"delivery_tag\": \"f78b3785-fb86-4a71-9630-e4a52bcae9aa\"}, \"content-encoding\": \"binary\"}',6),(13,0,'2015-06-15 06:30:21','{\"body\": \"gAJ9cQEoVQdleHBpcmVzcQJOVQN1dGNxA4hVBGFyZ3NxBGNkamFuZ28uZGIubW9kZWxzLmJhc2UKbW9kZWxfdW5waWNrbGUKcQVVA2FwaXEGVQNEb2NxB4ZdY2RqYW5nby5kYi5tb2RlbHMuYmFzZQpzaW1wbGVfY2xhc3NfZmFjdG9yeQpxCIdScQl9cQooVQNyZ3RxC4oCyABVBG5hbWVxDFgHAAAARmFpcmZheFUKY3VyX3Jldl9pZHENTlUGX3N0YXRlcQ5jZGphbmdvLmRiLm1vZGVscy5iYXNlCk1vZGVsU3RhdGUKcQ8pgXEQfXERKFUGYWRkaW5ncRKJVQJkYnETVQdkZWZhdWx0cRR1YlUFbGFiZWxxFVgIAAAAZG9jdW1lbnRVA2xmdHEWigEBVQVkZXB0aHEXigEBVQd0cmVlX2lkcRiKAQFVAmlkcRmKAQF1YlU/L1VzZXJzL3h6aGFuZy9wcm9qZWN0L2FwaS1vbGQvc3RhdGljL21lZGlhLzE2NTk2MDc0NjAxNjAyNDc4MTc0cRqGcRtVBWNob3JkcRxOVQljYWxsYmFja3NxHU5VCGVycmJhY2tzcR5OVQd0YXNrc2V0cR9OaBlVJDg0Y2U1ZmU5LWJkNDQtNDQwYi05ZTg3LWJlMDhhZDllZWU4ZnEgVQdyZXRyaWVzcSFLAFUEdGFza3EiVRdhcGkudGFza3MuYWRkX2ltYWdlX3ppcHEjVQl0aW1lbGltaXRxJE5OhlUDZXRhcSVOVQZrd2FyZ3NxJn1xJ3Uu\", \"headers\": {}, \"content-type\": \"application/x-python-serialize\", \"properties\": {\"body_encoding\": \"base64\", \"correlation_id\": \"84ce5fe9-bd44-440b-9e87-be08ad9eee8f\", \"reply_to\": \"fc7f25f2-fcce-3d6e-8180-ad77e286ae10\", \"delivery_info\": {\"priority\": 0, \"routing_key\": \"celery\", \"exchange\": \"celery\"}, \"delivery_mode\": 2, \"delivery_tag\": \"2798dbd1-848e-4328-ac06-3927c4ae7fb3\"}, \"content-encoding\": \"binary\"}',1),(14,1,'2015-06-15 06:30:22','{\"body\": \"gAJ9cQEoVQZzdGF0dXNxAlUHU1RBUlRFRHEDVQl0cmFjZWJhY2txBE5VBnJlc3VsdHEFfXEGKFUIaG9zdG5hbWVxB1UmY2VsZXJ5QFhpYW9oYW4tWmhhbmdzLU1hY0Jvb2tQcm8ubG9jYWxxCFUDcGlkcQlNyYJ1VQd0YXNrX2lkcQpVJDg0Y2U1ZmU5LWJkNDQtNDQwYi05ZTg3LWJlMDhhZDllZWU4ZnELVQhjaGlsZHJlbnEMXXUu\", \"headers\": {}, \"content-type\": \"application/x-python-serialize\", \"properties\": {\"body_encoding\": \"base64\", \"correlation_id\": \"84ce5fe9-bd44-440b-9e87-be08ad9eee8f\", \"delivery_mode\": 2, \"delivery_info\": {\"priority\": 0, \"routing_key\": \"84ce5fe9bd44440b9e87be08ad9eee8f\", \"exchange\": \"celeryresults\"}, \"delivery_tag\": \"7307f9de-a1d4-48e1-91f8-21137798d00e\"}, \"content-encoding\": \"binary\"}',7),(15,1,'2015-06-15 06:30:23','{\"body\": \"gAJ9cQEoVQZzdGF0dXNxAlUHU1VDQ0VTU3EDVQl0cmFjZWJhY2txBE5VBnJlc3VsdHEFTlUHdGFza19pZHEGVSQ4NGNlNWZlOS1iZDQ0LTQ0MGItOWU4Ny1iZTA4YWQ5ZWVlOGZxB1UIY2hpbGRyZW5xCF11Lg==\", \"headers\": {}, \"content-type\": \"application/x-python-serialize\", \"properties\": {\"body_encoding\": \"base64\", \"correlation_id\": \"84ce5fe9-bd44-440b-9e87-be08ad9eee8f\", \"delivery_mode\": 2, \"delivery_info\": {\"priority\": 0, \"routing_key\": \"84ce5fe9bd44440b9e87be08ad9eee8f\", \"exchange\": \"celeryresults\"}, \"delivery_tag\": \"0a78b83f-a1d9-4ce5-a723-abe9c0714039\"}, \"content-encoding\": \"binary\"}',7);
/*!40000 ALTER TABLE `djkombu_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `djkombu_queue`
--

DROP TABLE IF EXISTS `djkombu_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `djkombu_queue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `djkombu_queue`
--

LOCK TABLES `djkombu_queue` WRITE;
/*!40000 ALTER TABLE `djkombu_queue` DISABLE KEYS */;
INSERT INTO `djkombu_queue` VALUES (3,'6204318c76ac4aadb814fb6590749f88'),(7,'84ce5fe9bd44440b9e87be08ad9eee8f'),(5,'a4fa8c06902443aa98b5d396597b83cc'),(1,'celery'),(2,'celery@Xiaohan-Zhangs-MacBookPro.local.celery.pidbox'),(4,'e7ff2f3f548e48faa865a4eb261837d7'),(6,'ff6bb6050c564eb29bf8c2f24e15d4ff');
/*!40000 ALTER TABLE `djkombu_queue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularize_alignment`
--

DROP TABLE IF EXISTS `regularize_alignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regularize_alignment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alignmentID` varchar(100) COLLATE utf8_bin NOT NULL,
  `appliesTo` varchar(100) COLLATE utf8_bin NOT NULL,
  `witnessId` varchar(100) COLLATE utf8_bin NOT NULL,
  `context` varchar(1000) COLLATE utf8_bin NOT NULL,
  `isMove` tinyint(1) NOT NULL,
  `isForward` tinyint(1) NOT NULL,
  `token` varchar(200) COLLATE utf8_bin NOT NULL,
  `numPos` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularize_alignment`
--

LOCK TABLES `regularize_alignment` WRITE;
/*!40000 ALTER TABLE `regularize_alignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `regularize_alignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularize_alignment_modifications`
--

DROP TABLE IF EXISTS `regularize_alignment_modifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regularize_alignment_modifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alignment_id` int(11) NOT NULL,
  `modification_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alignment_id` (`alignment_id`,`modification_id`),
  KEY `regularize_alignment_modifications_15184c1a` (`alignment_id`),
  KEY `regularize_alignment_modifications_b94bca49` (`modification_id`),
  CONSTRAINT `alignment_id_refs_id_0b7145de` FOREIGN KEY (`alignment_id`) REFERENCES `regularize_alignment` (`id`),
  CONSTRAINT `modification_id_refs_id_65a026a6` FOREIGN KEY (`modification_id`) REFERENCES `regularize_modification` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularize_alignment_modifications`
--

LOCK TABLES `regularize_alignment_modifications` WRITE;
/*!40000 ALTER TABLE `regularize_alignment_modifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `regularize_alignment_modifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularize_collate`
--

DROP TABLE IF EXISTS `regularize_collate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regularize_collate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `alignment` text COLLATE utf8_bin,
  `ruleset` text COLLATE utf8_bin,
  PRIMARY KEY (`id`),
  KEY `regularize_collate_6340c63c` (`user_id`),
  KEY `regularize_collate_c096cf48` (`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularize_collate`
--

LOCK TABLES `regularize_collate` WRITE;
/*!40000 ALTER TABLE `regularize_collate` DISABLE KEYS */;
/*!40000 ALTER TABLE `regularize_collate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularize_modification`
--

DROP TABLE IF EXISTS `regularize_modification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regularize_modification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) COLLATE utf8_bin NOT NULL,
  `modification_type` varchar(300) COLLATE utf8_bin NOT NULL,
  `dateTime` varchar(100) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularize_modification`
--

LOCK TABLES `regularize_modification` WRITE;
/*!40000 ALTER TABLE `regularize_modification` DISABLE KEYS */;
/*!40000 ALTER TABLE `regularize_modification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularize_rule`
--

DROP TABLE IF EXISTS `regularize_rule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regularize_rule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ruleID` varchar(100) COLLATE utf8_bin NOT NULL,
  `appliesTo` varchar(100) COLLATE utf8_bin NOT NULL,
  `action` varchar(100) COLLATE utf8_bin NOT NULL,
  `scope` varchar(20) COLLATE utf8_bin NOT NULL,
  `token` varchar(100) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularize_rule`
--

LOCK TABLES `regularize_rule` WRITE;
/*!40000 ALTER TABLE `regularize_rule` DISABLE KEYS */;
/*!40000 ALTER TABLE `regularize_rule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularize_rule_modifications`
--

DROP TABLE IF EXISTS `regularize_rule_modifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regularize_rule_modifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rule_id` int(11) NOT NULL,
  `modification_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rule_id` (`rule_id`,`modification_id`),
  KEY `regularize_rule_modifications_fb21b565` (`rule_id`),
  KEY `regularize_rule_modifications_b94bca49` (`modification_id`),
  CONSTRAINT `modification_id_refs_id_d30dfaf4` FOREIGN KEY (`modification_id`) REFERENCES `regularize_modification` (`id`),
  CONSTRAINT `rule_id_refs_id_5b78c8e0` FOREIGN KEY (`rule_id`) REFERENCES `regularize_rule` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularize_rule_modifications`
--

LOCK TABLES `regularize_rule_modifications` WRITE;
/*!40000 ALTER TABLE `regularize_rule_modifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `regularize_rule_modifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularize_ruleset`
--

DROP TABLE IF EXISTS `regularize_ruleset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regularize_ruleset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_bin NOT NULL,
  `ruleSetID` varchar(100) COLLATE utf8_bin NOT NULL,
  `appliesTo` varchar(100) COLLATE utf8_bin NOT NULL,
  `userId` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularize_ruleset`
--

LOCK TABLES `regularize_ruleset` WRITE;
/*!40000 ALTER TABLE `regularize_ruleset` DISABLE KEYS */;
/*!40000 ALTER TABLE `regularize_ruleset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularize_ruleset_alignments`
--

DROP TABLE IF EXISTS `regularize_ruleset_alignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regularize_ruleset_alignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ruleset_id` int(11) NOT NULL,
  `alignment_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ruleset_id` (`ruleset_id`,`alignment_id`),
  KEY `regularize_ruleset_alignments_bbab68e4` (`ruleset_id`),
  KEY `regularize_ruleset_alignments_15184c1a` (`alignment_id`),
  CONSTRAINT `alignment_id_refs_id_4b918fcf` FOREIGN KEY (`alignment_id`) REFERENCES `regularize_alignment` (`id`),
  CONSTRAINT `ruleset_id_refs_id_9c7afd76` FOREIGN KEY (`ruleset_id`) REFERENCES `regularize_ruleset` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularize_ruleset_alignments`
--

LOCK TABLES `regularize_ruleset_alignments` WRITE;
/*!40000 ALTER TABLE `regularize_ruleset_alignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `regularize_ruleset_alignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularize_ruleset_rules`
--

DROP TABLE IF EXISTS `regularize_ruleset_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regularize_ruleset_rules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ruleset_id` int(11) NOT NULL,
  `rule_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ruleset_id` (`ruleset_id`,`rule_id`),
  KEY `regularize_ruleset_rules_bbab68e4` (`ruleset_id`),
  KEY `regularize_ruleset_rules_fb21b565` (`rule_id`),
  CONSTRAINT `rule_id_refs_id_fc1c4975` FOREIGN KEY (`rule_id`) REFERENCES `regularize_rule` (`id`),
  CONSTRAINT `ruleset_id_refs_id_043f759a` FOREIGN KEY (`ruleset_id`) REFERENCES `regularize_ruleset` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularize_ruleset_rules`
--

LOCK TABLES `regularize_ruleset_rules` WRITE;
/*!40000 ALTER TABLE `regularize_ruleset_rules` DISABLE KEYS */;
/*!40000 ALTER TABLE `regularize_ruleset_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regularize_witnessescache`
--

DROP TABLE IF EXISTS `regularize_witnessescache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regularize_witnessescache` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_id` int(11) NOT NULL,
  `json` text COLLATE utf8_bin,
  PRIMARY KEY (`id`),
  UNIQUE KEY `entity_id` (`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regularize_witnessescache`
--

LOCK TABLES `regularize_witnessescache` WRITE;
/*!40000 ALTER TABLE `regularize_witnessescache` DISABLE KEYS */;
/*!40000 ALTER TABLE `regularize_witnessescache` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-06-15  8:40:36
