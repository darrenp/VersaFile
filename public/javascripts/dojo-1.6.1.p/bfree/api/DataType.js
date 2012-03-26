/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.DataType"]){dojo._hasResource["bfree.api.DataType"]=true;dojo.provide("bfree.api.DataType");dojo.declare("bfree.api.DataType",null,{constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));},defaultMaxLength:function(){var _2=null;switch(this.prefix){case "str":_2=255;break;case "txt":_2=4096;break;}return _2;},isBoolean:function(){return (this.prefix=="bln");},isDateTime:function(){return (this.prefix=="dtt");},isFloat:function(){return (this.prefix=="flt");},isInteger:function(){return (this.prefix=="int");},isString:function(){return (this.prefix=="str");},isText:function(){return (this.prefix=="txt");}});bfree.api.DataType.schema={type:"object",properties:{"id":{type:"integer"},"name":{type:"string","default":""},"prefix":{type:"string"}},prototype:new bfree.api.DataType()};}