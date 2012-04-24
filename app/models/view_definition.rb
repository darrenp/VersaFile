class ViewDefinition < ActiveRecord::Base
  belongs_to :library
  has_many  :cell_definitions,
            :order => "column_order",
            :dependent => :destroy
  has_many :view_mappings, :dependent => :destroy

  attr_accessor :sort_id

  def dojo_url
    return "/zones/#{self.library.zone.subdomain}/libraries/#{self.library.id}/view_definitions/#{self.id}"
  end

  def self.from_document_type(library, document_type, created_by, is_system)
     
    i = 0
    view_definition = library.view_definitions.new(
      :name => document_type.name,
      :scope => "*",
      :sort_by => "documents.name",
      :is_system => is_system,
      :is_template=>true,
      :created_by => created_by,
      :updated_by => created_by
    )
    
    #Create icon column   
    cell_def = view_definition.cell_definitions.new(
        :library_id => library.id,
        :table_name => "documents",
        :column_name => "state",
        :name => "State",
        :label => "",
        :formatter => 4,
        :noresize => true,
        :width => "18px",
        :style => "",
        :column_order => i
      )
     view_definition.cell_definitions.push(cell_def)
     i += 1
    
    cell_def = view_definition.cell_definitions.new(
      :library_id => library.id,
      :table_name => "versions",
      :column_name => "binary_content_type",
      :name => "Content Type",
      :label => "",
      :formatter => 1,
      :noresize => true,
      :width => "18px",
      :style => "",
      :column_order => i
    )
    view_definition.cell_definitions.push(cell_def)
    i += 1
    
    icust = 0
    
    document_type.property_definitions.each do |pd|
      
      #no Text values in view
      next if pd.data_type_id == Bfree::DataTypes.Text
      
      width = "128px"
      width = "256px" if icust < 1
       
      cell_def = view_definition.cell_definitions.new(
        :library_id => library.id,
        :table_name => pd.table_name,
        :column_name => pd.column_name,
        :name => pd.name,
        :label => pd.name,
        :formatter => 0,
        :noresize => false,
        :width => width,
        :style => "",
        :column_order => i
      )
      view_definition.cell_definitions.push(cell_def)
      
      i += 1
      icust += 1
    end
    
    #lets add version number
    cell_def = view_definition.cell_definitions.new(
        :library_id => library.id,
        :table_name => "document_types",
        :column_name => "name",
        :name => "Document Type",
        :label => "Document Type",
        :formatter => 0,
        :noresize => false,
        :width => "128px",
        :style => "",
        :column_order => i
      )
     view_definition.cell_definitions.push(cell_def)
     i += 1
     
    cell_def = view_definition.cell_definitions.new(
        :library_id => library.id,
        :table_name => "versions",
        :column_name => "version_number",
        :name => "Version",
        :label => "Version",
        :formatter => 0,
        :noresize => false,
        :width => "64px",
        :style => "",
        :column_order => i
      )
     view_definition.cell_definitions.push(cell_def)
     i += 1
      
     cell_def = view_definition.cell_definitions.new(
        :library_id => library.id,
        :table_name => "versions",
        :column_name => "binary_file_size",
        :name => "Size",
        :label => "Size",
        :formatter => 2,
        :noresize => false,
        :width => "64px",
        :style => "",
        :column_order => i
      )
     view_definition.cell_definitions.push(cell_def)
     i += 1
     
     cell_def = view_definition.cell_definitions.new(
        :library_id => library.id,
        :table_name => "documents",
        :column_name => "updated_by",
        :name => "Owner",
        :label => "Owner",
        :formatter => 0,
        :noresize => false,
        :width => "128px",
        :style => "",
        :column_order => i
      )
     view_definition.cell_definitions.push(cell_def)
     i += 1
  
      return view_definition
  end

  def package(root_folder)

    exportable = {
        :name => self.name,
        :scope => self.scope,
        :sort_by => self.sort_by,
        :description => self.description,
        :created_at => self.created_at,
        :created_by => self.created_by,
        :updated_at => self.updated_at,
        :updated_by => self.updated_by,
        :cell_definitions => []
    }

    self.cell_definitions.each do |cell_definition|
      exportable[:cell_definitions] << {
          :table_name =>  cell_definition.table_name,
          :column_name => cell_definition.column_name,
          :name => cell_definition.name,
          :label => cell_definition.label,
          :formatter => cell_definition.formatter,
          :noresize => cell_definition.noresize,
          :width => cell_definition.width,
          :style => cell_definition.style,
          :column_order => cell_definition.column_order,
          :date_format => cell_definition.date_format
      }
    end

    _json = ActiveSupport::JSON.encode(exportable)

    json_file = File.join(root_folder, "#{self.name}.json")
    json_file = Pathname.new(json_file).cleanpath()
    File.open(json_file, 'w'){ |json_file| json_file.write _json }

  end

  def self.unpackage(library, file_path)

    import_json = ActiveSupport::JSON.decode(IO.read(file_path))

    view_definition = library.view_definitions.find_by_name(import_json['name'])
    if view_definition.nil?
      view_definition = library.view_definitions.new(:name => import_json['name'])
    end

    merge(view_definition, import_json)


  end

private

  def self.merge(view_definition, data)

    begin

      view_definition.scope = data['scope'] unless data['scope'].nil?
      view_definition.sort_by = data['sort_by'] unless data['sort_by'].nil?
      view_definition.description = data['description'] unless data['description'].nil?
      view_definition.created_by = data['created_by'] unless data['created_by'].nil?
      view_definition.created_at = data['created_at'] unless data['created_at'].nil?
      view_definition.updated_by = data['updated_by'] unless data['updated_by'].nil?
      view_definition.updated_at = data['updated_at'] unless data['updated_at'].nil?

      view_definition.cell_definitions.destroy_all
      unless data['cell_definitions'].nil?
        data['cell_definitions'].each do |cell_definition|
          view_definition.cell_definitions << view_definition.library.cell_definitions.create(
              :column_order => cell_definition['column_order'],
              :table_name => cell_definition['table_name'],
              :column_name => cell_definition['column_name'],
              :name => cell_definition['name'],
              :label => cell_definition['label'],
              :width => cell_definition['width'],
              :style => cell_definition['style'],
              :formatter => cell_definition['formatter'],
              :noresize => cell_definition['noresize']
          )
        end
      end

      ViewDefinition.record_timestamps = false
      unless view_definition.save

      end

    ensure
      ViewDefinition.record_timestamps = true
    end

  end
end
