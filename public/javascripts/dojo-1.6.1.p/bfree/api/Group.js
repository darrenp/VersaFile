/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Group"]){dojo._hasResource["bfree.api.Group"]=true;dojo.provide("bfree.api.Group");dojo.require("bfree.api._Object");dojo.declare("bfree.api.Group",[bfree.api._Object],{description:null,constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));},isValid:function(){var _2=true;if(String.isEmpty(this.name.trim())){_2=false;}return _2;}});bfree.api.Group.schema={type:"object",properties:{"id":{type:"integer"},"name":{type:"string","default":""},"description":{type:"string"},"active_users":{type:"array",items:{type:"integer"}},"created_at":{type:"date",format:"date-time"},"created_by":{type:"string"},"updated_at":{type:"date",format:"date-time"},"updated_by":{type:"string"}},prototype:new bfree.api.Group()};}