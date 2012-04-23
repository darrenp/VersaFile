class Share < ActiveRecord::Base
  belongs_to :library
  belongs_to :folder
  has_many :references
  before_create :on_before_create


  def authorize(password)
    enc_password = User.encrypt(password)
    raise Exceptions::InvalidCredentials.new('Guest') unless (enc_password == self.password)
  end

  def password=(value)
    write_attribute('password', User.encrypt(value))
  end

:private

  def on_before_create
      self.fingerprint = self.generate_fingerprint
  end

  def generate_fingerprint
    components = [
      self.library.name,
      self.folder.created_by,
      Time.now.to_f.to_s
    ]
    return  Digest::SHA1.hexdigest(components.join)

  end

  def generate_url(request)

    url = request.protocol <<
            self.library.zone.subdomain <<
            ".#{request.domain}"
    url << ":#{request.port}" unless request.port.blank?
    url << "/shares/#{self.fingerprint}"

    return url
  end

  def expired?
    return self.expiry.nil? ?
            false :
            self.expiry < DateTime.now
  end


end
