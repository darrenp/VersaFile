/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.propdef.PropertyEditor"]){dojo._hasResource["bfree.widget.propdef.PropertyEditor"]=true;dojo.provide("bfree.widget.propdef.PropertyEditor");dojo.require("bfree.EditorHelper");dojo.require("dijit._Templated");dojo.require("dijit._Widget");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.require("dojox.layout.ContentPane");dojo.declare("bfree.widget.propdef.PropertyEditor",[dijit._Widget,dijit._Templated],{templateString:null,templateString:dojo.cache("bfree/widget/propdef","template/PropertyEditor.html","<div style=\"height:100%;position:relative;width:100%;\">\n\n<div \tdojoType=\"dijit.layout.BorderContainer\"\n\t\tdojoAttachPoint=\"pneMain\"\n\t\tdesign=\"headline\"\n\t\tgutters=\"false\"\t \n\t\tstyle=\"height:100%;padding:0;width:100%\">\n\t\t\t\n\t<div \tdojoType=\"dijit.layout.ContentPane\"\n\t\t\tdojoAttachPoint=\"pneDocTypes\"\t\t\t\t\t\n\t\t\tregion=\"top\" \n\t\t\tsplitter=\"false\"\n\t\t\tstyle=\"height:28px;padding:4px 8px 0 88px;position:relative\">\n\t\t\n\t\t<label class=\"editorLabel darkLabel\" for=\"cmbDocTypesNode\" style=\"position:absolute;left:0px;top:8px\">Document Type:</label>\n\t\t<select dojoAttachPoint=\"cmbDocTypesNode\"></select>\n\t\t\t\t\t\t\t\n\t</div>\n\t\t\t\t\n\t<div \tdojoType=\"dijit.layout.ContentPane\"\t\t\t\t\t\t\n\t\t\tregion=\"center\" \n\t\t\tsplitter=\"false\"\n\t\t\tstyle=\"background:#EEEEEE;border:solid 1px #C0C0C0;padding:0\">\n\t\t\n\t\t<div dojoAttachPoint=\"pneEditorNode\"></div>\n\t\n\t</div>\t\t\t\n\t\t\t\n</div>\n\n</div>\n"),widgetsInTemplate:true,zone:null,hideDocTypes:false,documentTypes:null,documents:null,library:null,documentType:null,valueCache:null,_cmbDocTypes:null,_pneEditor:null,_cacheValues:function(){var _1=dijit.byId("editorForm");if(!_1){return;}this.valueCache=new Object();var _2=_1.getDescendants();dojo.forEach(_2,function(_3){this.valueCache[_3.id]=_3.value;},this);},_reloadValues:function(){if(!this.valueCache){return;}for(var _4 in this.valueCache){var _5=this.valueCache[_4];if(!_5){continue;}try{var _6=dijit.byId(_4);if(!_6){continue;}if(!_6.set){continue;}_5=bfree.EditorHelper.formatValueForWidget({widget:_6,value:_5});_6.set("value",_5);}catch(e){}}},_cmbDocTypes_onChange:function(_7){var _8=_7;this._cacheValues();if(this.parent){this.parent.documentType=this.documentTypes.fetchById({id:_8});}var _9=dojo.string.substitute("/zones/${0}/libraries/${1}/document_types/${2}/editor.html",[this.zone.subdomain,this.library.id,_8]);this._pneEditor.attr("href",_9);},_pneEditor_onLoad:function(){this._reloadValues();if(this.parent&&this.parent._wdgFileItem){this.parent._setDefaultValues(this.parent._wdgFileItem.item);}},copyProperties:function(_a){var _b=_a.document;var _c=dijit.byId("editorForm");var _d=_c.getDescendants();var _e=this._cmbDocTypes.attr("value");_b.document_type_id=_e;dojo.forEach(_d,function(_f){var d=_b;var _10=bfree.EditorHelper.formatValueFromWidget({widget:_f});if(!_f.ignoreValue){this.documents.setValue(_b,_f.id,_10);}},this);},focus:function(){var _11=dijit.byId("editorForm");var _12=_11.getDescendants();if(_12.length>0){_12[0].focus();if(_12[0].textbox){_12[0].textbox.select();}}},postCreate:function(){this.inherited("postCreate",arguments);if(this.hideDocTypes){this.pneDocTypes._setStyleAttr({visibility:"collapse",height:"0"});}this._cmbDocTypes=new dijit.form.FilteringSelect({query:{},searchAttr:"name",store:this.documentTypes.store,promptMessage:"Select a document type",style:"font-size:11px;width:100%;position: relative;right: -6px;",onChange:dojo.hitch(this,this._cmbDocTypes_onChange)},this.cmbDocTypesNode);this._cmbDocTypes.startup();this._pneEditor=new dojox.layout.ContentPane({id:"editorPane",baseClass:"bfree",extractContent:false,style:"overflow-x:hidden;overflow-y:auto;padding:0;visibility:collapse;",onLoad:dojo.hitch(this,this._pneEditor_onLoad)},this.pneEditorNode);if(!this.documentType){if(this.user.document_type_id){this.documentType=this.documentTypes.fetchById({id:this.user.document_type_id});}else{var _13=this.documentTypes.fetch();if(_13.length>0){this.documentType=_13[0];}}}if(this.documentType){this._cmbDocTypes.attr("value",this.documentType.id);}this._pneEditor._setStyleAttr({visibility:"visible"});},resize:function(_14){this.pneMain.resize();},setProperty:function(_15){var _16=_15.name;var _17=_15.value;var _18=dijit.byId(_16);if(_18==null){return;}_18.attr("value",_17);},validate:function(_19){var _1a=dijit.byId("editorForm");var _1b=true;var _1c="";if(!_1a.isValid()){_1b=false;var _1d=_1a.getDescendants();dojo.forEach(_1d,function(_1e){if((_1e.isValid!=undefined)&&(!_1e.isValid())){if((_1e.name)&&(_1e.name.length>0)){_1c+="<li><b>"+_1e.name+"</b>";}}});throw new Error("The file cannot be added because the following properties are missing or invalid:<ul>"+_1c+"</ul>");}return _1b;}});}