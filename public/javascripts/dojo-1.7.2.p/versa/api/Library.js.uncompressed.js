//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 22/09/11
 * Time: 4:49 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Library", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/_Securable",
        "versa/api/ChoiceLists",
        "versa/api/Documents",
        "versa/api/DocumentTypes",
        "versa/api/Folders",
        "versa/api/PropertyDefinitions",
        "versa/api/References",
        "versa/api/ViewMappings"],

    function(declare){
        var o=declare("versa.api.Library",
                [versa.api._Object,
                 versa.api._Securable], {
            zone: null,

            _choiceLists: null,
            _documents: null,
            _documentTypes: null,
            _folders: null,
            _propertyDefinitions: null,
            _references: null,
            _viewDefinitions: null,
            _viewMappings: null,
            _cellDefinitions: null,

            description: null,

            constructor: function(args){
                declare.safeMixin(this, ((!args) ? { } : args));
                this.securable_type = versa.api._Securable.types.Library
            },

            createShare: function(args){

                var shareRoot = args.shareRoot;
                var parentInfo = { parent: shareRoot, attribute: 'children' };

                var share = this.getFolders().store.newItem({
                    name: args.name,
                    folder_type: versa.api.Folder.FolderTypes.SHARE,
                    parent_id: shareRoot.getId(),
                    password: args.password,
                    expiry: args.expiry,
                    seed_id: (args.seed) ? args.seed.getId() : null,
                    children: []
                }, parentInfo);
                this.getFolders().store.changing(share);

               return share;
            },

            empty_trash: function(args){
                var zone = args.zone;

                var url = dojo.replace(versa.api.Library.EMPTYTRASH_TRGT,  [zone.subdomain, this.getId()]);

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: {}
                });

                return true;
            },

            getChoiceLists: function(){

                if(!this._choiceLists){
                    this._choiceLists = new versa.api.ChoiceLists({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._choiceLists;
            },

            getDocuments: function(){

                if(!this._documents){
                    this._documents = new versa.api.Documents({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._documents;
            },

            getDocumentTypes: function(){

               if(!this._documentTypes){
                    this._documentTypes = new versa.api.DocumentTypes({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._documentTypes;

            },

            getFolders: function(){

                if(!this._folders){
                    this._folders = new versa.api.Folders({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._folders;

            },

            getPropertyDefinitions: function(){

               if(!this._propertyDefinitions){
                    this._propertyDefinitions = new versa.api.PropertyDefinitions({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._propertyDefinitions;
            },

            getPropertyMappings: function(){
                if(!this._propertyMappings){
                    this._propertyMappings = new versa.api.PropertyMappings({
                        zone: this.zone,
                        library: this
                    })
                }
                return this._propertyMappings;
            },

            getReferences: function(){
                if(!this._references){
                    this._references = new versa.api.References({
                        zone: this.zone,
                        library: this
                    })
                }

                return this._references;
            },

            getViewDefinitions: function(){

                if(!this._viewDefinitions){
                    this._viewDefinitions = new versa.api.ViewDefinitions({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._viewDefinitions;

            },

            getViewMappings: function(){

                if(!this._viewMappings){
                    this._viewMappings = new versa.api.ViewMappings({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._viewMappings;

            },

            getCellDefinitions: function(){

                if(!this._cellDefinitions){
                    this._cellDefinitions = new versa.api.CellDefinitions({
                        zone: this.zone,
                        library: this
                    });
                }

                return this._cellDefinitions;

            }
        });

        o.EMPTYTRASH_TRGT = '/zones/{0}/libraries/{1}/empty_trash.json';

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': ''
                },
                'description': {
                    type: 'string'
                },
                'created_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'created_by': {
                    type: 'string'
                },
                'updated_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'updated_by': {
                    type: 'string'
                }
            },
            prototype: new o()
         };

        return o;
    }
);

