/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.DropboxAccounts"]){dojo._hasResource["bfree.api.DropboxAccounts"]=true;dojo.provide("bfree.api.DropboxAccounts");dojo.require("bfree.api.DropboxAccount");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Error");dojo.declare("bfree.api.DropboxAccounts",[bfree.api._Collection],{constructor:function(_1){this.zone=_1.zone;this.library=_1.library;this.target=dojo.replace(bfree.api.DropboxAccounts.TRGT,[this.zone.subdomain,this.library.id]);this.schema=bfree.api.DropboxAccount.schema;this.cache=true;this._initialize();}});bfree.api.DropboxAccounts.TRGT="/zones/{0}/libraries/{1}/dropbox";}