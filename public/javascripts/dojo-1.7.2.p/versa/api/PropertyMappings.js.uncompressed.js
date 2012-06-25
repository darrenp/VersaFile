//>>built
/**
 * @author Scott
 */
define("versa/api/PropertyMappings", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Error",
        "versa/api/PropertyMapping"],
    function(declare){
        var o=declare("versa.api.PropertyMappings", [versa.api._Collection], {
            constructor: function(/* Object */args){
                this.zone = args.zone;
                this.library = args.library;
                this.target = dojo.replace(versa.api.PropertyMappings.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.PropertyMapping.schema;
                this.cache = true;

                this._initialize();
            }
        });

        o.getDefault= function(propMap, propDefs){
            var propertyDefinition=propDefs.fetchById({id: propMap.property_definition_id});
            if(propertyDefinition.isTypeDate()&&propMap.default_type==versa.api.PropertyMapping.types.date.floating){
                var date=new Date();
                date.setDate(date.getDate()+parseInt(propMap.default_value));
                return date;
            }else{
                if(propMap.default_value){
                    if(propertyDefinition.isTypeInteger()){
                        return parseInt(propMap.default_value);
                    }else if(propertyDefinition.isTypeFloat()){
                        return parseFloat(propMap.default_value);
                    }
                    return propMap.default_value;
                }
            }
            return null;
        };

        o.TRGT='/zones/{0}/libraries/{1}/property_mappings';

        return o;
    }
);

