//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 26/09/11
 * Time: 10:55 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Group", ["dojo/_base/declare",
        "versa/api/_Object"],
    function(declare){
        var o=declare("versa.api.Group", [versa.api._Object], {
            description: null,

            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            isValid: function(){
                var isValid = true;

                if (String.isEmpty(this.name.trim())) {
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
                    'default': ''
                },
                'description': {
                    type: 'string'
                },
                'active_users': {
                    type: 'array',
                    items: {
                        type: 'integer'
                    }
                },
                'created_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'created_by': {
                    type: 'string'
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

