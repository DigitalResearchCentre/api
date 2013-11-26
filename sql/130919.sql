CREATE TABLE `api_header` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `xml` longtext NOT NULL,
    `text_id` integer NOT NULL
)
;
ALTER TABLE `api_header` ADD CONSTRAINT `text_id_refs_id_c0a1916f` FOREIGN KEY (`text_id`) REFERENCES `api_text` (`id`);

CREATE INDEX `api_header_377be151` ON `api_header` (`text_id`);
