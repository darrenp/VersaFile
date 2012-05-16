/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.ViewMapping"]){dojo._hasResource["bfree.api.ViewMapping"]=true;dojo.provide("bfree.api.ViewMapping");dojo.require("bfree.api._Object");dojo.require("bfree.api.Error");dojo.declare("bfree.api.ViewMapping",[bfree.api._Object],{constructor:function(_1){if(_1){dojo.safeMixin(this,_1);}}});bfree.api.ViewMapping.compare=function(_2,_3){return _2.sort_order-_3.sort_order;};bfree.api.ViewMapping.schema={type:"object",properties:{"library_id":{type:"integer"},"folder_id":{type:"integer"},"user_id":{type:"integer"},"view_id":{type:"integer"}}};}