# Re-writing root acl joins with emphasis on earliest limit...
#1)
# select MAX precedence all the acls (of type "reference") ordered by 
# retrieves highest precedence acl for each "reference" for the specified user/group
#:> duration 0.018s
#NOTE: Not much we can do here???
SELECT acls.id, MAX(precedence) as precedence
FROM acls
INNER JOIN acl_entries ON acl_entries.acl_id = acls.id
WHERE (securable_type = 'Reference') AND ((grantee_id = 1 AND grantee_type ='User') OR (grantee_id = 1 AND grantee_type = 'Group') OR (grantee_id = 2 AND grantee_type = 'Group'))
GROUP BY securable_id;

#2) 
# NOW selecting the references based on the folder and limited to 25
# Should retrieve the first 25 references in the folder
#:> duration 0.028s
SELECT 
	references.id,
	refacl.acl_id,
	refacl.precedence
FROM `references`
INNER JOIN (
	SELECT acls.id as 'acl_id', acls.securable_id, MAX(acl_entries.precedence) as precedence
	FROM acls
	INNER JOIN acl_entries ON acl_entries.acl_id = acls.id
	WHERE (securable_type = 'Reference') AND ((grantee_id = 1 AND grantee_type ='User') OR (grantee_id = 1 AND grantee_type = 'Group') OR (grantee_id = 2 AND grantee_type = 'Group'))
	GROUP BY securable_id
) AS refacl ON `references`.id = refacl.securable_id
WHERE `references`.`library_id` = 1 AND (folder_id = 1)
LIMIT 25 OFFSET 0;

#3) 
# MUST join with roles here, don't want to return documents to which the user does not have permissions.
# Now we should have first 25 references in folder where user permissions are not set to "NONE"
#:> duration 0.082s
SELECT 
	references.id,
	references.document_id,
	roles.permissions AS 'active_permissions'
FROM `references`
INNER JOIN (
	SELECT acls.id as 'acl_id', acls.securable_id, MAX(acl_entries.precedence) as precedence
	FROM acls
	INNER JOIN acl_entries ON acl_entries.acl_id = acls.id
	WHERE (securable_type = 'Reference') AND ((grantee_id = 1 AND grantee_type ='User') OR (grantee_id = 1 AND grantee_type = 'Group') OR (grantee_id = 2 AND grantee_type = 'Group'))
	GROUP BY securable_id
) AS refacl ON `references`.id = refacl.securable_id
INNER JOIN acl_entries ON acl_entries.acl_id = refacl.acl_id AND refacl.precedence = acl_entries.precedence
INNER JOIN roles ON roles.id = acl_entries.role_id  
WHERE `references`.`library_id` = 1 AND (folder_id = 1) AND (roles.permissions != 0)
LIMIT 25 OFFSET 0;

#4)
# MUST join with documents here, don't want to return deleted documents
#:> duration 0.066
SELECT 
	references.id,
	roles.permissions AS 'active_permissions'
FROM `references`
INNER JOIN (
	SELECT acls.id as 'acl_id', acls.securable_id, MAX(acl_entries.precedence) as precedence
	FROM acls
	INNER JOIN acl_entries ON acl_entries.acl_id = acls.id
	WHERE (securable_type = 'Reference') AND ((grantee_id = 1 AND grantee_type ='User') OR (grantee_id = 1 AND grantee_type = 'Group') OR (grantee_id = 2 AND grantee_type = 'Group'))
	GROUP BY securable_id
) AS refacl ON `references`.id = refacl.securable_id
INNER JOIN acl_entries ON acl_entries.acl_id = refacl.acl_id AND refacl.precedence = acl_entries.precedence
INNER JOIN roles ON roles.id = acl_entries.role_id  
INNER JOIN documents ON documents.id = references.document_id
WHERE `references`.`library_id` = 1 AND (folder_id = 1) AND (roles.permissions != 0) AND (documents.state & 2048 = 0)
LIMIT 25 OFFSET 0;

#5)
# MUST join with documents, versions, document_types for ordering.
#:> duration 0.066
SELECT active_permissions.acl_id, roles.permissions
FROM roles
INNER JOIN (
	SELECT active.acl_id, acl_entries.id, acl_entries.role_id
	FROM acl_entries
	INNER JOIN (
		SELECT acls.id as 'acl_id', acls.securable_id, MAX(acl_entries.precedence) as precedence
		FROM acls
		INNER JOIN acl_entries ON acl_entries.acl_id = acls.id
		WHERE (securable_type = 'Folder') AND ((grantee_id = 1 AND grantee_type ='User') OR (grantee_id = 1 AND grantee_type = 'Group') OR (grantee_id = 2 AND grantee_type = 'Group'))
		GROUP BY securable_id
	) AS active ON (acl_entries.acl_id = active.acl_id AND acl_entries.precedence = active.precedence)
) AS active_permissions ON roles.id = active_permissions.role_id




SELECT count(*) 
FROM acls
INNER JOIN acl_entries ON acl_entries.acl_id = acls.id
WHERE (securable_type = 'Reference') AND ((grantee_id = 1 AND grantee_type ='User') OR (grantee_id = 1 AND grantee_type = 'Group') OR (grantee_id = 2 AND grantee_type = 'Group'))

GROUP BY securable_id

SELECT acls.id as 'acl_id', acls.securable_id, acls.securable_type, MAX(acl_entries.precedence) as precedence
FROM acls
INNER JOIN acl_entries ON acl_entries.acl_id = acls.id
WHERE (securable_type = 'Reference') AND ((grantee_id = 1 AND grantee_type ='User') OR (grantee_id = 1 AND grantee_type = 'Group') OR (grantee_id = 2 AND grantee_type = 'Group'))
GROUP BY securable_id



SELECT * FROM (
SELECT 
	references.id,
	documents.name,
	roles.permissions AS 'active_permissions'
FROM `references`
INNER JOIN (
	SELECT acls.id as 'acl_id', acls.securable_id, MAX(acl_entries.precedence) as precedence
	FROM acls
	INNER JOIN acl_entries ON acl_entries.acl_id = acls.id
	WHERE (securable_type = 'Reference') AND ((grantee_id = 1 AND grantee_type ='User') OR (grantee_id = 1 AND grantee_type = 'Group') OR (grantee_id = 2 AND grantee_type = 'Group'))
	GROUP BY securable_id
) AS refacl ON `references`.id = refacl.securable_id
INNER JOIN acl_entries ON acl_entries.acl_id = refacl.acl_id AND refacl.precedence = acl_entries.precedence
INNER JOIN roles ON roles.id = acl_entries.role_id  
INNER JOIN documents ON documents.id = references.document_id
WHERE `references`.`library_id` = 1 AND (folder_id = 1) AND (roles.permissions != 0) AND (documents.state & 2048 = 0)
) AS results
LIMIT 25 OFFSET 0;

CHECK TABLE `references` FOR UPGRADE;
CHECK TABLE documents FOR UPGRADE;

SELECT 
	references.id,
	refacl.acl_id
FROM `references`
INNER JOIN (
	SELECT acls.id as 'acl_id', acls.securable_id, MAX(precedence) as precedence
	FROM acls
	INNER JOIN acl_entries ON acl_entries.acl_id = acls.id
	WHERE (securable_type = 'Reference') AND ((grantee_id = 1 AND grantee_type ='User') OR (grantee_id = 1 AND grantee_type = 'Group') OR (grantee_id = 2 AND grantee_type = 'Group'))
	GROUP BY securable_id
) AS refacl ON `references`.id = refacl.securable_id
WHERE `references`.`library_id` = 1 AND (folder_id = 1)


LIMIT 25 OFFSET 0;

#2b)
# MUST join with documents here, don't want to return deleted documents.
#:> duration 0.021
SELECT 
	references.id,
	refacl.acl_id
FROM `references`
INNER JOIN (
	SELECT acls.id as 'acl_id', acls.securable_id, MAX(precedence) as precedence
	FROM acls
	INNER JOIN acl_entries ON acl_entries.acl_id = acls.id
	WHERE (securable_type = 'Reference') AND ((grantee_id = 1 AND grantee_type ='User') OR (grantee_id = 1 AND grantee_type = 'Group') OR (grantee_id = 2 AND grantee_type = 'Group'))
	GROUP BY securable_id
) AS refacl ON `references`.id = refacl.securable_id
INNER JOIN documents ON documents.id = references.document_id 
WHERE `references`.`library_id` = 1 AND (folder_id = 1) AND (documents.state & 2048 = 0)
LIMIT 25 OFFSET 0;