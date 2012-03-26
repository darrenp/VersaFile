/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["versa.api.Formatter"]){dojo._hasResource["versa.api.Formatter"]=true;dojo.provide("versa.api.Formatter");dojo.declare("versa.api.Formatter",null,{});versa.api.Formatter.formatDateTime=function(_1){var _2=_1;if(String.isEmpty(_1)){return "";}if(typeof _1=="string"){_2=dojo.date.stamp.fromISOString(_1);}return dojo.date.locale.format(_2,{selector:"date",formatLength:"medium"});};}