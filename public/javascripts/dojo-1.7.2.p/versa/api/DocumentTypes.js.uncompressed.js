//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 08/11/11
 * Time: 4:05 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/DocumentTypes", ["dojo/_base/declare",
        "versa/api/DocumentTypes",
        "versa/api/_Collection",
        "versa/api/DocumentType"],
    function(declare){
        var o=declare("versa.api.DocumentTypes", [versa.api._Collection], {
            library: null,

            _isUpdateable: function(request){
                return false;
            },

            //this method prevents sub-objects from being included in the query
            //and being drawn on the grid
            _matchesQuery: function(item,request){

                //query returns array of property mappings,
                //exclude them.
                if(dojo.isArray(item) || (item.hasOwnProperty('sort_order')))
                    return false;

                var query = request.query;
                var ignoreCase = request.queryOptions && request.queryOptions.ignoreCase;
                for(var i in query){
                    // if anything doesn't match, than this should be in the query
                    var match = query[i];
                    var value = this.getValue(item,i);
                    if((typeof match == 'string' && (match.match(/[\*\.]/) || ignoreCase)) ?
                        !dojo.data.util.filter.patternToRegExp(match, ignoreCase).test(value) :
                        value != match){
                        return false;
                    }
                }
                return true;
            },

            constructor: function(args){
                this.zone = args.zone;
                this.library = args.library;
                this.target = dojo.replace(versa.api.DocumentTypes.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.DocumentType.schema;
                this.cache = true;

                this._initialize();
        //        this.store.isUpdateable = dojo.hitch(this, this._isUpdateable);
                this.store.matchesQuery  = dojo.hitch(this, this._matchesQuery);
            },

            getMetrics: function(args){

                var url = dojo.replace(versa.api.DocumentTypes.MT_TRGT,  [args.zone.subdomain, args.library.id]);
                var result = versa.api.XhrHelper.doGetAction({
                    target: url
                });

                return result;
            },

            getSystem: function(){
                var system_types = [];

                this.forEach(function(item){
                    if(item.is_system)
                        system_types.push(item);
                }, this);

                if(system_types.length < 1)
                    throw new Error('No system-defined document types were found');

                return system_types;
            }
        });

        o.TRGT = '/zones/{0}/libraries/{1}/document_types';
        o.MT_TRGT = '/zones/{0}/libraries/{1}/document_types/dtmetrics.json';

        return o;
    }
);

