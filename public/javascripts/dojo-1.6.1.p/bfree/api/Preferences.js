/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Preferences"]){dojo._hasResource["bfree.api.Preferences"]=true;dojo.provide("bfree.api.Preferences");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Preference");dojo.require("dojo.data.ItemFileReadStore");dojo.declare("bfree.api.Preferences",[bfree.api._Collection],{constructor:function(_1){this.zone=_1.zone;this.library=_1.library;this.target=dojo.replace(bfree.api.Preferences.TRGT,[this.zone.subdomain,this.library.id]);this.schema=bfree.api.Preference.schema;this.cache=true;this._dateEntryFormats=new dojo.data.ItemFileReadStore({data:{"identifier":"id","label":"name","items":[{id:bfree.api.Preference.dateEntryFormats._date,name:"Date only"},{id:bfree.api.Preference.dateEntryFormats._time,name:"Time only"},{id:bfree.api.Preference.dateEntryFormats._datetime,name:"Date and Time"}]},clearOnClose:true});this._initialize();},getDateEntryFormat:function(){var _2=this.store.fetch({query:{name:"Date entry format"}}).results[0];return (_2)?parseInt(this.getValue(_2,"value")):1;}});bfree.api.Preferences.TRGT="/zones{0}/libraries/${1}/preferences";}