/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Users"]){dojo._hasResource["bfree.api.Users"]=true;dojo.provide("bfree.api.Users");dojo.require("bfree.api._Collection");dojo.require("bfree.api.User");dojo.declare("bfree.api.Users",[bfree.api._Collection],{zone:null,constructor:function(_1){this.zone=_1.zone;this.target=dojo.replace(bfree.api.Users.TRGT,this.zone);this.schema=bfree.api.User.schema;this.cache=true;this._initialize();},getAdmin:function(){var _2=null;this.forEach(function(_3){if(_3.is_admin){_2=_3;}},this);return _2;},reset:function(_4,_5){bfree.api.XhrHelper.doPostAction({target:dojo.replace(bfree.api.Users.RESET_TRGT,this.zone),postData:{f:_4,newPassword:_5}});}});bfree.api.Users.generatePassword=function(_6){var _7=_6.length;var _8="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";var _9="";for(var i=0;i<_7;i++){_9+=_8.charAt(Math.floor(Math.random()*(_8.length)));}return _9;};bfree.api.Users.TRGT="/zones/{subdomain}/users";bfree.api.Users.RESET_TRGT="/zones/{subdomain}/users/reset";}