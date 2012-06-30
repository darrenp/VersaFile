module PropertyDefinitionsHelper

  def self.generate_sort(params)
    sort_info = ['name', 'ASC']

    params.each do |param|

      p = param[0].strip
      if(p.slice!(0..3) == 'sort')
        column_data = p.gsub(/[()]/, '')
        order = column_data.slice!(0).chr == '-' ? 'DESC' : 'ASC'
        sort_info[0] = column_data
        sort_info[1] = order
      end

    end


    return sort_info.join(' ')
  end

end
