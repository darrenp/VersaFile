/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.DocumentType"]){dojo._hasResource["bfree.api.DocumentType"]=true;dojo.provide("bfree.api.DocumentType");dojo.require("bfree.api._Object");dojo.require("bfree.api.XhrHelper");dojo.require("bfree.api.PropertyMapping");dojo.declare("bfree.api.DocumentType",[bfree.api._Object],{constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));},getMetrics:function(_2){var _3=dojo.replace(bfree.api.DocumentType.MT_TRGT,[_2.zone.subdomain,_2.library.id,this.id]);var _4=bfree.api.XhrHelper.doGetAction({target:_3});return true;},hasProperty:function(id){var _5=dojo.some(this.property_mappings,function(_6,_7){return (_6.property_definition_id==id);},this);return _5;},isValid:function(){var _8=true;if(String.isEmpty(this.name.trim())){_8=false;}return _8;}});bfree.api.DocumentType.MT_TRGT="/zones/{0}/libraries/{1}/document_types/{2}/dtmetrics.json";bfree.api.DocumentType.schema={type:"object",properties:{"id":{type:"integer"},"name":{type:"string","default":""},"is_system":{type:"boolean","default":false},"property_mappings":{type:"array","default":[],items:{type:"object",properties:{"property_definition_id":{type:"integer"},"choice_list_id":{type:"integer"},"default_value":{type:"string"},"is_required":{type:"boolean"},"sort_order":{type:"integer"},prototype:new bfree.api.PropertyMapping()}}},"created_at":{type:"date",format:"date-time"},"created_by":{type:"string"},"description":{type:"string","default":""},"updated_at":{type:"date",format:"date-time"},"updated_by":{type:"string"}},prototype:new bfree.api.DocumentType()};}