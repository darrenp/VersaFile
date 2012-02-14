/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Groups"]){dojo._hasResource["bfree.api.Groups"]=true;dojo.provide("bfree.api.Groups");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Group");dojo.declare("bfree.api.Groups",[bfree.api._Collection],{zone:null,_matchesQuery:function(_1,_2){if(dojo.isArray(_1)||(_1.hasOwnProperty("user_id"))){return false;}var _3=_2.query;var _4=_2.queryOptions&&_2.queryOptions.ignoreCase;for(var i in _3){var _5=_3[i];var _6=this.getValue(_1,i);if((typeof _5=="string"&&(_5.match(/[\*\.]/)||_4))?!dojo.data.util.filter.patternToRegExp(_5,_4).test(_6):_6!=_5){return false;}}return true;},constructor:function(_7){this.zone=_7.zone;this.target=dojo.replace(bfree.api.Groups.TRGT,this.zone);this.schema=bfree.api.Group.schema;this.cache=true;this._initialize();this.store.matchesQuery=dojo.hitch(this,this._matchesQuery);},getAdmin:function(){var _8=null;this.forEach(function(_9){if(_9.is_admin){_8=_9;}},this);return _8;},getEveryone:function(){var _a=null;this.forEach(function(_b){if(_b.is_everyone){_a=_b;}},this);return _a;}});bfree.api.Groups.TRGT="/zones/{subdomain}/groups";}