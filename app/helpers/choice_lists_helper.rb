module ChoiceListsHelper

  def self.generate_sort(params)
    sort_info = ['name', 'ASC']
    return ApplicationHelper.generate_sort(params, sort_info)
  end

end