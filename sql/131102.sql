INSERT INTO api_task (id, doc_id, membership_id, `status`)
SELECT 
    ta.id, d.id, ta.member_id, ta.`status` 
FROM community_task ta  
JOIN api_membership m ON ta.member_id = m.id 
LEFT JOIN community_transcript tr on ta.transcript_id = tr.id
LEFT JOIN api_doc d on tr.doc_id = d.id;
