//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 11/10/11
 * Time: 3:39 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Role", ["dojo/_base/declare",
        "versa/api/_Object"],
    function(declare){
        var o=declare("versa.api.Role", [versa.api._Object], {
             constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
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
                'permissions': {
                    type: 'integer'
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



