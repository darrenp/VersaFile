class UpdateOptimize1 < ActiveRecord::Migration

  def up
    add_index(:acl_entries, :acl_id) unless index_exists?(:acl_entries, :acl_id)
    add_index(:acl_entries, :role_id) unless index_exists?(:acl_entries, :role_id)
    add_index(:acl_entries, [:grantee_id, :grantee_type]) unless index_exists?(:acl_entries, [:grantee_id, :grantee_type])
    add_index(:acls, [:securable_id, :securable_type]) unless index_exists?(:acls, [:securable_id, :securable_type])
    add_index(:cell_definitions, :view_definition_id) unless index_exists?(:cell_definitions, :view_definition_id)
    add_index(:choice_values, :choice_list_id) unless index_exists?(:choice_values, :choice_list_id)
    add_index(:documents, :document_type_id) unless index_exists?(:documents, :document_type_id)
    add_index(:folders, :parent_id) unless index_exists?(:folders, :parent_id)
    add_index(:property_mappings, :document_type_id) unless index_exists?(:property_mappings, :document_type_id)
    add_index(:property_mappings, :property_definition_id) unless index_exists?(:property_mappings, :property_definition_id)
    add_index(:references, :document_id) unless index_exists?(:references, :document_id)
    add_index(:references, :folder_id) unless index_exists?(:references, :folder_id)
    add_index(:shares, :folder_id) unless index_exists?(:shares, :folder_id)
    add_index(:versions, :document_id) unless index_exists?(:versions, :document_id)
    add_index(:view_mappings, [:folder_id, :user_id], :unique => true) unless index_exists?(:view_mappings, [:folder_id, :user_id])
    add_index(:view_mappings, :view_definition_id) unless index_exists?(:view_mappings, :view_definition_id)
    add_index(:zones, :subdomain, :unique => true) unless index_exists?(:zones, :subdomain, :unique => true)
  end

  def down
    remove_index(:zones, :subdomain) if index_exists?(:zones, :subdomain)
    remove_index(:view_mappings, :view_definition_id) if index_exists?(:view_mappings, :view_definition_id)
    remove_index(:view_mappings, [:folder_id, :user_id]) if index_exist?(:view_mappings, [:folder_id, :user_id])
    remove_index(:shares, :folder_id) if index_exist?(:shares, :folder_id)
    remove_index(:references, :document_id) if index_exist?(:references, :document_id)
    remove_index(:references, :folder_id) if index_exist?(:references, :folder_id)
    remove_index(:property_mappings, :property_definition_id) if index_exist?(:property_mappings, :property_definition_id)
    remove_index(:property_mappings, :document_type_id) if index_exist?(:property_mappings, :document_type_id)
    remove_index(:folders, :parent_id) if index_exist?(:folders, :parent_id)
    remove_index(:documents, :document_type_id) if index_exist?(:documents, :document_type_id)
    remove_index(:choice_values, :choice_list_id) if index_exist?(:choice_values, :choice_list_id)
    remove_index(:cell_definitions, :view_definition_id) if index_exist?(:cell_definitions, :view_definition_id)
    remove_index(:acls, [:securable_id, :securable_type]) if index_exist?(:acls, [:securable_id, :securable_type])
    remove_index(:acl_entries, [:grantee_id, :grantee_type]) if index_exist?(:acl_entries, [:grantee_id, :grantee_type])
    remove_index(:acl_entries, :acl_id) if index_exist?(:acl_entries, :acl_id)
    remove_index(:acl_entries, :role_id) if index_exist?(:acl_entries, :role_id)
  end

end
