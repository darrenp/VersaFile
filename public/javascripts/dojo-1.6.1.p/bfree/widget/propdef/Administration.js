/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.propdef.Administration"]){dojo._hasResource["bfree.widget.propdef.Administration"]=true;dojo.provide("bfree.widget.propdef.Administration");dojo.require("bfree.widget.Bfree");dojo.require("bfree.widget._DialogWidget");dojo.require("bfree.widget.propdef.CommandBar");dojo.require("bfree.widget.propdef.Editor");dojo.require("bfree.widget.propdef.Grid");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.declare("bfree.widget.propdef.Administration",[dijit._Widget,dijit._Templated,bfree.widget._DialogWidget],{templateString:dojo.cache("bfree/widget/propdef","template/Administration.html","<div style=\"height:100%;width:100%;\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        style=\"height:100%;width:100%;\">\n\n     <!-- Command Bar -->\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            region=\"top\"\n            splitter=\"false\"\n            style=\"padding:0;overflow:hidden;height:27px\">\n\n        <div dojoAttachPoint=\"commandBarNode\"></div>\n\n    </div>\n\n     <div   dojoType=\"dijit.layout.BorderContainer\"\n            region=\"center\"\n            design=\"sidebar\"\n            gutters=\"false\"\n            liveSplitters=\"true\"\n            style=\"padding:8px;height:100%;width:100%\">\n\n\n         <div   dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"leading\"\n                style=\"padding:0 8px 0 0;width: 256px;\">\n\n            <div dojoAttachPoint=\"gridNode\"></div>\n\n        </div>\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"true\"\n                region=\"center\"\n                class=\"highlightPane\"\n                style=\"padding:8px\">\n\n            <div dojoAttachPoint=\"editorNode\"></div>\n\n        </div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_cmdBar:null,_editor:null,_grdPropDefs:null,_propertyDefinitions:null,activeUser:null,library:null,zone:null,_cmdBar_onCommand:function(_1){switch(_1){case bfree.widget.Bfree.Commands.NEW:this.createItem();break;case bfree.widget.Bfree.Commands.EDIT:this.editItem();break;case bfree.widget.Bfree.Commands.DELETE:this.deleteItem();break;case bfree.widget.Bfree.Commands.SAVE:this.save();break;case bfree.widget.Bfree.Commands.UNDO:this.undo();break;}},_grdPropDefs_onSelectedItem:function(_2){this._cmdBar.set("activeItem",_2);this._editor.set("activeItem",_2);},_validateItems:function(){var _3=true;for(var _4=0;_4<this._grdPropDefs.rowCount;_4++){var _5=this._grdPropDefs.getItem(_4);if(this._propertyDefinitions.isDirty({item:_5})){var _6=this._propertyDefinitions.fetchItemsByName(_5.name);_3&=(_6.length==1);_3&=_5.isValid();}}return _3;},constructor:function(_7){},createItem:function(){try{var _8=this._propertyDefinitions.generateUniqueName({base_name:"Property Definition",appendix:" ({index})"});var _9=this._propertyDefinitions.create({name:_8,cardinality:bfree.api.Cardinality.Single,description:"",max_length:0,created_by:this.activeUser.name,created_at:new Date(),updated_by:this.activeUser.name,updated_at:new Date(),is_system:false,is_readonly:false,table_name:"documents",column_name:""});this._grdPropDefs.selectItem(_9);this._editor.focus();}catch(e){var _a=new bfree.api.Error("Failed to create Property Definition",e);bfree.widget.ErrorManager.handleError({error:_a});}},deleteItem:function(){try{var _b=this._grdPropDefs.selection.getFirstSelected();if(_b){if(_b.document_types_count>0){alert("You cannot delete a property definition assigned to a document type.");return;}var _c=dojo.replace("Are you sure you want to delete the property definition: '{0}'?",[_b.name]);if(!confirm(_c)){return;}var _d=this._grdPropDefs.getItemIndex(_b);this._propertyDefinitions.destroy({item:_b});this._grdPropDefs.setSelectedIndex(_d);this._editor.focus();}}catch(e){var _e=new bfree.api.Error("Failed to delete Property Definition",e);bfree.widget.ErrorManager.handleError({error:_e});}},destroy:function(){if(this._cmdBar){this._cmdBar.destroy();this._cmdBar=null;}if(this._grdPropDefs){this._grdPropDefs.destroy();this._grdPropDefs=null;}if(this._editor){this._editor.destroy();this._editor=null;}this.inherited("destroy",arguments);},editItem:function(){try{var _f=this._grdPropDefs.selection.getFirstSelected();if(_f){var idx=this._grdPropDefs.getItemIndex(_f);this._propertyDefinitions.clone({item:_f});this._grdPropDefs.updateRow(idx);this._grdPropDefs.sort();this._grdPropDefs.selectItem(_f);this._editor.focus();}}catch(e){var err=new bfree.api.Error("Failed to edit Property Definition",e);bfree.widget.ErrorManager.handleError({error:err});}},isValid:function(){return true;},onDialogClosing:function(_10){var _11=false;try{if(this._propertyDefinitions.isDirty()){var msg="You have unsaved changes that will be lost. Do you wish to continue?";if(confirm(msg)){if(this._propertyDefinitions!=null){this._propertyDefinitions.revert();}_11=true;}}else{_11=true;}}catch(e){var err=new bfree.api.Error("Failed to close Property Definition Administration dialog",e);bfree.widget.ErrorManager.handleError({error:err});}return _11;},postCreate:function(){this.inherited("postCreate",arguments);this._propertyDefinitions=this.library.getPropertyDefinitions();this._propertyDefinitions.clearCache();this._cmdBar=new bfree.widget.propdef.CommandBar({id:"cmdBar",propertyDefinitions:this._propertyDefinitions,onCommand:dojo.hitch(this,this._cmdBar_onCommand)},this.commandBarNode);this._grdPropDefs=new bfree.widget.propdef.Grid({id:"grdPropDefs","class":"versaGridOutline versaNoHeader",propertyDefinitions:this._propertyDefinitions,onSelectedItem:dojo.hitch(this,this._grdPropDefs_onSelectedItem)},this.gridNode);this._editor=new bfree.widget.propdef.Editor({id:"edtPropDef",propertyDefinitions:this._propertyDefinitions},this.editorNode);},resize:function(){this.inherited("resize",arguments);if(this._grdPropDefs){this._grdPropDefs.resize();}},save:function(){try{if(!this._validateItems()){var msg="Cannot save Property Definition changes: One or more Property Definitions contain invalid data";alert(msg);return;}var _12=this._grdPropDefs.selection.getFirstSelected();this._propertyDefinitions.save({onComplete:dojo.hitch(this,this.saveOnComplete,_12)});}catch(e){var err=new bfree.api.Error("Failed to save Property Definition changes",e);bfree.widget.ErrorManager.handleError({error:err});}},saveOnComplete:function(_13){this._propertyDefinitions.clearCache();this._grdPropDefs.sort();this._grdPropDefs.selectItem(_13);},startup:function(){this.inherited("startup",arguments);this._grdPropDefs.startup();this._grdPropDefs.setSelectedIndex(0);},undo:function(){try{var _14=this._grdPropDefs.selection.getFirstSelected();this._propertyDefinitions.clearCache();this._propertyDefinitions.revert();if(_14){var idx=this._grdPropDefs.getItemIndex(_14);this._grdPropDefs.setSelectedIndex(idx);}}catch(e){var err=new bfree.api.Error("Failed to revert changes",e);bfree.widget.ErrorManager.handleError({error:err});}}});bfree.widget.propdef.Administration.show=function(_15){var dlg=new bfree.widget.Dialog({id:"dlgEditPropDefs",title:"Property Definition Administration",widgetConstructor:bfree.widget.propdef.Administration,widgetParams:{activeUser:_15.user,library:_15.library,zone:_15.zone},noResize:true,height:384,width:600,zIndex:1024,buttons:bfree.widget.Dialog.buttons.close,onClose:_15.onClose});dlg.startup();dlg.show();};}