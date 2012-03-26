/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Preference"]){dojo._hasResource["bfree.api.Preference"]=true;dojo.provide("bfree.api.Preference");dojo.require("bfree.api._Object");dojo.require("dojo.data.ItemFileReadStore");dojo.declare("bfree.api.Preference",[bfree.api._Object],{constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));}});bfree.api.Preference.dateEntryFormats={_date:1,_time:2,_datetime:3};bfree.api.Preference.schema={type:"object",properties:{"id":{type:"integer"},"name":{type:"string"},"value":{type:"string"},"created_at":{type:"date",format:"date-time"},"created_by":{type:"string","default":""},"updated_at":{type:"date",format:"date-time"},"updated_by":{type:"string","default":""}}};}