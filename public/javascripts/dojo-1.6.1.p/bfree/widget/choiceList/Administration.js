/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.choiceList.Administration"]){dojo._hasResource["bfree.widget.choiceList.Administration"]=true;dojo.provide("bfree.widget.choiceList.Administration");dojo.require("bfree.api.ChoiceLists");dojo.require("bfree.api.ChoiceValues");dojo.require("bfree.widget.ErrorManager");dojo.require("bfree.GridHelper");dojo.require("bfree.widget._DialogWidget");dojo.require("bfree.widget.DataTypeSelector");dojo.require("bfree.widget.ValidationTextBox");dojo.require("bfree.widget.choiceList.CommandBar");dojo.require("bfree.widget.choiceList.Grid");dojo.require("bfree.widget.choiceList.Editor");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.Dialog");dojo.require("dijit.Tooltip");dojo.require("dijit.form.Form");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.declare("bfree.widget.choiceList.Administration",[dijit._Widget,dijit._Templated,bfree.widget._DialogWidget],{templateString:null,templateString:dojo.cache("bfree/widget/choiceList","template/Administration.html","<div style=\"height:100%;width:100%;\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        style=\"height:100%;width:100%;\">\n\n     <!-- Command Bar -->\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            region=\"top\"\n            splitter=\"false\"\n            style=\"padding:0;overflow:hidden;height:27px\">\n\n        <div dojoAttachPoint=\"commandBarNode\"></div>\n\n    </div>\n\n     <div   dojoType=\"dijit.layout.BorderContainer\"\n            region=\"center\"\n            design=\"sidebar\"\n            gutters=\"false\"\n            liveSplitters=\"true\"\n            style=\"padding:8px;height:100%;width:100%\">\n\n\n         <div   dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"leading\"\n                style=\"padding:0 8px 0 0;width: 256px;\">\n\n            <div dojoAttachPoint=\"gridNode\"></div>\n\n        </div>\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"true\"\n                region=\"center\"\n                class=\"highlightPane\"\n                style=\"padding:8px\">\n\n            <div dojoAttachPoint=\"editorNode\"></div>\n\n        </div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,activeUser:null,library:null,zone:null,_choiceLists:null,_cmdBar:null,_dataTypes:null,_editor:null,_grdChoiceLists:null,_grdChoiceLists_onSelectedItem:function(_1){this._cmdBar.set("activeItem",_1);this._editor.set("activeItem",_1);},_onCommand:function(_2,_3){switch(_2){case bfree.widget.Bfree.Commands.NEW:this.createItem();break;case bfree.widget.Bfree.Commands.EDIT:this.editItem();break;case bfree.widget.Bfree.Commands.DELETE:this.deleteItem();break;case bfree.widget.Bfree.Commands.SAVE:this.save();break;case bfree.widget.Bfree.Commands.UNDO:this.undo();break;}},_onValueChange:function(_4,_5,_6,_7){var _8=this._grdChoiceLists.getItemIndex(_4);this._grdChoiceLists.updateRow(_8);},_validateItems:function(){var _9=true;for(var _a=0;_a<this._grdChoiceLists.rowCount;_a++){var _b=this._grdChoiceLists.getItem(_a);if(this._choiceLists.isDirty({item:_b})){var _c=this._choiceLists.fetch();for(var i=0;i<_c.length;i++){if(_c[i].name&&_c[i].name.toLowerCase().trim()==_b.name.toLowerCase().trim()&&_c[i].__id!=_b.__id){return false;}}_9&=_b.isValid();}}return _9;},constructor:function(_d){},createItem:function(){try{var _e=this._choiceLists.generateUniqueName({base_name:"Choice List"});var _f=this._choiceLists.create({name:_e,description:"",data_type_id:bfree.api.DataTypes.types.STRING,choice_values:[],created_by:this.activeUser.name,created_at:new Date(),updated_by:this.activeUser.name,updated_at:new Date()});this._grdChoiceLists.selectItem(_f);this._editor.focus();}catch(e){var err=new bfree.api.Error("Failed to create Choice List",e);bfree.widget.ErrorManager.handleError({error:err});}},deleteItem:function(){try{var _10=this._grdChoiceLists.selection.getFirstSelected();if(_10){var msg=dojo.replace("Are you sure you want to delete the Choice List: '{0}'?",[_10.name]);if(!confirm(msg)){return;}var idx=this._grdChoiceLists.getItemIndex(_10);this._choiceLists.destroy({item:_10});this._grdChoiceLists.setSelectedIndex(idx);this._editor.focus();}}catch(e){var err=new bfree.api.Error("Failed to delete Choice List",e);bfree.widget.ErrorManager.handleError({error:err});}},destroy:function(){this.destroyDescendants();if(this._editor){this._editor.destroy();this._editor=null;}this.inherited("destroy",arguments);},editItem:function(){try{var _11=this._grdChoiceLists.selection.getFirstSelected();if(_11){var idx=this._grdChoiceLists.getItemIndex(_11);this._choiceLists.clone({item:_11});this._grdChoiceLists.updateRow(idx);this._grdChoiceLists.setSelectedIndex(idx);this._editor.focus();}}catch(e){var err=new bfree.api.Error("Failed to edit Choice List",e);bfree.widget.ErrorManager.handleError({error:err});}},onDialogClosing:function(_12){var _13=false;try{if(this._choiceLists.isDirty()){var msg="You have unsaved changes that will be lost. Do you wish to continue?";if(confirm(msg)){if(this._choiceLists!=null){this._choiceLists.revert();}_13=true;}}else{_13=true;}}catch(e){var err=new bfree.api.Error("Failed to close Choice List Administration dialog",e);bfree.widget.ErrorManager.handleError({error:err});}return _13;},postCreate:function(){this.inherited("postCreate",arguments);this._dataTypes=bfree.api.Application.getDataTypes();this._choiceLists=this.library.getChoiceLists();this._choiceLists.clearCache();this._cmdBar=new bfree.widget.choiceList.CommandBar({choiceLists:this._choiceLists,onCommand:dojo.hitch(this,this._onCommand)},this.commandBarNode);this._grdChoiceLists=new bfree.widget.choiceList.Grid({id:"grdChoiceLists","class":"versaGridOutline versaNoHeader",noHeader:true,choiceLists:this._choiceLists,onSelectedItem:dojo.hitch(this,this._grdChoiceLists_onSelectedItem)},this.gridNode);this._editor=new bfree.widget.choiceList.Editor({id:"edtChoiceList",choiceLists:this._choiceLists,onValueChange:dojo.hitch(this,this._onValueChange)},this.editorNode);},save:function(){try{if(!this._validateItems()){var msg="Cannot save Choice List changes: One or more Choice Lists contain invalid data";alert(msg);return;}var _14=this._grdChoiceLists.selection.getFirstSelected();this._choiceLists.save({onComplete:dojo.hitch(this,this.saveOnComplete,_14)});}catch(e){var err=new bfree.api.Error("Failed to save Choice List changes",e);bfree.widget.ErrorManager.handleError({error:err});}},saveOnComplete:function(_15){this._choiceLists.clearCache();this._grdChoiceLists.sort();this._grdChoiceLists.selectItem(_15);},startup:function(){this.inherited(arguments);this._grdChoiceLists.startup();this._grdChoiceLists.setSelectedIndex(0);},undo:function(){try{var _16=this._grdChoiceLists.selection.getFirstSelected();this._choiceLists.clearCache();this._choiceLists.revert();if(_16){var idx=this._grdChoiceLists.getItemIndex(_16);this._grdChoiceLists.setSelectedIndex(idx);}}catch(e){var err=new bfree.api.Error("Failed to revert changes",e);bfree.widget.ErrorManager.handleError({error:err});}}});bfree.widget.choiceList.Administration.show=function(_17){var dlg=new bfree.widget.Dialog({id:"dlgChoiceLists",title:"Choice List",widgetConstructor:bfree.widget.choiceList.Administration,widgetParams:{activeUser:_17.user,library:_17.library,zone:_17.zone},noResize:true,height:480,width:640,zIndex:1024,buttons:bfree.widget.Dialog.buttons.close,onClose:_17.onClose});dlg.startup();dlg.show();};bfree.widget.choiceList.Administration.choiceValueGridLayout=[{cells:[{field:"name",name:"Displayed Value",width:"128px"},{field:"value",name:"Value",width:"auto"},{field:"sort_order",name:" ",width:"64px",hidden:true}],noscroll:false,width:"auto"}];}