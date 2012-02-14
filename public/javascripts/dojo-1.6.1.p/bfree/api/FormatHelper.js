/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.FormatHelper"]){dojo._hasResource["bfree.api.FormatHelper"]=true;dojo.provide("bfree.api.FormatHelper");dojo.declare("bfree.api.FormatHelper",null,{});bfree.api.FormatHelper.convertToDate=function(_1){var _2=_1.date_string;return dojo.date.stamp.fromISOString(_2);};bfree.api.FormatHelper.formatDateValue=function(_3){var _4=_3.date_value;if(typeof _4=="string"){_4=bfree.api.FormatHelper.convertToDate({date_string:_4});}return _4;};}