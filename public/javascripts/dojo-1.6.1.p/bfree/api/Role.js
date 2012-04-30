/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Role"]){dojo._hasResource["bfree.api.Role"]=true;dojo.provide("bfree.api.Role");dojo.require("bfree.api._Object");dojo.declare("bfree.api.Role",[bfree.api._Object],{constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));}});bfree.api.Role.schema={type:"object",properties:{"id":{type:"integer"},"name":{type:"string","default":""},"permissions":{type:"integer"},"created_at":{type:"date",format:"date-time"},"created_by":{type:"string"},"updated_at":{type:"date",format:"date-time"},"updated_by":{type:"string"}},prototype:new bfree.api.Role()};}