/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.view.Administration"]){dojo._hasResource["bfree.widget.view.Administration"]=true;dojo.provide("bfree.widget.view.Administration");dojo.require("bfree.widget._DialogWidget");dojo.require("bfree.widget.ErrorManager");dojo.require("bfree.widget.view.CommandBar");dojo.require("bfree.widget.view.Grid");dojo.require("bfree.widget.view.Editor");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.declare("bfree.widget.view.Administration",[dijit._Widget,dijit._Templated,bfree.widget._DialogWidget],{templateString:dojo.cache("bfree/widget/view","template/Administration.html","<div style=\"height:100%;width:100%;\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        style=\"height:100%;width:100%;\">\n\n     <!-- Command Bar -->\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            region=\"top\"\n            splitter=\"false\"\n            style=\"padding:0;overflow:hidden;height:27px\">\n\n        <div dojoAttachPoint=\"commandBarNode\"></div>\n\n    </div>\n\n     <div   dojoType=\"dijit.layout.BorderContainer\"\n            region=\"center\"\n            design=\"sidebar\"\n            gutters=\"false\"\n            liveSplitters=\"true\"\n            style=\"padding:8px;height:100%;width:100%\">\n\n\n         <div   dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"leading\"\n                style=\"padding:0 8px 0 0;width: 256px;\">\n\n            <div dojoAttachPoint=\"gridNode\"></div>\n\n        </div>\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"true\"\n                region=\"center\"\n                class=\"highlightPane\"\n                style=\"padding:8px\">\n\n            <div dojoAttachPoint=\"editorNode\"></div>\n\n        </div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_cmdBar:null,_grdViews:null,_editor:null,_propertyDefinitions:null,_viewDefinitions:null,activeUser:null,library:null,doRefresh:false,zone:null,_onCommand:function(_1){switch(_1){case bfree.widget.Bfree.Commands.NEW:this.createItem();break;case bfree.widget.Bfree.Commands.EDIT:this.editItem();break;case bfree.widget.Bfree.Commands.DELETE:this.deleteItem();break;case bfree.widget.Bfree.Commands.SAVE:this.save();break;case bfree.widget.Bfree.Commands.UNDO:this.undo();break;}},_grdViews_onSelectedItems:function(_2){var _3=null;if((!_2)||(_2.length<1)){return;}_3=_2[0];this._cmdBar.set("activeItem",_3);this._editor.set("activeItem",_3);},_loadItem:function(){try{}finally{this.onWidgetLoaded();}},_onValueChange:function(_4,_5,_6,_7){var _8=this._grdViews.getItemIndex(_4);this._grdViews.updateRow(_8);},_validateItems:function(_9){var _a=true;for(var _b=0;_b<this._grdViews.rowCount;_b++){var _c=this._grdViews.getItem(_b);if(this._viewDefinitions.isDirty({item:_c})){if(!_9||(_9&&_9.__id!=_c.__id)){var _d=this._viewDefinitions.fetch();for(var i=0;i<_d.length;i++){if(_d[i].name&&_d[i].name.toLowerCase().trim()==_c.name.toLowerCase().trim()&&_d[i].__id!=_c.__id){return false;}}_a&=_c.isValid();}}}return _a;},constructor:function(_e){},createItem:function(){try{var _f=this._viewDefinitions.generateUniqueName({base_name:"View"});var _10=this._viewDefinitions.create({name:_f,description:"",scope:"*",cell_definitions:[],sort_by:"documents.name",is_system:false,created_by:this.activeUser.name,created_at:new Date(),updated_by:this.activeUser.name,updated_at:new Date(),is_template:true});var idx=0;_10.cell_definitions.push({column_order:idx,table_name:"documents",column_name:"state",label:"",name:"State",noresize:true,style:"",width:"18px",formatter:bfree.api.CellDefinition.formats.status});idx++;_10.cell_definitions.push({column_order:idx,table_name:"versions",column_name:"binary_content_type",label:"",name:"Content Type",noresize:true,style:"",width:"18px",formatter:bfree.api.CellDefinition.formats.icon});idx++;_10.cell_definitions.push({column_order:idx,table_name:"documents",column_name:"name",label:"Title",name:"Title",noresize:false,style:"",width:"auto",formatter:bfree.api.CellDefinition.formats.none});idx++;_10.cell_definitions.push({column_order:idx,table_name:"document_types",column_name:"name",label:"Document Type",name:"Document Type",noresize:false,width:"128px",formatter:bfree.api.CellDefinition.formats.none,style:""});idx++;_10.cell_definitions.push({column_order:idx,table_name:"versions",column_name:"version_number",label:"Version",name:"Version",noresize:false,width:"64px",formatter:bfree.api.CellDefinition.formats.none,style:""});idx++;_10.cell_definitions.push({column_order:idx,table_name:"versions",column_name:"binary_file_size",label:"Size",name:"Size",noresize:false,width:"64px",formatter:bfree.api.CellDefinition.formats.size,style:""});idx++;_10.cell_definitions.push({column_order:idx,table_name:"documents",column_name:"updated_by",label:"Owner",name:"Owner",noresize:false,width:"128px",formatter:bfree.api.CellDefinition.formats.none,style:""});idx++;this._grdViews.selectItem(_10);this._editor.focus();}catch(e){var err=new bfree.api.Error("Failed to create Document Type",e);bfree.widget.ErrorManager.handleError({error:err});}},deleteItem:function(){try{var _11=this._grdViews.selection.getFirstSelected();if(_11){if(!this._validateItems(_11)){var msg="Cannot delete View: One or more Views contain invalid data";alert(msg);return;}var msg=dojo.replace("Are you sure you want to delete the view: '{0}'?",[_11.name]);if(!confirm(msg)){return;}var idx=this._grdViews.getItemIndex(_11);this._viewDefinitions.destroy({item:_11});this._grdViews.setSelectedIndex(idx);this._editor.focus();this.doRefresh=true;}}catch(e){var err=new bfree.api.Error("Failed to delete View",e);bfree.widget.ErrorManager.handleError({error:err});}},destroy:function(){if(this._cmdBar){this._cmdBar.destroy();this._cmdBar=null;}if(this._grdViews){this._grdViews.destroy();this._grdViews=null;}if(this._editor){this._editor.destroy();this._editor=null;}this.inherited("destroy",arguments);},editItem:function(){try{var _12=this._grdViews.selection.getFirstSelected();if(_12){var idx=this._grdViews.getItemIndex(_12);this._viewDefinitions.clone({item:_12});this._grdViews.updateRow(idx);this._grdViews.setSelectedIndex(idx);this._editor.focus();}}catch(e){var err=new bfree.api.Error("Failed to edit View",e);bfree.widget.ErrorManager.handleError({error:err});}},isValid:function(){return (this.isDirty||this._grdAcl.store.isDirty());},onDialogClosing:function(_13){var _14=false;try{if(this._viewDefinitions.isDirty()){var msg="You have unsaved changes that will be lost. Do you wish to continue?";if(confirm(msg)){if(this._viewDefinitions!=null){this._viewDefinitions.revert();}_14=true;}}else{_14=true;}this.returnValue=this.doRefresh;}catch(e){var err=new bfree.api.Error("Failed to close View Definitions dialog",e);bfree.widget.ErrorManager.handleError({error:err});}return _14;},postCreate:function(){this.inherited("postCreate",arguments);this._propertyDefinitions=this.library.getPropertyDefinitions();this._propertyDefinitions.refresh();this._viewDefinitions=this.library.getViewDefinitions();this._viewDefinitions.clearCache();this._cmdBar=new bfree.widget.view.CommandBar({id:"cmdBar",viewDefinitions:this._viewDefinitions,onCommand:dojo.hitch(this,this._onCommand)},this.commandBarNode);this._grdViews=new bfree.widget.view.Grid({id:"grdViews","class":"versaGridOutline versaNoHeader",viewDefinitions:this._viewDefinitions,onSelectedItems:dojo.hitch(this,this._grdViews_onSelectedItems)},this.gridNode);this._editor=new bfree.widget.view.Editor({id:"edtViewDef",viewDefinitions:this._viewDefinitions,propertyDefinitions:this._propertyDefinitions,onValueChange:dojo.hitch(this,this._onValueChange)},this.editorNode);},save:function(){try{if(!this._validateItems()){var msg="Cannot save View changes: One or more Views contain invalid data";alert(msg);return;}var _15=this._grdViews.selection.getFirstSelected();this._viewDefinitions.save({onComplete:dojo.hitch(this,this.saveOnComplete,_15)});}catch(e){var err=new bfree.api.Error("Failed to save View changes",e);bfree.widget.ErrorManager.handleError({error:err});}},saveOnComplete:function(_16){this._viewDefinitions.clearCache();this._grdViews.sort();this._grdViews.selectItem(_16);this.doRefresh=true;},startup:function(){this.inherited("startup",arguments);this._grdViews.startup();this._grdViews.setSelectedIndex(0);setTimeout(bfree.widget.view.Administration._loadFnRef(this),10);},undo:function(){try{var _17=this._grdViews.selection.getFirstSelected();var idx=(_17)?this._grdViews.getItemIndex(_17):0;this._viewDefinitions.clearCache();this._viewDefinitions.revert();this._grdViews.setSelectedIndex(idx);}catch(e){var err=new bfree.api.Error("Failed to revert changes",e);bfree.widget.ErrorManager.handleError({error:err});}}});bfree.widget.view.Administration._loadFnRef=function(_18){return (function(){_18._loadItem();});};bfree.widget.view.Administration.show=function(_19){var dlg=new bfree.widget.Dialog({id:"dlgEditViewDefs",title:"View Administration",widgetConstructor:bfree.widget.view.Administration,widgetParams:{activeUser:_19.user,library:_19.library,zone:_19.zone},noResize:true,height:600,width:800,zIndex:1024,buttons:bfree.widget.Dialog.buttons.close,onClose:_19.onClose});dlg.startup();dlg.show();};}