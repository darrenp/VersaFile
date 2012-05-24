SELECT 
	viewable.active_permissions, 
	references.id,
	references.reference_type,
	references.folder_id,
	documents.id AS 'document_id',
	documents.state,
	documents.checked_out_by,
	document_types.id AS 'document_type_id',
	versions.binary_content_type,documents.name,
	document_types.name AS 'document_type_name',
	versions.major_version_number,
	versions.minor_version_number,
	versions.binary_file_size,
	documents.updated_by 
FROM `references` 
INNER JOIN ( 
	SELECT 
		acls.securable_id AS id, 
		roles.permissions AS active_permissions 
	FROM `acls` 
	INNER JOIN (
		SELECT acls.id, MAX(precedence) as precedence
		FROM acls
		INNER JOIN acl_entries ON acl_entries.acl_id = acls.id
		WHERE (securable_type = 'Reference') AND ((grantee_id = 1 AND grantee_type ='User') OR (grantee_id = 1 AND grantee_type = 'Group') OR (grantee_id = 2 AND grantee_type = 'Group'))
		GROUP BY securable_id
	) AS active ON ((active.id = acls.id) AND (acls.securable_type = 'Reference')) 
	INNER JOIN acl_entries ON acl_entries.acl_id = acls.id AND active.precedence = acl_entries.precedence 
	INNER JOIN roles ON roles.id = acl_entries.role_id 
	WHERE ((roles.permissions != 0) AND ((grantee_id = 1 AND grantee_type = 'User') OR (grantee_id = 1 AND grantee_type = 'Group') OR (grantee_id = 2 AND grantee_type = 'Group'))) 
) AS viewable ON viewable.id = references.id 
INNER JOIN documents ON documents.id = references.document_id 
INNER JOIN versions ON versions.document_id = documents.id AND is_current_version = true 
INNER JOIN document_types ON document_types.id = documents.document_type_id WHERE `references`.`library_id` = 1 AND (folder_id = 1) AND ((documents.state & 2048 = 0)) 
ORDER BY documents.name ASC 
LIMIT 25 OFFSET 0;