//>>built
/**
 * @author aarons
 */
define("versa/api/ViewMappings", ["dojo/_base/declare",
         "versa/api/_Collection",
         "versa/api/Error",
         "versa/api/ViewMapping"],
    function(declare){
        var o=declare("versa.api.ViewMappings", [versa.api._Collection], {
            constructor: function(/* Object */args){
                this.zone = args.zone;
                this.library = args.library;
                this.target = dojo.replace(versa.api.ViewMappings.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.ViewMapping.schema;
                this.cache = false;

                this._initialize();
            },

            getMapping: function(folder_id, user_id){
                return this.query({query:dojo.replace('?folder_id={0}&user_id={1}', [folder_id, user_id])})
            }
        });

        o.TRGT='/zones/{0}/libraries/{1}/view_mappings';

        return o;
    }
);


