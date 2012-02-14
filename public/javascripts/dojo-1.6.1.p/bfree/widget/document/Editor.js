/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.document.Editor"]){dojo._hasResource["bfree.widget.document.Editor"]=true;dojo.provide("bfree.widget.document.Editor");dojo.require("bfree.widget.doctype.InstanceEditor");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.declare("bfree.widget.document.Editor",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("bfree/widget/document","template/Editor.html","<div style=\"height:100%;width:100%\">\n\n<div    dojoAttachPoint=\"mainNode\"\n        dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        style=\"padding:0;height:100%;width:100%\">\n\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            splitter=\"false\"\n            region=\"center\"\n            style=\"padding:0 8px 8px 8px\">\n\n        <div dojoAttachPoint=\"docTypeEditorNode\"></div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_choiceLists:null,_documentTypes:null,_docTypeEditor:null,_propertyDefinitions:null,activeItem:null,library:null,_btnAdd_onClick:function(_1){this.onSubmit();},_docTypeEditor_onChange:function(_2){var _3=this.activeItem.state;if(_2){if(_2.id!=this.activeItem.document_type_id){this.activeItem.document_type_id=_2.id;this.activeItem.validate({library:this.library});}this._docTypeEditor.setValues(this.activeItem);}else{this.activeItem.document_type_id=null;this.activeItem.validate({library:this.library});}if(_3!=this.activeItem.state){this.onValidChange(this.activeItem);}},_docTypeEditor_onValueChange:function(id,_4){var _5=id.replace("documents.","");if(this.activeItem[_5]!=_4){var _6=this.activeItem.state;this.activeItem[_5]=_4;this.activeItem.validate({library:this.library});if(_6!=this.activeItem.state){this.onValidChange(this.activeItem);}}},_setActiveItemAttr:function(_7){this.activeItem=_7;if(this.activeItem){var _8=this._documentTypes.fetchById({id:_7.document_type_id});this._docTypeEditor.set("activeItem",_8);this._docTypeEditor.set("disabled",this.activeItem.getState(bfree.api.Document.states.CHECKED_IN));}},constructor:function(_9){},destroy:function(){if(this._docTypeEditor){this._docTypeEditor.destroy();this._docTypeEditor=null;}this.inherited("destroy",arguments);},focus:function(){},onSubmit:function(){},onValidChange:function(_a){},postCreate:function(){this.inherited("postCreate",arguments);this._documentTypes=this.library.getDocumentTypes();this._documentTypes.refresh();this._propertyDefinitions=this.library.getPropertyDefinitions();this._propertyDefinitions.refresh();this._choiceLists=this.library.getChoiceLists();this._choiceLists.refresh();this._docTypeEditor=new bfree.widget.doctype.InstanceEditor({id:"doctypeeditor1",choiceLists:this._choiceLists,documentTypes:this._documentTypes,propertyDefinitions:this._propertyDefinitions,style:"height:100%",onChange:dojo.hitch(this,this._docTypeEditor_onChange),onValueChange:dojo.hitch(this,this._docTypeEditor_onValueChange)},this.docTypeEditorNode);},resize:function(){this.inherited("resize",arguments);this.mainNode.resize();},startup:function(){this.inherited("startup",arguments);}});}