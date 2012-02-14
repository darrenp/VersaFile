module UploaderHelper

  def self.clean(zone, session_id)

    session_id = session_id.gsub( /[^a-zA-Z0-9_\.]/, '_')

    tmp_dir = File.join(zone.subdomain, '~tmp', session_id)
    root_dir = File.join(Rails.root, 'system')
    tmpPath = File.join(root_dir, tmp_dir)

    if File.exists?(tmpPath)
      Dir.foreach(tmpPath) do |tmp_entry|
        if !File.directory?(tmp_entry)
          tmp_filepath = File.join(tmpPath, tmp_entry)
          File.delete(tmp_filepath)
        end
      end

      Dir.delete(tmpPath)
    end

      #TODO: cleanup orphaned ~tmp dirs
  end

  def self.generate_name(tmpdir)

    begin
      tmp_name = SecureRandom.hex(10) + ".tmp"
    end while File.exists? File.join(tmpdir, tmp_name)

    return tmp_name
  end

  def self.delete_file(zone, session_id, file_name)

    tmp_dir = File.join(zone.subdomain, '~tmp', session_id)
    root_dir = File.join(Rails.root, 'system')
    tmpFilePath = File.join(root_dir, tmp_dir, file_name)

    File.delete(tmpFilePath)
  end

  def self.write_pkg_file(zone, file)
    root_dir = File.join(Rails.root, 'system')
    pkg_dir = File.join(root_dir, zone.subdomain, 'packages')
    FileUtils.mkdir_p File.join(root_dir, pkg_dir)

    tmpFileName = file.original_filename
    tmpFilePath = File.join(pkg_dir, tmpFileName)
    tmpFilePath = Pathname.new(tmpFilePath).cleanpath()
    File.open(tmpFilePath, "wb") { |tmpFile| tmpFile.write(file.read) }

    return {:name => tmpFileName, :path => tmpFilePath}
  end

  def self.write_file(zone, session_id, file)

    session_id.gsub!( /[^a-zA-Z0-9_\.]/, '_')

    tmp_dir = File.join(zone.subdomain, '~tmp', session_id)
    root_dir = File.join(Rails.root, 'system')
    FileUtils.mkdir_p File.join(root_dir, tmp_dir)

    tmpFileName = file.original_filename #UploaderHelper.generate_name(tmp_dir)
    tmpFilePath = File.join(root_dir, tmp_dir, tmpFileName)

    tmpFilePath = Pathname.new(tmpFilePath).cleanpath()
    File.open(tmpFilePath, "wb") { |tmpFile| tmpFile.write(file.read) }

    return {:name => tmpFileName, :path => tmpFilePath}
  end


  def self.write_zero_byte_file(zone, session_id, file_name)

    tmp_dir = File.join(zone.subdomain, '~tmp', session_id)
    root_dir = File.join(Rails.root, 'system')
    FileUtils.mkdir_p File.join(proot_dir, tmp_dir)

    tmpFilePath = File.join(root_dir, tmp_dir, file_name)

    tmpFilePath = File.join(Dir::tmpdir, tmp_dir, tmpFileName)
    FileUtils.mkdir_p File.join(Dir::tmpdir, tmp_dir)

    FileUtils.touch tmpFilePath

    return File.join(tmp_dir, tmpFileName)
  end

  def self.read_file(zone, session_id, file_name)

    session_id = session_id.gsub( /[^a-zA-Z0-9_\.]/, '_')

    tmp_dir = File.join(zone.subdomain, '~tmp', session_id)
    root_dir = File.join(Rails.root, 'system')
    tmpFilePath = File.join(root_dir, tmp_dir, file_name)

    tmpFilePath = Pathname.new(tmpFilePath).cleanpath()
    return File.open(tmpFilePath)

  end

end
