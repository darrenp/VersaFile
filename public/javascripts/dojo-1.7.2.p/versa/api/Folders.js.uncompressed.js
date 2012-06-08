//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 24/10/11
 * Time: 9:58 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Folders", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Folder",
        "versa/api/Utilities"],
    function(declare){
         var o=declare("versa.api.Folders", [versa.api._Collection], {
            library: null,

            _getExistingNames: function(parentItem){

                var names = [];

                if((parentItem) && (parentItem.children)){
                    dojo.forEach(parentItem.children, function(folderItem){
                        names.push(folderItem.name);
                    });
                }

                return names;
            },

            /*
            _isUpdateable: function(request){
                return false;
                if(request.query.hasOwnProperty('parent_id'))
                    return true;

                return typeof request.query == "object";
            },
            */

            constructor: function(args){

                this.zone = args.zone;
                this.library = args.library;
                this.target = dojo.replace(versa.api.Folders.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.Folder.schema;
                this.cache = true;

                this._initialize();
                //this.store.isUpdateable  = dojo.hitch(this, this._isUpdateable);
            },

            generateUniqueName: function(args){
                var names = this._getExistingNames(args.parent);
                var baseName = args.base_name;

                return versa.api.Utilities.generateUniqueName({
                    names: names,
                    base_name: baseName
                });
            },

            getTextPath: function(args){
                var item=args.item;

                if(item.parent_id){
                    var parent=this.fetchById({id: item.parent_id});
                    return this.getTextPath({item: parent})+'/'+item.name;
                }else{
                    return '/'+item.name
                }
        //        return this.name;
            }
        });

        o.TRGT = '/zones/{0}/libraries/{1}/folders';

        o.generateUniqueName = function(args){
            var parentItem = args.folder;
            var names = [];

            dojo.forEach(parentItem.children, function(folderItem){
                names.push(folderItem.name);
            });

            return versa.api.Utilities.generateUniqueName({
                names: names,
                base_name: args.base_name
            });

        };

        return o;
    }
);

