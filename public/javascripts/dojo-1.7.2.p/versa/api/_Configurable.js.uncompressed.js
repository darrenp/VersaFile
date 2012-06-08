//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 29/01/12
 * Time: 7:55 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/_Configurable", ["dojo/_base/declare"],
    function(declare){
        return declare("versa.api._Configurable", [], {
            configuration: {
                configuration_settings: []
            },

            constructor: function(args){

            },

            getValue: function(name){

                var value = null;

                dojo.some(this.configuration.configuration_settings, function(setting, idx){
                    if(setting.name.toLowerCase() == name.toLowerCase()){
                        value = setting.value;
                        return true;
                    }
                    return false
                }, this);

                return value;
            }
        });
    }
);
