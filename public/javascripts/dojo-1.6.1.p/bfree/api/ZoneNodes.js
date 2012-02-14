/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.ZoneNodes"]){dojo._hasResource["bfree.api.ZoneNodes"]=true;dojo.provide("bfree.api.ZoneNodes");dojo.require("bfree.api._Collection");dojo.require("bfree.api.ZoneNode");dojo.declare("bfree.api.ZoneNodes",[bfree.api._Collection],{constructor:function(_1){this.target=bfree.api.ZoneNodes.TRGT;this.schema=bfree.api.ZoneNode.schema;this.cache=true;this._initialize();},updateUsage:function(_2){var _3=bfree.api.XhrHelper.doPostAction({target:dojo.replace("/zone_nodes/{0}/update_current_usage.json",[_2.id]),postData:[]});_2.current_disk_space=_3.current_disk_space;_2.current_users=_3.current_users;this.loadItem({item:_2});return _2;},deploy:function(_4){var _5=bfree.api.XhrHelper.doPostAction({target:dojo.replace("/zone_nodes/{0}/deploy.json",[_4.id]),postData:[]});_4.deployed=_5.deployed;this.loadItem({item:_4});return _4;}});bfree.api.ZoneNodes.TRGT="/zone_nodes";}