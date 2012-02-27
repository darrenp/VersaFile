class CellDefinition < ActiveRecord::Base
  belongs_to :library
  belongs_to :view_definition
end
