/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.SharedItems"]){dojo._hasResource["bfree.api.SharedItems"]=true;dojo.provide("bfree.api.SharedItems");dojo.require("bfree.api._Collection");dojo.require("bfree.api.SharedItem");dojo.declare("bfree.api.SharedItems",bfree.api._Collection,{zone:null,share:null,constructor:function(_1){this.zone=_1.zone;this.share=_1.share;this.target=dojo.replace(bfree.api.SharedItems.TRGT,[this.zone.subdomain,this.share.fingerprint]);this.schema=bfree.api.SharedItem.schema;this.cache=true;this._initialize();}});bfree.api.SharedItems.TRGT="/zones/{0}/shares/{1}/shared_items";}