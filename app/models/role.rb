class Role < ActiveRecord::Base
  belongs_to :zone

  scope :predefined, lambda { |name|
    where(:name => name)
  }

  scope :admins, lambda {
    Role.predefined('Admin')
  }

  scope :owners, lambda {
    Role.predefined('Owner')
  }

  scope :authors, lambda {
    Role.predefined('Author')
  }

  scope :viewers, lambda {
    Role.predefined('Viewer')
  }

  scope :nones, lambda {
    Role.predefined('None')
  }


end
