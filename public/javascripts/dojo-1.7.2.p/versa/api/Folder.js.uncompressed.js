//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 24/10/11
 * Time: 9:58 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Folder", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/_Securable",
        "versa/api/Acl",
        "versa/api/Search"],

    function(declare){
        var o=declare("versa.api.Folder",
                [versa.api._Object,
                 versa.api._Securable], {
            _activeQuery: null,
            _searchFolder: null,
            _shareRootFolder: null,
            _trashFolder: null,

            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
                this.securable_type = versa.api._Securable.types.Folder;
            },

            childNameExists: function(name, ignoreId){

                return dojo.some(this.children, function(child){
                    if(child.getId() == ignoreId)
                        return false;
                    return (child.name.toLowerCase() == name.toLowerCase());
                }, this);

            },

            getActiveQuery: function(){

                if(!this._activeQuery){
                    this._activeQuery = new versa.api.Search({
                        type: (this.isTrash() ? versa.api.Search.types.TRASH : versa.api.Search.types.FOLDER),
                        queryData: this.getId(),
                        view_definition_id: this.view_definition_id
                    });
                }

                return this._activeQuery;
            },

            getPermissionSet: function(library, user){
                var prmSet = new versa.api.PermissionSet();

                prmSet.setValue(versa.api.PermissionIndices.VIEW, true);
                prmSet.setValue(versa.api.PermissionIndices.COPY, true);
                prmSet.setValue(versa.api.PermissionIndices.EDIT, this.hasRights(versa.api._Securable.permissions.WRITE_METADATA) && (!this.isSpecial() || this.isShare()) && (!this.isRoot()));
                prmSet.setValue(versa.api.PermissionIndices.CREATE, this.hasRights(versa.api._Securable.permissions.CREATE_FOLDERS) && (!(this.isTrash() || this.isSearch() || this.isShare())));
                prmSet.setValue(versa.api.PermissionIndices.FILE, this.hasRights(versa.api._Securable.permissions.CREATE_DOCUMENTS) && (!this.isSpecial()));
                prmSet.setValue(versa.api.PermissionIndices.DELETE, this.hasRights(versa.api._Securable.permissions.DELETE_ITEMS) && (!this.isRoot()));
                prmSet.setValue(versa.api.PermissionIndices.SECURE, this.hasRights(versa.api._Securable.permissions.WRITE_ACL) && (!this.isSpecial() || this.isShareRoot() || this.isShare()));

                return prmSet;
            },

            getSearchFolder: function(){

                if(!this._searchFolder){
                    dojo.every(this.children, function(item, idx){
                        if(item.isSearch())
                            this._searchFolder = item;
                        return (!this._searchFolder);
                    }, this);
                }

                return this._searchFolder;
            },

            getShareRootFolder: function(){

                if(!this._shareRootFolder){
                    dojo.every(this.children, function(item, idx){
                        if(item.isShareRoot())
                            this._shareRootFolder = item;
                        return (!this._shareRootFolder);
                    }, this);
                }

                return this._shareRootFolder;
            },

            getTrashFolder: function(){

                if(!this._trashFolder){
                    dojo.every(this.children, function(item, idx){
                        if(item.isTrash())
                            this._trashFolder = item;
                        return (!this._trashFolder);
                    }, this);
                }

                return this._trashFolder;

            },

            isContent: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.CONTENT);
            },

            isError: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.ERROR);
            },

            isRoot: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.ROOT);
            },

            isSearch: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.SEARCH);
            },

            isShare: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.SHARE);
            },

            isShareRoot: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.SHARE_ROOT);
            },

            isSpecial: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.SEARCH ||
                           this.folder_type == versa.api.Folder.FolderTypes.TRASH ||
                           this.folder_type == versa.api.Folder.FolderTypes.SHARE ||
                           this.folder_type == versa.api.Folder.FolderTypes.SHARE_ROOT);
            },

            isTrash: function(){
                return (this.folder_type == versa.api.Folder.FolderTypes.TRASH);
            },

            setActiveQuery: function(query){
                this._activeQuery = query;
                this._activeQuery.view_definition_id = this.view_definition_id;
            },

            shareItems: function(args){
                var zone = args.zone;
                var library = args.library;

                var ids = []
                dojo.forEach(args.references, function(reference){
                    ids.push(reference.getId());
                }, this);

                var url = dojo.replace(versa.api.Folder.SHAREITEMS_TRGT,  [zone.subdomain, library.id, this.getId()]);
                var putData = {
                    reference_ids: ids
                };

                var result = versa.api.XhrHelper.doPutAction({
                    target: url,
                    putData: putData
                });

                return true;
            }
        });

        o.SHAREITEMS_TRGT = '/zones/{0}/libraries/{1}/folders/{2}/share_items.json';

        o.FolderTypes = {
            'ROOT':         0x0000,
            'CONTENT':      0x0001,
            'SHARE_ROOT':   0x0010,
            'SHARE':        0x0011,
            'SEARCH':       0x0020,
            'TRASH':        0x0040,
            'ERROR':        0xFFFF
        }

        o.getIconUrl = function(folder, size){
            var iconName = 'content';

            switch(folder.folder_type){
                case versa.api.Folder.FolderTypes.TRASH:
                    iconName = 'recyclebin';
                    break;
                case versa.api.Folder.FolderTypes.SEARCH:
                    iconName = 'search';
                    break;
                case versa.api.Folder.FolderTypes.SHARE_ROOT:
                    iconName = 'share_root';
                    break;

            }

            return dojo.replace('/images/mimetypes/{0}/{1}.png', [size, iconName]);
        }

        o.getTypeLabel = function(folder){
            var label = 'Content';

            switch(folder.folder_type){
                case versa.api.Folder.FolderTypes.TRASH:
                    label = 'Deleted Items';
                    break;
                case versa.api.Folder.FolderTypes.SEARCH:
                    label = 'Search Results';
                    break;
                case versa.api.Folder.FolderTypes.SHARE_ROOT:
                    label = 'Shared Folders';
                    break;
                case versa.api.Folder.FolderTypes.SHARE:
                    label = 'Shared Files';
                    break;
            }

            return label;
        }

        o.sort = function(item1, item2){

            //ORDER for non-content folder types
            if((item1.folder_type != versa.api.Folder.FolderTypes.CONTENT) ||
                (item2.folder_type != versa.api.Folder.FolderTypes.CONTENT)){

                //Order should be:
                // - Trash
                // - Search
                // - Share
                // - Content....
                if(item1.folder_type > item2.folder_type)
                    return -1;
                return 1;
            }

            //Sort by name
            if(item1.name == item2.name){
                return 0;
            }

            //Alphabetically for all else (case-insensitive)
            return (item1.name?item1.name:'').toLowerCase() < (item2.name?item2.name:'').toLowerCase() ? -1 : 1;
        };

        o.permissionIndices = {
            'CREATE':       0x00,
            'VIEW':         0x01,
            'FILE':         0x02,
            'DELETE':       0x03,
            'SECURE':       0x04

        }


        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'folder_type': {
                    type: 'integer'
                },
                'name': {
                    type: 'string',
                    'default': ''
                },
                'expiry': {
                    type: ['string', 'object', 'null'],
                    format: 'date-time'
                },
                'created_at': {
                    type: 'string',
                    format: 'date-time',
                    'default': dojo.date.stamp.toISOString(new Date(), {zulu: true})
                },
                'created_by': {
                    type: 'string',
                    'default': ''
                },
                'updated_at': {
                    type: 'string',
                    format: 'date-time',
                    'default': dojo.date.stamp.toISOString(new Date(), {zulu: true})
                },
                'updated_by': {
                    type: 'string',
                    'default': ''
                },
                'text_path':{
                    type: 'string',
                    'default':''
                },
                'document_count':{
                    type: 'integer',
                    'default': 0
                }
            },
            prototype: new o()
        };

        return o;
    }
);

