module ReferencesHelper
  REFERENCE_TERSE = {
      'references.id' => 'references.id',
      'documents.id' => 'documents.id AS \'document_id\'',
      'documents.state' => 'documents.state'
  }


  def self.columns_by_doctype(document)

    #Return only system-properties and properties defined in the doctype
    columns = {
      'references.id' => 'id',
      'references.folder_id' => 'folder_id',
      'references.active_permissions' => 'active_permissions',
      'documents.id' => 'document_id',
      'documents.state' => 'state',
      'documents.name' => 'name',
      'documents.checked_out_by' => 'checked_out_by',
      'documents.description' => 'description',
      'documents.created_at' => 'created_at',
      'documents.created_by' => 'created_by',
      'documents.updated_at' => 'updated_at',
      'documents.updated_by' => 'updated_by',
      'document_types.id' => 'document_type_id',
      'document_types.name' => 'document_type_name',
      'versions.binary_content_type' => 'binary_content_type',
      'versions.binary_file_name' => 'binary_file_name',
      'versions.binary_file_size' => 'binary_file_size',
      'versions.major_version_number' => 'major_version_number',
      'versions.minor_version_number' => 'minor_version_number',
    }

    #add properties from document type
    document.document_type.property_mappings.each do |property_mapping|
      property_definition = property_mapping.property_definition
      dbName = property_definition.dbName
      columns[dbName] = property_definition.column_name unless columns.include?(dbName)
    end

    return columns.values

=begin
    columns = [
      'id',
      'name',
      'state',
      'checked_out_by',
      'created_at',
      'created_by',
      'updated_at',
      'updated_by',
      'active_permissions',
      'folder_id',
      'document_type_id',
      'document_type_name',
      'binary_content_type',
      'binary_file_name',
      'binary_file_size',
      'major_version_number',
      'minor_version_number'
      ]
=end

      #add properties from document type

  end

  def self.generate_range(request)
    start_idx = 0
    max_rows = -1

    if request.headers['dojo-Range']
      _, s, e = request.headers['dojo-Range'].match(/items=([^-]*)-(.*)/).to_a
      start_idx = s.to_i
      end_idx = e.to_i
      max_rows = (end_idx - start_idx) + 1
    end

    return {'offset' => start_idx, 'row_count' => max_rows }
  end

  def self.generate_sort(params)
    sort_info = ['documents.name', 'ASC']

    params.each do |param|

      p = param[0].strip
      if(p.slice!(0..3) == 'sort')
        column_data = p.gsub(/[()]/, '')
        order = column_data.slice!(0).chr == '-' ? 'DESC' : 'ASC'
        sort_info[0] = column_data
        sort_info[1] = order
      end

    end

    if(sort_info[0]=='versions.version_number')
      sort_info[0]='versions.major_version_number'
      sort_info[2]=',versions.minor_version_number'
      sort_info[3]=sort_info[1]
    end

    return sort_info.join(' ')
  end

end
