//>>built
/**
 * @author Scott
 */
define("versa/api/ChoiceLists", ["dojo/_base/declare",
        "versa/api/ChoiceList",
        "versa/api/_Collection",
        "versa/api/Error",
        "versa/api/DataTypes"],
    function(declare){
        var o=declare("versa.api.ChoiceLists", [versa.api._Collection], {
            _matchesQuery: function(item,request){

                //query returns array of choice list values,
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
        
            constructor: function(/* Object */args){
                this.zone=args.zone;
                this.library=args.library;
                this.target = dojo.replace(versa.api.ChoiceLists.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.ChoiceList.schema;
                this.cache = true;
        
                this._initialize();
                this.store.matchesQuery  = dojo.hitch(this, this._matchesQuery);
        
            },
        
            isValidItem: function(args){
                var isValid = this.inherited(arguments);
                var item = args.item;
                var choiceValues = args.choice_values;
                
                if(!isValid) return;
                
                if (item.name.length < 1) {
                    throw new Error('Choice List \'Name\' is empty or invalid');
                }
                
                if((!choiceValues) || (choiceValues.length < 1)){
                    throw new Error('Choice List \'' + item.name + '\' does not contain any values');
                }
                        
                return true;
            }            
        });

        o.TRGT="/zones/{0}/libraries/{1}/choice_lists"

        return o;
    }
);

