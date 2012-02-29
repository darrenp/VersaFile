# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

DataType.delete_all
dt = DataType.new(
  :id => Bfree::DataTypes.Boolean,
  :name => 'Checkbox',
  :prefix => 'bln',
  :allow_choice_list => false
)
dt.id = Bfree::DataTypes.Boolean;
dt.save

dt = DataType.new(
  :name => 'Number (1234)',
  :prefix => 'int',
  :allow_choice_list => true
)
dt.id = Bfree::DataTypes.Integer;
dt.save

dt = DataType.new(
  :name => 'Decimal (12.34)',
  :prefix => 'flt',
  :allow_choice_list => true
)
dt.id = Bfree::DataTypes.Float;
dt.save

dt = DataType.new(
  :name => 'Date',
  :prefix => 'dtt',
  :allow_choice_list => true
)
dt.id = Bfree::DataTypes.DateTime;
dt.save

dt = DataType.new(
  :name => 'Text (Max 255 characters)',
  :prefix => 'str',
  :allow_choice_list => true
)
dt.id = Bfree::DataTypes.String;
dt.save

dt = DataType.new(
  :name => 'Text Block (Max 4096 characters)',
  :prefix => 'txt',
  :allow_choice_list => false
)
dt.id = Bfree::DataTypes.Text
dt.save

Operator.delete_all
Operator.create([
    {
      :name => 'and',
      :value => 'AND',
      :template => '%s AND %s'
    },
    {
      :name => 'or',
      :value => 'OR',
      :template => '%s OR %s'
    },
    {
      :name => 'not',
      :value => 'NOT',
      :template => 'NOT %s',
    },
    {
      :data_type_id => Bfree::DataTypes.Boolean,
      :name => 'is',
      :value => '=',
      :template => '%{lhs} = %{rhs}',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.DateTime,
      :name => 'before',
      :value => '<',
      :template => '%{lhs} < \'%{rhs}\'',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.DateTime,
      :name => 'after',
      :value => '>',
      :template => '%{lhs} > \'%{rhs}\'',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.DateTime,
      :name => 'on',
      :value => '>=',
      :template => '%{lhs} >= \'%{rhs}\'',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.Float,
      :name => '>',
      :value => '>',
      :template => '%{lhs} > %{rhs}',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.Float,
      :name => '<',
      :value => '<',
      :template => '%{lhs} < %{rhs}',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.Float,
      :name => '>=',
      :value => '>=',
      :template => '%{lhs} >= %{rhs}',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.Float,
      :name => '<=',
      :value => '<=',
      :template => '%{lhs} <= %{rhs}',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.Float,
      :name => '=',
      :value => '=',
      :template => '%{lhs} = %{rhs}',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.Integer,
      :name => '>',
      :value => '>',
      :template => '%{lhs} > %{rhs}',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.Integer,
      :name => '<',
      :value => '<',
      :template => '%{lhs} < %{rhs}',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.Integer,
      :name => '>=',
      :value => '>=',
      :template => '%{lhs} >= %{rhs}',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.Integer,
      :name => '<=',
      :value => '<=',
      :template => '%{lhs} <= %{rhs}',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.Integer,
      :name => '=',
      :value => '=',
      :template => '%{lhs} = %{rhs}',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.String,
      :name => 'contains',
      :value => 'LIKE',
      :template => '%{lhs} LIKE \'%%%{rhs}%%\'',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.String,
      :name => 'does not contain',
      :value => 'NOT LIKE',
      :template => '%{lhs} NOT LIKE \'%%%{rhs}%%\'',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.String,
      :name => 'equals',
      :value => '=',
      :template => '%{lhs} = \'%{rhs}\'',
      :no_rhs => false
    },
    {

      :data_type_id => Bfree::DataTypes.String,
      :name => 'not equal',
      :value => '!=',
      :template => '%{lhs} <> \'%{rhs}\'',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.String,
      :name => 'is blank',
      :value => '=',
      :template => '(%{lhs} IS NULL OR %{lhs}=\'\')',
      :no_rhs => true
    },
    {
      :data_type_id => Bfree::DataTypes.Text,
      :name => 'contains',
      :value => 'LIKE',
      :template => '%{lhs} LIKE \'%%%{rhs}%%\'',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.Text,
      :name => 'does not contain',
      :value => 'NOT LIKE',
      :template => '%{lhs} NOT LIKE \'%%%{rhs}%%\'',
      :no_rhs => false
    },
    {

      :data_type_id => Bfree::DataTypes.Text,
      :name => 'equals',
      :value => '=',
      :template => '%{lhs} = \'%{rhs}\'',
      :no_rhs => false
    },
    {

      :data_type_id => Bfree::DataTypes.Text,
      :name => 'not equal',
      :value => '!=',
      :template => '%{lhs} <> \'%{rhs}\'',
      :no_rhs => false
    },
    {
      :data_type_id => Bfree::DataTypes.Text,
      :name => 'is blank',
      :value => '=',
      :template => '(%{lhs} IS NULL OR %{lhs}=\'\')',
      :no_rhs => true
    }

])

Icon.delete_all
Icon.create([

  { :content_type => '.bmp', :file_name => 'image.bmp.png' },
  { :content_type => 'image/bmp', :file_name => 'image.bmp.png' },

  { :content_type => '.doc', :file_name => 'application.msword.png'},
  { :content_type => '.docx', :file_name => 'application.msword.png'},
  { :content_type => 'application/msword', :file_name => 'application.msword.png'},
  { :content_type => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', :file_name => 'application.msword.png'},

  { :content_type => '.gif', :file_name => 'image.gif.png' },
  { :content_type => 'image/gif', :file_name => 'image.gif.png' },

  { :content_type => '.jpg', :file_name => 'image.jpeg.png' },
  { :content_type => '.jpeg', :file_name => 'image.jpeg.png' },
  { :content_type => 'image/jpeg', :file_name => 'image.gif.png' },

  { :content_type => '.pdf', :file_name => 'application.pdf.png'},
  { :content_type => 'application/pdf', :file_name => 'application.pdf.png' },

  { :content_type => '.ppt', :file_name => 'application.vnd.ms-powerpoint.png'},
  { :content_type => '.pptx', :file_name => 'application.vnd.ms-powerpoint.png'},
  { :content_type => 'application/vnd.ms-powerpoint', :file_name => 'application.vnd.ms-powerpoint.png' },
  { :content_type => 'application/vnd.openxmlformats-officedocument.presentationml.presentation', :file_name => 'application.vnd.ms-powerpoint.png' },

  { :content_type => '.xls', :file_name => 'application.vnd.ms-excel.png'},
  { :content_type => '.xlsx', :file_name => 'application.vnd.ms-excel.png'},
  { :content_type => 'application/vnd.ms-excel', :file_name => 'application.vnd.ms-excel.png' },
  { :content_type => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', :file_name => 'application.vnd.ms-excel.png' },

  { :content_type => '.zip', :file_name => 'application.zip.png'},
  { :content_type => 'application/zip', :file_name => 'application.zip.png' }

])

RkoUser.delete_all
RkoUser.create(
    :name=>"admin",
    :password=>"admin",
    :first_name=>"admin",
    :last_name=>"admin"
)

ContentType.delete_all
ContentType.create(
    :binary_content_type=>"application/x-msdos-program",
    :open_as=>"text/plain"
)

ZoneTemplate.delete_all
zt_smb = ZoneTemplate.new(
    :name => 'Small Business Template',
    :folder_name => 'smb'
)
zt_smb.id = VersaFile::ZoneTemplates.SmallBusiness
zt_smb.save
