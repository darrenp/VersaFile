module DocumentsHelper

  # allows using some helper methods from within module
  def self.help
    Helper.instance
  end

  class Helper
    include Singleton
    include ActionView::Helpers::TextHelper
    include ActionView::Helpers::NumberHelper
  end

  def self.columns_by_doctype(document)

    #Return only system-properties and properties defined in the doctype
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

      #add properties from document type
      document.document_type.property_mappings.each do |property_mapping|
        property_definition = property_mapping.property_definition
        if(property_definition.table_name == 'documents')
          columns.push(property_definition.column_name) unless columns.include?(property_definition.column_name)
        end
      end

      return columns
  end

  def self.generate_columns(params)
    columns = ['documents.*']
    return columns.join(',')
  end

  def self.generate_joins(params)
    joins = ['versions']

    return 'INNER JOIN versions ON versions.document_id = documents.id AND versions.is_current_version=1 INNER JOIN document_types on documents.document_type_id=document_types.id'
  end

  # used for export to pdf (from views/documents/index.pdf.prawn)
  def generate_pdf_data(documents, view)
    rows = []
    #headers = []
    #headers_set = false

    row=[]
    view.cell_definitions.each do |cell_definition|
      label = {:content=>cell_definition.label.blank?||cell_definition.label=="&nbsp;" ? " " : "#{cell_definition.label}", :font_style=>:bold, :background_color=>"2DCCD3", :size=>10}
      row << label
    end
    rows << row

    documents.each do |document|
      row = []
      view.cell_definitions.each do |cell_definition|
        if(cell_definition.column_name=="binary_content_type")
          value = {:image => DocumentsHelper.formatted_column_value(document,cell_definition,"pdf"), :image_width=>16, :image_height=>16}
        else
          value = {:content => DocumentsHelper.formatted_column_value(document,cell_definition,"pdf").to_s, :size=>8}
        end

        row << value
      end
      rows << row
    end
    return rows
  end

  # used for export to csv and xml (from DocumentsController#index)
  def self.generate_view(documents, view, format)
    formatted_documents = []
    documents.each do |document|
      formatted_document = {}
      view.cell_definitions.each do |cell_definition|
        label = cell_definition.label.blank?||cell_definition.label=='&nbsp;' ? cell_definition.column_name : cell_definition.label.gsub(/[^A-Za-z0-9_.]/, '_').downcase
        value = formatted_column_value(document, cell_definition, format)
        formatted_document[label] = value
      end
      formatted_documents << formatted_document
    end
    return formatted_documents
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

  # used in export functions and print view (this file and views/documents/index.html.erb)
  def self.formatted_column_value(document, cell_definition, format = nil)
    column = cell_definition.column_name

    case cell_definition.table_name
    when "documents" then
      data = document[column]
      case column
      when "state" then format == "html" ? status_image_tag(data) : Bfree::DocumentStates.to_string(data)
      when /prp_dtt/ then
        date_format = cell_definition.date_format
        data ? (date_format.blank? ? data.dojo_date_format : data.dojo_date_format(date_format)) : nil
      else data
      end
    when "document_types"
      case column
        when "name"
          document.document_type_name
      end
    when "versions" then
      #data = document.current_version[column]
      case column
        when "version_number"
          "#{document.major_version_number}"
        when "binary_file_size"
          help.number_to_human_size(document.binary_file_size).to_s
      when "binary_content_type"
        if(format=='csv'||format=='xml')
          return document.binary_content_type
        elsif(format=='pdf')
          icon = self.get_icon(document.binary_content_type)
        else
          return self.mimetype_image_tag(document.binary_content_type)
        end
        else
          ""
      end
    end
  end

  def self.get_icon(content_type)
    iconPath = nil

    icon = Icon.find_by_content_type(content_type)
    unless icon.nil?
      iconPath = Rails.root.join('public', 'images', 'mimetypes', '16', icon.file_name)
      iconPath = nil if !File.exists?(iconPath)
    end

    iconPath = Rails.root.join('public', 'images', 'mimetypes', '16', 'default.png') if iconPath.nil?

    return iconPath
  end

  def self.status_image_tag(status)
    image = case status
    when Bfree::DocumentStates.CheckedOut then 'cko.16.png'
    else "none.16.png"
    end
    "<img src=\"/images/icons/states/#{image}\" alt=\"#{image}\" />"
  end

  def self.mimetype_image_tag(mimetype)
    "<img src=\"/icons/#{mimetype}?size=16\" width=\"16\" height=\"16\"/>"
  end

end
