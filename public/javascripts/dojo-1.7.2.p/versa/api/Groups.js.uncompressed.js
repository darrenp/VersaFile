//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 26/09/11
 * Time: 10:55 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Groups", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Group"],
    function(declare){
        var o=declare("versa.api.Groups", [versa.api._Collection], {
            zone: null,

            _matchesQuery: function(item,request){

                //query returns array of choice list values,
                //exclude them.
                if(dojo.isArray(item) || (item.hasOwnProperty('user_id')))
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
                this.target = dojo.replace(versa.api.Groups.TRGT, this.zone);
                this.schema = versa.api.Group.schema;
                this.cache = true;

                this._initialize();
                this.store.matchesQuery  = dojo.hitch(this, this._matchesQuery);
            },

            getAdmin: function(){
                var admin = null;

                this.forEach(function(item){
                    if(item.is_admin)
                        admin = item;
                }, this);

                return admin;
            },

            getEveryone: function(){
                var everyone = null;

                this.forEach(function(item){
                    if(item.is_everyone)
                        everyone = item;
                }, this);

                return everyone;
            }

        });

        o.TRGT = '/zones/{subdomain}/groups'

        return o;
    }
);

