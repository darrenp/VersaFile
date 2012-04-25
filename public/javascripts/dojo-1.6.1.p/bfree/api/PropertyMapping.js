/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.PropertyMapping"]){dojo._hasResource["bfree.api.PropertyMapping"]=true;dojo.provide("bfree.api.PropertyMapping");dojo.require("bfree.api._Object");dojo.require("bfree.api.Error");dojo.require("versa.api.Formatter");dojo.declare("bfree.api.PropertyMapping",[bfree.api._Object],{constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));},});bfree.api.PropertyMapping.compare=function(_2,_3){return _2.sort_order-_3.sort_order;};bfree.api.PropertyMapping.formatValue=function(_4,_5){var _6=null;if(_4.isTypeDate()){_6=versa.api.Formatter.formatDateTime(_5);}else{_6=_5;}return _6;};bfree.api.PropertyMapping.types={date:{fixed:0,floating:1}};bfree.api.PropertyMapping.schema={type:"object",properties:{"id":{type:"integer"},"document_type_id":{type:"integer"},"property_definition_id":{type:"integer"},"name":{type:"string","default":"Property"},"sort_order":{type:"integer","default":1},"is_required":{type:"boolean","default":false},"choice_list_id":{type:"integer","default":null},"default_value":{type:"string","default":null},"default_type":{type:"integer","default":0}}};}