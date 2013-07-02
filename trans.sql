INSERT INTO api_community (id, name, abbr, long_name, description)  
SELECT id, name, abbr, long_name, description FROM community_community;

--------------- this part is useless we already have ancestor table     -------------------
CREATE TABLE tmp_det (
  id int NOT NULL AUTO_INCREMENT, 
  de_id int NOT NULL, 
  an_id int NOT NULL, 
  `depth` int NOT NULL,
    PRIMARY KEY (id),
     CONSTRAINT de_id_co FOREIGN KEY (de_id) REFERENCES det_det (id) ,
     CONSTRAINT an_id_co FOREIGN KEY (an_id) REFERENCES det_det (id) 
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO tmp_det (de_id, an_id, `depth`)
select de.id, an.id, de.depth from det_det de 
join det_det an on de.parent_id = an.id ;

insert into tmp_det (de_id, an_id, `depth`)
select de.de_id, an.an_id, 2
from tmp_det de 
join tmp_det an on an.de_id = de.an_id 
where de.`depth` = 2;

insert into tmp_det (de_id, an_id, `depth`)
select de.de_id, an.an_id, 3
from tmp_det de 
join tmp_det an on de.an_id = an.de_id
where de.`depth` = 3 and an.`depth` = 2;

insert into tmp_det (de_id, an_id, `depth`)
select de.de_id, an.an_id, 4
from tmp_det de 
join tmp_det an on de.an_id = an.de_id
where de.`depth` = 4 and an.`depth` = 3;
---------------------------------------------------------------------------------------


INSERT INTO api_doc (id, lft, rgt, tree_id, `depth`, name, label) 
select dd.id, 1, count(td.id)*2+2, dd.id, dd.`depth` + 1, dd.n, dd.`type` 
from det_det dd 
left join tmp_det td on dd.id = td.an_id 
where dd.`depth` = 0 and type = 'document'
group by dd.id
;

INSERT INTO api_entity (id, lft, rgt, tree_id, `depth`, name, label) 
select dd.id, 1, count(td.id)*2+2, dd.id, dd.`depth` + 1, dd.n, dd.`type` 
from det_det dd 
left join tmp_det td on dd.id = td.an_id 
where dd.`depth` = 0 and type = 'entity'
group by dd.id
;


INSERT INTO api_doc (id, lft, rgt, tree_id, `depth`, name, label) 
select dd.id, doc.lft+1, count(td.id)*2+doc.lft, doc.tree_id, dd.`depth` + 1, dd.n, dd.`type` 
from det_det dd 
left join tmp_det td on dd.id = td.an_id 
join api_doc doc on doc.id = dd.parent_id
where dd.`depth` = 1 and dd.`order` = 0
group by dd.id;

-- 297909 where an.depth=0 is null  limit 10

drop procedure loop_insert;
DELIMITER $$
create procedure loop_insert (d int, ord int, cnt int)
begin
  label: LOOP
    INSERT INTO api_doc (id, lft, rgt, tree_id, `depth`, name, label) 
    select dd.id, doc.rgt+1, count(td.id)*2+doc.rgt, doc.tree_id, dd.`depth` + 1, dd.n, dd.`type` 
    from det_det dd 
    left join tmp_det td on dd.id = td.an_id 
    join det_det sib on sib.parent_id = dd.parent_id and sib.`order` = dd.`order` - 1 
    join api_doc doc on doc.id = sib.id
    where dd.`depth` = d and dd.`order` = ord
    group by dd.id;
    SET cnt = (
      select count(*)
      from det_det dd 
      join api_doc doc on doc.id = dd.parent_id
      where dd.`depth` = d and dd.`order` > ord
    );
    select cnt, ord;
    if cnt > 0  then
      set ord = ord + 1;
      iterate label;
    end if;
    leave label;
  END LOOP label;
  set @x = cnt;
end $$
delimiter ;
call loop_insert(1, 1, -1);


INSERT INTO api_doc (id, lft, rgt, tree_id, `depth`, name, label) 
select dd.id, doc.lft+1, count(td.id)*2+doc.lft, doc.tree_id, dd.`depth` + 1, dd.n, dd.`type` 
from det_det dd 
left join tmp_det td on dd.id = td.an_id 
join api_doc doc on doc.id = dd.parent_id
where dd.`depth` = 2 and dd.`order` = 0
group by dd.id;
call loop_insert(2, 1, -1);

INSERT INTO api_doc (id, lft, rgt, tree_id, `depth`, name, label) 
select dd.id, doc.lft+1, count(td.id)*2+doc.lft, doc.tree_id, dd.`depth` + 1, dd.n, dd.`type` 
from det_det dd 
left join tmp_det td on dd.id = td.an_id 
join api_doc doc on doc.id = dd.parent_id
where dd.`depth` = 3 and dd.`order` = 0
group by dd.id;
call loop_insert(3, 1, -1);



drop procedure loop_insert;
DELIMITER $$
create procedure loop_insert (d int)
begin
    INSERT INTO api_entity (id, lft, rgt, tree_id, `depth`, name, label) 
    select dd.id, entity.lft+1, count(td.id)*2+entity.lft, entity.tree_id, dd.`depth` + 1, dd.n, dd.`type` 
    from det_det dd 
    left join tmp_det td on dd.id = td.an_id 
    join api_entity entity on entity.id = dd.parent_id
    where dd.`depth` = d and dd.`order` = 0
    group by dd.id;

  set @ord = 1;
  label: LOOP
    INSERT INTO api_entity (id, lft, rgt, tree_id, `depth`, name, label) 
    select dd.id, entity.rgt+1, count(td.id)*2+entity.rgt, entity.tree_id, dd.`depth` + 1, dd.n, dd.`type` 
    from det_det dd 
    left join tmp_det td on dd.id = td.an_id 
    join det_det sib on sib.parent_id = dd.parent_id and sib.`order` = dd.`order` - 1 
    join api_entity entity on entity.id = sib.id
    where dd.`depth` = d and dd.`order` = @ord
    group by dd.id;
    SET @cnt = (
      select count(*)
      from det_det dd 
      join api_entity entity on entity.id = dd.parent_id
      where dd.`depth` = d and dd.`order` > @ord
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


--------------- this part is useless we already have ancestor table     -------------------
CREATE TABLE tmp_el (
  id int NOT NULL AUTO_INCREMENT, 
  de_id int NOT NULL, 
  an_id int NOT NULL, 
  `depth` int NOT NULL,
    PRIMARY KEY (id),
     CONSTRAINT el_de_id_co FOREIGN KEY (de_id) REFERENCES det_element (id) ,
     CONSTRAINT el_an_id_co FOREIGN KEY (an_id) REFERENCES det_element (id) 
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO tmp_el (de_id, an_id, `depth`)
select de.id, an.id, de.depth from det_element de 
join det_element an on de.parent_id = an.id ;

insert into tmp_el (de_id, an_id, `depth`)
select de.de_id, an.an_id, 1 loop-to 11
from tmp_el de 
join tmp_el an on an.de_id = de.an_id 
where de.`depth` = 1 loop-to 11;
---------------------------------------------------------------------------------------


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
; 

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
select t.id, 1, count(tt.id)*2+2, t.id, t.`depth` + 1, t.tag, t.text, t.tail, t.istextin_id, t.istextof_id 
from det_element t
left join tmp_el tt on t.id = tt.an_id 
where t.`depth` = 0
group by t.id
;

drop procedure loop_insert;
DELIMITER $$
create procedure loop_insert (d int)
begin
    INSERT INTO api_text (id, lft, rgt, tree_id, `depth`, tag, text, tail, doc_id, entity_id)
    select t.id, node.lft+1, count(tmp.id)*2+node.lft, node.tree_id, t.`depth` + 1, 
        t.tag, t.text, t.tail, t.istextin_id, t.istextof_id 
    from det_element t
    left join tmp_el tmp on t.id = tmp.an_id 
    join api_text node on node.id = t.parent_id
    where t.`depth` = d and t.`order` = 0
    group by t.id;

  set @ord = 1;
  label: LOOP
    INSERT INTO api_text (id, lft, rgt, tree_id, `depth`, tag, text, tail, doc_id, entity_id)
    select t.id, node.rgt+1, count(tmp.id)*2+node.rgt, node.tree_id, t.`depth` + 1, 
        t.tag, t.text, t.tail, t.istextin_id, t.istextof_id 
    from det_element t
    left join tmp_el tmp on t.id = tmp.an_id 
    join det_element sib on sib.parent_id = t.parent_id and sib.`order` = t.`order` - 1
    join api_text node on node.id = sib.id
    where t.`depth` = d and t.`order` = @ord
    group by t.id;

    SET @cnt = (
      select count(*)
      from det_det dd 
      join api_entity entity on entity.id = dd.parent_id
      where dd.`depth` = d and dd.`order` > @ord
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

