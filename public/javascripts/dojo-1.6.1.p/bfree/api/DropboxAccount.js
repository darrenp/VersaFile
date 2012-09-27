/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.DropboxAccount"]){dojo._hasResource["bfree.api.DropboxAccount"]=true;dojo.provide("bfree.api.DropboxAccount");dojo.require("bfree.api._Object");dojo.declare("bfree.api.DropboxAccount",[bfree.api._Object],{constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));}});bfree.api.DropboxAccount.requestAccess=function(_2,_3){var _4=bfree.api.Utilities.getBox({scale:0.75});var _5=dojo.replace(bfree.api.DropboxAccount.requestURL,[_2.id,_3.id]);var _6="DropboxAccess";var _7=dojo.string.substitute("width=${0},height=${1},top=${2},left=${3},toolbar=0,resizable=1,location=0,directories=0,status=0,menubar=0,scrollbars=1",[_4.w,_4.h,_4.t,_4.l]);if(!dojo.isIE){var _8=window.open(_5,_6,_7);_8.focus();}else{var _8=window.open(_5,"_blank",_7);if(_8){_8.focus();}}};bfree.api.DropboxAccount.requestURL="/zones/{0}/libraries/{1}/dropbox/access";bfree.api.ChoiceList.schema={type:"object",properties:{"id":{type:"integer"},"request_token":{type:"string"},"request_secret":{type:"string"},"access_token":{type:"string"},"access_secret":{type:"string"}},prototype:new bfree.api.DropboxAccount()};}