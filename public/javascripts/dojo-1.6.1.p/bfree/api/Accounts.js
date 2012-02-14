/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Accounts"]){dojo._hasResource["bfree.api.Accounts"]=true;dojo.provide("bfree.api.Accounts");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Account");dojo.require("bfree.api.XhrHelper");dojo.declare("bfree.api.Accounts",[bfree.api._Collection],{constructor:function(_1){this.target=bfree.api.Accounts.TRGT;this.schema=bfree.api.Account.schema;this.cache=true;this._initialize();}});bfree.api.Accounts.generatePassword=function(_2){var _3=_2.length;var _4="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";var _5="";for(var i=0;i<_3;i++){_5+=_4.charAt(Math.floor(Math.random()*(_4.length)));}return _5;};bfree.api.Accounts.TRGT="/accounts";}