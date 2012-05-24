#1)
# select MAX precedence all the acls (of type "reference") ordered by 
# retrieves highest precedence acl for each "reference" for the specified user/group
#:> duration 0.018s
SELECT acls.id, MAX(precedence) as precedence
FROM acls
INNER JOIN acl_entries ON acl_entries.acl_id = acls.id
WHERE (securable_type = 'Reference') AND ((grantee_id = 1 AND grantee_type ='User') OR (grantee_id = 1 AND grantee_type = 'Group') OR (grantee_id = 2 AND grantee_type = 'Group'))
GROUP BY securable_id;

#2) 
# Retrieves "viewable" (user does not have permissions set to "NONE") acls and permission flags for specified user/group
# based on MAX precedence determined in step 1
#:> duration 0.565s
SELECT acls.securable_id AS id, roles.permissions AS active_permissions 
FROM acls
INNER JOIN ( 
	SELECT acls.id, MAX(precedence) as precedence
	FROM acls
	INNER JOIN acl_entries ON acl_entries.acl_id = acls.id
	WHERE (securable_type = 'Reference') AND ((grantee_id = 1 AND grantee_type ='User') OR (grantee_id = 1 AND grantee_type = 'Group') OR (grantee_id = 2 AND grantee_type = 'Group'))
	GROUP BY securable_id
) AS active ON ((active.id = acls.id) AND (acls.securable_type = 'Reference')) 
INNER JOIN acl_entries ON acl_entries.acl_id = acls.id AND active.precedence = acl_entries.precedence 
INNER JOIN roles ON roles.id = acl_entries.role_id 
WHERE ((roles.permissions != 0) AND ((grantee_id = 1 AND grantee_type = 'User') OR (grantee_id = 1 AND grantee_type = 'Group') OR (grantee_id = 2 AND grantee_type = 'Group'))); 

#2a)
# Limit to 25 rows (dojo grid page size)
#:> duration 0.039s
SELECT acls.securable_id AS id, roles.permissions AS active_permissions 
FROM acls
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
LIMIT 25; 


#3)
#Join with references
#:> duration 2.147s
SELECT
	references.id, 
	viewable.active_permissions
FROM `references`
INNER JOIN (
	SELECT acls.securable_id AS id, roles.permissions AS active_permissions 
	FROM acls
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
) AS viewable ON viewable.id = references.id;

#3a)
# "Inner" LIMIT
#:> Duration 0.042s
# NOTE: can't do this for browsing must be top 25 in the FOLDER, possible for searching
SELECT
	references.id, 
	viewable.active_permissions
FROM `references`
INNER JOIN (
	SELECT acls.securable_id AS id, roles.permissions AS active_permissions 
	FROM acls
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
	LIMIT 25
) AS viewable ON viewable.id = references.id;

#3b)
# "Outer" LIMIT
#:> duration 2.026s
SELECT
	references.id, 
	viewable.active_permissions
FROM `references`
INNER JOIN (
	SELECT acls.securable_id AS id, roles.permissions AS active_permissions 
	FROM acls
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
LIMIT 25;

#4) 
# LIMIT to specified folder.
#:> duration 2.013s
SELECT
	references.id, 
	viewable.active_permissions
FROM `references`
INNER JOIN (
	SELECT acls.securable_id AS id, roles.permissions AS active_permissions 
	FROM acls
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
WHERE `references`.library_id = 1 AND (folder_id = 1);

#5)
# JOIN with "documents" table
#:> duration 2.154s
SELECT
	references.id,
	references.reference_type,
	references.folder_id,
	documents.id AS 'document_id',
	documents.state,
	documents.checked_out_by,
	documents.updated_by, 
	viewable.active_permissions
FROM `references`
INNER JOIN (
	SELECT acls.securable_id AS id, roles.permissions AS active_permissions 
	FROM acls
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
WHERE `references`.`library_id` = 1 AND (folder_id = 1) AND ((documents.state & 2048 = 0)) 
ORDER BY documents.name ASC ;

#6) JOIN with "versions" table
#:> duration 11.806s
SELECT
	references.id,
	references.reference_type,
	references.folder_id,
	documents.id AS 'document_id',
	documents.state,
	documents.checked_out_by,
	documents.updated_by,
	versions.binary_content_type,documents.name,
	versions.major_version_number,
	versions.minor_version_number,
	versions.binary_file_size,
	viewable.active_permissions
FROM `references`
INNER JOIN (
	SELECT acls.securable_id AS id, roles.permissions AS active_permissions 
	FROM acls
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
WHERE `references`.`library_id` = 1 AND (folder_id = 1) AND ((documents.state & 2048 = 0)) 
ORDER BY documents.name ASC;

#7) JOIN with "document_types" table
#:> duration 12.886s
SELECT
	references.id,
	references.reference_type,
	references.folder_id,
	documents.id AS 'document_id',
	documents.state,
	documents.checked_out_by,
	documents.updated_by,
	document_types.id AS 'document_type_id',
	document_types.name AS 'document_type_name',
	versions.binary_content_type,documents.name,
	versions.major_version_number,
	versions.minor_version_number,
	versions.binary_file_size,
	viewable.active_permissions
FROM `references`
INNER JOIN (
	SELECT acls.securable_id AS id, roles.permissions AS active_permissions 
	FROM acls
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
INNER JOIN document_types ON document_types.id = documents.document_type_id 
WHERE `references`.`library_id` = 1 AND (folder_id = 1) AND ((documents.state & 2048 = 0)) 
ORDER BY documents.name ASC;

#7a)
# INNER LIMIT
#:> duration 0.130s
# NOTE: can't do this for browsing must be top 25 in the FOLDER, possible for searching though
SELECT
	references.id,
	references.reference_type,
	references.folder_id,
	documents.id AS 'document_id',
	documents.state,
	documents.checked_out_by,
	documents.updated_by,
	document_types.id AS 'document_type_id',
	document_types.name AS 'document_type_name',
	versions.binary_content_type,documents.name,
	versions.major_version_number,
	versions.minor_version_number,
	versions.binary_file_size,
	viewable.active_permissions
FROM `references`
INNER JOIN (
	SELECT acls.securable_id AS id, roles.permissions AS active_permissions 
	FROM acls
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
	LIMIT 25 OFFSET 0
) AS viewable ON viewable.id = references.id
INNER JOIN documents ON documents.id = references.document_id
INNER JOIN versions ON versions.document_id = documents.id AND is_current_version = true
INNER JOIN document_types ON document_types.id = documents.document_type_id 
WHERE `references`.`library_id` = 1 AND (folder_id = 1) AND ((documents.state & 2048 = 0)) 
ORDER BY documents.name ASC;

#7b)
# LIMIT before join with documents table
# NOTE: bummer can't do it this way because it would screw up ordering.
#:> duration 2.184s
SELECT
	viewable_references.id,
	viewable_references.reference_type,
	viewable_references.folder_id,
	viewable_references.active_permissions,
	documents.id AS 'document_id',
	documents.name,
	documents.state,
	documents.checked_out_by,
	documents.updated_by,
	document_types.id AS 'document_type_id',
	document_types.name AS 'document_type_name',
	versions.binary_content_type,documents.name,
	versions.major_version_number,
	versions.minor_version_number,
	versions.binary_file_size
FROM documents
INNER JOIN (
	SELECT
		references.id,
		references.reference_type,		
		references.document_id,
		references.folder_id,
		viewable.active_permissions
	FROM `references`
	INNER JOIN (
		SELECT acls.securable_id AS id, roles.permissions AS active_permissions 
		FROM acls
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
	WHERE `references`.`library_id` = 1 AND `references`.folder_id = 1
	LIMIT 25 OFFSET 0
) as viewable_references ON viewable_references.document_id = documents.id
INNER JOIN versions ON versions.document_id = documents.id AND is_current_version = true
INNER JOIN document_types ON document_types.id = documents.document_type_id 
WHERE documents.state & 2048 = 0
ORDER BY documents.name ASC;

#7c)
# LIMIT before join with documents table
#:> duration 5.422s
SELECT
	viewable_references.id,
	viewable_references.reference_type,
	viewable_references.folder_id,
	viewable_references.active_permissions,
	documents.id AS 'document_id',
	documents.name,
	documents.state,
	documents.checked_out_by,
	documents.updated_by,
	document_types.id AS 'document_type_id',
	document_types.name AS 'document_type_name',
	versions.binary_content_type,documents.name,
	versions.major_version_number,
	versions.minor_version_number,
	versions.binary_file_size
FROM documents
INNER JOIN (
	SELECT
		references.id,
		references.reference_type,		
		references.document_id,
		references.folder_id,
		viewable.active_permissions
	FROM `references`
	INNER JOIN (
		SELECT acls.securable_id AS id, roles.permissions AS active_permissions 
		FROM acls
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
	WHERE `references`.`library_id` = 1 AND `references`.folder_id = 1
) as viewable_references ON viewable_references.document_id = documents.id
INNER JOIN versions ON versions.document_id = documents.id AND is_current_version = true
INNER JOIN document_types ON document_types.id = documents.document_type_id 
WHERE documents.state & 2048 = 0
ORDER BY documents.name ASC
LIMIT 25 OFFSET 0;





