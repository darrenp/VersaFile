/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Shares"]){dojo._hasResource["bfree.api.Shares"]=true;dojo.provide("bfree.api.Shares");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Share");dojo.declare("bfree.api.Shares",bfree.api._Collection,{constructor:function(_1){this.zone=_1.zone;this.target=dojo.replace(bfree.api.Shares.TRGT,[this.zone.subdomain]);this.schema=bfree.api.Share.schema;this.cache=true;this._initialize();}});bfree.api.Shares.TRGT="/zones/{0}/shares";}