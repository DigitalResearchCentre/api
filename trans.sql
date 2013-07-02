INSERT INTO api_community (id, name, abbr, long_name, description)  
SELECT id, name, abbr, long_name, description FROM community_community;

INSERT INTO api_doc (id, lft, rgt, tree_id, `depth`, name, label) 
select dd.id, 1, count(distinct an.from_det_id) * 2 + 2,
    dd.id, dd.`depth` + 1, dd.n, dd.`type` 
from det_det dd 
left join det_det_ancestors an on dd.id = an.to_det_id
where dd.`depth` = 0 and type = 'document'
group by dd.id
;

INSERT INTO api_entity (id, lft, rgt, tree_id, `depth`, name, label) 
select dd.id, 1, count(distinct an.from_det_id) * 2 + 2,
    dd.id, dd.`depth` + 1, dd.n, dd.`type` 
from det_det dd 
left join det_det_ancestors an on dd.id = an.to_det_id
where dd.`depth` = 0 and type = 'entity'
group by dd.id
;

-- 297909 where an.depth=0 is null  limit 10

drop procedure loop_insert;
DELIMITER $$
create procedure loop_insert (d int)
begin
    INSERT INTO api_doc (id, lft, rgt, tree_id, `depth`, name, label) 
    select old.id, node.lft+1, 
        count(distinct tmp.from_det_id) * 2 + 2 + node.lft, 
        node.tree_id, old.`depth` + 1, old.n, old.`type` 
    from det_det old
    left join det_det_ancestors tmp on old.id = tmp.to_det_id
    join api_doc node on node.id = old.parent_id
    where old.`depth` = d and old.`order` = 0
    group by old.id;

  set @ord = 1;
  label: LOOP
    INSERT INTO api_doc (id, lft, rgt, tree_id, `depth`, name, label) 
    select old.id, node.rgt + 1, 
        count(distinct tmp.from_det_id) * 2 + 2 + node.rgt, 
        node.tree_id, old.`depth` + 1, old.n, old.`type` 
    from det_det old
    left join det_det_ancestors tmp on old.id = tmp.to_det_id
    join det_det sib on sib.parent_id = old.parent_id 
        and sib.`order` = old.`order` - 1 
    join api_doc node on node.id = sib.id
    where old.`depth` = d and old.`order` = @ord
    group by old.id;

    SET @cnt = (
      select count(*)
      from det_det old
      join api_doc node on node.id = old.parent_id
      where old.`depth` = d and old.`order` > @ord
    );
    select @cnt, @ord;
    if @cnt > 0  then
      set @ord = @ord + 1;
      iterate label;
    end if;
    leave label;
  END LOOP label;
end $$
delimiter ;

call loop_insert(1);

drop procedure loop_insert;
DELIMITER $$
create procedure loop_insert (d int)
begin
    INSERT INTO api_entity (id, lft, rgt, tree_id, `depth`, name, label) 
    select old.id, node.lft+1, 
        count(distinct tmp.from_det_id) * 2 + 2 + node.lft, 
        node.tree_id, old.`depth` + 1, old.n, old.`type` 
    from det_det old
    left join det_det_ancestors tmp on old.id = tmp.to_det_id
    join api_entity node on node.id = old.parent_id
    where old.`depth` = d and old.`order` = 0
    group by old.id;

  set @ord = 1;
  label: LOOP
    INSERT INTO api_entity (id, lft, rgt, tree_id, `depth`, name, label) 
    select old.id, node.rgt + 1,
        count(distinct tmp.from_det_id) * 2 + 2 + node.rgt, 
        node.tree_id, old.`depth` + 1, old.n, old.`type` 
    from det_det old
    left join det_det_ancestors tmp on old.id = tmp.to_det_id
    join det_det sib on sib.parent_id = old.parent_id 
        and sib.`order` = old.`order` - 1 
    join api_entity node on node.id = sib.id
    where old.`depth` = d and old.`order` = @ord
    group by old.id;

    SET @cnt = (
      select count(*)
      from det_det old
      join api_entity node on node.id = old.parent_id
      where old.`depth` = d and old.`order` > @ord
    );
    select @cnt, @ord;
    if @cnt > 0  then
      set @ord = @ord + 1;
      iterate label;
    end if;
    leave label;
  END LOOP label;
end $$
delimiter ;

call loop_insert(1);
call loop_insert(2);
call loop_insert(3);


-- clean up duplicate text id
update det_element as el1 join (
select min(el.order) as minorder, el.id, el.istextin_id from det_element as el
join (
  select count(*) as c, count(distinct parent_id) as cp, istextin_id from det_element 
  where istextin_id is not null group by istextin_id 
  having c > 1 and cp = 1
) as helper on helper.istextin_id = el.istextin_id
group by el.istextin_id
) as el2 on el1.istextin_id = el2.istextin_id
set el1.istextin_id = null
where el1.order != el2.minorder;

update det_element as el1 join (
select min(el.id) as minid, el.id, el.istextin_id from det_element as el
join (
  select count(*) as c, count(distinct parent_id) as cp, istextin_id from det_element 
  where istextin_id is not null group by istextin_id 
  having c > 1
) as helper on helper.istextin_id = el.istextin_id
group by el.istextin_id
) as el2 on el1.istextin_id = el2.istextin_id
set el1.istextin_id = null
where el1.id != el2.minid;

INSERT INTO api_text (id, lft, rgt, tree_id, `depth`, tag, text, tail, doc_id, entity_id) 
select t.id, 1, count(an.from_element_id) * 2 + 2, t.id, t.`depth` + 1, 
    t.tag, t.text, t.tail, t.istextin_id, t.istextof_id 
from det_element t
left join det_element_ancestors an on t.id = an.to_element_id
where t.`depth` = 0
group by t.id
;

drop procedure loop_insert;
DELIMITER $$
create procedure loop_insert (d int)
begin
    INSERT INTO api_text (id, lft, rgt, tree_id, `depth`, tag, text, tail, doc_id, entity_id)
    select t.id, node.lft+1, 
        count(distinct tmp.from_element_id) * 2 + 2 + node.lft,
        node.tree_id, t.`depth` + 1, 
        t.tag, t.text, t.tail, t.istextin_id, t.istextof_id 
    from det_element t
    left join det_element_ancestors tmp on t.id = tmp.to_element_id
    join api_text node on node.id = t.parent_id
    where t.`depth` = d and t.`order` = 0
    group by t.id;

  set @ord = 1;
  label: LOOP
    INSERT INTO api_text (id, lft, rgt, tree_id, `depth`, tag, text, tail, doc_id, entity_id)
    select t.id, node.rgt + 1, 
        count(distinct tmp.from_element_id) * 2 + 2 + node.rgt,
        node.tree_id, t.`depth` + 1, 
        t.tag, t.text, t.tail, t.istextin_id, t.istextof_id 
    from det_element t
    left join det_element_ancestors tmp on t.id = tmp.to_element_id
    join det_element sib on sib.parent_id = t.parent_id and sib.`order` = t.`order` - 1
    join api_text node on node.id = sib.id
    where t.`depth` = d and t.`order` = @ord
    group by t.id;

    SET @cnt = (
      select count(*)
      from det_element old
      join api_text node on node.id = old.parent_id
      where old.`depth` = d and old.`order` > @ord
    );
    select @cnt, @ord;
    if @cnt > 0  then
      set @ord = @ord + 1;
      iterate label;
    end if;
    leave label;
  END LOOP label;
end $$
delimiter ;

INSERT INTO api_community_docs (community_id, doc_id)
SELECT cd.community_id, cd.det_id FROM community_community_dets cd
JOIN det_det dd ON dd.id = cd.det_id
WHERE dd.type = 'document';

INSERT INTO api_community_entities (community_id, entity_id)
SELECT cd.community_id, cd.det_id FROM community_community_dets cd
JOIN det_det dd ON dd.id = cd.det_id
WHERE dd.type = 'entity';

ALTER TABLE det_tilerimage ADD COLUMN doc_id integer;
UPDATE det_tilerimage SET doc_id = det_id;
ALTER TABLE det_tilerimage MODIFY doc_id integer NOT NULL UNIQUE;
ALTER TABLE `det_tilerimage` ADD CONSTRAINT `doc_id_refs_id_c33c2798` 
FOREIGN KEY (`doc_id`) REFERENCES `api_doc` (`id`);

ALTER TABLE api_doc ADD COLUMN `cur_rev_id` integer UNIQUE;

CREATE TABLE `api_revision` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `doc_id` integer NOT NULL,
    `user_id` integer NOT NULL,
    `prev_id` integer,
    `create_date` datetime NOT NULL,
    `edit_date` datetime NOT NULL,
    `text` longtext NOT NULL
)
;
-- ALTER TABLE auth_user modify username varchar(180) COLLATE utf8_bin DEFAULT NULL;
-- ALTER TABLE auth_user ENGINE = InnoDB;
ALTER TABLE `api_revision` ADD CONSTRAINT `user_id_refs_id_5512d657` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
ALTER TABLE `api_revision` ADD CONSTRAINT `doc_id_refs_id_98a1df75` FOREIGN KEY (`doc_id`) REFERENCES `api_doc` (`id`);
ALTER TABLE `api_doc` ADD CONSTRAINT `cur_rev_id_refs_id_7779d53a` FOREIGN KEY (`cur_rev_id`) REFERENCES `api_revision` (`id`);
ALTER TABLE `api_revision` ADD CONSTRAINT `prev_id_refs_id_01ffac0f` FOREIGN KEY (`prev_id`) REFERENCES `api_revision` (`id`);

INSERT INTO api_revision (
    id, doc_id, user_id, prev_id, create_date, edit_date, text
) 
SELECT r.id, t.doc_id, r.user_id, r.prev_id, 
    r.create_date, r.create_date, r.text 
FROM community_revision r
JOIN community_transcript t ON r.transcript_id = t.id
;


UPDATE api_doc d JOIN community_transcript t ON t.doc_id = d.id
SET d.cur_rev_id = t.cur_rev_id
WHERE t.cur_rev_id IS NOT NULL;

INSERT INTO api_attr (id, text_id, name, value)
SELECT da.id, da.element_id, da.name, da.value 
FROM det_attr da INNER JOIN api_text t on t.id = da.element_id;

