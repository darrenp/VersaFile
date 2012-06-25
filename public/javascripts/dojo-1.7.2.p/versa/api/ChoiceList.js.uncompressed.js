//>>built
/**
 * @author Scott
 */
define("versa/api/ChoiceList", ["dojo/_base/declare",
        "versa/api/_Object"],
    function(declare){
        var o=declare("versa.api.ChoiceList", [versa.api._Object], {
            constructor: function(/* Object */args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            isValid: function(){
                var isValid = true;

                if (String.isEmpty(this.name.trim())) {
                    isValid = false;
                }

                if((!this.data_type_id) || (this.data_type_id < 1)){
                    isValid = false;
                }

                return isValid;
            }
        });

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': 'Property'
                },
                'data_type_id': {
                    type: 'integer'
                },
                'choice_values': {
                    type: 'array',
                    'default': [],
                    items: {
                        type: 'object',
                        properties: {
                            'sort_order': {
                                type: 'integer'
                            },
                            'name': {
                                type: 'string'
                            },
                            'value': {
                                type: 'string'
                            }
                        }
                    }
                },
                'created_at': {
                    type: 'string',
                    format: 'date-time',
                    'default': dojo.date.stamp.toISOString(new Date(), {zulu: true})
                },
                'created_by': {
                    type: 'string',
                    'default': ''
                },
                'updated_at': {
                    type: 'string',
                    format: 'date-time',
                    'default': dojo.date.stamp.toISOString(new Date(), {zulu: true})
                },
                'updated_by': {
                    type: 'string',
                    'default': ''
                }
            },
            prototype: new o()
        };
        return o;
    }
);

