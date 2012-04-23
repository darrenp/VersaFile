/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Utilities"]){dojo._hasResource["bfree.api.Utilities"]=true;dojo.provide("bfree.api.Utilities");dojo.declare("bfree.api.Utilities",null,{});bfree.api.Utilities.uniqueIdBase=(new Date()).getTime();bfree.api.Utilities.randomNumber=function(_1){var l=_1.lowerBound;var u=_1.upperBound;return (Math.floor(Math.random()*(u-l))+l);};bfree.api.Utilities.readablizeBytes=function(_2){var _3="";var _4=_2.bytes;if((_4==null)||(_4==Number.NaN)){return "???";}if(_4<1){return "0 bytes";}var s=["bytes","KB","MB","GB","TB","PB"];var e=Math.floor(Math.log(_4)/Math.log(1024));if(e>0){_3=(_4/Math.pow(1024,Math.floor(e))).toFixed(2)+" "+s[e];}else{_3=(_4/Math.pow(1024,Math.floor(e))).toFixed(0)+" "+s[e];}return _3;};bfree.api.Utilities.readabilizeSeconds=function(_5){var s=_5.seconds;var d=Number(s);var h=Math.floor(d/3600);var m=Math.floor(d%3600/60);var s=Math.floor(d%3600%60);return ((h>0?h+":":"")+(m>0?(h>0&&m<10?"0":"")+m+":":"0:")+(s<10?"0":"")+s);};bfree.api.Utilities.generateUniqueId=function(_6){return bfree.api.Utilities.uniqueIdBase++;};bfree.api.Utilities.isArray=function(_7){return _7.constructor==Array;};bfree.api.Utilities.generateUniqueName=function(_8){var _9=_8.names;var _a=_8.base_name;var _b=(_8.appendix)?_8.appendix:"({index})";var _c=_a;var i=0;while(++i){var _d=dojo.indexOf(_9,_c);if(_d<0){break;}_c=dojo.replace("{baseName}"+_b,{baseName:_a,index:i});}return _c;};bfree.api.Utilities.getFileExtension=function(_e){var _f=_e.file_name;var pos=_f.lastIndexOf(".");if(pos<1){return "";}return _f.substring(pos);};bfree.api.Utilities.getFileName=function(_10){var _11=_10.file_name;var pos=_11.lastIndexOf(".");if(pos<1){return _11;}return _11.substring(0,pos);};bfree.api.Utilities.saveUrl=function(_12){var url=_12.url;var _13=_12.window_name;var _14=dojo.string.substitute("width=10,height=10,top=-20,left=-20,toolbar=0,resizable=1,location=0,directories=0,status=0,menubar=0",[]);window.location.href=url;};bfree.api.Utilities.getBox=function(_15){var _16=dojo.window.getBox();var _17=_16.w;var _18=_16.h;var _19=_17*_15.scale;var _1a=_18*_15.scale;var _1b=(_18/2)-(_1a/2);var _1c=(_17/2)-(_19/2);return {w:_19,h:_1a,t:_1b,l:_1c};};bfree.api.Utilities.getFormatStore=function(){var _1d=[{id:bfree.api.DataTypes.types.BOOLEAN+":"+bfree.api.CellDefinition.formats.none,format_id:bfree.api.CellDefinition.formats.none,data_type_id:bfree.api.DataTypes.types.BOOLEAN,name:"None"},{id:bfree.api.DataTypes.types.DATETIME+":"+bfree.api.CellDefinition.formats.none,format_id:bfree.api.CellDefinition.formats.none,data_type_id:bfree.api.DataTypes.types.DATETIME,name:"None"},{id:bfree.api.DataTypes.types.DATETIME+":"+bfree.api.CellDefinition.formats.datetime,format_id:bfree.api.CellDefinition.formats.datetime,data_type_id:bfree.api.DataTypes.types.DATETIME,name:"Date"},{id:bfree.api.DataTypes.types.FLOAT+":"+bfree.api.CellDefinition.formats.none,format_id:bfree.api.CellDefinition.formats.none,data_type_id:bfree.api.DataTypes.types.FLOAT,name:"None"},{id:bfree.api.DataTypes.types.INTEGER+":"+bfree.api.CellDefinition.formats.none,format_id:bfree.api.CellDefinition.formats.none,data_type_id:bfree.api.DataTypes.types.INTEGER,name:"None"},{id:bfree.api.DataTypes.types.INTEGER+":"+bfree.api.CellDefinition.formats.size,format_id:bfree.api.CellDefinition.formats.size,data_type_id:bfree.api.DataTypes.types.INTEGER,name:"File Size"},{id:bfree.api.DataTypes.types.STRING+":"+bfree.api.CellDefinition.formats.none,format_id:bfree.api.CellDefinition.formats.none,data_type_id:bfree.api.DataTypes.types.STRING,name:"None"},{id:bfree.api.DataTypes.types.TEXT+":"+bfree.api.CellDefinition.formats.none,format_id:bfree.api.CellDefinition.formats.none,data_type_id:bfree.api.DataTypes.types.TEXT,name:"None"}];return new bfree.api.ItemFileWriteStore({data:{identifier:"id",label:"name",items:_1d}});};bfree.api.Utilities.viewUrl=function(_1e){var box=_1e.windowBox;var url=_1e.url;var _1f=_1e.window_name;var _20=dojo.string.substitute("width=${0},height=${1},top=${2},left=${3},toolbar=0,resizable=1,location=0,directories=0,status=0,menubar=0,scrollbars=1",[box.w,box.h,box.t,box.l]);window.open(url,_1f,_20).focus();};bfree.api.Utilities.formatDate=function(_21){var _22=(_21.getUTCMonth()+1).toString();var _23=_21.getUTCDate().toString();var _24=_21.getUTCHours().toString();_22=_22.length==1?"0"+_22:_22;_23=_23.length==1?"0"+_23:_23;_24=_24.length==1?"0"+_24:_24;return _21.getUTCFullYear()+"-"+_22+"-"+_23+"T"+_24+":00:00Z";};bfree.api.Utilities.validateEmail=function(str){var _25=str.lastIndexOf("@");if(_25<1){return false;}if(_25==str.length-1){return false;}if(_25>64){return false;}if(str.length-_25>255){return false;}var _26=str.lastIndexOf(".");if(_26>_25+1&&_26<str.length-1){return true;}if(str.charAt(_25+1)=="["&&str.charAt(str.length-1)=="]"){return true;}return false;};}