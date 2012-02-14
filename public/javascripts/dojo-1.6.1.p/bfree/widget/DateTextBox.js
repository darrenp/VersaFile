/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.DateTextBox"]){dojo._hasResource["bfree.widget.DateTextBox"]=true;dojo.provide("bfree.widget.DateTextBox");dojo.require("dijit.form.DateTextBox");dojo.declare("bfree.widget.DateTextBox",[dijit.form.DateTextBox],{postCreate:function(){this.inherited("postCreate",arguments);},reset:function(){this.inherited("reset",arguments);this._hasBeenBlurred=true;},startup:function(){this._hasBeenBlurred=true;this.inherited("startup",arguments);this.validate();}});}