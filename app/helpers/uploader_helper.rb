module UploaderHelper

  def self.clean_dir(dir)

    if File.exists?(dir)
      Dir.foreach(dir) do |tmp_entry|
        next if ['.', '..'].include?(tmp_entry)
        if !File.directory?(tmp_entry)
          tmp_filepath = File.join(dir, tmp_entry)
          File.delete(tmp_filepath)
        end
      end

      Dir.delete(dir)
    end

  end

  def self.clean(zone, session_id)

    session_id = session_id.gsub( /[^a-zA-Z0-9_\.]/, '_')

    tmp_dir = File.join(zone.subdomain, '~tmp', session_id)
    tmpPath = File.join(VersaFile::SYSTEM_PATH, tmp_dir)

    UploaderHelper.clean_dir(tmpPath)

    #cleanup orphaned ~tmp dirs
    tmpPath = File.join(VersaFile::SYSTEM_PATH, zone.subdomain, '~tmp')

    #Don't clean if it doesn't exist
    if File.exists?(tmpPath)
      Dir.foreach(tmpPath) do |tmp_entry|
        next if ['.', '..'].include?(tmp_entry)
        entryPath = File.join(tmpPath, tmp_entry)

        if(File.mtime(entryPath).utc < 1.day.ago)
          UploaderHelper.clean_dir(entryPath)
        end

      end
    end

  end

  def self.generate_name(tmpdir)

    begin
      tmp_name = SecureRandom.hex(10) + ".tmp"
    end while File.exists? File.join(tmpdir, tmp_name)

    return tmp_name
  end

  def self.delete_file(zone, session_id, file_name)

    session_id = session_id.gsub( /[^a-zA-Z0-9_\.]/, '_')

    tmp_dir = File.join(zone.subdomain, '~tmp', session_id)
    tmpFilePath = File.join(VersaFile::SYSTEM_PATH, tmp_dir, file_name)

    File.delete(tmpFilePath)

  end

  def self.write_pkg_file(zone, file)

    pkg_dir = File.join(VersaFile::SYSTEM_PATH, zone.subdomain, 'packages')
    FileUtils.mkdir_p pkg_dir

    tmpFileName = file.original_filename
    tmpFilePath = File.join(pkg_dir, tmpFileName)
    tmpFilePath = Pathname.new(tmpFilePath).cleanpath()
    File.open(tmpFilePath, "wb") { |tmpFile| tmpFile.write(file.read) }

    return {:name => tmpFileName, :path => tmpFilePath}
  end

  def self.read_file(zone, session_id, file_name)

    session_id = session_id.gsub( /[^a-zA-Z0-9_\.]/, '_')

    tmp_dir = File.join(zone.subdomain, '~tmp', session_id)
    tmpFilePath = File.join(VersaFile::SYSTEM_PATH, tmp_dir, file_name)

    tmpFilePath = Pathname.new(tmpFilePath).cleanpath()
    return File.open(tmpFilePath)

  end

  def self.write_file(zone, session_id, file)

    session_id.gsub!( /[^a-zA-Z0-9_\.]/, '_')

    tmp_dir = File.join(zone.subdomain, '~tmp', session_id)
    tmp_dir = File.join(VersaFile::SYSTEM_PATH, tmp_dir)
    FileUtils.mkdir_p tmp_dir

    tmpFileName = file.original_filename #UploaderHelper.generate_name(tmp_dir)
    tmpFilePath = File.join(tmp_dir, tmpFileName)

    tmpFilePath = Pathname.new(tmpFilePath).cleanpath()
    File.open(tmpFilePath, "wb") { |tmpFile| tmpFile.write(file.read) }

    return {:name => tmpFileName, :path => tmpFilePath}
  end


  def self.write_zero_byte_file(zone, session_id, file_name)

    tmp_dir = File.join(zone.subdomain, '~tmp', session_id)
    tmp_dir = File.join(VersaFile::SYSTEM_PATH, tmp_dir)

    FileUtils.mkdir_p tmp_dir

    tmpFileName = file_name
    tmpFilePath = File.join(tmp_dir, tmpFileName)
    FileUtils.touch tmpFilePath

    return {:name => tmpFileName, :path => tmpFilePath}

  end



end
