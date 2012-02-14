/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.RkoUsers"]){dojo._hasResource["bfree.api.RkoUsers"]=true;dojo.provide("bfree.api.RkoUsers");dojo.require("bfree.api._Collection");dojo.require("bfree.api.RkoUser");dojo.require("bfree.api.XhrHelper");dojo.declare("bfree.api.RkoUsers",[bfree.api._Collection],{constructor:function(_1){this.target=bfree.api.RkoUsers.TRGT;this.schema=bfree.api.RkoUser.schema;this.cache=true;this._initialize();},logon:function(_2,_3){var _4={username:_2,password:_3};var _5=bfree.api.XhrHelper.doPostAction({target:bfree.api.RkoUsers.LOGIN_URL,postData:_4});return new bfree.api.RkoUser(_5);},logoff:function(){var _6=bfree.api.RkoUsers.LOGOUT_URL;var _7={};var _8=bfree.api.XhrHelper.doPostAction({target:_6,postData:_7});return _8;}});bfree.api.RkoUsers.generatePassword=function(_9){var _a=_9.length;var _b="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";var _c="";for(var i=0;i<_a;i++){_c+=_b.charAt(Math.floor(Math.random()*(_b.length)));}return _c;};bfree.api.RkoUsers.LOGIN_URL="/rko_users/logon.json";bfree.api.RkoUsers.LOGOUT_URL="/rko_users/logout.json";bfree.api.RkoUsers.TRGT="/rko_users";}