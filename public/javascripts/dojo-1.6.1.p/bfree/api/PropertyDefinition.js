/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.PropertyDefinition"]){dojo._hasResource["bfree.api.PropertyDefinition"]=true;dojo.provide("bfree.api.PropertyDefinition");dojo.require("bfree.api._Object");dojo.declare("bfree.api.PropertyDefinition",[bfree.api._Object],{constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));},getDbName:function(){return dojo.replace("{table_name}.{column_name}",this);},isTypeDate:function(){return this.data_type_id==bfree.api.DataTypes.types.DATETIME;},isTypeText:function(){return this.data_type_id==bfree.api.DataTypes.types.TEXT;},isTypeInteger:function(){return this.data_type_id==bfree.api.DataTypes.types.INTEGER;},isTypeFloat:function(){return this.data_type_id==bfree.api.DataTypes.types.FLOAT;},isTypeAnyNumber:function(){return this.data_type_id==bfree.api.DataTypes.types.INTEGER||this.data_type_id==bfree.api.DataTypes.types.FLOAT;},isValid:function(){var _2=true;if(String.isEmpty(this.name.trim())){_2=false;}if(!this.data_type_id){_2=false;}return _2;}});bfree.api.Cardinality={"Single":1,"Multiple":2};bfree.api.PropertyDefinition.compare=function(a,b){return a.sort_id-b.sort_id;};bfree.api.PropertyDefinition.schema={type:"object",properties:{"id":{type:"integer"},"name":{type:"string","default":""},"cardinality":{type:"integer","default":bfree.api.Cardinality.Single},"column_name":{type:"string"},"created_at":{type:"date",format:"date-time"},"created_by":{type:"string"},"data_type_id":{type:"integer"},"description":{type:"string","default":""},"is_readonly":{type:"boolean","default":false},"is_system":{type:"boolean","default":false},"max_length":{type:"max_length"},"table_name":{type:"string"},"updated_at":{type:"date",format:"date-time"},"updated_by":{type:"string"}},prototype:new bfree.api.PropertyDefinition()};}