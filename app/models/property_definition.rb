class PropertyDefinition < ActiveRecord::Base
  belongs_to :library
  belongs_to :data_type
  has_many :property_mappings
  has_many  :document_types,
            :through => :property_mappings

  def document_types_count
    return self.document_types.length
  end

  def dbName
    return self.table_name + "." + self.column_name
  end

  def dojo_url
    return "/zones/#{self.library.zone.subdomain}/libraries/#{self.library.id}/property_definitions/#{self.id}"
  end


  def package(root_folder)

    exportable = {
        :name => self.name,
        :description => self.description,
        :data_type_id => self.data_type.id,
        :cardinality => self.cardinality,
        :max_length => self.max_length,
        :created_at => self.created_at,
        :created_by => self.created_by,
        :updated_at => self.updated_at,
        :updated_by => self.updated_by,
    }

    _json = ActiveSupport::JSON.encode(exportable)

    json_file = File.join(root_folder, "#{self.name}.json")
    json_file = Pathname.new(json_file).cleanpath()
    File.open(json_file, 'w'){ |json_file| json_file.write _json }

  end

  def self.unpackage(library, file_path)

    import_json = ActiveSupport::JSON.decode(IO.read(file_path))

    property_column = nil
    property_definition = library.property_definitions.find_by_name(import_json['name'])
    if property_definition.nil?

      #deterimine next available column for data type
      property_column = library.property_columns.find_by_data_type_id(import_json['data_type_id'])
      column = property_column.next

      property_definition = library.property_definitions.new(
          :name => import_json['name'],
          :data_type => property_column.data_type,
          :table_name => 'documents',
          :column_name => column[:name]
      )
    end

    merge(property_definition, import_json)

    #mark the column as "taken"
    unless property_column.nil?
      property_column.set_column(column[:index], true)
      unless property_column.save

      end
    end

  end

private

  def self.merge(property_definition, data)

    begin

      property_definition.description = data['description'] unless data['description'].nil?
      property_definition.cardinality = data['cardinality'] unless data['cardinality'].nil?
      property_definition.max_length = data['max_length'] unless data['max_length'].nil?
      property_definition.created_by = data['created_by'] unless data['created_by'].nil?
      property_definition.created_at = data['created_at'] unless data['created_at'].nil?
      property_definition.updated_by = data['updated_by'] unless data['updated_by'].nil?
      property_definition.updated_at = data['updated_at'] unless data['updated_at'].nil?

      PropertyDefinition.record_timestamps = false
      unless property_definition.save

      end

    ensure
      PropertyDefinition.record_timestamps = true
    end

  end

end
