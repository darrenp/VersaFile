/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.PropertyTable"]){dojo._hasResource["bfree.widget.PropertyTable"]=true;dojo.provide("bfree.widget.PropertyTable");dojo.require("dojox.layout.TableContainer");dojo.declare("bfree.widget.PropertyTable",[dojox.layout.TableContainer],{refresh:function(){this._initialized=false;this._started=false;this.startup();}});}