//>>built
/**
 * @author Scott
 */
define("versa/api/PropertyMapping", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/Error",
        "versa/api/Formatter"],
    function(declare){
        var o=declare("versa.api.PropertyMapping", [versa.api._Object], {
            constructor: function(/* Object */args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            }
        });

        o.compare = function(item1, item2){
            return item1.sort_order-item2.sort_order;
        };

        o.formatValue = function(property_definition, value){
            var frmt_value = null;

            if(property_definition.isTypeDate()){
                frmt_value = versa.api.Formatter.formatDateTime(value);
            }
            else{
                frmt_value = value;
            }

            return frmt_value;
        };

        //leavin this open for other default types
        o.types = {
            date:{
                fixed: 0,
                floating: 1
            }
        };

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'document_type_id': {
                    type: 'integer'
                },
                'property_definition_id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': 'Property'
                },
                'sort_order': {
                    type: 'integer',
                    'default': 1
                },
                'is_required': {
                    type: 'boolean',
                    'default': false
                },
                'choice_list_id': {
                    type: 'integer',
                    'default': null
                },
                'default_value': {
                    type: 'string',
                    'default': null
                },
                'default_type': {
                    type: 'integer',
                    'default': 0
                }
            }
        };

        return o;
    }
);

