/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Libraries"]){dojo._hasResource["bfree.api.Libraries"]=true;dojo.provide("bfree.api.Libraries");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Library");dojo.declare("bfree.api.Libraries",[bfree.api._Collection],{zone:null,constructor:function(_1){this.zone=_1.zone;this.target=dojo.replace(bfree.api.Libraries.TRGT,this.zone);this.schema=bfree.api.Library.schema;this.cache=true;this._initialize();}});bfree.api.Libraries.TRGT="/zones/{subdomain}/libraries";}