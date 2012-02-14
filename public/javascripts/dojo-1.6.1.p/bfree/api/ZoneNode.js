/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.ZoneNode"]){dojo._hasResource["bfree.api.ZoneNode"]=true;dojo.provide("bfree.api.ZoneNode");dojo.require("bfree.api._Object");dojo.declare("bfree.api.ZoneNode",[bfree.api._Object],{constructor:function(_1){if(_1){dojo.safeMixin(this,_1);}},isValid:function(){var _2=true;if(String.isBlank(this.name)){_2=false;}if(String.isBlank(this.subdomain)){_2=false;}if(String.isBlank(this.max_users)){_2=false;}if(String.isBlank(this.max_disk_space)){_2=false;}return _2;}});bfree.api.ZoneNode.schema={type:"object",properties:{"id":{type:"integer"},"name":{type:"string","default":""},"subdomain":{type:"string","default":""},"fingerprint":{type:"string","default":""},"status":{type:"integer","default":""},"current_users":{type:"integer","default":""},"max_users":{type:"integer","default":""},"current_disk_space":{type:"long","default":""},"max_disk_space":{type:"long","default":""},"created_at":{type:"date",format:"date-time"},"updated_at":{type:"date",format:"date-time"},"account_id":{type:"integer","default":1},"server_id":{type:"integer","default":1},"status":{type:"integer","default":0}},prototype:new bfree.api.ZoneNode()};}