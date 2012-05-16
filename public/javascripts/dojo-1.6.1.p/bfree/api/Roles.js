/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Roles"]){dojo._hasResource["bfree.api.Roles"]=true;dojo.provide("bfree.api.Roles");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Role");dojo.declare("bfree.api.Roles",bfree.api._Collection,{zone:null,constructor:function(_1){this.zone=_1.zone;this.target=dojo.replace(bfree.api.Roles.TRGT,this.zone);this.schema=bfree.api.Role.schema;this.cache=true;this._initialize();}});bfree.api.Roles.TRGT="/zones/{subdomain}/roles";}