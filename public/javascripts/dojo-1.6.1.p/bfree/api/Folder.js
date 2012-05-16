/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Folder"]){dojo._hasResource["bfree.api.Folder"]=true;dojo.provide("bfree.api.Folder");dojo.require("bfree.api._Object");dojo.require("bfree.api._Securable");dojo.require("bfree.api.Acl");dojo.require("bfree.api.Search");dojo.declare("bfree.api.Folder",[bfree.api._Object,bfree.api._Securable],{_activeQuery:null,_searchFolder:null,_shareRootFolder:null,_trashFolder:null,constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));this.securable_type=bfree.api._Securable.types.Folder;},childNameExists:function(_2,_3){return dojo.some(this.children,function(_4){if(_4.getId()==_3){return false;}return (_4.name.toLowerCase()==_2.toLowerCase());},this);},getActiveQuery:function(){if(!this._activeQuery){this._activeQuery=new bfree.api.Search({type:(this.isTrash()?bfree.api.Search.types.TRASH:bfree.api.Search.types.FOLDER),queryData:this.getId(),view_definition_id:this.view_definition_id});}return this._activeQuery;},getPermissionSet:function(_5,_6){var _7=new versa.api.PermissionSet();_7.setValue(versa.api.PermissionIndices.VIEW,true);_7.setValue(versa.api.PermissionIndices.COPY,true);_7.setValue(versa.api.PermissionIndices.EDIT,this.hasRights(bfree.api._Securable.permissions.WRITE_METADATA)&&(!this.isSpecial()||this.isShare())&&(!this.isRoot()));_7.setValue(versa.api.PermissionIndices.CREATE,this.hasRights(bfree.api._Securable.permissions.CREATE_FOLDERS)&&(!(this.isTrash()||this.isSearch()||this.isShare())));_7.setValue(versa.api.PermissionIndices.FILE,this.hasRights(bfree.api._Securable.permissions.CREATE_DOCUMENTS)&&(!this.isSpecial()));_7.setValue(versa.api.PermissionIndices.DELETE,this.hasRights(bfree.api._Securable.permissions.DELETE_ITEMS)&&(!this.isRoot()));_7.setValue(versa.api.PermissionIndices.SECURE,this.hasRights(bfree.api._Securable.permissions.WRITE_ACL)&&(!this.isSpecial()||this.isShareRoot()||this.isShare()));return _7;},getSearchFolder:function(){if(!this._searchFolder){dojo.every(this.children,function(_8,_9){if(_8.isSearch()){this._searchFolder=_8;}return (!this._searchFolder);},this);}return this._searchFolder;},getShareRootFolder:function(){if(!this._shareRootFolder){dojo.every(this.children,function(_a,_b){if(_a.isShareRoot()){this._shareRootFolder=_a;}return (!this._shareRootFolder);},this);}return this._shareRootFolder;},getTrashFolder:function(){if(!this._trashFolder){dojo.every(this.children,function(_c,_d){if(_c.isTrash()){this._trashFolder=_c;}return (!this._trashFolder);},this);}return this._trashFolder;},isContent:function(){return (this.folder_type==bfree.api.Folder.FolderTypes.CONTENT);},isError:function(){return (this.folder_type==bfree.api.Folder.FolderTypes.ERROR);},isRoot:function(){return (this.folder_type==bfree.api.Folder.FolderTypes.ROOT);},isSearch:function(){return (this.folder_type==bfree.api.Folder.FolderTypes.SEARCH);},isShare:function(){return (this.folder_type==bfree.api.Folder.FolderTypes.SHARE);},isShareRoot:function(){return (this.folder_type==bfree.api.Folder.FolderTypes.SHARE_ROOT);},isSpecial:function(){return (this.folder_type==bfree.api.Folder.FolderTypes.SEARCH||this.folder_type==bfree.api.Folder.FolderTypes.TRASH||this.folder_type==bfree.api.Folder.FolderTypes.SHARE||this.folder_type==bfree.api.Folder.FolderTypes.SHARE_ROOT);},isTrash:function(){return (this.folder_type==bfree.api.Folder.FolderTypes.TRASH);},setActiveQuery:function(_e){this._activeQuery=_e;this._activeQuery.view_definition_id=this.view_definition_id;},shareItems:function(_f){var _10=_f.zone;var _11=_f.library;var ids=[];dojo.forEach(_f.references,function(_12){ids.push(_12.getId());},this);var url=dojo.replace(bfree.api.Folder.SHAREITEMS_TRGT,[_10.subdomain,_11.id,this.getId()]);var _13={reference_ids:ids};var _14=bfree.api.XhrHelper.doPutAction({target:url,putData:_13});return true;}});bfree.api.Folder.SHAREITEMS_TRGT="/zones/{0}/libraries/{1}/folders/{2}/share_items.json";bfree.api.Folder.FolderTypes={"ROOT":0,"CONTENT":1,"SHARE_ROOT":16,"SHARE":17,"SEARCH":32,"TRASH":64,"ERROR":65535};bfree.api.Folder.getIconUrl=function(_15,_16){var _17="content";switch(_15.folder_type){case bfree.api.Folder.FolderTypes.ROOT:_17="root";break;case bfree.api.Folder.FolderTypes.TRASH:_17="recyclebin";break;case bfree.api.Folder.FolderTypes.SEARCH:_17="search";break;case bfree.api.Folder.FolderTypes.SHARE_ROOT:_17="share_root";break;case bfree.api.Folder.FolderTypes.SHARE:_17="share";break;}return dojo.replace("/images/mimetypes/{0}/{1}.png",[_16,_17]);};bfree.api.Folder.getTypeLabel=function(_18){var _19="Content";switch(_18.folder_type){case bfree.api.Folder.FolderTypes.TRASH:_19="Deleted Items";break;case bfree.api.Folder.FolderTypes.SEARCH:_19="Search Results";break;case bfree.api.Folder.FolderTypes.SHARE_ROOT:_19="Shared Folders";break;case bfree.api.Folder.FolderTypes.SHARE:_19="Shared Files";break;}return _19;};bfree.api.Folder.sort=function(_1a,_1b){if((_1a.isTrash()||_1b.isTrash())||(_1a.isSearch()||_1b.isSearch())||(_1a.isShareRoot()||_1b.isShareRoot())){if(_1a.folder_type>_1b.folder_type){return -1;}return 1;}if(_1a.name==_1b.name){return 0;}return (_1a.name?_1a.name:"").toLowerCase()<(_1b.name?_1b.name:"").toLowerCase()?-1:1;};bfree.api.Folder.permissionIndices={"CREATE":0,"VIEW":1,"FILE":2,"DELETE":3,"SECURE":4};bfree.api.Folder.schema={type:"object",properties:{"id":{type:"integer"},"folder_type":{type:"integer"},"name":{type:"string","default":""},"expiry":{type:["string","object","null"],format:"date-time"},"created_at":{type:"string",format:"date-time","default":dojo.date.stamp.toISOString(new Date(),{zulu:true})},"created_by":{type:"string","default":""},"updated_at":{type:"string",format:"date-time","default":dojo.date.stamp.toISOString(new Date(),{zulu:true})},"updated_by":{type:"string","default":""},"text_path":{type:"string","default":""},"document_count":{type:"integer","default":0}},prototype:new bfree.api.Folder()};}