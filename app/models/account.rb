class Account < ActiveRecord::Base
  has_many :zone_nodes
  validates :email,
              :presence => true,
              :uniqueness => { :message => "The address '%{value}' is already associated with an account" }
  validates :customer_code,
              :allow_nil => true,
              :uniqueness => { :message => "The customer code '%{value}' is already associated with an account" }

  scope :active, lambda {
    where("status & #{VersaFile::AccountStates.Deleted} = 0")
  }

  def full_name

    val = ''
    val += self.first_name unless self.first_name.blank?

    unless self.last_name.blank?
      val += ' ' unless val.blank?
      val += self.last_name unless self.last_name.blank?
    end

    val = self.email if val.blank?

    return val
  end

  def template
    self.zone_nodes.first.template_id
  end

  def subdomains
    sds = []

    self.zone_nodes.each do |zone_node|
      sds << {
          :name => zone_node.subdomain,
          :user_quota => zone_node.max_users,
          :disk_quota => (zone_node.max_disk_space / VersaFile::DiskSizes.Gigabyte).to_i
      }
    end

    return sds
  end


  def password=(value)
    write_attribute('password', Account.encrypt(value))
  end

  def verify_password(password)
    isVerified = true

    unless (password == self.password)
      enc_password = Account.encrypt(password)
      isVerified = (enc_password == self.password)
    end

    return isVerified
  end

  private

  def self.encrypt(value)
    Digest::SHA1.hexdigest(value)
  end
end
