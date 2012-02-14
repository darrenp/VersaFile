/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Application"]){dojo._hasResource["bfree.api.Application"]=true;dojo.provide("bfree.api.Application");dojo.require("bfree.api.DataTypes");dojo.require("bfree.api.Operators");dojo.declare("bfree.api.Application",null,{});bfree.api.Application._data_types=null;bfree.api.Application._operators=null;bfree.api.Application.getDataTypes=function(){if(!bfree.api.Application._data_types){bfree.api.Application._data_types=new bfree.api.DataTypes();bfree.api.Application._data_types.fetch();}return bfree.api.Application._data_types;};bfree.api.Application.getOperators=function(){if(!bfree.api.Application._operators){bfree.api.Application._operators=new bfree.api.Operators();bfree.api.Application._operators.fetch();}return bfree.api.Application._operators;};}