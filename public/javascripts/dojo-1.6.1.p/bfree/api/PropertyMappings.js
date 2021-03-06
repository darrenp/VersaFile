/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.PropertyMappings"]){dojo._hasResource["bfree.api.PropertyMappings"]=true;dojo.provide("bfree.api.PropertyMappings");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Error");dojo.require("bfree.api.PropertyMapping");dojo.declare("bfree.api.PropertyMappings",[bfree.api._Collection],{constructor:function(_1){this.zone=_1.zone;this.library=_1.library;this.target=dojo.replace(bfree.api.PropertyMappings.TRGT,[this.zone.subdomain,this.library.id]);this.schema=bfree.api.PropertyMapping.schema;this.cache=true;this._initialize();}});bfree.api.PropertyMappings.getDefault=function(_2,_3){var _4=_3.fetchById({id:_2.property_definition_id});if(_4.isTypeDate()&&_2.default_type==bfree.api.PropertyMapping.types.date.floating){var _5=new Date();_5.setDate(_5.getDate()+parseInt(_2.default_value));return _5;}else{if(_2.default_value){if(_4.isTypeInteger()){return parseInt(_2.default_value);}else{if(_4.isTypeFloat()){return parseFloat(_2.default_value);}}return _2.default_value;}}return null;};bfree.api.PropertyMappings.TRGT="/zones/{0}/libraries/{1}/property_mappings";}