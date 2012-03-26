/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.user.Administration"]){dojo._hasResource["bfree.widget.user.Administration"]=true;dojo.provide("bfree.widget.user.Administration");dojo.require("bfree.widget._DialogWidget");dojo.require("bfree.widget.user.CommandBar");dojo.require("bfree.widget.user.Editor");dojo.require("bfree.widget.user.Grid");dojo.require("dijit._Templated");dojo.require("dijit._Widget");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.declare("bfree.widget.user.Administration",[dijit._Widget,dijit._Templated,bfree.widget._DialogWidget],{templateString:dojo.cache("bfree/widget/user","template/Administration.html","<div style=\"height:100%;width:100%;\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        style=\"height:100%;width:100%;\">\n\n     <!-- Command Bar -->\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            region=\"top\"\n            splitter=\"false\"\n            style=\"padding:0;overflow:hidden;height:27px\">\n\n        <div dojoAttachPoint=\"commandBarNode\"></div>\n\n    </div>\n\n     <div   dojoType=\"dijit.layout.BorderContainer\"\n            region=\"center\"\n            design=\"sidebar\"\n            gutters=\"false\"\n            liveSplitters=\"true\"\n            style=\"padding:8px;height:100%;width:100%\">\n\n\n         <div   dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"leading\"\n                style=\"padding:0 8px 0 0;width: 256px;\">\n\n            <div dojoAttachPoint=\"gridNode\"></div>\n\n        </div>\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"true\"\n                region=\"center\"\n                class=\"highlightPane\"\n                style=\"padding:8px\">\n\n            <div dojoAttachPoint=\"editorNode\"></div>\n\n        </div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_cmdBar:null,_editor:null,_grdUsers:null,_groups:null,_users:null,activeUser:null,zone:null,_grdUsers_onSelectedItems:function(_1){var _2=null;if((!_1)||(_1.length<1)){return;}_2=_1[0];this._cmdBar.set("activeItem",_2);this._editor.set("activeItem",_2);},_loadItem:function(){try{}finally{this.onWidgetLoaded();}},_onCommand:function(_3){switch(_3){case bfree.widget.Bfree.Commands.NEW:this.createItem();break;case bfree.widget.Bfree.Commands.EDIT:this.editItem();break;case bfree.widget.Bfree.Commands.DELETE:this.deleteItem();break;case bfree.widget.Bfree.Commands.SAVE:this.save();break;case bfree.widget.Bfree.Commands.UNDO:this.undo();break;}},_onValueChange:function(_4,_5,_6,_7){var _8=this._grdUsers.getItemIndex(_4);this._grdUsers.updateRow(_8);},_validateItems:function(_9){var _a=true;for(var _b=0;_b<this._grdUsers.rowCount;_b++){var _c=this._grdUsers.getItem(_b);if(this._users.isDirty({item:_c})){if(!_9||(_9&&_9.__id!=_c.__id)){var _d=this._users.fetch();for(var i=0;i<_d.length;i++){if(_d[i].name&&_d[i].name.toLowerCase().trim()==_c.name.toLowerCase().trim()&&_d[i].__id!=_c.__id){return false;}}if(_c.email==""){_a=false;}_a&=_c.isValid();}}}return _a;},constructor:function(_e){},createItem:function(){try{var _f=this._users.generateUniqueName({base_name:"user",appendix:"{index}"});var _10=this._users.create({name:_f,created_by:this.activeUser.name,created_at:new Date(),updated_by:this.activeUser.name,updated_at:new Date(),is_admin:false,active_group:this._groups.getEveryone().id,reset_password:bfree.api.Users.generatePassword({length:8}),disabled:false});this._grdUsers.selectItem(_10);this._editor.focus();}catch(e){var err=new bfree.api.Error("Failed to create User",e);bfree.widget.ErrorManager.handleError({error:err});}},deleteItem:function(){try{var _11=this._grdUsers.selection.getFirstSelected();if(_11){if(!this._validateItems(_11)){var msg="Cannot delete user: One or more Users contain invalid data";alert(msg);return;}var msg=dojo.replace("Are you sure you want to delete the user: '{0}'?",[_11.getFullName()]);if(!confirm(msg)){return;}var idx=this._grdUsers.getItemIndex(_11);this._users.destroy({item:_11,onComplete:dojo.hitch(this,this.deleteOnComplete,idx)});}}catch(e){var err=new bfree.api.Error("Failed to delete User",e);bfree.widget.ErrorManager.handleError({error:err});}},deleteOnComplete:function(idx){this._grdUsers.setSelectedIndex(idx);this._editor.focus();},destroy:function(){this.destroyDescendants();if(this._editor){this._editor.destroy();this._editor=null;}this.inherited("destroy",arguments);},editItem:function(){try{var _12=this._grdUsers.selection.getFirstSelected();if(_12){var idx=this._grdUsers.getItemIndex(_12);this._users.clone({item:_12});this._grdUsers.updateRow(idx);this._grdUsers.setSelectedIndex(idx);this._users.setValue(_12,"reset_password","");this._editor.focus();}}catch(e){var err=new bfree.api.Error("Failed to edit User",e);bfree.widget.ErrorManager.handleError({error:err});}},isValid:function(){return true;},onDialogClosing:function(_13){var _14=false;try{if(this._users.isDirty()){var msg="You have unsaved changes that will be lost. Do you wish to continue?";if(confirm(msg)){if(this._users!=null){this._users.revert();}_14=true;}}else{_14=true;}}catch(e){var err=new bfree.api.Error("Failed to close User Administration dialog",e);bfree.widget.ErrorManager.handleError({error:err});}return _14;},postCreate:function(){this.inherited("postCreate",arguments);this._groups=this.zone.getGroups();this._groups.refresh();this._users=this.zone.getUsers();this._users.clearCache();this._cmdBar=new bfree.widget.user.CommandBar({id:"cmdBar",users:this._users,onCommand:dojo.hitch(this,this._onCommand)},this.commandBarNode);this._grdUsers=new bfree.widget.user.Grid({id:"grdUsers","class":"versaGridOutline versaNoHeader",users:this._users,onSelectedItems:dojo.hitch(this,this._grdUsers_onSelectedItems)},this.gridNode);this._editor=new bfree.widget.user.Editor({id:"wdgEditor",groups:this._groups,users:this._users,onValueChange:dojo.hitch(this,this._onValueChange)},this.editorNode);},save:function(){try{if(!this._validateItems()){var msg="Cannot save User changes: One or more Users contain invalid data";alert(msg);return;}var _15=this._grdUsers.selection.getFirstSelected();this._users.save({onComplete:dojo.hitch(this,this.saveOnComplete,_15)});}catch(e){var err=new bfree.api.Error("Failed to save User changes",e);bfree.widget.ErrorManager.handleError({error:err});}},saveOnComplete:function(_16){this._users.clearCache();this._grdUsers.sort();this._grdUsers.selectItem(_16);},startup:function(){this.inherited("startup",arguments);this._grdUsers.startup();this._grdUsers.setSelectedIndex(0);setTimeout(bfree.widget.user.Administration._loadFnRef(this),10);},undo:function(){try{var _17=this._grdUsers.selection.getFirstSelected();var idx=(_17)?this._grdUsers.getItemIndex(_17):0;this._users.clearCache();this._users.revert();this._grdUsers.setSelectedIndex(idx);}catch(e){var err=new bfree.api.Error("Failed to revert changes",e);bfree.widget.ErrorManager.handleError({error:err});}}});bfree.widget.user.Administration._loadFnRef=function(_18){return (function(){_18._loadItem();});};bfree.widget.user.Administration.show=function(_19){var dlg=new bfree.widget.Dialog({id:"dlgUserAdmin",title:"User Administration",widgetConstructor:bfree.widget.user.Administration,widgetParams:{activeUser:_19.user,zone:_19.zone},noResize:true,height:400,width:600,zIndex:1024,buttons:bfree.widget.Dialog.buttons.close,onClose:_19.onClose});dlg.startup();dlg.show();};}