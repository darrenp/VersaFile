/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.ValidationTextBox"]){dojo._hasResource["bfree.widget.ValidationTextBox"]=true;dojo.provide("bfree.widget.ValidationTextBox");dojo.require("dijit.form.ValidationTextBox");dojo.declare("bfree.widget.ValidationTextBox",[dijit.form.ValidationTextBox],{scrollOnFocus:false,blur:function(){this._hasBeenBlurred=true;},constructor:function(_1){},postCreate:function(){this.inherited("postCreate",arguments);},setFocus:function(_2){this.focus();if(_2){this.textbox.select();}},startup:function(){this._hasBeenBlurred=true;this.inherited("startup",arguments);this.validate();}});}