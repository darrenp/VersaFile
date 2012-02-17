/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.group.Editor"]){dojo._hasResource["bfree.widget.group.Editor"]=true;dojo.provide("bfree.widget.group.Editor");dojo.require("bfree.widget.SortGrid");dojo.require("bfree.widget.ValidationTextBox");dojo.require("bfree.widget.group.Info");dojo.require("bfree.widget.group.UserBar");dojo.require("bfree.widget.user.List");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.require("dojox.layout.TableContainer");dojo.declare("bfree.widget.group.Editor",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("bfree/widget/group","template/Editor.html","<div style=\"height:100%;width:100%\">\n\n<div    dojoAttachPoint=\"mainNode\"\n        dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        liveSplitters=\"true\"\n        style=\"width:100%;height:100%\">\n\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            splitter=\"false\"\n            region=\"top\"\n            style=\"overflow:hidden;padding:0;height: 100px;\">\n\n         <div dojoAttachPoint=\"formNode\">\n\n            <div dojoAttachPoint=\"tableNode\"></div>\n\n        </div>\n\n        Users:\n    </div>\n\n    <div    dojoType=\"dijit.layout.BorderContainer\"\n            splitter=\"false\"\n            region=\"center\"\n            design=\"sidebar\"\n            gutters=\"false\"\n            liveSplitters=\"true\"\n            style=\"width:100%;height:100%\">\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"center\">\n\n            <div dojoAttachPoint=\"userGridNode\"></div>\n\n        </div>\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"right\"\n                style=\"overflow:hidden;padding:16px 0 0 0;width:24px\">\n\n            <div dojoAttachPoint=\"userBarNode\"></div>\n\n        </div>\n\n    </div>\n\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            splitter=\"false\"\n            region=\"bottom\"\n            style=\"padding:0 8px 0 8px;height: 112px;\">\n\n        <div dojoAttachPoint=\"infoNode\"></div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_handles:[],_cmdBar:null,_form:null,_grdUsers:null,_tblProperties:null,_txtDescription:null,_txtName:null,_userStore:null,_wdgInfo:null,activeItem:null,groups:null,users:null,__onUserDlgClose:function(_1,_2){var _3=null;if(_1==bfree.widget.Dialog.dialogResult.ok){try{this._grdUsers.beginUpdate();dojo.forEach(_2,function(id){var _4=this.users.fetchById({id:id});var _5=this._userStore.newItem({id:_4.id,name:_4.getFullName(),is_admin:_4.is_admin});},this);}finally{this._grdUsers.endUpdate();}}if(_3){this._grdUsers.setSelectedItem(_3);}return true;},_grdUsers_onSelectedItem:function(_6){this._cmdBar.set("activeUser",_6);},_onUserCommand:function(_7){switch(_7){case bfree.widget.Bfree.Commands.ADD:this._onUserAdd();break;case bfree.widget.Bfree.Commands.REMOVE:this._onUserRemove();}},_onUserAdd:function(){try{var _8=[];var _9=this.users.getAdmin();_8.push(_9.id);dojo.forEach(this.activeItem.active_users,function(_a,_b){_8.push(_a.user_id);},this);bfree.widget.user.List.show({users:this.users,filter:_8,onClose:dojo.hitch(this,this.__onUserDlgClose)});}catch(e){var _c=new bfree.api.Error("Failed to open 'Users' dialog",e);bfree.widget.ErrorManager.handleError({error:_c});}},_onUserCreated:function(_d,_e){this.activeItem.active_users.push({user_id:this._userStore.getIdentity(_d)});this.onValueChange(this.activeItem,"active_users",[],this.activeItem.active_users);},_onUserDeleted:function(_f){for(var idx=0;idx<this.activeItem.active_users.length;idx++){var id=this._userStore.getIdentity(_f);if(this.activeItem.active_users[idx].user_id==id){this.activeItem.active_users.splice(idx,1);break;}}this.onValueChange(this.activeItem,"active_users",[],this.activeItem.active_users);},_onUserRemove:function(_10){var idx=0;try{this._grdUsers.beginUpdate();var _10=this._grdUsers.selection.getFirstSelected();idx=this._grdUsers.getItemIndex(_10);this._userStore.deleteItem(_10);}catch(e){var err=new bfree.api.Error("Failed to remove User",e);bfree.widget.ErrorManager.handleError({error:err});}finally{this._grdUsers.endUpdate();}},_onValueChange:function(_11,_12){if(!this.activeItem){return;}var _13=this.users.getValue(this.activeItem,_11);if(_13!=_12){this.users.store.setValue(this.activeItem,_11,_12);this.onValueChange(this.activeItem,_11,_13,_12);}},_setActiveItemAttr:function(_14){this.activeItem=_14;this._txtName.set("value",this.activeItem.name);this._txtDescription.set("value",this.activeItem.description);this._setStore();this._cmdBar.set("activeGroup",this.activeItem);this._wdgInfo.set("activeItem",this.activeItem);this._setState();},_setState:function(){var _15=this.groups.isDirty({item:this.activeItem});this._txtName.set("disabled",!_15);this._txtDescription.set("disabled",!_15);this._grdUsers.set("disabled",!_15);this._cmdBar.set("disabled",!_15);},_setStore:function(){var _16=[];dojo.forEach(this.activeItem.active_users,function(_17,idx){var _18=this.users.fetchById({id:_17.user_id});_16.push({id:_18.id,name:_18.getFullName(),is_admin:_18.is_admin});},this);dojo.forEach(this._handles,function(_19,idx){dojo.disconnect(_19);delete this._handles[idx];},this);this._userStore=new bfree.api.ItemFileWriteStore({data:{identifier:"id",label:"name",items:_16}});this._handles[0]=dojo.connect(this._userStore,"onNew",this,this._onUserCreated);this._handles[1]=dojo.connect(this._userStore,"onDelete",this,this._onUserDeleted);this._grdUsers.setStore(this._userStore);},constructor:function(_1a){this._userStore=new bfree.api.ItemFileWriteStore({data:{identifier:"id",label:"name",items:[]}});},destroy:function(){this.destroyDescendants();if(this._tblProperties){this._tblProperties.destroyRecursive();this._tblProperties=null;}if(this._form){this._form.destroy();this._form=null;}if(this._wdgInfo){this._wdgInfo.destroy();this._wdgInfo=null;}this.inherited("destroy",arguments);},focus:function(){this._txtName.setFocus(true);},onValueChange:function(_1b,_1c,_1d,_1e){},postCreate:function(){this.inherited("postCreate",arguments);this._form=new dijit.form.Form({id:"groupForm"},this.formNode);this._tblProperties=new dojox.layout.TableContainer({id:"tblGroup1",customClass:"versa",showLabels:true,cols:1,labelWidth:96,style:"width:100%"},this.tableNode);this._txtName=new bfree.widget.ValidationTextBox({id:"txtName",label:"Name",required:true,intermediateChanges:true,selectOnClick:true,style:"width:100%",validator:dojo.hitch(this,this._txtNameValidator),onChange:dojo.hitch(this,this._onValueChange,"name")});this._tblProperties.addChild(this._txtName);this._txtDescription=new dijit.form.SimpleTextarea({label:"Description","class":"bfree",style:"resize:none;width:100%",onChange:dojo.hitch(this,this._onValueChange,"description")});this._tblProperties.addChild(this._txtDescription);this._grdUsers=new bfree.widget._Grid({id:"grdGroupUsers","class":"versaGridOutline versaNoHeader",query:{},noDataMessage:"No Users in Group",store:this._userStore,structure:bfree.widget.group.Editor.view1,formatterScope:this,sortInfo:2,style:"width:100%;height:100%",onSelectedItem:dojo.hitch(this,this._grdUsers_onSelectedItem)},this.userGridNode);this._cmdBar=new bfree.widget.group.UserBar({id:"user","class":"versaSidebar",activeStore:this._userStore,onCommand:dojo.hitch(this,this._onUserCommand)},this.userBarNode);this._wdgInfo=new bfree.widget.group.Info({id:"wdgGroupInfo1"},this.infoNode);this._grdUsers.startup();},_txtNameValidator:function(_1f){var _20=this.groups.fetch();for(var i=0;i<_20.length;i++){if(_20[i].name.toLowerCase().trim()==_1f.toLowerCase().trim()&&_20[i].__id!=this.activeItem.__id){this._txtName.set("invalidMessage","Duplicate group name");return false;}}return true;},resize:function(){this.inherited("resize",arguments);this.mainNode.resize();},startup:function(){this.inherited("startup",arguments);this._tblProperties.startup();}});bfree.widget.group.Editor.view1=[{cells:[{field:"id",name:"&nbsp",width:"16px",hidden:true},{field:"name",name:"Property",width:"auto"}],width:"auto"}];}