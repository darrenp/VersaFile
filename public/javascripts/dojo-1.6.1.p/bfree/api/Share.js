/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Share"]){dojo._hasResource["bfree.api.Share"]=true;dojo.provide("bfree.api.Share");dojo.require("bfree.api._Object");dojo.require("bfree.api.SharedItems");dojo.declare("bfree.api.Share",bfree.api._Object,{constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));},authorize:function(_2){var _3=dojo.replace(bfree.api.Share.AUTH_URL,[_2.id,this.fingerprint]);var _4={password:this.password};var _5=bfree.api.XhrHelper.doPostAction({target:_3,postData:_4});return true;},getSharedItems:function(_6){return new bfree.api.SharedItems({zone:_6.zone,share:this});}});bfree.api.Share.AUTH_URL="/zones/{0}/shares/{1}/authorize.json";bfree.api.Share.schema={type:"object",properties:{"id":{type:"integer"}},prototype:new bfree.api.Share()};}