/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.BooleanSelect"]){dojo._hasResource["bfree.widget.BooleanSelect"]=true;dojo.provide("bfree.widget.BooleanSelect");dojo.require("bfree.api.ItemFileWriteStore");dojo.require("bfree.widget.FilteringSelect");dojo.declare("bfree.widget.BooleanSelect",[bfree.widget.FilteringSelect],{constructor:function(_1){this.store=new bfree.api.ItemFileWriteStore({data:{identifier:"id",label:"name",items:[{id:0,name:"false"},{id:1,name:"true"}]}});},postCreate:function(){this.inherited("postCreate",arguments);this._setDisabledAttr(this.disabled);},_setDisabledAttr:function(_2){this.inherited(arguments);var _3=((this.disabledIconClass!=null)&&(_2))?this.disabledIconClass:this._iconClass;this.set("iconClass",_3);}});}