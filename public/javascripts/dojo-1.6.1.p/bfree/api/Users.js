/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Users"]){dojo._hasResource["bfree.api.Users"]=true;dojo.provide("bfree.api.Users");dojo.require("bfree.api._Collection");dojo.require("bfree.api.User");dojo.declare("bfree.api.Users",[bfree.api._Collection],{zone:null,constructor:function(_1){this.zone=_1.zone;this.target=dojo.replace(bfree.api.Users.TRGT,this.zone);this.schema=bfree.api.User.schema;this.cache=true;this._initialize();},getAdmin:function(){var _2=null;this.forEach(function(_3){if(_3.is_admin){_2=_3;}},this);return _2;},reset:function(_4,_5,_6){bfree.api.XhrHelper.doPostAction({target:dojo.replace(bfree.api.Users.RESET_TRGT,this.zone),postData:{f:_4,oldPassword:_5,newPassword:_6}});}});bfree.api.Users.generatePassword=function(_7){var _8=_7.length;var _9="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";var _a="";for(var i=0;i<_8;i++){_a+=_9.charAt(Math.floor(Math.random()*(_9.length)));}return _a;};bfree.api.Users.TRGT="/zones/{subdomain}/users";bfree.api.Users.RESET_TRGT="/zones/{subdomain}/users/reset";}