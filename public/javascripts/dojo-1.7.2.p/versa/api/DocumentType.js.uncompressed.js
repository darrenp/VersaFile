//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 08/11/11
 * Time: 4:05 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/DocumentType", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/XhrHelper",
        "versa/api/PropertyMapping"],
    function(declare){
        var o=declare("versa.api.DocumentType", [versa.api._Object], {
            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            getMetrics: function(args){

                var url = dojo.replace(versa.api.DocumentType.MT_TRGT,  [args.zone.subdomain, args.library.id, this.id]);
                var result = versa.api.XhrHelper.doGetAction({
                    target: url
                });

                return true;
            },

            hasProperty: function(id){

                var has = dojo.some(this.property_mappings, function(mapping, idx){
                    return (mapping.property_definition_id == id);
                }, this);

                return has;
            },

            isValid: function(){
                var isValid = true;

                if (String.isEmpty(this.name.trim())) {
                    isValid = false;
                }

                return isValid;
            }
        });

        o.MT_TRGT = '/zones/{0}/libraries/{1}/document_types/{2}/dtmetrics.json';

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': ''
                },
                'is_system': {
                    type: 'boolean',
                    'default': false
                },
                'property_mappings': {
                    type: 'array',
                    'default': [],
                    items: {
                        type: 'object',
                        properties: {
                            'property_definition_id': {
                                type: 'integer'
                            },
                            'choice_list_id': {
                                type: 'integer'
                            },
                            'default_value': {
                                type: 'string'
                            },
                            'is_required': {
                                type: 'boolean'
                            },
                            'sort_order': {
                                type: 'integer'
                            },
                            prototype: new versa.api.PropertyMapping()
                        }
                    }
                },
                'created_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'created_by': {
                    type: 'string'
                },
                'description': {
                    type: 'string',
                    'default': ''
                },
                'updated_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'updated_by': {
                    type: 'string'
                }
            },
            prototype: new o()
        };

        return o;
    }
);

