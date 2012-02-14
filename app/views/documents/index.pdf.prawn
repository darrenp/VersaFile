border_color = "D5CDB5"
header_color = "2DCCD3"
odd = "D9D9D6"
even = "FFFFFF"

w = pdf.bounds.width

data = generate_pdf_data @documents, @cell_definitions

pdf.bounding_box([pdf.bounds.left, pdf.bounds.top-20], :width => w, :height => pdf.bounds.height - 50) do
  if data.size > 1
    pdf.table(data[0..data.length],
      :header => true,
      :position => :center,
      :row_colors => [odd, even],
      :width=>w,
      :column_widths => {1 =>  28}) do |table|
    end
  else
    pdf.move_down 50
    pdf.text "There isn't any data to report.", :size => 14, :align => :center
  end
end
  
pdf.page_count.times do |i|
  pdf.go_to_page(i+1)
  pdf.bounding_box([pdf.bounds.left,pdf.bounds.top + 25], :width => w){
    pdf.table [[{:image=>"#{Rails.root}/public/images/versafile-32.png"},{:content=>"VersaFile - #{@library.name}", :size=>10, :align => :center, :valign=>:center},""]],
    :column_widths => {0 => w/8, 1 =>  3*w/4, 2 => w/8},
    :position => :center,
    :cell_style => {:borders => []}
  }
  pdf.bounding_box([pdf.bounds.left,pdf.bounds.bottom + 15], :width => w) {
    pdf.table [[Date.today.strftime("%e/%m/%Y"), "", "#{i+1} of #{pdf.page_count}"]],
      :column_widths => {0 => w/8, 1 =>  3*w/4, 2 => w/8},
      :position => :center,
      :cell_style => {:borders => []} do |table|
    end
  }
end
