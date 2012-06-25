//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 26/09/11
 * Time: 11:24 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Document", ["dojo/_base/declare",
        "dojox/json/ref",
        "versa/api/_Object",
        "versa/api/_Securable",
        "versa/api/Acl",
        "versa/api/Application",
        "versa/api/Utilities",
        "versa/api/Versions",
        "versa/api/PermissionSet"],
    function(declare){
        var o = declare("versa.api.Document",
                [versa.api._Object,
                 versa.api._Securable], {
            zone: null,
            library: null,

            checked_out_by: '',
            document_type_id: null,
            library: null,
            state: 0x0000,  //NONE

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

                this.securable_type = versa.api._Securable.types.Document;

                if((this.created_at != null) && (typeof this.created_at == 'string'))
                    this.created_at = dojo.date.stamp.fromISOString(this.created_at);
                if((this.updated_at != null) && (typeof this.updated_at == 'string'))
                    this.updated_at = dojo.date.stamp.fromISOString(this.created_at);

            },

            copyLocal: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Document.CP_TRGT, [zone.subdomain, library.id, this.getId()]);
                versa.api.Utilities.saveUrl({
                    url: url,
                    window_name: 'versa_save'
                });

            },

            file: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Document.FILE_TRGT,  [zone.subdomain, library.id, this.getId()]);
                var putData = {
                    folder_id: args.folder.id
                };

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true;
            },

            getFullVersion: function(){
                //Changed to hide minor version support (for now)
                /*
                var version = {
                    major_version_number: (this.current_version) ? this.current_version.major_version_number: this.major_version_number,
                    minor_version_number: (this.current_version) ? this.current_version.minor_version_number: this.minor_version_number
                }
                return dojo.replace('{major_version_number}.{minor_version_number}', version);
                */
                return this.major_version_number;
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
               return versa.api.Document._isState(this.state, stateFlag);
            },

            getVersions: function(args){

                if(!this._versions){
                    this._versions = new versa.api.Versions({zone: args.zone, library: args.library, document: this});
                }
                return this._versions;
            },

            isDeleted: function(){
                return this.getState(versa.api.Document.states.DELETED);
            },

            restore: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Document.RESTORE_TRGT,  [zone.subdomain, library.getId(), this.getId()]);
                var putData = {};

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true;
            },

            setState: function(stateFlag, isSet){

                if(isSet){
                    this.state = this.state | stateFlag;
                }
                else{
                    this.state = this.state & ~stateFlag;
                }

                return this.state;
            },


            unfile: function(args){

                var zone = args.zone;
                var library = args.library;

                var url = dojo.replace(versa.api.Document.UNFILE_TRGT,  [zone.subdomain, library.id, this.id]);
                var putData = {
                };

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true
            },

            validate: function(args){

                if(!this.document_type_id){
                    this.state |= versa.api.Document.states.INVALID;
                    return false;
                }

                var documentType = args.library.getDocumentTypes().fetchById({id: this.document_type_id});
                var propertyDefinitions = args.library.getPropertyDefinitions();
                var dataTypes = versa.api.Application.getDataTypes();

                var isValid = dojo.every(documentType.property_mappings, function(item, idx){
                    var valid = true;

                    if(item.is_required){
                        var propertyDefinition = propertyDefinitions.fetchById({id: item.property_definition_id});
                        var dataType = dataTypes.fetchById({id: propertyDefinition.data_type_id});

                        if(!propertyDefinition) return false;
                        var value = this[propertyDefinition.column_name];

                        if(dataType.isString()){
                            valid = !String.isEmpty(value);
                        }

                    }

                    return valid;
                }, this);

                this.setState(versa.api.Document.states.INVALID, !isValid);

                return isValid;
            },

            getViewUrl: function(zone, library){
                return dojo.replace(versa.api.Document.VW_TRGT, [zone.subdomain, library.id, this.getId()]);
            },

            view: function(args){
                var zone = args.zone;
                var library = args.library;

                var url = this.getViewUrl(zone, library);

                versa.api.Utilities.viewUrl({
                    windowBox: args.windowBox,
                    url: url,
                    window_name: 'versa_viewer'
                });
            }

        });

        o.getIconUrl = function(content_type, size){
            return dojo.replace('/icons/{0}?size={1}', [encodeURIComponent(content_type), size]);
        }

        o._isState = function(stateMask, stateFlag){
            return ((stateMask & stateFlag) == stateFlag);
        }

        o.getStateIcon = function(stateMask){

            var icon = 'none.16.png'

            if(versa.api.Document._isState(stateMask, versa.api.Document.states.ERROR)){
                icon = 'error.16.png'
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.INVALID)){
                icon = 'invalid.16.png';
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.CHECKED_IN)){
                icon = 'cki.16.png';
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.PENDING)){
                icon = 'pending.16.gif';
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.UPLOADED)){
                icon = 'uploaded.16.png'
            }

            return icon;
        }

        o.getStateMessage = function(stateMask){
            var msg = '';

            if(versa.api.Document._isState(stateMask, versa.api.Document.states.ERROR)){
                msg = 'An error occurred';
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.INVALID)){
                msg = 'The file contains missing or invalid property values';
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.CHECKED_IN)){
                msg = 'The file has been added to VersaFile';
            }
            else if(versa.api.Document._isState(stateMask, (versa.api.Document.states.PENDING | versa.api.Document.states.UPLOADED))){
                msg = 'The file is being added to VersaFile';
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.PENDING)){
                msg = 'Uploading...';;
            }
            else if(versa.api.Document._isState(stateMask, versa.api.Document.states.UPLOADED)){
                msg = 'The file has been uploaded and is ready for checkin';
            }

            return msg;
        }

        o.VW_TRGT = '/zones/{0}/libraries/{1}/documents/{2}/download/?disposition=inline';
        o.CP_TRGT = '/zones/{0}/libraries/{1}/documents/{2}/download/?disposition=attachment';
        o.CKO_TRGT = '/zones/{0}/libraries/{1}/documents/{2}/checkout.json';
        o.CKI_TRGT  = '/zones/{0}/libraries/{1}/documents/{2}/checkin.json';
        o.XCKO_TRGT = '/zones/{0}/libraries/{1}/documents/{2}/cancel_checkout.json';
        o.FILE_TRGT  = '/zones/{0}/libraries/{1}/documents/{2}/file.json';
        o.UNFILE_TRGT  = '/zones/{0}/libraries/{1}/documents/{2}/unfile.json';
        o.RESTORE_TRGT  = '/zones/{0}/libraries/{1}/documents/{2}/restore.json';
        o.SDEL_TRGT  = '/zones/{0}/libraries/{1}/documents/{2}/soft_delete.json';

        o.states = {
            'NONE':         0x0000,
            'PENDING':      0x0001,
            'UPLOADED':     0x0002,
            'BUSY':         0x0004,
            'INDEXED':      0x0010,
            'CHECKED_IN':   0x0020,
            'CHECKED_OUT':  0x0040,
            'INVALID':      0x0400,
            'DELETED':      0x0800,
            'ERROR':        0x8000
        };

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'document_type_id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': '',
                     'required': true
                },
                'created_at': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'created_by': {
                    type: ['string', 'null'],
                    'default': ''
                },
                'checked_out_by': {
                    type: ['string', 'null']
                },
                'state': {
                    type: 'integer',
                    'default': o.PENDING
                },
                'updated_at': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'updated_by': {
                    type: ['string', 'null'],
                    'default': ''
                },
                'prp_dtt001': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'prp_dtt002': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'prp_dtt003': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'prp_dtt004': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'prp_dtt005': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'prp_dtt006': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'prp_dtt007': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'prp_dtt008': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                }

            },
            prototype: new o()
        };
        return o;
    }
);
