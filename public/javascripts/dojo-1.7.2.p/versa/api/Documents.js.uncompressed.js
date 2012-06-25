//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 26/09/11
 * Time: 11:24 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Documents", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Document",
        "versa/api/Utilities"],
    function(declare){
        var o=declare("versa.api.Documents", [versa.api._Collection], {
            library: null,

            _isUpdateable: function(request){
                return false;
            },

            /*
            _onDelete: function(item){
                item.state |= versa.api.Document.states.DELETED;
            },
            */

            _softDelete: function(item){
                var url = dojo.replace(versa.api.Documents.SDEL_TRGT,  [this.zone.subdomain, this.library.getId(), item.getId()]);
                var putData = {};

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return result;
            },

            constructor: function(args){
                console.log(versa);
                console.log(versa.api);
                console.log(versa.api.Document);
                console.log(versa.api.Document.schema);

                this.zone = args.zone;
                this.library = args.library;
                this.target = dojo.replace(versa.api.Documents.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.Document.schema;
                this.cache = false;
                this.syncMode = false;

                this._initialize();
                this.store.isUpdateable = dojo.hitch(this, this._isUpdateable);

                //dojo.connect(this.store, 'onDelete', this._onDelete);

            },

            destroy: function(args){
                var item = args.item;

                if((item.isInstanceOf(versa.api.Document)) && (args.soft)){
                    item = this._softDelete(item);
                    this.store.onDelete(item);
                }
                else{
                    this.inherited('destroy', arguments);
                }
            },

            empty_recycling: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Documents.EMPTY,  [zone.subdomain, library.id]);

                var result = versa.api.XhrHelper.doPostAction({
                    target: url,
                    postData: {}
                });

                return true;
            },

            export_query: function(args){

                var queryStr = dojo.objectToQuery(args.query);

                var sortStr = dojo.replace('sort({0}{1})',
                    [   (args.sort.descending ? '-' : '+'),
                        encodeURIComponent(args.sort.attribute)]) ;

                var frmt = 'json';
                switch(args.type){
                    case versa.api.Documents.ExportTypes.CSV:
                        frmt = 'csv';
                        break;
                    case versa.api.Documents.ExportTypes.PDF:
                        frmt = 'pdf';
                        break;
                    case versa.api.Documents.ExportTypes.XML:
                        frmt = 'xml'
                        break;
                }

                var url = dojo.replace(versa.api.Documents.EXPORT_TRGT, [args.zone.subdomain, args.library.id, queryStr, sortStr, frmt]);

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

            isValid: function(args){
                this.validate(args);
                return this.getState(versa.api.Document.states.INVALID);
            },

            print_query: function(args){

                var queryStr = dojo.objectToQuery(args.query);

                var sortStr = dojo.replace('sort({0}{1})',
                    [   (args.sort.descending ? '-' : '+'),
                        encodeURIComponent(args.sort.attribute)]) ;

                var url = dojo.replace(versa.api.Documents.EXPORT_TRGT, [args.zone.subdomain, args.library.id, queryStr, sortStr, 'html'])

                versa.api.Utilities.viewUrl({
                    windowBox: args.windowBox,
                    url: url,
                    window_name: 'versa_printer'
                });

            }
        });

        o.States = { pending: 0x0000, checked_in: 0x0001, checked_out: 0x0002, busy: 0x4000, deleted: 0x8000 }
        o.ExportTypes = { 'NONE':  0x0000, 'CSV':   0x001, 'PDF':   0x0002, 'XML':   0x0003 }

        o.TRGT = '/zones/{0}/libraries/{1}/documents';
        o.PRINT_TRGT = '/zones/{0}/libraries/{1}/documents?{2}&{3}';
        o.EXPORT_TRGT = '/zones/{0}/libraries/{1}/documents.{4}?{2}&{3}';
        o.EMPTY = '/zones/{0}/libraries/{1}/documents/empty';
        o.SDEL_TRGT  = '/zones/{0}/libraries/{1}/documents/{2}/soft_delete.json';

        o.isCheckedOut = function(args){
            var state
            if(args.document){
                state=args.document.state;
            }else if(args.state){
                state=args.state;
            }
            return ((state & versa.api.Documents.States.checked_out) > 0);
        };

        o.isBusy = function(args){
            return ((args.state & versa.api.Documents.States.busy) > 0);
        };

        return o;
    }
);

