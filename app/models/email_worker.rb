class EmailWorker < Struct.new(:to, :params)
  ACCOUNT_RESET = 'email_templates/account_reset.html'
  USER_CREATED = 'email_templates/user_created.html'
  USER_RESET = 'email_templates/user_reset.html'
  ZONE_CREATE_TRIAL = 'email_templates/zone_create_trial.html'
  ZONE_CREATE_ACTIVE = 'email_templates/zone_create_active.html'
  ZONE_UPGRADE_ACTIVE = 'email_templates/zone_upgrade_active.html'
  ZONE_UPGRADE_QUOTA = 'email_templates/zone_upgrade_quota.html'

  def send_account_reset()

    account = self.params[:account]

    email_body = IO.read(File.join(Rails.root, ACCOUNT_RESET))
    email_body.gsub!('{account_fullname}', account.full_name)
    email_body.gsub!('{account_email}', account.email)
    email_body.gsub!('{account_password}', self.params[:password])
    email_body.gsub!('{domain}', ENV['location'])

    email_from = configatron.versafile.mail.from
    email_subject = configatron.versafile.mail.account_reset.subject

    Pony.mail(
      :to => self.to,
      :from => email_from,
      :subject => email_subject,
      :html_body => email_body
    )

  end

  def send_user_created()

    zone = params[:zone]
    user = self.params[:user]
    password = params[:password]

    email_body = IO.read(File.join(Rails.root, USER_CREATED))
    email_body.gsub!('{zone_subdomain}', zone.subdomain)
    email_body.gsub!('{user_fullname}', user.full_name)
    email_body.gsub!('{user_name}', user.name)
    email_body.gsub!('{user_password}', password)
    email_body.gsub!('{domain}', ENV['location'])

    email_from = configatron.versafile.mail.from
    email_subject = configatron.versafile.mail.user_created.subject

    Pony.mail(
      :to => self.to,
      :from => email_from,
      :subject => email_subject,
      :html_body => email_body
    )

  end

  def send_user_reset()

    zone = params[:zone]
    user = self.params[:user]
    password = params[:password]
    fingerprint = params[:fingerprint]

    email_body = IO.read(File.join(Rails.root, USER_RESET))
    email_body.gsub!('{zone_subdomain}', zone.subdomain)
    email_body.gsub!('{user_fullname}', user.full_name)
    email_body.gsub!('{user_name}', user.name)
    email_body.gsub!('{user_password}', password)
    email_body.gsub!('{fingerprint}', fingerprint)
    email_body.gsub!('{domain}', ENV['location'])

    email_from = configatron.versafile.mail.from
    email_subject = configatron.versafile.mail.user_reset.subject

    Pony.mail(
      :to => self.to,
      :from => email_from,
      :subject => email_subject,
      :html_body => email_body
    )

  end

  def send_zone_creation_active()

    zone = params[:zone]
    user = params[:user]
    password = params[:password]

    email_body = IO.read(File.join(Rails.root, ZONE_CREATE_ACTIVE))
    email_body.gsub!('{zone_name}', zone.name)
    email_body.gsub!('{zone_subdomain}', zone.subdomain)
    email_body.gsub!('{user_name}', user.name)
    email_body.gsub!('{user_password}', password)
    email_body.gsub!('{domain}', ENV['location'])

    email_from = configatron.versafile.mail.from
    email_subject = configatron.versafile.mail.zone_create_active.subject

    Pony.mail(
      :to => self.to,
      :from => email_from,
      :subject => email_subject,
      :html_body => email_body
    )

  end

  def send_zone_creation_trial()

    zone = params[:zone]
    user = params[:user]
    password = params[:password]
    trial_period = zone.configuration.configuration_settings.find_by_name('trial_period').value

    email_body = IO.read(File.join(Rails.root, ZONE_CREATE_TRIAL))
    email_body.gsub!('{zone_name}', zone.name)
    email_body.gsub!('{zone_subdomain}', zone.subdomain)
    email_body.gsub!('{user_name}', user.name)
    email_body.gsub!('{user_password}',password)
    email_body.gsub!('{trial_period}', trial_period)
    email_body.gsub!('{domain}', ENV['location'])

    email_from = configatron.versafile.mail.from
    email_subject = configatron.versafile.mail.zone_create_trial.subject.gsub('{trial_period}', trial_period)

    Pony.mail(
      :to => self.to,
      :from => email_from,
      :subject => email_subject,
      :html_body => email_body
    )

  end

  def send_zone_upgrade_active

    zone = params[:zone]

    email_body = IO.read(File.join(Rails.root, ZONE_UPGRADE_ACTIVE))
    email_body.gsub!('{zone_name}', zone.name)
    email_body.gsub!('{zone_subdomain}', zone.subdomain)
    email_body.gsub!('{domain}', ENV['location'])

    email_from = configatron.versafile.mail.from
    email_subject = configatron.versafile.mail.zone_upgrade_active.subject

    Pony.mail(
      :to => self.to,
      :from => email_from,
      :subject => email_subject,
      :html_body => email_body
    )

  end

  def send_zone_upgrade_quota

    zone = self.params[:zone]
    user_quota = self.params[:user_quota]
    disk_quota = self.params[:disk_quota]

    email_body = IO.read(File.join(Rails.root, ZONE_UPGRADE_QUOTA))
    email_body.gsub!('{zone_name}', zone.name)
    email_body.gsub!('{user_quota}', user_quota)
    email_body.gsub!('{disk_quota}', disk_quota)

    email_from = configatron.versafile.mail.from
    email_subject = configatron.versafile.mail.zone_upgrade_quota.subject

    Pony.mail(
      :to => self.to,
      :from => email_from,
      :subject => email_subject,
      :html_body => email_body
    )

  end

end