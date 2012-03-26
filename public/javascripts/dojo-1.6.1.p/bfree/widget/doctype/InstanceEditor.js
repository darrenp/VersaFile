/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.doctype.InstanceEditor"]){dojo._hasResource["bfree.widget.doctype.InstanceEditor"]=true;dojo.provide("bfree.widget.doctype.InstanceEditor");dojo.require("bfree.widget.PropertyTable");dojo.require("bfree.widget.doctype.properties.Editor");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.layout.ContentPane");dojo.declare("bfree.widget.doctype.InstanceEditor",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("bfree/widget/doctype","template/InstanceEditor.html","<div style=\"height:100%;width:100%\">\n\n<div    dojoAttachPoint=\"mainNode\"\n        dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        liveSplitters=\"true\"\n        style=\"height:100%;width:100%\">\n\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            splitter=\"false\"\n            region=\"top\"\n            style=\"padding:8px 0 8px 0;height:24px;\">\n\n        <div dojoAttachPoint=\"tableNode\"></div>\n\n    </div>\n\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            splitter=\"false\"\n            region=\"center\"\n            class=\"highlightPane\">\n\n        <div dojoAttachPoint=\"editorNode\"></div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_cmbDocTypes:null,_propertyEditor:null,activeItem:null,choiceLists:null,disabled:false,documentTypes:null,propertyDefinitions:null,disableDocumentType:false,_onChange:function(_1){if(String.isBlank(_1)){this.activeItem=null;}else{this.activeItem=this.documentTypes.fetchById({id:_1});}if(this._propertyEditor){this._propertyEditor.destroy();this._propertyEditor=null;}this._propertyEditor=new bfree.widget.doctype.properties.Editor({id:"propertyEditor1",choiceLists:this.choiceLists,propertyDefinitions:this.propertyDefinitions,onLoaded:dojo.hitch(this,this._onLoaded),onValueChange:dojo.hitch(this,this._onValueChange)});this._propertyEditor.placeAt(this.editorNode);if(this.activeItem){this._propertyEditor.set("activeItem",this.activeItem);}this._propertyEditor.set("disabled",this.disabled);this.onChange(this.activeItem);},_onLoaded:function(){this.onChange(this.activeItem);},_onValueChange:function(id,_2){this.onValueChange(id,_2);},_setActiveItemAttr:function(_3){this._cmbDocTypes.reset();this.activeItem=_3;this._cmbDocTypes.set("value",_3.id);this._cmbDocTypes.set("disabled",(this.activeItem==null)||this.disableDocumentType);},_setDisabledAttr:function(_4){this.disabled=_4;this._cmbDocTypes.set("disabled",this.disabled||this.disableDocumentType);if(this._propertyEditor){this._propertyEditor.set("disabled",this.disabled);}},constructor:function(_5){},destroy:function(){if(this._tblProperties){this._tblProperties.destroyDescendants();this._tblProperties.destroy();this._tblProperties=null;}if(this._propertyEditor){this._propertyEditor.destroy();this._propertyEditor=null;}this.inherited("destroy",arguments);},focus:function(){},onChange:function(){},onValueChange:function(){},postCreate:function(){this.inherited("postCreate",arguments);this._tblProperties=new bfree.widget.PropertyTable({id:"tblDocTypes1",customClass:"versa",showLabels:true,cols:1,labelWidth:88,style:"width:100%"},this.tableNode);this._cmbDocTypes=new dijit.form.FilteringSelect({id:"cmbDocTypes",label:"Document Type",store:this.documentTypes.store,searchAttr:"name",disabled:true,onChange:dojo.hitch(this,this._onChange)});this._tblProperties.addChild(this._cmbDocTypes);},resize:function(){this.inherited("resize",arguments);this.mainNode.resize();},setValues:function(_6){this._propertyEditor.setValues(_6);},startup:function(){this.inherited("startup",arguments);}});}