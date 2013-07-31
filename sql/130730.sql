CREATE TABLE `api_community_refs_decls` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `community_id` integer NOT NULL,
    `refsdecl_id` integer NOT NULL,
    UNIQUE (`community_id`, `refsdecl_id`)
)
;
CREATE TABLE `api_refsdecl` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` varchar(255) NOT NULL,
    `description` longtext NOT NULL,
    `type` integer NOT NULL,
    `text_id` integer,
    `xml` longtext NOT NULL,
    `template` longtext NOT NULL
)
;
ALTER TABLE `api_community_refs_decls` ADD CONSTRAINT `community_id_refs_id_cf17ce6c` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`);
ALTER TABLE `api_refsdecl` ADD CONSTRAINT `text_id_refs_id_e615e8b6` FOREIGN KEY (`text_id`) REFERENCES `api_text` (`id`);
ALTER TABLE `api_community_refs_decls` ADD CONSTRAINT `refsdecl_id_refs_id_585b1d12` FOREIGN KEY (`refsdecl_id`) REFERENCES `api_refsdecl` (`id`);
CREATE INDEX `api_refsdecl_377be151` ON `api_refsdecl` (`text_id`);


INSERT INTO api_refsdecl (id, name, description, `type`, text_id) 
    SELECT r.id, r.name, r.description, r.`type`, r.text_el_id
    FROM det_refsdecl r
    LEFT JOIN api_text t ON r.text_el_id = t.id
    WHERE r.text_el_id is NULL or t.id is not NULL
;

INSERT INTO api_community_refs_decls (id, community_id, refsdecl_id)
    SELECT cr.id, cr.community_id, cr.refsdecl_id 
    FROM community_community_refs_decls cr
    LEFT JOIN api_community cc ON cc.id = cr.community_id
    WHERE cc.id is NOT NULL
;
