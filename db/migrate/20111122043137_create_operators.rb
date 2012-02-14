class CreateOperators < ActiveRecord::Migration
  def change
    create_table :operators do |t|
      t.integer   :data_type_id
      t.string    :name
      t.string    :value
      t.string    :template
      t.boolean   :no_rhs, :default => false
    end
  end
end
