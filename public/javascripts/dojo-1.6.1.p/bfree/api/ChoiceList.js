/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.ChoiceList"]){dojo._hasResource["bfree.api.ChoiceList"]=true;dojo.provide("bfree.api.ChoiceList");dojo.require("bfree.api._Object");dojo.declare("bfree.api.ChoiceList",[bfree.api._Object],{constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));},isValid:function(){var _2=true;if(String.isEmpty(this.name.trim())){_2=false;}if((!this.data_type_id)||(this.data_type_id<1)){_2=false;}return _2;}});bfree.api.ChoiceList.schema={type:"object",properties:{"id":{type:"integer"},"name":{type:"string","default":"Property"},"data_type_id":{type:"integer"},"choice_values":{type:"array","default":[],items:{type:"object",properties:{"sort_order":{type:"integer"},"name":{type:"string"},"value":{type:"string"}}}},"created_at":{type:"string",format:"date-time","default":dojo.date.stamp.toISOString(new Date(),{zulu:true})},"created_by":{type:"string","default":""},"updated_at":{type:"string",format:"date-time","default":dojo.date.stamp.toISOString(new Date(),{zulu:true})},"updated_by":{type:"string","default":""}},prototype:new bfree.api.ChoiceList()};}