/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.PropertyMappings"]){dojo._hasResource["bfree.api.PropertyMappings"]=true;dojo.provide("bfree.api.PropertyMappings");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Error");dojo.require("bfree.api.PropertyMapping");dojo.declare("bfree.api.PropertyMappings",[bfree.api._Collection],{constructor:function(_1){this.zone=_1.zone;this.library=_1.library;this.target=dojo.replace(bfree.api.PropertyMappings.TRGT,[this.zone.subdomain,this.library.id]);this.schema=bfree.api.PropertyMapping.schema;this.cache=true;this._initialize();}});bfree.api.PropertyMappings.TRGT="/zones/{0}/libraries/{1}/property_mappings";}