/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.document.PropertyEditor"]){dojo._hasResource["bfree.widget.document.PropertyEditor"]=true;dojo.provide("bfree.widget.document.PropertyEditor");dojo.require("bfree.widget._DialogWidget");dojo.require("bfree.widget.Dialog");dojo.require("bfree.widget.document.SystemInfo");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("bfree.widget.document.SystemInfo");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.declare("bfree.widget.document.PropertyEditor",[dijit._Widget,dijit._Templated,bfree.widget._DialogWidget],{templateString:dojo.cache("bfree/widget/document","template/PropertyEditor.html","<div style=\"height:100%;width:100%;\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        style=\"padding:0px 8px 4px 8px;height:100%;width:100%;\">\n\n     <div   dojoType=\"dijit.layout.ContentPane\"\n            region=\"top\"\n            splitter=\"false\"\n            style=\"overflow:hidden;height:32px\">\n\n         <div dojoAttachPoint=\"headerNode\"></div>\n\n    </div>\n\n    <div    dojoType=\"dijit.layout.BorderContainer\"\n            design=\"headline\"\n            gutters=\"false\"\n            splitter=\"false\"\n            region=\"center\">\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"center\"\n                splitter=\"true\"\n                class=\"highlightPane\"\n                style=\"padding:8px\">\n\n           <div dojoAttachPoint=\"editorNode\"></div>\n\n        </div>\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                region=\"bottom\"\n                splitter=\"false\"\n                style=\"padding:8px;overflow:hidden;height:128px\">\n\n             <div dojoAttachPoint=\"infoNode\"></div>\n\n        </div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_document:null,_editor:null,_wdgHeader:null,_wdgInfo:null,activeReference:null,references:null,library:null,zone:null,_doCancel:function(){var _1=false;try{_1=true;}catch(e){var _2=new bfree.api.Error("Failed to revert document",e);bfree.widget.ErrorManager.handleError({error:_2});}return _1;},_doSave:function(){var _3=false;try{if(!this._document.isValid({library:this.library})){throw new Error("One or more properties are missing or invalid");}if(this.library.getReferences().isDirty({item:this.activeReference})){this.library.getReferences().save();this.library.getDocuments().invalidate(this.activeReference.document_id);}_3=true;}catch(e){var _4=new bfree.api.Error("Failed to save document",e);bfree.widget.ErrorManager.handleError({error:_4});this.library.getDocuments().clone({item:this._document});if(e.status==404){_3=this._doCancel();this.library.getDocuments().store.onDelete(this._document);}}return _3;},_loadItem:function(){this.library.getDocuments().refreshAsync({scope:this,identity:this.activeReference.document_id,onItem:this._onItemLoaded,onError:this._onItemError});},_onItemError:function(e){try{var _5=new bfree.api.Error("Failed to load document",e);bfree.widget.ErrorManager.handleError({error:_5});}finally{this.onWidgetLoaded();}},_onItemLoaded:function(_6){try{this._document=_6;this.library.getDocuments().clone({item:this._document});var _7=this.library.getDocumentTypes().fetchById({id:this._document.document_type_id});this._wdgHeader.set("activeItem",this._document);this._editor.set("activeItem",this._document);this._wdgInfo.set("activeItem",this._document);}finally{this.onWidgetLoaded();}},_onValueChange:function(id,_8){var _9=id.replace("documents.","");if(!this._document.valueEquals(_9,_8)){this.library.getDocuments().setValue(this._document,_9,_8);this.library.getReferences().setValue(this.activeReference,_9,_8);this._wdgHeader.set("activeItem",this._document);this.onValueChange();}},constructor:function(_a){},destroy:function(){if(this._editor){this._editor.destroy();this._editor=null;}this.inherited("destroy",arguments);},isValid:function(){this._document.validate({library:this.library});return ((this.library.getDocuments().isDirty({item:this._document}))&&(!this._document.getState(bfree.api.Document.states.INVALID)));},onDialogClosing:function(_b){var _c=false;try{this.returnValue=this.references;_c=(_b==bfree.widget.Dialog.dialogResult.ok)?this._doSave():this._doCancel();}catch(e){var _d=new bfree.api.Error("Failed to close 'Edit Document' dialog",e);bfree.widget.ErrorManager.handleError({error:_d});}finally{this.library.getDocuments().revert();}return _c;},_onValidChange:function(){this.onValueChange();},postCreate:function(){this.inherited("postCreate",arguments);this.activeReference=this.references[0];this._wdgHeader=new bfree.widget.document.Header({},this.headerNode);var _e=this.library.getChoiceLists();_e.refresh();var _f=this.library.getPropertyDefinitions();_f.refresh();this._editor=new bfree.widget.document.Editor({id:"editor1",library:this.library,onValidChange:dojo.hitch(this,this._onValidChange),onSubmit:dojo.hitch(this,this._onSubmit),onValueChange:dojo.hitch(this,this._onValueChange)},this.editorNode);this._wdgInfo=new bfree.widget.document.SystemInfo({id:"wdgDocSysInfo1"},this.infoNode);},startup:function(){this.inherited("startup",arguments);setTimeout(bfree.widget.document.PropertyEditor._loadFnRef(this),10);}});bfree.widget.document.PropertyEditor._loadFnRef=function(_10){return (function(){_10._loadItem();});};bfree.widget.document.PropertyEditor.show=function(_11){if((!_11.items)||(_11.items.length<1)){throw new Error("No documents selected");}var _12=_11.items[0];var dlg=new bfree.widget.Dialog({id:"dlgEditDocument",title:"Edit Document: "+_12.name.display_limit(32),widgetConstructor:bfree.widget.document.PropertyEditor,widgetParams:{user:_11.user,references:_11.items,library:_11.library,zone:_11.zone},noResize:true,height:480,width:400,zIndex:1024,buttons:bfree.widget.Dialog.buttons.ok|bfree.widget.Dialog.buttons.cancel,onClose:_11.onClose});dlg.startup();dlg.show();};}