/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.search.Advanced"]){dojo._hasResource["bfree.widget.search.Advanced"]=true;dojo.provide("bfree.widget.search.Advanced");dojo.require("bfree.api.Application");dojo.require("bfree.api.Search");dojo.require("bfree.widget.Bfree");dojo.require("bfree.widget.search.Criterion");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.form.Form");dojo.require("dojox.layout.TableContainer");dojo.declare("bfree.widget.search.Advanced",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("bfree/widget/search","template/Advanced.html","<div style=\"\">\n    <div dojoAttachPoint=\"formNode\">\n        <div dojoAttachPoint=\"criteriaNode\"></div>\n    </div>\n    <div style=\"text-align: right\">\n        <div dojoAttachPoint=\"submitNode\"></div>\n        <div dojoAttachPoint=\"resetNode\"></div>\n    </div>\n</div>\n"),widgetsInTemplate:true,_btnReset:null,_btnSubmit:null,_form:null,_operators:null,_widgets:[],library:null,_btnReset_onClick:function(_1){this.reset();},_onSubmit:function(_2){var _3=null;var _4=null;if(this._form.get("state")!=""){return false;}_3=new Array();for(var _5=0;_5<this._widgets.length;_5++){_3.push(this._widgets[_5].getQuery());}var _6=new bfree.api.Search({type:bfree.api.Search.types.ADVANCED,queryData:_3});this.onSearch(_6);},_onStateChange:function(){this._form.connectChildren(false);},_onValueChange:function(_7){this._btnSubmit.set("disabled",(this._form.isValid()==""));},addRow:function(){var _8=new bfree.widget.search.Criterion({dataTypes:bfree.api.Application.getDataTypes(),propertyDefinitions:this.library.getPropertyDefinitions(),operators:this._operators,onNewRow:dojo.hitch(this,this.addRow),onDeleteRow:dojo.hitch(this,this.deleteRow),onStateChange:dojo.hitch(this,this._onStateChange),onValueChange:dojo.hitch(this,this._onValueChange)});_8.startup();_8.placeAt(this.criteriaNode,"last");this._widgets.push(_8);this._form.connectChildren(false);},constructor:function(_9){},deleteRow:function(_a){_a.destroyRecursive();this._widgets.removeByValue(_a);this._form.connectChildren(false);},destroy:function(){},onSearch:function(_b){},postCreate:function(){this.inherited("postCreate",arguments);this._operators=bfree.api.Application.getOperators();this._form=new dijit.form.Form({onSubmit:dojo.hitch(this,this._onSubmit)},this.formNode);this._btnSubmit=bfree.widget.Button({iconClass:"commandIcon bfreeIconSearch",label:"Search",showLabel:false,type:"submit"},this.submitNode);this._btnReset=bfree.widget.Button({iconClass:"commandIcon bfreeIconCancel",label:"Reset",showLabel:false,onClick:dojo.hitch(this,this._btnReset_onClick)},this.resetNode);},reset:function(){while(this._widgets.length>0){var _c=this._widgets.pop();_c.destroy();_c=null;}this.addRow();},startup:function(){this.inherited("startup",arguments);this.addRow();}});}