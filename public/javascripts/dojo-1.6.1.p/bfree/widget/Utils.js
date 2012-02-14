/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.Utils"]){dojo._hasResource["bfree.widget.Utils"]=true;dojo.provide("bfree.widget.Utils");dojo.declare("bfree.widget.Utils",null,{});bfree.widget.Utils.units=["bytes","KB","MB","GB","TB","PB"];bfree.widget.Utils.readablizeBytes=function(_1){var _2=_1.bytes;if((_2==null)||(_2==Number.NaN)){return "???";}if(_2<1){return "0 bytes";}var e=Math.floor(Math.log(_2)/Math.log(1024));return (_2/Math.pow(1024,Math.floor(e))).toFixed(2)+" "+bfree.widget.Utils.units[e];};}