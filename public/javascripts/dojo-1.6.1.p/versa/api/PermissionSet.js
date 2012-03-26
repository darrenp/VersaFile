/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["versa.api.PermissionSet"]){dojo._hasResource["versa.api.PermissionSet"]=true;dojo.provide("versa.api.PermissionSet");dojo.declare("versa.api.PermissionSet",null,{_values:null,constructor:function(_1){var _2=(_1)?_1:false;this._values=new Array();for(var p in versa.api.PermissionIndices){var _3=versa.api.PermissionIndices[p];this._values[_3]=_2;}},andSet:function(_4){var _5=new versa.api.PermissionSet(true);for(var p in versa.api.PermissionIndices){var _6=versa.api.PermissionIndices[p];_5._values[_6]=(this._values[_6]&&_4._values[_6]);}return _5;},orSet:function(_7){var _8=new versa.api.PermissionSet();for(var p in versa.api.PermissionIndices){var _9=versa.api.PermissionIndices[p];_8._values[_9]=(this._values[_9]||_7._values[_9]);}return _8;},getValue:function(_a){return this._values[_a];},setValue:function(_b,_c){this._values[_b]=_c;}});versa.api.PermissionIndices={"CREATE":0,"VIEW":1,"COPY":2,"EDIT":3,"MOVE":4,"CKO":5,"CKI":6,"CANCEL_CKO":7,"VERSION":8,"DELETE":9,"SECURE":10};}