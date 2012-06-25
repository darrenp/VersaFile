//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 21/11/11
 * Time: 8:46 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Operators", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Operator"],
    function(declare){
        var o=declare("versa.api.Operators", [versa.api._Collection], {
            _andOp: null,

            _fetch_onComplete: function(items, request){

                this.isLoaded = true;
                if((items != null) && (items.length > 1)){
                    this.first = items[0];
                }

                dojo.forEach(items, function(item,idx){
                    if(item.name == 'and')
                        this._andOp = item;
                }, this);

            },

            constructor: function(args){
                this.target = versa.api.Operators.TRGT;
                this.schema = versa.api.Operator.schema;
                this.cache = true;

                this._initialize();
            },

            byDataType: function(id){
                var ops = []

                this.forEach(function(item){
                    if(item.data_type_id == id)
                        ops.push(item);
                }, this);

                return ops;
            },

            getAndOp: function(){
                return this._andOp;
            }
        });

        o.TRGT = '/operators';

        return o;
    }
);

