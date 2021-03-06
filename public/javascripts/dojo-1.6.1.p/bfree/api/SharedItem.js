/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.SharedItem"]){dojo._hasResource["bfree.api.SharedItem"]=true;dojo.provide("bfree.api.SharedItem");dojo.require("bfree.api._Object");dojo.require("bfree.api.Utilities");dojo.declare("bfree.api.SharedItem",bfree.api._Object,{zone:null,constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));},copyLocal:function(_2){var _3=_2.zone;var _4=_2.share;var _5=_2.form;var _6=dojo.replace(bfree.api.SharedItem.CP_TRGT,[_3.subdomain,_4.fingerprint,this.getId()]);_5.set("action",_6);_5.set("target","_self");_5.set("method","post");_5.submit();},view:function(_7){var _8=_7.zone;var _9=_7.share;var _a=_7.form;var _b=dojo.replace(bfree.api.SharedItem.VW_TRGT,[_8.subdomain,_9.fingerprint,this.getId()]);bfree.api.Utilities.viewUrl({windowBox:_7.windowBox,url:_b,window_name:"versa_viewer"});}});bfree.api.SharedItem.VW_TRGT="/zones/{0}/shares/{1}/download/?item_id={2}&disposition=inline";bfree.api.SharedItem.CP_TRGT="/zones/{0}/shares/{1}/download/?item_id={2}&disposition=attachment";bfree.api.SharedItem.schema={type:"object",properties:{"id":{type:"integer"}},prototype:new bfree.api.SharedItem()};}