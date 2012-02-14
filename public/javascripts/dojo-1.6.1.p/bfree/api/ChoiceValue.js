/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.ChoiceValue"]){dojo._hasResource["bfree.api.ChoiceValue"]=true;dojo.provide("bfree.api.ChoiceValue");dojo.require("bfree.api._Object");dojo.require("bfree.api.Error");dojo.declare("bfree.api.ChoiceValue",[bfree.api._Object],{constructor:function(_1){if(_1){dojo.safeMixin(this,_1);}}});bfree.api.ChoiceValue.schema={type:"object",properties:{"id":{type:"integer"},"name":{type:"string"},"value":{type:"string"},"choice_list_id":{type:"integer"},"sort_order":{type:"integer","default":1}},prototype:new bfree.api.ChoiceValue()};}