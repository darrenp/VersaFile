//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 26/09/11
 * Time: 10:47 AM
 * To change this template use File | Settings | File Templates.
 */

define("versa/api/_Object", ["dojo/_base/declare"],
    function(declare){
        return declare("versa.api._Object", [], {
            id: null,
            name: null,
            created_at: null,
            created_by: null,
            updated_at: null,
            updated_by: null,

            constructor: function(args){

                if((this.created_at != null) && (typeof this.created_at == 'string'))
                    this.created_at = dojo.date.stamp.fromISOString(this.created_at);
                if((this.updated_at != null) && (typeof this.updated_at == 'string'))
                    this.updated_at = dojo.date.stamp.fromISOString(this.created_at);

            },

            valueEquals: function(property, value){

                if(!this.hasOwnProperty(property))
                    return false;

                var myValue = this[property];
                if((myValue == null) && (value == null))
                    return true;

                //in the case of string compare empty string to null = 'true'
                if((typeof myValue == 'string') || (typeof value == 'string')){
                    myValue = (myValue == null) ? '' : myValue;
                    value = (value == null) ? '' : value;
                }

                return (myValue == value);
            },

            getId: function(){
                return (this.$ref ? this.$ref : this.id);
            },

            isNew: function(){
                return ((this.id == undefined) || (this.id == null));
            },

            isValid: function(){
                return true;
            }
        });
    }
);
