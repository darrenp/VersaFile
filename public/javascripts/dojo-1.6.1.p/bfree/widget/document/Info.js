/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.document.Info"]){dojo._hasResource["bfree.widget.document.Info"]=true;dojo.provide("bfree.widget.document.Info");dojo.require("bfree.IconManager");dojo.require("bfree.widget.PropertyTable");dojo.require("bfree.api.Preferences");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("versa.api.Formatter");dojo.declare("bfree.widget.document.Info",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("bfree/widget/document","template/Info.html","<div style=\"padding:4px 0 0 72px;position:relative;height:100%;width:100%\">\n\n    <div style=\"position:absolute;top:8px;left:8px;height:48px;width:48px;\">\n        <img dojoAttachPoint=\"typeIconNode\" src=\"\" height=\"48\" width=\"48\"/>\n        <img dojoAttachPoint=\"stateIconNode\" src=\"/images/loading/loading24.gif\" height=\"24\"width=\"24\" style=\"position:absolute;bottom:0;right:0\">\n    </div>\n\n    <div class=\"dijitBoldLabel dijitLargeLabel dijitDarkLabel\" dojoAttachPoint=\"nameNode\" style=\"margin-right:80px\"></div>\n    <div dojoAttachPoint=\"tableNode\"></div>\n\n</div>\n"),widgetsInTemplate:false,_destroyed:false,_labels:null,_rowCount:3,_propertyCount:12,_tblProperties:null,items:null,library:null,preferences:null,__onDocumentLoadError:function(_1){},__onDocumentLoad:function(_2){var _3=this._generateSingleItem(_2);this._loadData(_3);this.setBusy(false);if(this.onComplete){this.onComplete(this.items);}},_generateMultiItem:function(_4){var _5=this._initData();var _6=0;dojo.forEach(_4,function(_7,_8){_6+=_7.binary_file_size;},this);_5[0].label="Size";_5[0].value=bfree.api.Utilities.readablizeBytes({bytes:_6});return _5;},_generateSingleItem:function(_9){var _a=this._initData();_a[0].label="Type";_a[0].value=_9.document_type_name;_a[3].label="Version";_a[3].value=_9.getFullVersion();_a[6].label="Checked Out By";_a[6].value=(_9.getState(bfree.api.Document.states.CHECKED_OUT)?_9.checked_out_by:"");_a[9].label=(_9.isDeleted()?"Deletion Date":"Last Modified Date");_a[9].value=versa.api.Formatter.formatDateTime(_9.updated_at);var _b=this.library.getDocumentTypes().fetchById({id:_9.document_type_id});var _c=1;var _d=0;dojo.every(_b.property_mappings,function(_e){var _f=0;var _10=this.library.getPropertyDefinitions().fetchById({id:_e.property_definition_id});if(!(_10.is_system||_10.isTypeText())){var _11=_9[_10.column_name];_11=bfree.api.PropertyMapping.formatValue(_10,_11);_f=(_c+(_d*this._rowCount));_a[_f].label=_10.name.display_limit(10);_a[_f].value=_11;_d++;if(_d>this._rowCount){_c++;_d=0;}}return (_f<this._propertyCount);},this);return _a;},_initData:function(){var _12=new Array();for(var i=0;i<this._propertyCount;i++){_12.push({label:"",value:""});}return _12;},_loadData:function(_13){if(this._destroyed){return;}dojo.forEach(this._labels,function(_14,idx){_14.reset(_13[idx].label,_13[idx].value);},this);this._tblProperties.refresh();},_loadItems:function(){var _15="";var _16="";var _17="";if(this._destroyed){return;}var _18=(dojo.isArray(this.items)&&this.items.length>1);if(_18){_15="/images/mimetypes/48/multi-document.png";_16="Multiple documents selected";_17=dojo.replace("{0} documents selected",[this.items.length]);}else{var _19=this.items[0];_15=bfree.api.Document.getIconUrl(_19.binary_content_type,48);_16=_19.binary_content_type;_17=_19.name;}dojo.attr(this.typeIconNode,"src",_15);dojo.attr(this.typeIconNode,"alt",_16);this.nameNode.innerHTML=_17;this._labels[0].reset("Loading...","");this._tblProperties.refresh();if(_18){var _1a=this._generateMultiItem(this.items);this._loadData(_1a);this.setBusy(false);}else{dojo.forEach(this.items,function(_1b){this.library.getDocuments().refreshAsync({scope:this,invalidate:true,identity:_1b.document_id,onItem:this.__onDocumentLoad,onError:this.__onDocumentLoadError});},this);}},_preload:function(){var _1c="";var _1d="";var _1e="";if(this._destroyed){return;}var _1f=(dojo.isArray(this.items)&&this.items.length>1);if(_1f){_1c="/images/mimetypes/48/multi-document.png";_1d="Multiple documents selected";_1e=dojo.replace("{0} documents selected",[this.items.length]);}else{var _20=this.items[0];_1c=bfree.api.Document.getIconUrl(_20.binary_content_type,48);_1d=_20.binary_content_type;_1e=_20.name;}dojo.attr(this.typeIconNode,"src",_1c);dojo.attr(this.typeIconNode,"alt",_1d);this.nameNode.innerHTML=_1e;this._labels[0].reset("Loading...","");this._tblProperties.refresh();},constructor:function(_21){this._itemMap=new Object();this._labels=new Array();},destroy:function(){this._destroyed=true;this.destroyDescendants();if(this._tblProperties){this._tblProperties.destroyRecursive();this._tblProperties=null;}this.inherited("destroy",arguments);},errorItem:function(_22,_23){var _24="/images/icons/24/error.png";var _25="An error occurred";dojo.attr(this.stateIconNode,"src",_24);this._labels[0].reset("Failed to load","");this._tblProperties.refresh();},load:function(_26){if(this._destroyed){return;}this.items=_26;var _27=(dojo.isArray(this.items)&&this.items.length>1);if(_27){var _28=this._generateMultiItem(_26);this._loadData(_28);}else{dojo.forEach(this.items,function(_29){var _2a=this._generateSingleItem(_29);this._loadData(_2a);},this);}this.setBusy(false);},postCreate:function(){this.inherited("postCreate",arguments);this._tblProperties=new bfree.widget.PropertyTable({customClass:"versafoot",showLabels:true,cols:3,labelWidth:112,style:""},this.tableNode);for(var i=0;i<this._propertyCount;i++){this._labels.push(new bfree.widget.Label({label:"",value:""}));this._tblProperties.addChild(this._labels[i]);}},setBusy:function(_2b){if(this._destroyed){return;}(_2b)?dojo.style(this.stateIconNode,{display:"block"}):dojo.style(this.stateIconNode,{display:"none"});},startup:function(){this.inherited("startup",arguments);this._tblProperties.startup();this._preload();}});}