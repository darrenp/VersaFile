/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.HeaderMenu"]){dojo._hasResource["bfree.widget.HeaderMenu"]=true;dojo.provide("bfree.widget.HeaderMenu");dojo.require("dijit.Menu");dojo.declare("bfree.widget.HeaderMenu",dijit.Menu,{menuLabel:"Menu",closable:false,getChildren:function(){var c=this.inherited("getChildren",arguments);c.splice(0,1);return c;},postCreate:function(){this.inherited("postCreate",arguments);this.addChild(new dijit.MenuItem({"class":"dijitMenuHeader",label:this.menuLabel,disabled:false}));}});}