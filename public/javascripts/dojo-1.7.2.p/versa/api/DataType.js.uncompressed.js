//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 07/11/11
 * Time: 2:46 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/DataType", ["dojo/_base/declare"],
    function(declare){
        var o=declare("versa.api.DataType", [], {
            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            defaultMaxLength: function(){
                var max_length = null;

                switch(this.prefix){
                    case 'str':
                        max_length = 255;
                        break;
                    case 'txt':
                        max_length = 4096;
                        break;
                }

                return max_length;

            },

            isBoolean: function(){
                return (this.prefix == 'bln');
            },

            isDateTime: function(){
                return (this.prefix == 'dtt');
            },

            isFloat: function(){
                return (this.prefix == 'flt');
            },

            isInteger: function(){
                return (this.prefix == 'int');
            },

            isString: function(){
                return (this.prefix == 'str');
            },

            isText: function(){
                return (this.prefix == 'txt');
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
                'prefix': {
                    type: 'string'
                }
            },
            prototype: new o()
        };

        return o;
    }
);

