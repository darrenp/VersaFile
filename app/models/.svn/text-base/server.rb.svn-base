class Server < ActiveRecord::Base
  has_many :zone_nodes

  def base_url
    url = "#{self.protocol}://#{self.host}"
    unless self.port.nil?
      url << ":#{self.port}"
    end
    return url
  end
end
