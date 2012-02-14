/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Versions"]){dojo._hasResource["bfree.api.Versions"]=true;dojo.provide("bfree.api.Versions");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Version");dojo.declare("bfree.api.Versions",[bfree.api._Collection],{zone:null,library:null,document:null,constructor:function(_1){this.zone=_1.zone;this.library=_1.library;this.document=_1.document;this.target=dojo.replace(bfree.api.Versions.TRGT,[this.zone.subdomain,this.library.id,this.document.id]);this.schema=bfree.api.Version.schema;this.cache=true;this._initialize();}});bfree.api.Versions.TRGT="/zones/{0}/libraries/{1}/documents/{2}/versions";}