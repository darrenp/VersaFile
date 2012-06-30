class ChoiceList < ActiveRecord::Base
  belongs_to :zone
  belongs_to :library
  belongs_to :data_type
  has_many  :property_mappings
  has_many  :choice_values,
            :order => "sort_order",
            :dependent => :destroy

  attr_accessor :sort_id

  def dojo_url
    return "/zones/#{self.library.zone.subdomain}/libraries/#{self.library.id}/choice_lists/#{self.id}"
  end

  def package(root_folder)

    exportable = {
        :name => self.name,
        :description => self.description,
        :data_type_id => self.data_type.id,
        :created_at => self.created_at,
        :created_by => self.created_by,
        :updated_at => self.updated_at,
        :updated_by => self.updated_by,
        :choice_values => []
    }

    self.choice_values.each do |choice_value|
      exportable[:choice_values] << {
          :name =>  choice_value.name,
          :value => choice_value.value,
          :sort_order => choice_value.sort_order
      }
    end

    _json = ActiveSupport::JSON.encode(exportable)

    json_file = File.join(root_folder, "#{self.name}.json")
    json_file = Pathname.new(json_file).cleanpath()
    File.open(json_file, 'w'){ |json_file| json_file.write _json }

  end

  def self.unpackage(library, file_path)


    import_json = ActiveSupport::JSON.decode(IO.read(file_path))

    choice_list = library.choice_lists.find_by_name(import_json['name'])
    if choice_list.nil?
      choice_list = library.choice_lists.new(:name => import_json['name'], :library => library)
    end

    merge(choice_list, import_json)

  end

private

  def self.merge(choice_list, data)

    begin

      choice_list.data_type = DataType.find_by_id(data['data_type_id']) unless data['data_type_id'].nil?
      choice_list.description = data['description'] unless data['description'].nil?
      choice_list.created_by = data['created_by'] unless data['created_by'].nil?
      choice_list.created_at = data['created_at'] unless data['created_at'].nil?
      choice_list.updated_by = data['updated_by'] unless data['updated_by'].nil?
      choice_list.updated_at = data['updated_at'] unless data['updated_at'].nil?

      choice_list.choice_values.destroy_all
      unless data['choice_values'].nil?
        data['choice_values'].each do |choice_value|
          choice_list.choice_values << ChoiceValue.create(
              :name => choice_value['name'],
              :value => choice_value['value'],
              :sort_order => choice_value['sort_order']
          )
        end
      end

      ChoiceList.record_timestamps = false
      unless choice_list.save

      end

    ensure
      ChoiceList.record_timestamps = true
    end

  end

end
