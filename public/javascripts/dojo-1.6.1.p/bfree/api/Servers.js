/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Servers"]){dojo._hasResource["bfree.api.Servers"]=true;dojo.provide("bfree.api.Servers");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Server");dojo.require("bfree.api.XhrHelper");dojo.declare("bfree.api.Servers",[bfree.api._Collection],{constructor:function(_1){this.target=bfree.api.Servers.TRGT;this.schema=bfree.api.Server.schema;this.cache=true;this._initialize();}});bfree.api.Servers.TRGT="/servers";}