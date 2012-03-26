/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.group.Administration"]){dojo._hasResource["bfree.widget.group.Administration"]=true;dojo.provide("bfree.widget.group.Administration");dojo.require("bfree.widget._DialogWidget");dojo.require("bfree.widget.group.CommandBar");dojo.require("bfree.widget.group.Editor");dojo.require("bfree.widget.group.Grid");dojo.require("dijit._Templated");dojo.require("dijit._Widget");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.declare("bfree.widget.group.Administration",[dijit._Widget,dijit._Templated,bfree.widget._DialogWidget],{templateString:dojo.cache("bfree/widget/group","template/Administration.html","<div style=\"height:100%;width:100%;\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        style=\"height:100%;width:100%;\">\n\n     <!-- Command Bar -->\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            region=\"top\"\n            splitter=\"false\"\n            style=\"padding:0;overflow:hidden;height:27px\">\n\n        <div dojoAttachPoint=\"commandBarNode\"></div>\n\n    </div>\n\n     <div   dojoType=\"dijit.layout.BorderContainer\"\n            region=\"center\"\n            design=\"sidebar\"\n            gutters=\"false\"\n            liveSplitters=\"true\"\n            style=\"padding:8px;height:100%;width:100%\">\n\n\n         <div   dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"leading\"\n                style=\"padding:0 8px 0 0;width: 256px;\">\n\n            <div dojoAttachPoint=\"gridNode\"></div>\n\n        </div>\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"true\"\n                region=\"center\"\n                class=\"highlightPane\"\n                style=\"padding:8px\">\n\n            <div dojoAttachPoint=\"editorNode\"></div>\n\n        </div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_cmdBar:null,_editor:null,_grdGroups:null,_groups:null,_users:null,activeUser:null,zone:null,_grdGroups_onSelectedItems:function(_1){var _2=null;if((!_1)||(_1.length<1)){return;}_2=_1[0];this._cmdBar.set("activeItem",_2);this._editor.set("activeItem",_2);},_loadItem:function(){try{}finally{this.onWidgetLoaded();}},_onCommand:function(_3){switch(_3){case bfree.widget.Bfree.Commands.NEW:this.createItem();break;case bfree.widget.Bfree.Commands.EDIT:this.editItem();break;case bfree.widget.Bfree.Commands.DELETE:this.deleteItem();break;case bfree.widget.Bfree.Commands.SAVE:this.save();break;case bfree.widget.Bfree.Commands.UNDO:this.undo();break;}},_onValueChange:function(_4,_5,_6,_7){var _8=this._grdGroups.getItemIndex(_4);this._grdGroups.updateRow(_8);},_validateItems:function(_9){var _a=true;for(var _b=0;_b<this._grdGroups.rowCount;_b++){var _c=this._grdGroups.getItem(_b);if(this._groups.isDirty({item:_c})){if(!_9||(_9&&_9.__id!=_c.__id)){var _d=this._groups.fetch();for(var i=0;i<_d.length;i++){if(_d[i].name&&_d[i].name.toLowerCase().trim()==_c.name.toLowerCase().trim()&&_d[i].__id!=_c.__id){return false;}}_a&=_c.isValid();}}}return _a;},constructor:function(_e){},createItem:function(){try{var _f=this._groups.generateUniqueName({base_name:"group",appendix:"{index}"});var _10=this._groups.create({name:_f,description:"",created_by:this.activeUser.name,created_at:new Date(),updated_by:this.activeUser.name,updated_at:new Date(),is_admin:false,is_everyone:false,active_users:[]});this._grdGroups.selectItem(_10);this._editor.focus();}catch(e){var err=new bfree.api.Error("Failed to create Group",e);bfree.widget.ErrorManager.handleError({error:err});}},deleteItem:function(){try{var _11=this._grdGroups.selection.getFirstSelected();if(_11){if(!this._validateItems(_11)){var msg="Cannot delete Group: One or more Groups contain invalid data";alert(msg);return;}var msg=dojo.replace("Are you sure you want to delete the group: '{0}'?",[_11.name]);if(!confirm(msg)){return;}var idx=this._grdGroups.getItemIndex(_11);this._groups.destroy({item:_11});this._grdGroups.setSelectedIndex(idx);this._editor.focus();}}catch(e){var err=new bfree.api.Error("Failed to delete User",e);bfree.widget.ErrorManager.handleError({error:err});}},destroy:function(){this.destroyDescendants();if(this._editor){this._editor.destroy();this._editor=null;}this.inherited("destroy",arguments);},editItem:function(){try{var _12=this._grdGroups.selection.getFirstSelected();if(_12){var idx=this._grdGroups.getItemIndex(_12);this._groups.clone({item:_12});this._grdGroups.updateRow(idx);this._grdGroups.setSelectedIndex(idx);this._editor.focus();}}catch(e){var err=new bfree.api.Error("Failed to edit Group",e);bfree.widget.ErrorManager.handleError({error:err});}},isValid:function(){return true;},onDialogClosing:function(_13){var _14=false;try{if(this._groups.isDirty()){var msg="You have unsaved changes that will be lost. Do you wish to continue?";if(confirm(msg)){if(this._groups!=null){this._groups.revert();}_14=true;}}else{_14=true;}}catch(e){var err=new bfree.api.Error("Failed to close Group Administration dialog",e);bfree.widget.ErrorManager.handleError({error:err});}return _14;},postCreate:function(){this.inherited("postCreate",arguments);this._users=this.zone.getUsers();this._users.refresh();this._groups=this.zone.getGroups();this._groups.clearCache();this._cmdBar=new bfree.widget.group.CommandBar({id:"cmdBar",groups:this._groups,onCommand:dojo.hitch(this,this._onCommand)},this.commandBarNode);this._grdGroups=new bfree.widget.group.Grid({id:"grdGroups","class":"versaGridOutline versaNoHeader",groups:this._groups,onSelectedItems:dojo.hitch(this,this._grdGroups_onSelectedItems)},this.gridNode);this._editor=new bfree.widget.group.Editor({id:"wdgEditor",groups:this._groups,users:this._users,onValueChange:dojo.hitch(this,this._onValueChange)},this.editorNode);},save:function(){try{if(!this._validateItems()){var msg="Cannot save Group changes: One or more Groups contain invalid data";alert(msg);return;}var _15=this._grdGroups.selection.getFirstSelected();this._groups.save({onComplete:dojo.hitch(this,this.saveOnComplete,_15)});}catch(e){var err=new bfree.api.Error("Failed to save Group changes",e);bfree.widget.ErrorManager.handleError({error:err});}},saveOnComplete:function(_16){this._groups.clearCache();this._grdGroups.sort();this._grdGroups.selectItem(_16);},startup:function(){this.inherited("startup",arguments);this._grdGroups.startup();this._grdGroups.setSelectedIndex(0);setTimeout(bfree.widget.group.Administration._loadFnRef(this),10);},undo:function(){try{var _17=this._grdGroups.selection.getFirstSelected();this._groups.clearCache();this._groups.revert();if(_17){var idx=this._grdGroups.getItemIndex(_17);this._grdGroups.setSelectedIndex(idx);}}catch(e){var err=new bfree.api.Error("Failed to revert changes",e);bfree.widget.ErrorManager.handleError({error:err});}}});bfree.widget.group.Administration._loadFnRef=function(_18){return (function(){_18._loadItem();});};bfree.widget.group.Administration.show=function(_19){var dlg=new bfree.widget.Dialog({id:"dlgGroupAdmin",title:"Group Administration",widgetConstructor:bfree.widget.group.Administration,widgetParams:{activeUser:_19.user,zone:_19.zone},noResize:true,height:480,width:640,zIndex:1024,buttons:bfree.widget.Dialog.buttons.close,onClose:_19.onClose});dlg.startup();dlg.show();};}