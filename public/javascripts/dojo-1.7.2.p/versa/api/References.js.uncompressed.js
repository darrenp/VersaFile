//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 04/04/12
 * Time: 12:32 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/References", ["dojo/_base/declare",
         "versa/api/_Collection",
         "versa/api/Reference"],
    function(declare){
        var o=declare("versa.api.References", [versa.api._Collection], {
            library: null,
            zone: null,

            _isUpdateable: function(request){
                return false;
            },

            _softDelete: function(item){
                var url = dojo.replace(versa.api.References.SDEL_TRGT,  [this.zone.subdomain, this.library.getId(), item.getId()]);
                var putData = {};

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return result;
            },

            constructor: function(args){

                this.zone = args.zone;
                this.library = args.library;
                this.target = dojo.replace(versa.api.References.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.Reference.schema;
                this.cache = false;

                this._initialize();
                this.store.isUpdateable = dojo.hitch(this, this._isUpdateable);
            },

            destroy: function(args){
                var item = args.item;

                if((item.isInstanceOf(versa.api.Reference)) && (args.soft)){
                    item = this._softDelete(item);
                    this.store.onDelete(item);
                }
                else{
                    this.inherited('destroy', arguments);
                }

            },

            export_query: function(args){
                var queryStr = dojo.objectToQuery(args.query);

                var sortStr = dojo.replace('sort({0}{1})',
                    [   (args.sort.descending ? '-' : '+'),
                        encodeURIComponent(args.sort.attribute)]) ;

                var frmt = 'json';
                switch(args.type){
                    case versa.api.References.ExportTypes.CSV:
                        frmt = 'csv';
                        break;
                    case versa.api.References.ExportTypes.PDF:
                        frmt = 'pdf';
                        break;
                    case versa.api.References.ExportTypes.XML:
                        frmt = 'xml'
                        break;
                }

                var url = dojo.replace(versa.api.References.EXPORT_TRGT, [args.zone.subdomain, args.library.id, queryStr, sortStr, frmt]);

                if(args.type == versa.api.Documents.ExportTypes.PDF){
                   versa.api.Utilities.viewUrl({
                        windowBox: args.windowBox,
                        url: url,
                        window_name: 'versa_save'
                    });
                }
                else{
                   versa.api.Utilities.saveUrl({
                        url: url,
                        window_name: 'versa_save'
                    });
                }
            },

            print_query: function(args){

                var queryStr = dojo.objectToQuery(args.query);

                var sortStr = dojo.replace('sort({0}{1})',
                    [   (args.sort.descending ? '-' : '+'),
                        encodeURIComponent(args.sort.attribute)]) ;

                var url = dojo.replace(versa.api.References.PRINT_TRGT, [args.zone.subdomain, args.library.id, queryStr, sortStr, 'html'])

                versa.api.Utilities.viewUrl({
                    windowBox: args.windowBox,
                    url: url,
                    window_name: 'versa_printer'
                });

            }
        });

        o.ExportTypes = { 'NONE':  0x0000, 'CSV':   0x001, 'PDF':   0x0002, 'XML':   0x0003 }

        o.TRGT = '/zones/{0}/libraries/{1}/references';
        o.SDEL_TRGT  = '/zones/{0}/libraries/{1}/references/{2}/soft_delete.json';
        o.PRINT_TRGT = '/zones/{0}/libraries/{1}/references?{2}&{3}';
        o.EXPORT_TRGT = '/zones/{0}/libraries/{1}/references.{4}?{2}&{3}';

        return o;
    }
);

