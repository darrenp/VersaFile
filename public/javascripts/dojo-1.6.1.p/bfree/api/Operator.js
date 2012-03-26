/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Operator"]){dojo._hasResource["bfree.api.Operator"]=true;dojo.provide("bfree.api.Operator");dojo.declare("bfree.api.Operator",null,{id:null,name:null,value:null,constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));}});bfree.api.Operator.schema={type:"object",properties:{"id":{type:"integer"},"name":{type:"string","default":""},"value":{type:"string"},"no_rhs":{type:"boolean"}},prototype:new bfree.api.Operator()};}