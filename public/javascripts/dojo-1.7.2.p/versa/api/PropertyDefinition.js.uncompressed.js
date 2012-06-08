//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 04/11/11
 * Time: 10:11 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/PropertyDefinition", ["dojo/_base/declare",
        "versa/api/_Object"],
    function(declare){
        var o=declare("versa.api.PropertyDefinition", [versa.api._Object], {
            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            getDbName: function(){
                //return dojo.replace("{table_name}.{column_name}", this);
                return dojo.replace("{table_name}.{column_name}", this);
            },

            isTypeDate: function(){
                return this.data_type_id == versa.api.DataTypes.types.DATETIME;
            },

            isTypeText: function(){
               return this.data_type_id == versa.api.DataTypes.types.TEXT
            },

            isTypeInteger: function(){
                return this.data_type_id==versa.api.DataTypes.types.INTEGER;
            },

            isTypeFloat: function(){
                return this.data_type_id==versa.api.DataTypes.types.FLOAT;
            },

            isTypeAnyNumber: function(){
                return this.data_type_id==versa.api.DataTypes.types.INTEGER||
                       this.data_type_id==versa.api.DataTypes.types.FLOAT
            },

            isTypeBoolean: function(){
                return this.data_type_id==versa.api.DataTypes.types.BOOLEAN;
            },

            isValid: function(){
                var isValid = true;

                if (String.isEmpty(this.name.trim())) {
                    isValid = false;
                }

                if(!this.data_type_id){
                    isValid = false;
                }

                return isValid;
            }
        });

        versa.api.Cardinality = {
            'Single': 0x01,
            'Multiple': 0x02
        };

        o.compare = function(item1, item2){
            if(!item1.name||!item2.name){
                return 0;
            }
            return (item1.name.toLowerCase()>item2.name.toLowerCase())?1:-1;
        };

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
                'cardinality': {
                    type: 'integer',
                    'default': versa.api.Cardinality.Single
                 },
                'column_name': {
                    type: 'string'
                },
                'created_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'created_by': {
                    type: 'string'
                },
                'data_type_id': {
                    type: 'integer'
                },
                'description': {
                    type: 'string',
                    'default': ''
                },
                'is_readonly': {
                    type: 'boolean',
                    'default': false
                },
                'is_system': {
                    type: 'boolean',
                    'default': false
                },
                'max_length': {
                    type: 'max_length'
                },
                'table_name': {
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

