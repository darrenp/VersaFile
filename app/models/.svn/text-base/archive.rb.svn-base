require 'zip/zip'

class Archive
  attr_accessor(:archive_name)

  def initialize(archive_name)
    @archive_name = archive_name
  end


  def from_directory(src_dir)

    zip_file = File.join(Pathname.new(src_dir).parent(), @archive_name)
    Zip::ZipFile.open(zip_file, Zip::ZipFile::CREATE){ |zip|
      recurse_directories(zip, '', src_dir)
    }

    return zip_file
  end

  def to_directory(dst_dir)

    Zip::ZipFile.open(@archive_name){ |zip|
      _unzip(zip, dst_dir)
    }

    return dst_dir
  end

private

  def _unzip(zip_file, dst_dir)

    zip_file.each { |f|
      next unless f.file?
      file_path = File.join(dst_dir, f.name)
      FileUtils.mkdir_p(File.dirname(file_path))
      zip_file.extract(f, file_path) unless File.exists?(file_path)
    }

  end

  def recurse_directories(zip, zip_path, dir)


    Dir.foreach(dir) do |entry|
      next if entry == '.' || entry == '..'

      entry_path = File.join(dir, entry)


      if File.directory?(entry_path)
        curr_zip_path = File.join(zip_path, entry)
        curr_zip_path.slice!(0)
        zip.mkdir(curr_zip_path)
        recurse_directories(zip, File.join(zip_path, entry), File.join(dir, entry))
      elsif File.file?(entry_path)
        curr_zip_path = File.join(zip_path, entry)
        curr_zip_path.slice!(0)
        zip.add(curr_zip_path, entry_path)
      end

    end

  end

end