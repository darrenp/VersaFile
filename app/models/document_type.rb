class DocumentType < ActiveRecord::Base
  belongs_to :library
  has_many :documents
  has_many :users
  has_many :property_mappings, :dependent => :destroy, :include => :property_definition, :order=>"sort_order"
  has_many  :property_definitions,
            :through => :property_mappings,
            :order => "sort_order"

  attr_accessor :sort_id

  def dojo_url
    return "/zones/#{self.library.zone.subdomain}/libraries/#{self.library.id}/document_types/#{self.id}"
  end

  def metrics()
    doc_count = self.documents.count
    return {:document_count => doc_count }
  end

  def package(root_folder)

    exportable = {
        :name => self.name,
        :description => self.description,
        :created_at => self.created_at,
        :created_by => self.created_by,
        :updated_at => self.updated_at,
        :updated_by => self.updated_by,
        :property_mappings => []
    }

    self.property_mappings.each do |property_mapping|
      exportable[:property_mappings] << {
          :property_definition =>  property_mapping.property_definition.name,
          :sort_order => property_mapping.sort_order,
          :is_required => property_mapping.is_required,
          :default_value => property_mapping.default_value,
          :choice_list => (property_mapping.choice_list.nil?) ? nil : property_mapping.choice_list.name
      }
    end

    _json = ActiveSupport::JSON.encode(exportable)

    json_file = File.join(root_folder, "#{self.name}.json")
    json_file = Pathname.new(json_file).cleanpath()
    File.open(json_file, 'w'){ |json_file| json_file.write _json }

  end

  def self.unpackage(library, file_path)

    import_json = ActiveSupport::JSON.decode(IO.read(file_path))

    document_type = library.document_types.find_by_name(import_json['name'])
    if document_type.nil?
      document_type = library.document_types.new(:name => import_json['name'])
    end

    merge(document_type, import_json)

  end

private

  def self.merge(document_type, data)

    begin

      document_type.description = data['description'] unless data['description'].nil?
      document_type.created_by = data['created_by'] unless data['created_by'].nil?
      document_type.created_at = data['created_at'] unless data['created_at'].nil?
      document_type.updated_by = data['updated_by'] unless data['updated_by'].nil?
      document_type.updated_at = data['updated_at'] unless data['updated_at'].nil?

      document_type.property_mappings.destroy_all
      unless data['property_mappings'].nil?
        data['property_mappings'].each do |property_mapping|
          property_definition = document_type.library.property_definitions.find_by_name(property_mapping['property_definition'])
          choice_list = (property_mapping['choice_list'].nil? ?
                          nil :
                          document_type.library.choice_lists.find_by_name(property_mapping['choice_list']))

          document_type.property_mappings << PropertyMapping.create(
            :property_definition => property_definition,
            :sort_order => property_mapping['sort_order'],
            :is_required => property_mapping['is_required'],
            :choice_list => choice_list,
            :default_value => property_mapping['default_value']
          )

        end
      end

      DocumentType.record_timestamps = false
      unless document_type.save

      end

    ensure
      DocumentType.record_timestamps = true
    end

  end

end
