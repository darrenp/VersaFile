class ZoneNode < ActiveRecord::Base
  belongs_to :account
  belongs_to :server
  before_save :generate_fingerprint
  validates :subdomain,   :exclusion => { :in => %w(admin mysql dev), :message => "The subdomain '%{value}' is reserved"},
                          :uniqueness => { :message => "The subdomain '%{value}' is already in use" }

  #generate a unique key for the zone
  def generate_fingerprint
    if(!self.fingerprint||self.fingerprint=="")
      self.fingerprint = "#{Digest::SHA1.hexdigest(self.subdomain + Time.now.to_f.to_s)}"
    end
  end

  def zone_deploy

    #TODO: Don't forget to change back!!!
    #create_url = "#{self.server.base_url}/zones.json"
    create_url = "http://www.bfreetest.com:3001/zones.json"

    url = URI.parse(create_url)
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = (self.server.protocol == "https")

    form = {
      :name => self.name,
      :subdomain => self.subdomain,
      :fingerprint => self.fingerprint,
      :email => self.account.email,
      :first_name => self.account.first_name,
      :last_name => self.account.last_name,
      :created_by => self.account.created_by,
      :user_quota => self.max_users,
      :disk_quota => self.max_disk_space,
      :trial_period => self.account.trial_period,
      :template_id => self.template_id
    }

    request = Net::HTTP::Post.new(url.request_uri)
    request['Content-Type'] = 'application/json'
    request['Accept'] = 'application/json,application/javascript'
    request.set_form_data(form)

    response = http.request(request)

    logger.debug(response.code)
    if(response.code == :created)
      self.update_attribute(:status, VersaFile::ZoneStates.Enabled)
    end

  end

  def zone_update

    #TODO: Don't forget to change back!!!
    #update_url = "#{self.server.base_url}/zones.json"
    update_url = "http://www.bfreetest.com:3001/zones/#{self.subdomain}"

    logger.debug("URL:> #{update_url}")
    url = URI.parse(update_url)
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = (self.server.protocol == "https")

    form = {
      :name => self.name,
      :subdomain => self.subdomain,
      :fingerprint => self.fingerprint,
      :updated_by => self.account.updated_by,
      :user_quota => self.max_users,
      :disk_quota => self.max_disk_space,
      :trial_period => self.account.trial_period
    }

    request = Net::HTTP::Put.new(url.request_uri)
    request['Content-Type'] = 'application/json'
    request['Accept'] = 'application/json,application/javascript'
    request.set_form_data(form)

    response = http.request(request)
    logger.debug("CODE:> #{response.code}")

  end



  def zone_url
    return self.server.base_url << "/zones/#{self.subdomain}"
  end

  def url
    return "#{self.server.protocol}://" +
              "#{self.subdomain}#{self.server.host.sub('www', '')}" +
              "#{ (self.server.port.nil?) ? '' : ':' + self.server.port.to_s }"
  end


end
