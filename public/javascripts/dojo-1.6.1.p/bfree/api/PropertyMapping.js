/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.PropertyMapping"]){dojo._hasResource["bfree.api.PropertyMapping"]=true;dojo.provide("bfree.api.PropertyMapping");dojo.require("bfree.api._Object");dojo.require("bfree.api.Error");dojo.declare("bfree.api.PropertyMapping",[bfree.api._Object],{constructor:function(_1){if(_1){dojo.safeMixin(this,_1);}}});bfree.api.PropertyMapping.schema={type:"object",properties:{"id":{type:"integer"},"document_type_id":{type:"integer"},"property_definition_id":{type:"integer"},"name":{type:"string","default":"Property"},"sort_order":{type:"integer","default":1},"is_required":{type:"boolean","default":false},"choice_list_id":{type:"integer","default":null},"default_value":{type:"string","default":null}}};}