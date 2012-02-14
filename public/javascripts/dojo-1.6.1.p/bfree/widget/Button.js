/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.Button"]){dojo._hasResource["bfree.widget.Button"]=true;dojo.provide("bfree.widget.Button");dojo.require("dijit.form.Button");dojo.declare("bfree.widget.Button",[dijit.form.Button],{_iconClass:null,disabledIconClass:null,scrollOnFocus:false,constructor:function(_1){this._iconClass=(_1.iconClass==null)?this.iconClass:_1.iconClass;},postCreate:function(){this.inherited("postCreate",arguments);this._setDisabledAttr(this.disabled);},_setDisabledAttr:function(_2){this.inherited(arguments);var _3=((this.disabledIconClass!=null)&&(_2))?this.disabledIconClass:this._iconClass;this.set("iconClass",_3);}});}