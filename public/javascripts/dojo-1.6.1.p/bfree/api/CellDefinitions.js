/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.CellDefinitions"]){dojo._hasResource["bfree.api.CellDefinitions"]=true;dojo.provide("bfree.api.CellDefinitions");dojo.require("bfree.api.CellDefinition");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Error");dojo.require("bfree.widget.StatusIcon");dojo.declare("bfree.api.CellDefinitions",[bfree.api._Collection],{constructor:function(_1){this.zone=_1.zone;this.library=_1.library;this.target=dojo.replace(bfree.api.CellDefinitions.TRGT,[this.zone.subdomain,this.library.id]);this.schema=bfree.api.CellDefinition.schema;this.cache=true;this._initialize();},isValidItem:function(_2){var _3=this.inherited(arguments);var _4=_2.item;if(!_3){return;}if((!_4.width)||(_4.width.length<1)){throw new Error("Cell Definition 'Width' property is empty or invalid");}return true;}});bfree.api.CellDefinitions.TRGT="/zones/{0}/libraries/{1}/cell_definitions";}