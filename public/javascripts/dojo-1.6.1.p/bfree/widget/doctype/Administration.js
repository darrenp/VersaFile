/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.doctype.Administration"]){dojo._hasResource["bfree.widget.doctype.Administration"]=true;dojo.provide("bfree.widget.doctype.Administration");dojo.require("bfree.widget.Bfree");dojo.require("bfree.widget._DialogWidget");dojo.require("bfree.widget.doctype.CommandBar");dojo.require("bfree.widget.doctype.Editor");dojo.require("bfree.widget.doctype.Grid");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.declare("bfree.widget.doctype.Administration",[dijit._Widget,dijit._Templated,bfree.widget._DialogWidget],{templateString:dojo.cache("bfree/widget/doctype","template/Administration.html","<div style=\"height:100%;width:100%;\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        style=\"height:100%;width:100%;\">\n\n     <!-- Command Bar -->\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            region=\"top\"\n            splitter=\"false\"\n            style=\"padding:0;overflow:hidden;height:27px\">\n\n        <div dojoAttachPoint=\"commandBarNode\"></div>\n\n    </div>\n\n     <div   dojoType=\"dijit.layout.BorderContainer\"\n            region=\"center\"\n            design=\"sidebar\"\n            gutters=\"false\"\n            liveSplitters=\"true\"\n            style=\"padding:8px;height:100%;width:100%\">\n\n\n         <div   dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"leading\"\n                style=\"padding:0 8px 0 0;width: 256px;\">\n\n            <div dojoAttachPoint=\"gridNode\"></div>\n\n        </div>\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"true\"\n                region=\"center\"\n                class=\"highlightPane\"\n                style=\"padding:8px\">\n\n            <div dojoAttachPoint=\"editorNode\"></div>\n\n        </div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_choiceLists:null,_cmdBar:null,_editor:null,_grdDocTypes:null,_documentTypes:null,_metrics:[],activeUser:null,library:null,zone:null,_cmdBar_onCommand:function(_1){switch(_1){case bfree.widget.Bfree.Commands.NEW:this.createItem();break;case bfree.widget.Bfree.Commands.EDIT:this.editItem();break;case bfree.widget.Bfree.Commands.DELETE:this.deleteItem();break;case bfree.widget.Bfree.Commands.SAVE:this.save();break;case bfree.widget.Bfree.Commands.UNDO:this.undo();break;}},_getMetrics:function(_2){var _3=null;dojo.some(this._metrics,function(m,_4){if(m.id==_2.id){_3=m.metrics;return true;}return false;},this);return _3;},_grdDocTypes_onSelectedItems:function(_5){var _6=null;if((!_5)||(_5.length<1)){return;}_6=_5[0];this._cmdBar.set("activeItem",_6);this._editor.set("activeItem",_6);},_loadItem:function(){try{}finally{this.onWidgetLoaded();}},_validateItems:function(_7){var _8=true;for(var _9=0;_9<this._grdDocTypes.rowCount;_9++){var _a=this._grdDocTypes.getItem(_9);if(this._documentTypes.isDirty({item:_a})){if(!_7||(_7&&_7.__id!=_a.__id)){var _b=this._documentTypes.fetch();for(var i=0;i<_b.length;i++){if(_b[i].name&&_b[i].name.toLowerCase().trim()==_a.name.toLowerCase().trim()&&_b[i].__id!=_a.__id){return false;}}_8&=_a.isValid();}}}return _8;},constructor:function(_c){},createItem:function(){try{var _d=this._documentTypes.generateUniqueName({base_name:"Document Type"});var _e=this._documentTypes.create({name:_d,description:"",property_mappings:[],is_system:false,created_by:this.activeUser.name,created_at:new Date(),updated_by:this.activeUser.name,updated_at:new Date()});var _f=this._propertyDefinitions.getNameProperty();_e.property_mappings.push({property_definition_id:_f.id,choice_list_id:null,is_required:true,sort_order:0});this._grdDocTypes.selectItem(_e);this._editor.focus();}catch(e){var err=new bfree.api.Error("Failed to create Document Type",e);bfree.widget.ErrorManager.handleError({error:err});}},deleteItem:function(){var idx=0;var _10=null;var _11=false;try{var _10=this._grdDocTypes.selection.getFirstSelected();idx=this._grdDocTypes.getItemIndex(_10);if(!this._validateItems(_10)){var msg="Cannot delete Document Type: One or more Document Types contain invalid data";alert(msg);return;}var _12=this._getMetrics(_10);if((_12)&&(_12.document_count>0)){var msg=dojo.replace("Cannot delete Document Type. One or more documents are assigned to '{0}'",[_10.name]);alert(msg);return;}if(_10){var msg=dojo.replace("Are you sure you want to delete the Document Type: '{0}'?",[_10.name]);if(!confirm(msg)){return;}this._documentTypes.destroy({item:_10});}}catch(e){_11=true;var err=new bfree.api.Error("Failed to delete Document Type",e);bfree.widget.ErrorManager.handleError({error:err});}finally{if(_11){this._grdDocTypes._onRevert();}this._grdDocTypes.setSelectedIndex(idx);this._editor.focus();}},destroy:function(){if(this._cmdBar){this._cmdBar.destroyRecursive(false);this._cmdBar=null;}if(this._grdDocTypes){this._grdDocTypes.destroyRecursive();this._grdDocTypes=null;}if(this._editor){this._editor.destroyRecursive();this._editor=null;}},editItem:function(){try{var _13=this._grdDocTypes.selection.getFirstSelected();if(_13){var idx=this._grdDocTypes.getItemIndex(_13);this._documentTypes.clone({item:_13});this._grdDocTypes.updateRow(idx);this._grdDocTypes.setSelectedIndex(idx);this._editor.focus();}}catch(e){}},isValid:function(){return true;},onDialogClosing:function(_14){var _15=false;try{if(this._documentTypes.isDirty()){var msg="You have unsaved changes that will be lost. Do you wish to continue?";if(confirm(msg)){if(this._documentTypes!=null){this._documentTypes.revert();}_15=true;}}else{_15=true;}}catch(e){var err=new bfree.api.Error("Failed to close Document Types dialog",e);bfree.widget.ErrorManager.handleError({error:err});}return _15;},postCreate:function(){this.inherited("postCreate",arguments);this._propertyDefinitions=this.library.getPropertyDefinitions();this._propertyDefinitions.refresh();this._choiceLists=this.library.getChoiceLists();this._choiceLists.refresh();this._documentTypes=this.library.getDocumentTypes();this._documentTypes.clearCache();this._cmdBar=new bfree.widget.doctype.CommandBar({id:"cmdBar",documentTypes:this._documentTypes,onCommand:dojo.hitch(this,this._cmdBar_onCommand)},this.commandBarNode);this._grdDocTypes=new bfree.widget.doctype.Grid({id:"grdDocTypes","class":"versaGridOutline versaNoHeader",documentTypes:this._documentTypes,onSelectedItems:dojo.hitch(this,this._grdDocTypes_onSelectedItems)},this.gridNode);this._editor=new bfree.widget.doctype.Editor({library:this.library,zone:this.zone,choiceLists:this._choiceLists,documentTypes:this._documentTypes,propertyDefinitions:this._propertyDefinitions},this.editorNode);this._metrics=this._documentTypes.getMetrics({zone:this.zone,library:this.library});},save:function(){try{if(!this._validateItems()){var msg="Cannot save Document Type changes: One or more Document Types contain invalid data";alert(msg);return;}var _16=this._grdDocTypes.selection.getFirstSelected();this._documentTypes.save({onComplete:dojo.hitch(this,this.saveOnComplete,_16)});}catch(e){var err=new bfree.api.Error("Failed to save Document Type changes",e);bfree.widget.ErrorManager.handleError({error:err});}},saveOnComplete:function(_17){this._documentTypes.clearCache();this._grdDocTypes.sort();this._grdDocTypes.selectItem(_17);},startup:function(){this.inherited("startup",arguments);this._grdDocTypes.startup();this._grdDocTypes.setSelectedIndex(0);setTimeout(bfree.widget.doctype.Administration._loadFnRef(this),10);},undo:function(){try{var _18=this._grdDocTypes.selection.getFirstSelected();this._documentTypes.clearCache();this._documentTypes.revert();if(_18){var idx=this._grdDocTypes.getItemIndex(_18);this._grdDocTypes.setSelectedIndex(idx);}}catch(e){var err=new bfree.api.Error("Failed to revert changes",e);bfree.widget.ErrorManager.handleError({error:err});}}});bfree.widget.doctype.Administration._loadFnRef=function(_19){return (function(){_19._loadItem();});};bfree.widget.doctype.Administration.show=function(_1a){var dlg=new bfree.widget.Dialog({id:"dlgEditDocTypes",title:"Document Types",widgetConstructor:bfree.widget.doctype.Administration,widgetParams:{activeUser:_1a.user,library:_1a.library,zone:_1a.zone},noResize:true,height:480,width:800,zIndex:1024,buttons:bfree.widget.Dialog.buttons.close,onClose:_1a.onClose});dlg.startup();dlg.show();};}