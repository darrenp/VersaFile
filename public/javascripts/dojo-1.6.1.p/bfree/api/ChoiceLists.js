/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.ChoiceLists"]){dojo._hasResource["bfree.api.ChoiceLists"]=true;dojo.provide("bfree.api.ChoiceLists");dojo.require("bfree.api.ChoiceList");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Error");dojo.require("bfree.api.DataTypes");dojo.declare("bfree.api.ChoiceLists",[bfree.api._Collection],{_matchesQuery:function(_1,_2){if(dojo.isArray(_1)||(_1.hasOwnProperty("sort_order"))){return false;}var _3=_2.query;var _4=_2.queryOptions&&_2.queryOptions.ignoreCase;for(var i in _3){var _5=_3[i];var _6=this.getValue(_1,i);if((typeof _5=="string"&&(_5.match(/[\*\.]/)||_4))?!dojo.data.util.filter.patternToRegExp(_5,_4).test(_6):_6!=_5){return false;}}return true;},constructor:function(_7){this.zone=_7.zone;this.library=_7.library;this.target=dojo.replace(bfree.api.ChoiceLists.TRGT,[this.zone.subdomain,this.library.id]);this.schema=bfree.api.ChoiceList.schema;this.cache=true;this._initialize();this.store.matchesQuery=dojo.hitch(this,this._matchesQuery);},isValidItem:function(_8){var _9=this.inherited(arguments);var _a=_8.item;var _b=_8.choice_values;if(!_9){return;}if(_a.name.length<1){throw new Error("Choice List 'Name' is empty or invalid");}if((!_b)||(_b.length<1)){throw new Error("Choice List '"+_a.name+"' does not contain any values");}return true;}});bfree.api.ChoiceLists.TRGT="/zones/{0}/libraries/{1}/choice_lists";}