/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.RkoUser"]){dojo._hasResource["bfree.api.RkoUser"]=true;dojo.provide("bfree.api.RkoUser");dojo.require("bfree.api._Object");dojo.declare("bfree.api.RkoUser",[bfree.api._Object],{constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));},isValid:function(){var _2=true;if(String.isBlank(this.name)){_2=false;}return _2;}});bfree.api.RkoUser.schema={type:"object",properties:{"id":{type:"integer"},"name":{type:"string","default":""},"password":{type:"string"},"first_name":{type:"string"},"last_name":{type:"string"},"email":{type:"string"},"created_at":{type:"date",format:"date-time"},"updated_at":{type:"date",format:"date-time"}},prototype:new bfree.api.RkoUser()};}