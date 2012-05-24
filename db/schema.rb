# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120524161632) do

  create_table "accounts", :force => true do |t|
    t.string   "email",                                      :null => false
    t.string   "customer_code"
    t.string   "name",                                       :null => false
    t.string   "first_name"
    t.string   "last_name"
    t.string   "address"
    t.string   "city"
    t.string   "postal_code",   :limit => 32
    t.string   "province",      :limit => 8
    t.string   "country",       :limit => 8
    t.string   "phone",         :limit => 32
    t.integer  "billing_type"
    t.integer  "account_type"
    t.integer  "trial_period"
    t.string   "password",      :limit => 64
    t.integer  "status",                      :default => 0
    t.string   "created_by"
    t.string   "updated_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "acl_entries", :force => true do |t|
    t.integer "acl_id"
    t.integer "role_id"
    t.integer "grantee_id"
    t.string  "grantee_type"
    t.integer "precedence"
  end

  add_index "acl_entries", ["acl_id"], :name => "index_acl_entries_on_acl_id"
  add_index "acl_entries", ["grantee_id", "grantee_type"], :name => "index_acl_entries_on_grantee_id_and_grantee_type"
  add_index "acl_entries", ["role_id"], :name => "index_acl_entries_on_role_id"

  create_table "acls", :force => true do |t|
    t.integer "zone_id",        :null => false
    t.integer "securable_id"
    t.string  "securable_type"
    t.boolean "inherits"
  end

  add_index "acls", ["securable_id", "securable_type"], :name => "index_acls_on_securable_id_and_securable_type"

  create_table "avatars", :force => true do |t|
    t.integer  "zone_id",            :null => false
    t.integer  "imageable_id"
    t.string   "imageable_type"
    t.string   "image_file_name",    :null => false
    t.string   "image_storage_name", :null => false
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "cell_definitions", :force => true do |t|
    t.integer "library_id"
    t.integer "view_definition_id"
    t.string  "table_name"
    t.string  "column_name"
    t.string  "name"
    t.string  "label"
    t.integer "formatter"
    t.boolean "noresize"
    t.string  "width"
    t.string  "style"
    t.integer "column_order"
    t.string  "date_format"
  end

  add_index "cell_definitions", ["view_definition_id"], :name => "index_cell_definitions_on_view_definition_id"

  create_table "choice_lists", :force => true do |t|
    t.integer  "library_id"
    t.string   "name"
    t.string   "description"
    t.integer  "data_type_id"
    t.string   "created_by"
    t.string   "updated_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "choice_values", :force => true do |t|
    t.integer "choice_list_id"
    t.string  "value"
    t.string  "name"
    t.integer "sort_order"
  end

  add_index "choice_values", ["choice_list_id"], :name => "index_choice_values_on_choice_list_id"

  create_table "configuration_settings", :force => true do |t|
    t.integer "configuration_id"
    t.string  "name"
    t.string  "value"
  end

  create_table "configurations", :force => true do |t|
    t.integer "zone_id",           :null => false
    t.integer "configurable_id"
    t.string  "configurable_type"
  end

  create_table "content_types", :force => true do |t|
    t.string "binary_content_type"
    t.string "open_as"
  end

  create_table "data_types", :force => true do |t|
    t.string  "name"
    t.string  "prefix"
    t.boolean "allow_choice_list", :default => false
  end

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "document_types", :force => true do |t|
    t.integer  "library_id"
    t.string   "name"
    t.text     "description"
    t.boolean  "is_system",   :default => false
    t.string   "created_by"
    t.string   "updated_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "documents", :force => true do |t|
    t.integer  "zone_id"
    t.integer  "library_id"
    t.string   "name",                                                  :null => false
    t.integer  "document_type_id",                                      :null => false
    t.string   "checked_out_by"
    t.string   "created_by"
    t.string   "updated_by"
    t.integer  "state",            :limit => 8,          :default => 0
    t.text     "description"
    t.text     "body",             :limit => 2147483647
    t.text     "metadata"
    t.text     "custom_metadata"
    t.string   "prp_str001"
    t.string   "prp_str002"
    t.string   "prp_str003"
    t.string   "prp_str004"
    t.string   "prp_str005"
    t.string   "prp_str006"
    t.string   "prp_str007"
    t.string   "prp_str008"
    t.string   "prp_str009"
    t.string   "prp_str010"
    t.string   "prp_str011"
    t.string   "prp_str012"
    t.string   "prp_str013"
    t.string   "prp_str014"
    t.string   "prp_str015"
    t.string   "prp_str016"
    t.string   "prp_str017"
    t.string   "prp_str018"
    t.string   "prp_str019"
    t.string   "prp_str020"
    t.string   "prp_str021"
    t.string   "prp_str022"
    t.string   "prp_str023"
    t.string   "prp_str024"
    t.string   "prp_str025"
    t.string   "prp_str026"
    t.string   "prp_str027"
    t.string   "prp_str028"
    t.string   "prp_str029"
    t.string   "prp_str030"
    t.string   "prp_str031"
    t.string   "prp_str032"
    t.string   "prp_str033"
    t.string   "prp_str034"
    t.string   "prp_str035"
    t.string   "prp_str036"
    t.string   "prp_str037"
    t.string   "prp_str038"
    t.string   "prp_str039"
    t.string   "prp_str040"
    t.string   "prp_str041"
    t.string   "prp_str042"
    t.string   "prp_str043"
    t.string   "prp_str044"
    t.string   "prp_str045"
    t.string   "prp_str046"
    t.string   "prp_str047"
    t.string   "prp_str048"
    t.string   "prp_str049"
    t.string   "prp_str050"
    t.string   "prp_str051"
    t.string   "prp_str052"
    t.string   "prp_str053"
    t.string   "prp_str054"
    t.string   "prp_str055"
    t.string   "prp_str056"
    t.string   "prp_str057"
    t.string   "prp_str058"
    t.string   "prp_str059"
    t.string   "prp_str060"
    t.string   "prp_str061"
    t.string   "prp_str062"
    t.string   "prp_str063"
    t.string   "prp_str064"
    t.boolean  "prp_bln001"
    t.boolean  "prp_bln002"
    t.boolean  "prp_bln003"
    t.boolean  "prp_bln004"
    t.boolean  "prp_bln005"
    t.boolean  "prp_bln006"
    t.boolean  "prp_bln007"
    t.boolean  "prp_bln008"
    t.boolean  "prp_bln009"
    t.boolean  "prp_bln010"
    t.boolean  "prp_bln011"
    t.boolean  "prp_bln012"
    t.boolean  "prp_bln013"
    t.boolean  "prp_bln014"
    t.boolean  "prp_bln015"
    t.boolean  "prp_bln016"
    t.boolean  "prp_bln017"
    t.boolean  "prp_bln018"
    t.boolean  "prp_bln019"
    t.boolean  "prp_bln020"
    t.boolean  "prp_bln021"
    t.boolean  "prp_bln022"
    t.boolean  "prp_bln023"
    t.boolean  "prp_bln024"
    t.integer  "prp_int001"
    t.integer  "prp_int002"
    t.integer  "prp_int003"
    t.integer  "prp_int004"
    t.integer  "prp_int005"
    t.integer  "prp_int006"
    t.integer  "prp_int007"
    t.integer  "prp_int008"
    t.integer  "prp_int009"
    t.integer  "prp_int010"
    t.integer  "prp_int011"
    t.integer  "prp_int012"
    t.integer  "prp_int013"
    t.integer  "prp_int014"
    t.integer  "prp_int015"
    t.integer  "prp_int016"
    t.float    "prp_flt001"
    t.float    "prp_flt002"
    t.float    "prp_flt003"
    t.float    "prp_flt004"
    t.float    "prp_flt005"
    t.float    "prp_flt006"
    t.float    "prp_flt007"
    t.float    "prp_flt008"
    t.float    "prp_flt009"
    t.float    "prp_flt010"
    t.float    "prp_flt011"
    t.float    "prp_flt012"
    t.float    "prp_flt013"
    t.float    "prp_flt014"
    t.float    "prp_flt015"
    t.float    "prp_flt016"
    t.datetime "prp_dtt001"
    t.datetime "prp_dtt002"
    t.datetime "prp_dtt003"
    t.datetime "prp_dtt004"
    t.datetime "prp_dtt005"
    t.datetime "prp_dtt006"
    t.datetime "prp_dtt007"
    t.datetime "prp_dtt008"
    t.datetime "prp_dtt009"
    t.datetime "prp_dtt010"
    t.datetime "prp_dtt011"
    t.datetime "prp_dtt012"
    t.datetime "prp_dtt013"
    t.datetime "prp_dtt014"
    t.datetime "prp_dtt015"
    t.datetime "prp_dtt016"
    t.text     "prp_txt001"
    t.text     "prp_txt002"
    t.text     "prp_txt003"
    t.text     "prp_txt004"
    t.text     "prp_txt005"
    t.text     "prp_txt006"
    t.text     "prp_txt007"
    t.text     "prp_txt008"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "documents", ["body", "metadata", "custom_metadata"], :name => "fulltext_document"
  add_index "documents", ["document_type_id"], :name => "index_documents_on_document_type_id"

  create_table "folders", :force => true do |t|
    t.integer  "zone_id"
    t.integer  "library_id"
    t.integer  "parent_id"
    t.string   "name",        :null => false
    t.string   "created_by"
    t.string   "updated_by"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "folder_type"
  end

  add_index "folders", ["parent_id"], :name => "index_folders_on_parent_id"

  create_table "groups", :force => true do |t|
    t.integer  "zone_id"
    t.string   "name"
    t.string   "description"
    t.boolean  "is_admin",    :default => false
    t.boolean  "is_everyone", :default => false
    t.string   "created_by"
    t.string   "updated_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groups_users", :id => false, :force => true do |t|
    t.integer "group_id"
    t.integer "user_id"
  end

  create_table "icons", :force => true do |t|
    t.string "content_type"
    t.string "file_name"
  end

  create_table "libraries", :force => true do |t|
    t.integer  "zone_id"
    t.string   "name"
    t.string   "description"
    t.string   "created_by"
    t.string   "updated_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "operators", :force => true do |t|
    t.integer "data_type_id"
    t.string  "name"
    t.string  "value"
    t.string  "template"
    t.boolean "no_rhs",       :default => false
  end

  create_table "preview_elements", :force => true do |t|
    t.integer  "zone_id"
    t.string   "content_type"
    t.text     "element_template"
    t.boolean  "maintain_aspect_ratio", :default => false
    t.string   "created_by"
    t.string   "updated_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "property_columns", :force => true do |t|
    t.integer "library_id"
    t.integer "data_type_id"
    t.integer "column_mask",  :limit => 8, :default => 0
    t.integer "max_columns"
  end

  create_table "property_definitions", :force => true do |t|
    t.integer  "library_id"
    t.integer  "data_type_id"
    t.string   "name"
    t.text     "description"
    t.string   "table_name"
    t.string   "column_name"
    t.integer  "cardinality"
    t.integer  "max_length"
    t.boolean  "is_system"
    t.boolean  "is_readonly"
    t.boolean  "is_name",      :default => false
    t.string   "created_by"
    t.string   "updated_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "property_mappings", :force => true do |t|
    t.integer "document_type_id"
    t.integer "property_definition_id"
    t.integer "sort_order"
    t.boolean "is_required"
    t.string  "default_value"
    t.integer "choice_list_id"
    t.integer "default_type",           :default => 0
  end

  add_index "property_mappings", ["document_type_id"], :name => "index_property_mappings_on_document_type_id"
  add_index "property_mappings", ["property_definition_id"], :name => "index_property_mappings_on_property_definition_id"

  create_table "references", :force => true do |t|
    t.integer "reference_type"
    t.integer "library_id"
    t.integer "folder_id"
    t.integer "document_id"
  end

  add_index "references", ["document_id"], :name => "index_references_on_document_id"
  add_index "references", ["folder_id"], :name => "index_references_on_folder_id"

  create_table "rko_users", :force => true do |t|
    t.string   "name"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "password"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "roles", :force => true do |t|
    t.integer  "zone_id",                  :null => false
    t.string   "name",                     :null => false
    t.integer  "permissions", :limit => 8, :null => false
    t.string   "created_by"
    t.string   "updated_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "servers", :force => true do |t|
    t.string   "name"
    t.string   "protocol"
    t.string   "host"
    t.integer  "port"
    t.boolean  "active",     :default => false
    t.boolean  "current",    :default => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "shares", :force => true do |t|
    t.integer  "library_id"
    t.integer  "folder_id"
    t.string   "fingerprint"
    t.string   "password"
    t.datetime "expiry"
  end

  add_index "shares", ["folder_id"], :name => "index_shares_on_folder_id"

  create_table "users", :force => true do |t|
    t.integer  "zone_id"
    t.string   "name",                                 :null => false
    t.boolean  "is_admin",          :default => false
    t.string   "password",                             :null => false
    t.string   "email"
    t.string   "first_name"
    t.string   "last_name"
    t.integer  "state"
    t.string   "created_by"
    t.string   "updated_by"
    t.datetime "password_expires"
    t.string   "reset_fingerprint"
    t.string   "reset_password"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "versions", :force => true do |t|
    t.integer "zone_id"
    t.integer "document_id"
    t.string  "binary_file_name"
    t.string  "binary_storage_name"
    t.string  "binary_content_type"
    t.integer "binary_file_size"
    t.string  "binary_uniqueness_key"
    t.boolean "is_current_version"
    t.integer "major_version_number"
    t.integer "minor_version_number"
    t.integer "library_id"
  end

  add_index "versions", ["document_id"], :name => "index_versions_on_document_id"

  create_table "view_definitions", :force => true do |t|
    t.integer  "library_id"
    t.string   "name"
    t.string   "description"
    t.string   "scope"
    t.string   "sort_by"
    t.boolean  "is_system",   :default => false
    t.string   "created_by"
    t.string   "updated_by"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_template", :default => true
    t.boolean  "is_desc",     :default => false
  end

  create_table "view_mappings", :force => true do |t|
    t.integer "library_id"
    t.integer "folder_id"
    t.integer "user_id"
    t.integer "view_definition_id"
  end

  add_index "view_mappings", ["folder_id", "user_id"], :name => "index_view_mappings_on_folder_id_and_user_id", :unique => true
  add_index "view_mappings", ["view_definition_id"], :name => "index_view_mappings_on_view_definition_id"

  create_table "zone_nodes", :force => true do |t|
    t.integer  "account_id"
    t.integer  "server_id"
    t.string   "name"
    t.string   "subdomain"
    t.string   "fingerprint"
    t.string   "status"
    t.integer  "current_users",                   :default => 0
    t.integer  "max_users"
    t.integer  "current_disk_space", :limit => 8, :default => 0
    t.integer  "max_disk_space",     :limit => 8
    t.boolean  "deployed"
    t.integer  "template_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "zone_templates", :force => true do |t|
    t.string "name"
    t.string "folder_name"
  end

  create_table "zones", :force => true do |t|
    t.string   "subdomain"
    t.string   "name"
    t.string   "fingerprint"
    t.string   "created_by"
    t.string   "updated_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "zones", ["subdomain"], :name => "index_zones_on_subdomain", :unique => true

end
