class Avatar < ActiveRecord::Base
  belongs_to :zone, :inverse_of => :avatars
  belongs_to :imageable, :polymorphic => true
  has_attached_file   :image,
                      :path => ":rails_root/system/:subdomain/avatars/:image_storage_name"
  before_save :create_storage_name

  #generate a unique storage name for avatar file on the filesystem
  def create_storage_name
    ext = self.image_file_name.scan(/\.\w+$/)
    self.image_storage_name = "#{Digest::SHA1.hexdigest(Time.now.to_f.to_s)}"
    self.image_storage_name << ext[0] unless ext.empty?
    logger.debug "STORAGE NAME :> #{self.image_storage_name}"
  end

end
