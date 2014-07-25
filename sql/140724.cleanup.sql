-- delete doc: 53453, 53503 from admin interface
-- delete entity: 725005
-- delete text: 1579353

/*
select d.id, d.name, c.id, c.name from api_doc d 
left join api_community_docs cd on cd.doc_id = d.id
left join api_community c on c.id = cd.community_id
where d.depth = 1 and c.id is null;

select d.id, d.name, c.id, c.name from api_entity d 
left join api_community_entities cd on cd.entity_id = d.id
left join api_community c on c.id = cd.community_id
where d.depth = 1 and c.id is null;
*/

select tree_id from api_text t 
left join api_refsdecl r on r.text_id = t.id
group by tree_id
having count(r.id) = 0 and count(doc_id) = 0 and count(entity_id) = 0 limit 2000;

delete a from api_attr a 
join api_text t on t.id = a.text_id where t.tree_id in (
    -- result from above
);

delete t from api_text t where t.tree_id in (
    -- result from above
);

