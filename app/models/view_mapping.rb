class ViewMapping < ActiveRecord::Base

  belongs_to :library
  belongs_to :user
  belongs_to :folder
  belongs_to :view_definition

  #before_destroy :destroy_view
=begin
  def destroy_view
    if(self.view_definition_id!=nil&&self.view_definition&&!self.view_definition.is_template)
      if(!self.view_definition.view_mappings.length||self.view_definition.view_mappings.length<=1)
        self.view_definition.destroy
      end
    end
  end
=end

  def dojo_url
    return "/zones/#{self.library.zone.subdomain}/libraries/#{self.library.id}/view_mappings/#{self.id}"
  end

  def package

  end

end
