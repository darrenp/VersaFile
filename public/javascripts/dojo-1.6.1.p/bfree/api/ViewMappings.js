/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.ViewMappings"]){dojo._hasResource["bfree.api.ViewMappings"]=true;dojo.provide("bfree.api.ViewMappings");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Error");dojo.require("bfree.api.ViewMapping");dojo.declare("bfree.api.ViewMappings",[bfree.api._Collection],{constructor:function(_1){this.zone=_1.zone;this.library=_1.library;this.target=dojo.replace(bfree.api.ViewMappings.TRGT,[this.zone.subdomain,this.library.id]);this.schema=bfree.api.ViewMapping.schema;this.cache=false;this._initialize();},getMapping:function(_2,_3){return this.query({query:dojo.replace("?folder_id={0}&user_id={1}",[_2,_3])});}});bfree.api.ViewMappings.TRGT="/zones/{0}/libraries/{1}/view_mappings";}