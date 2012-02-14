/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.DataTypes"]){dojo._hasResource["bfree.api.DataTypes"]=true;dojo.provide("bfree.api.DataTypes");dojo.require("bfree.api._Collection");dojo.require("bfree.api.DataType");dojo.declare("bfree.api.DataTypes",[bfree.api._Collection],{constructor:function(_1){this.zone=null;this.target=bfree.api.DataTypes.TRGT;this.schema=bfree.api.DataType.schema;this.cache=true;this._initialize();}});bfree.api.DataTypes.types={"VOID":0,"BOOLEAN":1,"INTEGER":2,"FLOAT":3,"DATETIME":4,"STRING":5,"TEXT":6};bfree.api.DataTypes.TRGT="/data_types";}