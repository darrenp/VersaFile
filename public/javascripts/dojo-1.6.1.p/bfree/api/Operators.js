/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Operators"]){dojo._hasResource["bfree.api.Operators"]=true;dojo.provide("bfree.api.Operators");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Operator");dojo.declare("bfree.api.Operators",[bfree.api._Collection],{_andOp:null,_fetch_onComplete:function(_1,_2){this.isLoaded=true;if((_1!=null)&&(_1.length>1)){this.first=_1[0];}dojo.forEach(_1,function(_3,_4){if(_3.name=="and"){this._andOp=_3;}},this);},constructor:function(_5){this.target=bfree.api.Operators.TRGT;this.schema=bfree.api.Operator.schema;this.cache=true;this._initialize();},byDataType:function(id){var _6=[];this.forEach(function(_7){if(_7.data_type_id==id){_6.push(_7);}},this);return _6;},getAndOp:function(){return this._andOp;}});bfree.api.Operators.TRGT="/operators";}