//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 04/11/11
 * Time: 10:11 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/PropertyDefinitions", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/PropertyDefinition"],
    function(declare){
        var o=declare("versa.api.PropertyDefinitions", [versa.api._Collection], {
            library: null,

            constructor: function(args){
                this.zone = args.zone;
                this.library = args.library;
                this.target = dojo.replace(versa.api.PropertyDefinitions.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.PropertyDefinition.schema;
                this.cache = true;

                this._initialize();
            },

            fetchByDbName: function(dbName){
                var _item = null;

                function  __onComplete(items, request){
                    dojo.some(items, function(item){
                        if(item.getDbName() == dbName){
                            _item = item;
                            return false;
                        }
                    }, this);
                }

                this.store.fetch({
                    query:{},
                    queryOptions:{cache: true},
                    onComplete: __onComplete
                });

                return _item;
            },

            getNameProperty: function(){
                var name_propdef = null;

                this.forEach(function(item){
                    if(item.is_name)
                        name_propdef = item;
                }, this);

                return name_propdef;
            }
        });

        o.TRGT = '/zones/{0}/libraries/{1}/property_definitions';

        return o;
    }
);

