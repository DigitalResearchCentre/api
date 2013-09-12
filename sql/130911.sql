CREATE TABLE `api_membership` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_id` integer,
    `community_id` integer NOT NULL,
    `role_id` integer NOT NULL,
    `create_date` date NOT NULL,
    UNIQUE (`user_id`, `community_id`, `role_id`)
)
;
ALTER TABLE `api_membership` ADD CONSTRAINT `user_id_refs_id_44af110c` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
ALTER TABLE `api_membership` ADD CONSTRAINT `role_id_refs_id_a66b692c` FOREIGN KEY (`role_id`) REFERENCES `auth_group` (`id`);
ALTER TABLE `api_membership` ADD CONSTRAINT `community_id_refs_id_05229630` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`);

CREATE TABLE `api_task` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `doc_id` integer NOT NULL,
    `user_id` integer NOT NULL,
    `community_id` integer NOT NULL,
    `status` integer NOT NULL,
    UNIQUE (`doc_id`, `user_id`)
)
;
ALTER TABLE `api_task` ADD CONSTRAINT `user_id_refs_id_c7880c58` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
ALTER TABLE `api_task` ADD CONSTRAINT `doc_id_refs_id_981d7fb7` FOREIGN KEY (`doc_id`) REFERENCES `api_doc` (`id`);
ALTER TABLE `api_task` ADD CONSTRAINT `community_id_refs_id_854a4d4f` FOREIGN KEY (`community_id`) REFERENCES `api_community` (`id`);

CREATE INDEX `api_membership_6340c63c` ON `api_membership` (`user_id`);
CREATE INDEX `api_membership_2caeaf6c` ON `api_membership` (`community_id`);
CREATE INDEX `api_membership_278213e1` ON `api_membership` (`role_id`);

CREATE INDEX `api_task_fbbb6049` ON `api_task` (`doc_id`);
CREATE INDEX `api_task_6340c63c` ON `api_task` (`user_id`);
CREATE INDEX `api_task_2caeaf6c` ON `api_task` (`community_id`);

INSERT INTO api_membership (id, user_id, community_id, role_id, create_date)
    SELECT m.id, m.user_id, m.community_id, m.role, i.accepted_date 
    FROM community_membership m 
    LEFT JOIN community_invitation i on m.id = i.invitee_id
;
