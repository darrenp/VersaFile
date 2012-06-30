class PropertyColumn < ActiveRecord::Base
  belongs_to :library
  belongs_to :data_type

  def next

    avail_columns = self.available_columns
    raise "There are no available columns for data type [#{self.data_type.name}]" if avail_columns.length < 1
    avail_columns.first

  end

  def available_columns
    filter_columns(true)
  end

  def self.index_from_name(column_name)
    idx = column_name[-3..-1]
    idx.to_i
end

  def used_columns
    filter_columns(false)
  end

  def set_column(index, is_used)
     p = (1 << (index - 1))

      if(is_used)
        self.column_mask |= p
      else
        self.column_mask &= ~p
      end
  end

private

  def filter_columns(filter = nil)

      columns = []

      1.upto(self.max_columns) do |n|
        p = (1 << (n - 1))
        name =  "prp_%s%03d" % [self.data_type.prefix, n]
        is_avail = ((self.column_mask & p) == 0)

        if filter.nil? || (filter && is_avail) || (!filter && !is_avail)
          columns << {:index => n, :name => name, :is_available => is_avail}
        end

      end

      columns
  end

end
