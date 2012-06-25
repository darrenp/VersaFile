//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 21/11/11
 * Time: 2:41 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Search", ["dojo/_base/declare",
         "versa/api/_Object"],
    function(declare){
        var o=declare("versa.api.Search", [versa.api._Object], {
            type: 0,
            queryData: null,
            view_definition_id: null,

            _getAdvancedQuery: function(){
                return {
                    type: this.type,
                    query: dojo.toJson(this.queryData),
                    view: this.view_definition_id
                }
            },

            _getFolderQuery: function(){
                return {
                    type: this.type,
                    query: this.queryData,
                    view: this.view_definition_id
                }
            },

            _getSimpleQuery: function(){
                return {
                    type: this.type,
                    query: this.queryData,
                    view: this.view_definition_id
                }
            },

            constructor: function(args){
                declare.safeMixin(this, ((!args) ? { } : args))
            },

            getQuery: function(){

                var query = { type: bfree.api.Search.types.NONE };

                switch(this.type){
                    case bfree.api.Search.types.FOLDER:
                    case bfree.api.Search.types.TRASH:
                        query = this._getFolderQuery();
                        break;
                    case bfree.api.Search.types.SIMPLE:
                        query = this._getSimpleQuery();
                        break;
                    case bfree.api.Search.types.ADVANCED:
                        query = this._getAdvancedQuery();
                        break;
                    case bfree.api.Search.types.TRASH:
                        break;
                }

                return query;
            }
        });

        o.types =  {
            'NONE':     0x00,
            'FOLDER':   0x01,
            'SIMPLE':   0x02,
            'ADVANCED': 0x03,
            'TRASH':    0x04
        };

        return o;
    }
);





