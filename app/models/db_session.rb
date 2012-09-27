class DbSession < ActiveRecord::Base
  belongs_to :zone
  belongs_to :library

  attr_accessor :dropbox

  def getSession
    if(self.dropbox==nil)
      self.dropbox=DropboxSession.deserialize(self.session)
    end
    return self.dropbox
  end
end
