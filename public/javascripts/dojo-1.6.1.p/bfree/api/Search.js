/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Search"]){dojo._hasResource["bfree.api.Search"]=true;dojo.provide("bfree.api.Search");dojo.require("bfree.api._Object");dojo.declare("bfree.api.Search",[bfree.api._Object],{type:0,queryData:null,_getAdvancedQuery:function(){return {type:this.type,query:dojo.toJson(this.queryData)};},_getFolderQuery:function(){return {type:this.type,query:this.queryData};},_getSimpleQuery:function(){return {type:this.type,query:this.queryData};},constructor:function(_1){if(_1){dojo.safeMixin(this,_1);}},getQuery:function(){var _2={type:bfree.api.Search.types.NONE};switch(this.type){case bfree.api.Search.types.FOLDER:_2=this._getFolderQuery();break;case bfree.api.Search.types.SIMPLE:_2=this._getSimpleQuery();break;case bfree.api.Search.types.ADVANCED:_2=this._getAdvancedQuery();break;}return _2;}});bfree.api.Search.types={"NONE":0,"FOLDER":1,"SIMPLE":2,"ADVANCED":3};}