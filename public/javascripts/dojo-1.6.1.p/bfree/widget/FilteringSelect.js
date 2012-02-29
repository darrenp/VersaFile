/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.FilteringSelect"]){dojo._hasResource["bfree.widget.FilteringSelect"]=true;dojo.provide("bfree.widget.FilteringSelect");dojo.require("dijit.form.FilteringSelect");dojo.declare("bfree.widget.FilteringSelect",[dijit.form.FilteringSelect],{postCreate:function(){this.inherited("postCreate",arguments);},reset:function(){this.inherited("reset",arguments);this._hasBeenBlurred=true;},startup:function(){this._hasBeenBlurred=true;this.inherited("startup",arguments);this.validate();},_openResultList:function(_1,_2){this.focusNode.focus();this.inherited("_openResultList",arguments);}});}