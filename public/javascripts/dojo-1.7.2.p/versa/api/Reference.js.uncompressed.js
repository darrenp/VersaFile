//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 04/04/12
 * Time: 12:36 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Reference", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/_Securable",
        "versa/api/Utilities",
        "versa/api/Document"],
    function(declare){
        var o=declare("versa.api.Reference",
                [versa.api._Object,
                 versa.api._Securable], {
            zone: null,
            library: null,

            clean_properties: function(args){
                var library = args.library;

                var document_type = library.getDocumentTypes().fetchById({id: this.document_type_id});

                //For each property
                for(var p in this){
                    //exclude functions
                    if(!dojo.isFunction(this[p])){
                        //retrieve the property_definition based on dbName (only lookup documents.*)
                        var dbName = dojo.replace('documents.{0}', [p]);
                        var property_definition = library.getPropertyDefinitions().fetchByDbName(dbName);

                        //Exclude if property wasn't found or is a system property
                        if((property_definition) && (!property_definition.is_system)){
                            //if current document type does not include property, delete it.
                            if(!document_type.hasProperty(property_definition.id)){
                                delete this[p];
                            }
                        }

                    }
                }

            },

            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
                this.securable_type = versa.api._Securable.types.Reference;
            },

            cancelCheckout: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Reference.XCKO_TRGT,  [zone.subdomain, library.id, this.getId()]);

                var putData = {
                };

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true;
            },

            checkin: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Reference.CKI_TRGT,  [zone.subdomain, library.id, this.getId()]);
                var putData = dojo.fromJson(dojox.json.ref.toJson(this, false, '', true));;

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true;
            },

            checkout: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Reference.CKO_TRGT,  [zone.subdomain, library.id, this.getId()]);
                var putData = {};

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true;
            },

            getCopyUrl: function(zone, library){
                return dojo.replace(versa.api.Reference.CP_TRGT, [zone.subdomain, library.id, this.getId()])
            },

            getCopyVersionUrl: function(zone, library, version){
                return dojo.replace(versa.api.Reference.CPV_TRGT, [zone.subdomain, library.id, this.getId(), version]);
            },

            copyLocal: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = (args.version_id) ?
                                this.getCopyVersionUrl(zone, library, args.version_id):
                                this.getCopyUrl(zone, library);

                versa.api.Utilities.saveUrl({
                    url: url,
                    window_name: 'versa_save'
                });

            },

            file: function(args){
                var zone = args.zone;
                var library = args.library;
                var folder = args.folder;

                var url = dojo.replace(versa.api.Reference.FILE_TRGT,  [zone.subdomain, library.id, this.getId(), folder.getId()]);
                var putData = {};

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                //simulate removal from current results.
                library.getReferences().store.onDelete(this);
                return true;
            },

            getPermissionSet: function(folder, library, user){
                var prmSet = new versa.api.PermissionSet();

                prmSet.setValue(versa.api.PermissionIndices.VIEW, this.hasRights(versa.api._Securable.permissions.VIEW));
                prmSet.setValue(versa.api.PermissionIndices.COPY, this.hasRights(versa.api._Securable.permissions.VIEW));
                prmSet.setValue(versa.api.PermissionIndices.EDIT, this.hasRights(versa.api._Securable.permissions.WRITE_METADATA));
                prmSet.setValue(versa.api.PermissionIndices.MOVE, prmSet.getValue(versa.api.PermissionIndices.EDIT));
                prmSet.setValue(versa.api.PermissionIndices.CKO, (this.hasRights(versa.api._Securable.permissions.VERSION) && this.getState(versa.api.Document.states.CHECKED_IN)));
                prmSet.setValue(versa.api.PermissionIndices.CKI, (this.hasRights(versa.api._Securable.permissions.VERSION) && this.getState(versa.api.Document.states.CHECKED_OUT) && (this.checked_out_by == user.name)));
                prmSet.setValue(versa.api.PermissionIndices.CANCEL_CKO, prmSet.getValue(versa.api.PermissionIndices.CKI));
                prmSet.setValue(versa.api.PermissionIndices.DELETE, this.hasRights(versa.api._Securable.permissions.DELETE_ITEMS));
                prmSet.setValue(versa.api.PermissionIndices.SECURE, this.hasRights(versa.api._Securable.permissions.WRITE_ACL));

                prmSet.setValue(versa.api.PermissionIndices.RESTORE, this.hasRights(versa.api._Securable.permissions.DELETE_ITEMS));
                prmSet.setValue(versa.api.PermissionIndices.DESTROY, this.hasRights(versa.api._Securable.permissions.DELETE_ITEMS));

                return prmSet;
            },

            getState: function(stateFlag){
               return ((this.state & stateFlag) == stateFlag);
            },

            isDeleted: function(){
                return this.getState(versa.api.Document.states.DELETED);
            },

            isShare: function(){
                return this.reference_type == versa.api.Reference.types.SHARE;
            },

            restore: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Reference.RESTORE_TRGT,  [zone.subdomain, library.getId(), this.getId()]);
                var putData = {
                    folder_id: (args.folder) ? args.folder.id : null
                };

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                //simulate removal from 'recycle bin'.
                library.getReferences().store.onDelete(this);
                return true;
            },

            share: function(args){
                var zone = args.zone;
                var library = args.library;
                var folder = args.folder;

                var url = dojo.replace(versa.api.Reference.SHARE_TRGT,  [zone.subdomain, library.id, this.getId(), folder.getId()]);
                var putData = {};

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true;
            },

            unshare: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Reference.UNSHARE_TRGT,  [zone.subdomain, library.id, this.getId()]);
                var putData = {};

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                //simulate removal from current results.
                library.getReferences().store.onDelete(this);

                return true;
            },

            getViewUrl: function(zone, library){
                return dojo.replace(versa.api.Reference.VW_TRGT, [zone.subdomain, library.id, this.getId()]);
            },

            getViewVersionUrl: function(zone, library, version){
                return dojo.replace(versa.api.Reference.VWV_TRGT, [zone.subdomain, library.id, this.getId(), version])
            },

            view: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = (args.version_id) ?
                                this.getViewVersionUrl(zone, library, args.version_id) :
                                this.getViewUrl(zone, library);


                versa.api.Utilities.viewUrl({
                    windowBox: args.windowBox,
                    url: url,
                    window_name: 'versa_viewer'
                });
            }
        });

        o.VW_TRGT = '/zones/{0}/libraries/{1}/references/{2}/download/?disposition=inline'
        o.VWV_TRGT = '/zones/{0}/libraries/{1}/references/{2}/download/?disposition=inline&version_id={3}'
        o.CP_TRGT = '/zones/{0}/libraries/{1}/references/{2}/download/?disposition=attachment';
        o.CPV_TRGT = '/zones/{0}/libraries/{1}/references/{2}/download/?disposition=attachment&version_id={3}';
        o.CKO_TRGT = '/zones/{0}/libraries/{1}/references/{2}/checkout.json';
        o.CKI_TRGT  = '/zones/{0}/libraries/{1}/references/{2}/checkin.json';
        o.XCKO_TRGT = '/zones/{0}/libraries/{1}/references/{2}/cancel_checkout.json';
        o.FILE_TRGT = '/zones/{0}/libraries/{1}/references/{2}/file.json?folder_id={3}';
        o.SHARE_TRGT = '/zones/{0}/libraries/{1}/references/{2}/share.json?folder_id={3}'
        o.UNSHARE_TRGT = '/zones/{0}/libraries/{1}/references/{2}/unshare.json?'
        o.RESTORE_TRGT  = '/zones/{0}/libraries/{1}/references/{2}/restore.json';

        o.types = {
            'CONTENT':  0x0000,
            'SHARE':    0x0011,
            'TRASH':    0x0012
        }

        console.log(versa);
        console.log(versa.api);
        console.log(versa.api.Document);
        console.log(versa.api.Document.states);

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'reference_type': {
                    type: 'integer'
                },
                'state': {
                    type: 'integer',
                    'default': versa.api.Document.states.PENDING
                }
            },

            prototype: new o()
        };

        return o;
    }
);
