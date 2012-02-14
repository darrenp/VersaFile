/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Zones"]){dojo._hasResource["bfree.api.Zones"]=true;dojo.provide("bfree.api.Zones");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Zone");dojo.declare("bfree.api.Zones",[bfree.api._Collection],{constructor:function(_1){this.target=bfree.api.Zones.TRGT;this.schema=bfree.api.Zone.schema;this.cache=true;this._initialize();}});bfree.api.Zones.TRGT="/zones";}