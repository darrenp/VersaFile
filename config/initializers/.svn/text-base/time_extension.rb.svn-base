class Time
  def dojo_date_format(format = "MMMM-dd-yy")
    format.gsub(/([a-z])\1*/i) do |match|
      c = match[0..0]
      l = match.length
      match = case c
      when "y" then
        case l
        when 2 then year.to_s[2..3]
        when 3..4 then year
        end
      when "Q","q" then c + (month/3.0).ceil.to_s
      when "M" then
        case l
        when 1..2 then "%0#{l}d" % month
        when 3 then Date::ABBR_MONTHNAMES[month]
        else Date::MONTHNAMES[month]
        end
      when "w" then strftime("%U")
      when "d" then "%0#{l}d" % day
      when "D" then "%0#{l}d" % yday
      when "E" then
        case l
        when 1..2 then "%0#{l}d" % wday
        when 3 then Date::ABBR_DAYNAMES[wday]
        else Date::DAYNAMES[wday]
        end
      when "a" then (hour < 12) ? 'am' : 'pm'
      when "h" then "%0#{l}d" % ((hour % 12) || 12)
      when "H" then "%0#{l}d" % hour
      when "K" then "%0#{l}d" % (hour % 12)
      when "k" then "%0#{l}d" % (hour || 24)
      when "m" then "%0#{l}d" % min
      when "s" then "%0#{l}d" % sec
      when "S" then "%0#{l}f" % (to_f - to_i)
      else match
      end
    end
  end
end