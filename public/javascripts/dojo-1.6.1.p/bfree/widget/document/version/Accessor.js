/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.document.version.Accessor"]){dojo._hasResource["bfree.widget.document.version.Accessor"]=true;dojo.provide("bfree.widget.document.version.Accessor");dojo.declare("bfree.widget.document.version.Accessor",null,{library:null,zone:null,constructor:function(_1){this.library=_1.library;this.zone=_1.zone;},doCopyLocal:function(_2,_3){_3.copyLocal({zone:this.zone,library:this.library,document:_2});},doView:function(_4,_5){var _6=bfree.api.Utilities.getBox({scale:0.75});_5.view({zone:this.zone,library:this.library,document:_4,windowBox:_6});}});}