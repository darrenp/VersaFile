//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 21/11/11
 * Time: 8:46 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Operator", ["dojo/_base/declare",
        "dojox/json/ref",
        "versa/api/Error"],
    function(declare){
        var o=declare("versa.api.Operator", [], {
            id: null,
            name: null,
            value: null,

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
                'value': {
                    type: 'string'
                },
                'no_rhs': {
                    type: 'boolean'
                }

            },
            prototype: new o()
        };

        return o;
    }
);



