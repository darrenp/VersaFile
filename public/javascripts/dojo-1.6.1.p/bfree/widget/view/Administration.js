/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.view.Administration"]){dojo._hasResource["bfree.widget.view.Administration"]=true;dojo.provide("bfree.widget.view.Administration");dojo.require("bfree.widget._DialogWidget");dojo.require("bfree.widget.ErrorManager");dojo.require("bfree.widget.view.CommandBar");dojo.require("bfree.widget.view.Grid");dojo.require("bfree.widget.view.Editor");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.declare("bfree.widget.view.Administration",[dijit._Widget,dijit._Templated,bfree.widget._DialogWidget],{templateString:dojo.cache("bfree/widget/view","template/Administration.html","<div style=\"height:100%;width:100%;\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        style=\"height:100%;width:100%;\">\n\n     <!-- Command Bar -->\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            region=\"top\"\n            splitter=\"false\"\n            style=\"padding:0;overflow:hidden;height:27px\">\n\n        <div dojoAttachPoint=\"commandBarNode\"></div>\n\n    </div>\n\n     <div   dojoType=\"dijit.layout.BorderContainer\"\n            region=\"center\"\n            design=\"sidebar\"\n            gutters=\"false\"\n            liveSplitters=\"true\"\n            style=\"padding:8px;height:100%;width:100%\">\n\n\n         <div   dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"leading\"\n                style=\"padding:0 8px 0 0;width: 256px;\">\n\n            <div dojoAttachPoint=\"gridNode\"></div>\n\n        </div>\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"true\"\n                region=\"center\"\n                class=\"highlightPane\"\n                style=\"padding:8px\">\n\n            <div dojoAttachPoint=\"editorNode\"></div>\n\n        </div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_cmdBar:null,_grdViews:null,_editor:null,_propertyDefinitions:null,_viewDefinitions:null,activeUser:null,library:null,zone:null,_onCommand:function(_1){switch(_1){case bfree.widget.Bfree.Commands.NEW:this.createItem();break;case bfree.widget.Bfree.Commands.EDIT:this.editItem();break;case bfree.widget.Bfree.Commands.DELETE:this.deleteItem();break;case bfree.widget.Bfree.Commands.SAVE:this.save();break;case bfree.widget.Bfree.Commands.UNDO:this.undo();break;}},_grdViews_onSelectedItem:function(_2){this._cmdBar.set("activeItem",_2);this._editor.set("activeItem",_2);},_onValueChange:function(_3,_4,_5,_6){var _7=this._grdViews.getItemIndex(_3);this._grdViews.updateRow(_7);},_validateItems:function(_8){var _9=true;for(var _a=0;_a<this._grdViews.rowCount;_a++){var _b=this._grdViews.getItem(_a);if(this._viewDefinitions.isDirty({item:_b})){if(!_8||(_8&&_8.__id!=_b.__id)){var _c=this._viewDefinitions.fetch();for(var i=0;i<_c.length;i++){if(_c[i].name&&_c[i].name.toLowerCase().trim()==_b.name.toLowerCase().trim()&&_c[i].__id!=_b.__id){return false;}}_9&=_b.isValid();}}}return _9;},constructor:function(_d){},createItem:function(){try{var _e=this._viewDefinitions.generateUniqueName({base_name:"View"});var _f=this._viewDefinitions.create({name:_e,description:"",scope:"*",cell_definitions:[],sort_by:"documents.name",is_system:false,created_by:this.activeUser.name,created_at:new Date(),updated_by:this.activeUser.name,updated_at:new Date()});var idx=0;_f.cell_definitions.push({column_order:idx,table_name:"documents",column_name:"state",label:"",name:"State",noresize:true,style:"",width:"18px",formatter:bfree.api.CellDefinition.formats.status});idx++;_f.cell_definitions.push({column_order:idx,table_name:"versions",column_name:"binary_content_type",label:"",name:"Content Type",noresize:true,style:"",width:"18px",formatter:bfree.api.CellDefinition.formats.icon});idx++;_f.cell_definitions.push({column_order:idx,table_name:"documents",column_name:"name",label:"Title",name:"Title",noresize:false,style:"",width:"512px",formatter:bfree.api.CellDefinition.formats.none});idx++;_f.cell_definitions.push({column_order:idx,table_name:"document_types",column_name:"name",label:"Document Type",name:"Document Type",noresize:true,width:"128px",formatter:bfree.api.CellDefinition.formats.none,style:""});idx++;_f.cell_definitions.push({column_order:idx,table_name:"versions",column_name:"version_number",label:"Version",name:"Version",noresize:true,width:"64px",formatter:bfree.api.CellDefinition.formats.none,style:""});idx++;_f.cell_definitions.push({column_order:idx,table_name:"versions",column_name:"binary_file_size",label:"Size",name:"Size",noresize:true,width:"64px",formatter:bfree.api.CellDefinition.formats.size,style:""});idx++;_f.cell_definitions.push({column_order:idx,table_name:"documents",column_name:"updated_by",label:"Owner",name:"Owner",noresize:true,width:"128px",formatter:bfree.api.CellDefinition.formats.none,style:""});idx++;this._grdViews.selectItem(_f);this._editor.focus();}catch(e){var err=new bfree.api.Error("Failed to create Document Type",e);bfree.widget.ErrorManager.handleError({error:err});}},deleteItem:function(){try{var _10=this._grdViews.selection.getFirstSelected();if(_10){if(!this._validateItems(_10)){var msg="Cannot delete View: One or more Views contain invalid data";alert(msg);return;}var msg=dojo.replace("Are you sure you want to delete the view: '{0}'?",[_10.name]);if(!confirm(msg)){return;}var idx=this._grdViews.getItemIndex(_10);this._viewDefinitions.destroy({item:_10});this._grdViews.setSelectedIndex(idx);this._editor.focus();}}catch(e){var err=new bfree.api.Error("Failed to delete View",e);bfree.widget.ErrorManager.handleError({error:err});}},destroy:function(){if(this._cmdBar){this._cmdBar.destroy();this._cmdBar=null;}if(this._grdViews){this._grdViews.destroy();this._grdViews=null;}if(this._editor){this._editor.destroy();this._editor=null;}this.inherited("destroy",arguments);},editItem:function(){try{var _11=this._grdViews.selection.getFirstSelected();if(_11){var idx=this._grdViews.getItemIndex(_11);this._viewDefinitions.clone({item:_11});this._grdViews.updateRow(idx);this._grdViews.setSelectedIndex(idx);this._editor.focus();}}catch(e){var err=new bfree.api.Error("Failed to edit View",e);bfree.widget.ErrorManager.handleError({error:err});}},isValid:function(){return (this.isDirty||this._grdAcl.store.isDirty());},onDialogClosing:function(_12){var _13=false;try{if(this._viewDefinitions.isDirty()){var msg="You have unsaved changes that will be lost. Do you wish to continue?";if(confirm(msg)){if(this._viewDefinitions!=null){this._viewDefinitions.revert();}_13=true;}}else{_13=true;}}catch(e){var err=new bfree.api.Error("Failed to close View Definitions dialog",e);bfree.widget.ErrorManager.handleError({error:err});}return _13;},postCreate:function(){this.inherited("postCreate",arguments);this._propertyDefinitions=this.library.getPropertyDefinitions();this._propertyDefinitions.refresh();this._viewDefinitions=this.library.getViewDefinitions();this._viewDefinitions.clearCache();this._cmdBar=new bfree.widget.view.CommandBar({id:"cmdBar",viewDefinitions:this._viewDefinitions,onCommand:dojo.hitch(this,this._onCommand)},this.commandBarNode);this._grdViews=new bfree.widget.view.Grid({id:"grdViews","class":"versaGridOutline versaNoHeader",viewDefinitions:this._viewDefinitions,onSelectedItem:dojo.hitch(this,this._grdViews_onSelectedItem)},this.gridNode);this._editor=new bfree.widget.view.Editor({id:"edtViewDef",viewDefinitions:this._viewDefinitions,propertyDefinitions:this._propertyDefinitions,onValueChange:dojo.hitch(this,this._onValueChange)},this.editorNode);},save:function(){try{if(!this._validateItems()){var msg="Cannot save View changes: One or more Views contain invalid data";alert(msg);return;}var _14=this._grdViews.selection.getFirstSelected();this._viewDefinitions.save({onComplete:dojo.hitch(this,this.saveOnComplete,_14)});}catch(e){var err=new bfree.api.Error("Failed to save View changes",e);bfree.widget.ErrorManager.handleError({error:err});}},saveOnComplete:function(_15){this._viewDefinitions.clearCache();this._grdViews.sort();this._grdViews.selectItem(_15);},startup:function(){this.inherited("startup",arguments);},undo:function(){try{var _16=this._grdViews.selection.getFirstSelected();var idx=(_16)?this._grdViews.getItemIndex(_16):0;this._viewDefinitions.clearCache();this._viewDefinitions.revert();this._grdViews.setSelectedIndex(idx);}catch(e){var err=new bfree.api.Error("Failed to revert changes",e);bfree.widget.ErrorManager.handleError({error:err});}}});bfree.widget.view.Administration.show=function(_17){var dlg=new bfree.widget.Dialog({id:"dlgEditViewDefs",title:"View Definitions",widgetConstructor:bfree.widget.view.Administration,widgetParams:{activeUser:_17.user,library:_17.library,zone:_17.zone},noResize:true,height:600,width:800,zIndex:1024,buttons:bfree.widget.Dialog.buttons.close,onClose:_17.onClose});dlg.startup();dlg.show();};}