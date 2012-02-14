/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.PropertyDefinitions"]){dojo._hasResource["bfree.api.PropertyDefinitions"]=true;dojo.provide("bfree.api.PropertyDefinitions");dojo.require("bfree.api._Collection");dojo.require("bfree.api.PropertyDefinition");dojo.declare("bfree.api.PropertyDefinitions",[bfree.api._Collection],{library:null,constructor:function(_1){this.zone=_1.zone;this.library=_1.library;this.target=dojo.replace(bfree.api.PropertyDefinitions.TRGT,[this.zone.subdomain,this.library.id]);this.schema=bfree.api.PropertyDefinition.schema;this.cache=true;this._initialize();},fetchByDbName:function(_2){var _3=null;function _4(_5,_6){dojo.some(_5,function(_7){if(_7.getDbName()==_2){_3=_7;return false;}},this);};this.store.fetch({query:{},queryOptions:{cache:true},onComplete:_4});return _3;},getNameProperty:function(){var _8=null;this.forEach(function(_9){if(_9.is_name){_8=_9;}},this);return _8;}});bfree.api.PropertyDefinitions.TRGT="/zones/{0}/libraries/{1}/property_definitions";}