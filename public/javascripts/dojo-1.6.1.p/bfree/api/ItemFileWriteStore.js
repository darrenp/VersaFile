/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.ItemFileWriteStore"]){dojo._hasResource["bfree.api.ItemFileWriteStore"]=true;dojo.provide("bfree.api.ItemFileWriteStore");dojo.require("dojo.data.ItemFileWriteStore");dojo.declare("bfree.api.ItemFileWriteStore",[dojo.data.ItemFileWriteStore],{fetchItemById:function(id){var _1=null;this.fetchItemByIdentity({identity:id,onItem:function(_2){_1=_2;}});return _1;},generateUniqueId:function(){var _3=null;var _4=true;do{_3=(new Date()).getTime();this.fetchItemByIdentity({identity:_3,onItem:function(_5){_4=(_5!=null);}});}while(_4);return _3;}});}