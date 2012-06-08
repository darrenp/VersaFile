//>>built
define("versa/api/Library",["dojo/_base/declare","versa/api/_Object","versa/api/_Securable","versa/api/ChoiceLists","versa/api/Documents","versa/api/DocumentTypes","versa/api/Folders","versa/api/PropertyDefinitions","versa/api/References","versa/api/ViewMappings"],function(_1){var o=_1("versa.api.Library",[versa.api._Object,versa.api._Securable],{zone:null,_choiceLists:null,_documents:null,_documentTypes:null,_folders:null,_propertyDefinitions:null,_references:null,_viewDefinitions:null,_viewMappings:null,_cellDefinitions:null,description:null,constructor:function(_2){_1.safeMixin(this,((!_2)?{}:_2));this.securable_type=versa.api._Securable.types.Library;},createShare:function(_3){var _4=_3.shareRoot;var _5={parent:_4,attribute:"children"};var _6=this.getFolders().store.newItem({name:_3.name,folder_type:versa.api.Folder.FolderTypes.SHARE,parent_id:_4.getId(),password:_3.password,expiry:_3.expiry,seed_id:(_3.seed)?_3.seed.getId():null,children:[]},_5);this.getFolders().store.changing(_6);return _6;},empty_trash:function(_7){var _8=_7.zone;var _9=dojo.replace(versa.api.Library.EMPTYTRASH_TRGT,[_8.subdomain,this.getId()]);var _a=versa.api.XhrHelper.doPutAction({target:_9,putData:{}});return true;},getChoiceLists:function(){if(!this._choiceLists){this._choiceLists=new versa.api.ChoiceLists({zone:this.zone,library:this});}return this._choiceLists;},getDocuments:function(){if(!this._documents){this._documents=new versa.api.Documents({zone:this.zone,library:this});}return this._documents;},getDocumentTypes:function(){if(!this._documentTypes){this._documentTypes=new versa.api.DocumentTypes({zone:this.zone,library:this});}return this._documentTypes;},getFolders:function(){if(!this._folders){this._folders=new versa.api.Folders({zone:this.zone,library:this});}return this._folders;},getPropertyDefinitions:function(){if(!this._propertyDefinitions){this._propertyDefinitions=new versa.api.PropertyDefinitions({zone:this.zone,library:this});}return this._propertyDefinitions;},getPropertyMappings:function(){if(!this._propertyMappings){this._propertyMappings=new versa.api.PropertyMappings({zone:this.zone,library:this});}return this._propertyMappings;},getReferences:function(){if(!this._references){this._references=new versa.api.References({zone:this.zone,library:this});}return this._references;},getViewDefinitions:function(){if(!this._viewDefinitions){this._viewDefinitions=new versa.api.ViewDefinitions({zone:this.zone,library:this});}return this._viewDefinitions;},getViewMappings:function(){if(!this._viewMappings){this._viewMappings=new versa.api.ViewMappings({zone:this.zone,library:this});}return this._viewMappings;},getCellDefinitions:function(){if(!this._cellDefinitions){this._cellDefinitions=new versa.api.CellDefinitions({zone:this.zone,library:this});}return this._cellDefinitions;}});o.EMPTYTRASH_TRGT="/zones/{0}/libraries/{1}/empty_trash.json";o.schema={type:"object",properties:{"id":{type:"integer"},"name":{type:"string","default":""},"description":{type:"string"},"created_at":{type:"date",format:"date-time"},"created_by":{type:"string"},"updated_at":{type:"date",format:"date-time"},"updated_by":{type:"string"}},prototype:new o()};return o;});