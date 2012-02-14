/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Version"]){dojo._hasResource["bfree.api.Version"]=true;dojo.provide("bfree.api.Version");dojo.require("bfree.api._Object");dojo.declare("bfree.api.Version",[bfree.api._Object],{zone:null,library:null,document:null,constructor:function(_1){if(_1){dojo.safeMixin(this,_1);}}});bfree.api.Version.schema={type:"object",properties:{"id":{type:"integer"},"binary_file_name":{type:"string","default":""},"binary_content_type":{type:"string","default":""}},prototype:new bfree.api.Version()};}