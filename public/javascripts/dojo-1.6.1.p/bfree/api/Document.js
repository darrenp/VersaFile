/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Document"]){dojo._hasResource["bfree.api.Document"]=true;dojo.provide("bfree.api.Document");dojo.require("bfree.api._Object");dojo.require("bfree.api._Securable");dojo.require("bfree.api.Acl");dojo.require("bfree.api.Application");dojo.require("bfree.api.Utilities");dojo.require("bfree.api.Versions");dojo.require("dojox.json.ref");dojo.require("versa.api.PermissionSet");dojo.declare("bfree.api.Document",[bfree.api._Object,bfree.api._Securable],{zone:null,library:null,checked_out_by:"",document_type_id:null,library:null,state:0,clean_properties:function(_1){var _2=_1.library;var _3=_2.getDocumentTypes().fetchById({id:this.document_type_id});for(var p in this){if(!dojo.isFunction(this[p])){var _4=dojo.replace("documents.{0}",[p]);var _5=_2.getPropertyDefinitions().fetchByDbName(_4);if((_5)&&(!_5.is_system)){if(!_3.hasProperty(_5.id)){delete this[p];}}}}},constructor:function(_6){dojo.safeMixin(this,((!_6)?{}:_6));this.securable_type=bfree.api._Securable.types.Document;if((this.created_at!=null)&&(typeof this.created_at=="string")){this.created_at=dojo.date.stamp.fromISOString(this.created_at);}if((this.updated_at!=null)&&(typeof this.updated_at=="string")){this.updated_at=dojo.date.stamp.fromISOString(this.created_at);}},copyLocal:function(_7){var _8=_7.zone;var _9=_7.library;var _a=dojo.replace(bfree.api.Document.CP_TRGT,[_8.subdomain,_9.id,this.getId()]);bfree.api.Utilities.saveUrl({url:_a,window_name:"versa_save"});},file:function(_b){var _c=_b.zone;var _d=_b.library;var _e=dojo.replace(bfree.api.Document.FILE_TRGT,[_c.subdomain,_d.id,this.getId()]);var _f={folder_id:_b.folder.id};var _10=bfree.api.XhrHelper.doPutAction({target:_e,putData:_f});return true;},getFullVersion:function(){return this.major_version_number;},getPermissionSet:function(_11,_12,_13){var _14=new versa.api.PermissionSet();_14.setValue(versa.api.PermissionIndices.VIEW,this.hasRights(bfree.api._Securable.permissions.VIEW));_14.setValue(versa.api.PermissionIndices.COPY,this.hasRights(bfree.api._Securable.permissions.VIEW));_14.setValue(versa.api.PermissionIndices.EDIT,this.hasRights(bfree.api._Securable.permissions.WRITE_METADATA));_14.setValue(versa.api.PermissionIndices.MOVE,_14.getValue(versa.api.PermissionIndices.EDIT));_14.setValue(versa.api.PermissionIndices.CKO,(this.hasRights(bfree.api._Securable.permissions.VERSION)&&this.getState(bfree.api.Document.states.CHECKED_IN)));_14.setValue(versa.api.PermissionIndices.CKI,(this.hasRights(bfree.api._Securable.permissions.VERSION)&&this.getState(bfree.api.Document.states.CHECKED_OUT)&&(this.checked_out_by==_13.name)));_14.setValue(versa.api.PermissionIndices.CANCEL_CKO,_14.getValue(versa.api.PermissionIndices.CKI));_14.setValue(versa.api.PermissionIndices.DELETE,this.hasRights(bfree.api._Securable.permissions.DELETE_ITEMS));_14.setValue(versa.api.PermissionIndices.SECURE,this.hasRights(bfree.api._Securable.permissions.WRITE_ACL));_14.setValue(versa.api.PermissionIndices.RESTORE,this.hasRights(bfree.api._Securable.permissions.DELETE_ITEMS));_14.setValue(versa.api.PermissionIndices.DESTROY,this.hasRights(bfree.api._Securable.permissions.DELETE_ITEMS));return _14;},getState:function(_15){return bfree.api.Document._isState(this.state,_15);},getVersions:function(_16){if(!this._versions){this._versions=new bfree.api.Versions({zone:_16.zone,library:_16.library,document:this});}return this._versions;},isDeleted:function(){return this.getState(bfree.api.Document.states.DELETED);},restore:function(_17){var _18=_17.zone;var _19=_17.library;var url=dojo.replace(bfree.api.Document.RESTORE_TRGT,[_18.subdomain,_19.getId(),this.getId()]);var _1a={};var _1b=bfree.api.XhrHelper.doPutAction({target:url,putData:_1a});return true;},setState:function(_1c,_1d){if(_1d){this.state=this.state|_1c;}else{this.state=this.state&~_1c;}return this.state;},unfile:function(_1e){var _1f=_1e.zone;var _20=_1e.library;var url=dojo.replace(bfree.api.Document.UNFILE_TRGT,[_1f.subdomain,_20.id,this.id]);var _21={};var _22=bfree.api.XhrHelper.doPutAction({target:url,putData:_21});return true;},validate:function(_23){if(!this.document_type_id){this.state|=bfree.api.Document.states.INVALID;return false;}var _24=_23.library.getDocumentTypes().fetchById({id:this.document_type_id});var _25=_23.library.getPropertyDefinitions();var _26=bfree.api.Application.getDataTypes();var _27=dojo.every(_24.property_mappings,function(_28,idx){var _29=true;if(_28.is_required){var _2a=_25.fetchById({id:_28.property_definition_id});var _2b=_26.fetchById({id:_2a.data_type_id});if(!_2a){return false;}var _2c=this[_2a.column_name];if(_2b.isString()){_29=!String.isEmpty(_2c);}}return _29;},this);this.setState(bfree.api.Document.states.INVALID,!_27);return _27;},view:function(_2d){var _2e=_2d.zone;var _2f=_2d.library;var url=dojo.replace(bfree.api.Document.VW_TRGT,[_2e.subdomain,_2f.id,this.getId()]);bfree.api.Utilities.viewUrl({windowBox:_2d.windowBox,url:url,window_name:"versa_viewer"});}});bfree.api.Document.getIconUrl=function(_30,_31){return dojo.replace("/icons/{0}?size={1}",[encodeURIComponent(_30),_31]);};bfree.api.Document._isState=function(_32,_33){return ((_32&_33)==_33);};bfree.api.Document.getStateIcon=function(_34){var _35="none.16.png";if(bfree.api.Document._isState(_34,bfree.api.Document.states.ERROR)){_35="error.16.png";}else{if(bfree.api.Document._isState(_34,bfree.api.Document.states.INVALID)){_35="invalid.16.png";}else{if(bfree.api.Document._isState(_34,bfree.api.Document.states.CHECKED_IN)){_35="cki.16.png";}else{if(bfree.api.Document._isState(_34,bfree.api.Document.states.PENDING)){_35="pending.16.gif";}else{if(bfree.api.Document._isState(_34,bfree.api.Document.states.UPLOADED)){_35="uploaded.16.png";}}}}}return _35;};bfree.api.Document.getStateMessage=function(_36){var msg="";if(bfree.api.Document._isState(_36,bfree.api.Document.states.ERROR)){msg="An error occurred";}else{if(bfree.api.Document._isState(_36,bfree.api.Document.states.INVALID)){msg="The file contains missing or invalid property values";}else{if(bfree.api.Document._isState(_36,bfree.api.Document.states.CHECKED_IN)){msg="The file has been added to VersaFile";}else{if(bfree.api.Document._isState(_36,(bfree.api.Document.states.PENDING|bfree.api.Document.states.UPLOADED))){msg="The file is being added to VersaFile";}else{if(bfree.api.Document._isState(_36,bfree.api.Document.states.PENDING)){msg="Uploading...";}else{if(bfree.api.Document._isState(_36,bfree.api.Document.states.UPLOADED)){msg="The file has been uploaded and is ready for checkin";}}}}}}return msg;};bfree.api.Document.VW_TRGT="/zones/{0}/libraries/{1}/documents/{2}/download/?disposition=inline";bfree.api.Document.CP_TRGT="/zones/{0}/libraries/{1}/documents/{2}/download/?disposition=attachment";bfree.api.Document.CKO_TRGT="/zones/{0}/libraries/{1}/documents/{2}/checkout.json";bfree.api.Document.CKI_TRGT="/zones/{0}/libraries/{1}/documents/{2}/checkin.json";bfree.api.Document.XCKO_TRGT="/zones/{0}/libraries/{1}/documents/{2}/cancel_checkout.json";bfree.api.Document.FILE_TRGT="/zones/{0}/libraries/{1}/documents/{2}/file.json";bfree.api.Document.UNFILE_TRGT="/zones/{0}/libraries/{1}/documents/{2}/unfile.json";bfree.api.Document.RESTORE_TRGT="/zones/{0}/libraries/{1}/documents/{2}/restore.json";bfree.api.Document.SDEL_TRGT="/zones/{0}/libraries/{1}/documents/{2}/soft_delete.json";bfree.api.Document.states={"NONE":0,"PENDING":1,"UPLOADED":2,"BUSY":4,"INDEXED":16,"CHECKED_IN":32,"CHECKED_OUT":64,"INVALID":1024,"DELETED":2048,"ERROR":32768};bfree.api.Document.schema={type:"object",properties:{"id":{type:"integer"},"document_type_id":{type:"integer"},"name":{type:"string","default":"","required":true},"created_at":{type:["string","object","null"],format:"date-time"},"created_by":{type:["string","null"],"default":""},"checked_out_by":{type:["string","null"]},"state":{type:"integer","default":bfree.api.Document.states.PENDING},"updated_at":{type:["string","object","null"],format:"date-time"},"updated_by":{type:["string","null"],"default":""},"prp_dtt001":{type:["string","object","null"],format:"date-time"},"prp_dtt002":{type:["string","object","null"],format:"date-time"},"prp_dtt003":{type:["string","object","null"],format:"date-time"},"prp_dtt004":{type:["string","object","null"],format:"date-time"},"prp_dtt005":{type:["string","object","null"],format:"date-time"},"prp_dtt006":{type:["string","object","null"],format:"date-time"},"prp_dtt007":{type:["string","object","null"],format:"date-time"},"prp_dtt008":{type:["string","object","null"],format:"date-time"}},prototype:new bfree.api.Document()};}