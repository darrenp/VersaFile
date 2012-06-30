class RkoUser < ActiveRecord::Base

  def password=(value)
    write_attribute('password', RkoUser.encrypt(value))
  end

  def verify_password(password)
    isVerified = true

    unless (password == self.password)
      enc_password = RkoUser.encrypt(password)
      isVerified = (enc_password == self.password)
    end

    return isVerified
  end

  private

  def self.encrypt(value)
    Digest::SHA1.hexdigest(value)
  end
end
