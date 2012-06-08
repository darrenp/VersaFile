//>>built
/**
 * @author aarons
 */
define("versa/api/ViewMapping", ["dojo/_base/declare",
         "versa/api/_Object",
         "versa/api/Error"],
    function(declare){
        var o=declare("versa.api.ViewMapping", [versa.api._Object], {
            constructor: function(/* Object */args){
                if(args) dojo.safeMixin(this, args);
            }
        });

        o.compare = function(item1, item2){
            return item1.sort_order-item2.sort_order;
        };

        o.schema = {
            type: 'object',
            properties: {
                'library_id': {
                    type: 'integer'
                },
                'folder_id': {
                    type: 'integer'
                },
                'user_id': {
                    type: 'integer'
                },
                'view_id': {
                    type: 'integer'
                }
            }
        };

        return o;
    }
);


