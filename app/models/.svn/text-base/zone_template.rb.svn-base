class ZoneTemplate < ActiveRecord::Base

  def apply(zone)

    template_dir = File.join(Rails.root, 'zone_templates', self.folder_name)
    results = zone.unpackage(template_dir)

    logger.debug("Users:> #{results[:users]}")
    logger.debug("Groups:> #{results[:groups]}")
    logger.debug("Choice Lists:> #{results[:choice_lists]}")
    logger.debug("Property Definitions:> #{results[:property_definitions]}")
    logger.debug("Document Types:> #{results[:document_types]}")
    logger.debug("View Definitions:> #{results[:view_definitions]}")
    logger.debug("Folders:> #{results[:folders]}")
    logger.debug("Documents:> #{results[:documents]}")
    logger.debug("Versions:> #{results[:versions]}")

  end


end
