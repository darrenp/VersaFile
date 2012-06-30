class Preference < ActiveRecord::Base
  belongs_to :library
  
  def self.create_defaults(library)
    new_preferences = []
    defaults = {"Date entry format" => 1}
    
    defaults.each do |key, value|
      preference = library.preferences.find_or_initialize_by_name(
        :name => key,
        :value => value.to_s,
        :created_by => "system",
        :updated_by => "system"
      )
      new_preferences.push(preference) if preference.new_record?
    end
    
    return new_preferences
  end
end
