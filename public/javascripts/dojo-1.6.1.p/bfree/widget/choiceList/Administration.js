/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.choiceList.Administration"]){dojo._hasResource["bfree.widget.choiceList.Administration"]=true;dojo.provide("bfree.widget.choiceList.Administration");dojo.require("bfree.api.ChoiceLists");dojo.require("bfree.api.ChoiceValues");dojo.require("bfree.widget.ErrorManager");dojo.require("bfree.GridHelper");dojo.require("bfree.widget._DialogWidget");dojo.require("bfree.widget.DataTypeSelector");dojo.require("bfree.widget.ValidationTextBox");dojo.require("bfree.widget.choiceList.CommandBar");dojo.require("bfree.widget.choiceList.Grid");dojo.require("bfree.widget.choiceList.Editor");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.Dialog");dojo.require("dijit.Tooltip");dojo.require("dijit.form.Form");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.declare("bfree.widget.choiceList.Administration",[dijit._Widget,dijit._Templated,bfree.widget._DialogWidget],{templateString:null,templateString:dojo.cache("bfree/widget/choiceList","template/Administration.html","<div style=\"height:100%;width:100%;\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        style=\"height:100%;width:100%;\">\n\n     <!-- Command Bar -->\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            region=\"top\"\n            splitter=\"false\"\n            style=\"padding:0;overflow:hidden;height:27px\">\n\n        <div dojoAttachPoint=\"commandBarNode\"></div>\n\n    </div>\n\n     <div   dojoType=\"dijit.layout.BorderContainer\"\n            region=\"center\"\n            design=\"sidebar\"\n            gutters=\"false\"\n            liveSplitters=\"true\"\n            style=\"padding:8px;height:100%;width:100%\">\n\n\n         <div   dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"leading\"\n                style=\"padding:0 8px 0 0;width: 256px;\">\n\n            <div dojoAttachPoint=\"gridNode\"></div>\n\n        </div>\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"true\"\n                region=\"center\"\n                class=\"highlightPane\"\n                style=\"padding:8px\">\n\n            <div dojoAttachPoint=\"editorNode\"></div>\n\n        </div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,activeUser:null,library:null,zone:null,_choiceLists:null,_cmdBar:null,_dataTypes:null,_editor:null,_grdChoiceLists:null,_grdChoiceLists_onSelectedItem:function(_1){this._cmdBar.set("activeItem",_1);this._editor.set("activeItem",_1);},_onCommand:function(_2,_3){switch(_2){case bfree.widget.Bfree.Commands.NEW:this.createItem();break;case bfree.widget.Bfree.Commands.EDIT:this.editItem();break;case bfree.widget.Bfree.Commands.DELETE:this.deleteItem();break;case bfree.widget.Bfree.Commands.SAVE:this.save();break;case bfree.widget.Bfree.Commands.UNDO:this.undo();break;}},_onValueChange:function(_4,_5,_6,_7){var _8=this._grdChoiceLists.getItemIndex(_4);this._grdChoiceLists.updateRow(_8);},_validateItems:function(_9){var _a=true;for(var _b=0;_b<this._grdChoiceLists.rowCount;_b++){var _c=this._grdChoiceLists.getItem(_b);if(this._choiceLists.isDirty({item:_c})){if(!_9||(_9&&_9.__id!=_c.__id)){var _d=this._choiceLists.fetch();for(var i=0;i<_d.length;i++){if(_d[i].name&&_d[i].name.toLowerCase().trim()==_c.name.toLowerCase().trim()&&_d[i].__id!=_c.__id){return false;}}_a&=_c.isValid();}}}return _a;},constructor:function(_e){},createItem:function(){try{var _f=this._choiceLists.generateUniqueName({base_name:"Choice List"});var _10=this._choiceLists.create({name:_f,description:"",data_type_id:bfree.api.DataTypes.types.STRING,choice_values:[],created_by:this.activeUser.name,created_at:new Date(),updated_by:this.activeUser.name,updated_at:new Date()});this._grdChoiceLists.selectItem(_10);this._editor.focus();}catch(e){var err=new bfree.api.Error("Failed to create Choice List",e);bfree.widget.ErrorManager.handleError({error:err});}},deleteItem:function(){try{var _11=this._grdChoiceLists.selection.getFirstSelected();if(_11){if(!this._validateItems(_11)){var msg="Cannot delete Choice List: One or more Choice Lists contain invalid data";alert(msg);return;}var msg=dojo.replace("Are you sure you want to delete the Choice List: '{0}'?",[_11.name]);if(!confirm(msg)){return;}var idx=this._grdChoiceLists.getItemIndex(_11);this._choiceLists.destroy({item:_11});this._grdChoiceLists.setSelectedIndex(idx);this._editor.focus();}}catch(e){var err=new bfree.api.Error("Failed to delete Choice List",e);bfree.widget.ErrorManager.handleError({error:err});}},destroy:function(){this.destroyDescendants();if(this._editor){this._editor.destroy();this._editor=null;}this.inherited("destroy",arguments);},editItem:function(){try{var _12=this._grdChoiceLists.selection.getFirstSelected();if(_12){var idx=this._grdChoiceLists.getItemIndex(_12);this._choiceLists.clone({item:_12});this._grdChoiceLists.updateRow(idx);this._grdChoiceLists.setSelectedIndex(idx);this._editor.focus();}}catch(e){var err=new bfree.api.Error("Failed to edit Choice List",e);bfree.widget.ErrorManager.handleError({error:err});}},onDialogClosing:function(_13){var _14=false;try{if(this._choiceLists.isDirty()){var msg="You have unsaved changes that will be lost. Do you wish to continue?";if(confirm(msg)){if(this._choiceLists!=null){this._choiceLists.revert();}_14=true;}}else{_14=true;}}catch(e){var err=new bfree.api.Error("Failed to close Choice List Administration dialog",e);bfree.widget.ErrorManager.handleError({error:err});}return _14;},postCreate:function(){this.inherited("postCreate",arguments);this._dataTypes=bfree.api.Application.getDataTypes();this._choiceLists=this.library.getChoiceLists();this._choiceLists.clearCache();this._cmdBar=new bfree.widget.choiceList.CommandBar({choiceLists:this._choiceLists,onCommand:dojo.hitch(this,this._onCommand)},this.commandBarNode);this._grdChoiceLists=new bfree.widget.choiceList.Grid({id:"grdChoiceLists","class":"versaGridOutline versaNoHeader",noHeader:true,choiceLists:this._choiceLists,onSelectedItem:dojo.hitch(this,this._grdChoiceLists_onSelectedItem)},this.gridNode);this._editor=new bfree.widget.choiceList.Editor({id:"edtChoiceList",choiceLists:this._choiceLists,onValueChange:dojo.hitch(this,this._onValueChange)},this.editorNode);},save:function(){try{if(!this._validateItems()){var msg="Cannot save Choice List changes: One or more Choice Lists contain invalid data";alert(msg);return;}var _15=this._grdChoiceLists.selection.getFirstSelected();this._choiceLists.save({onComplete:dojo.hitch(this,this.saveOnComplete,_15)});}catch(e){var err=new bfree.api.Error("Failed to save Choice List changes",e);bfree.widget.ErrorManager.handleError({error:err});}},saveOnComplete:function(_16){this._choiceLists.clearCache();this._grdChoiceLists.sort();this._grdChoiceLists.selectItem(_16);},startup:function(){this.inherited(arguments);this._grdChoiceLists.startup();this._grdChoiceLists.setSelectedIndex(0);},undo:function(){try{var _17=this._grdChoiceLists.selection.getFirstSelected();this._choiceLists.clearCache();this._choiceLists.revert();if(_17){var idx=this._grdChoiceLists.getItemIndex(_17);this._grdChoiceLists.setSelectedIndex(idx);}}catch(e){var err=new bfree.api.Error("Failed to revert changes",e);bfree.widget.ErrorManager.handleError({error:err});}}});bfree.widget.choiceList.Administration.show=function(_18){var dlg=new bfree.widget.Dialog({id:"dlgChoiceLists",title:"Choice List",widgetConstructor:bfree.widget.choiceList.Administration,widgetParams:{activeUser:_18.user,library:_18.library,zone:_18.zone},noResize:true,height:480,width:640,zIndex:1024,buttons:bfree.widget.Dialog.buttons.close,onClose:_18.onClose});dlg.startup();dlg.show();};bfree.widget.choiceList.Administration.choiceValueGridLayout=[{cells:[{field:"name",name:"Displayed Value",width:"128px"},{field:"value",name:"Value",width:"auto"},{field:"sort_order",name:" ",width:"64px",hidden:true}],noscroll:false,width:"auto"}];}