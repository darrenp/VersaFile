class DataType < ActiveRecord::Base
  set_primary_key :id
  has_many :property_columns
  has_many :operators

  def self.boolean
    where(:prefix => 'bln').first
  end

  def self.datetime
    where(:prefix => 'dtt').first
  end

  def self.float
    where(:prefix => 'flt').first
  end

  def self.integer
    where(:prefix => 'int').first
  end

  def self.string
    where(:prefix => 'str').first
  end

  def self.text
    where(:prefix => 'txt').first
  end


end
