/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.XhrHelper"]){dojo._hasResource["bfree.api.XhrHelper"]=true;dojo.provide("bfree.api.XhrHelper");dojo.require("dojox.json.ref");dojo.require("bfree.api.Error");dojo.declare("bfree.api.XhrHelper",null,{});bfree.api.XhrHelper._doXhrAction=function(_1,_2){var _3=null;var _4=null;function _5(_6,_7){_3=_6;};function _8(_9,_a){_4=new bfree.api.Error(_9.responseText,_9);};_2.contentType="application/json";_2.handleAs="json";_2.sync=true;_2.load=_5;_2.error=_8;_1(_2);if(_4!=null){throw _4;}return _3;};bfree.api.XhrHelper.doGetAction=function(_b){var _c=(_b.getData)?dojo.toJson(_b.getData):null;var _d={url:_b.target,content:_c};return bfree.api.XhrHelper._doXhrAction(dojo.xhrGet,_d);};bfree.api.XhrHelper.doPostAction=function(_e){var _f=_e.postData;var _10=dojo.toJson(_f);var _11={url:_e.target,postData:_10};return bfree.api.XhrHelper._doXhrAction(dojo.xhrPost,_11);};bfree.api.XhrHelper.doPutAction=function(_12){var _13=_12.putData;var _14=dojo.toJson(_13);var _15={url:_12.target,putData:_14};return bfree.api.XhrHelper._doXhrAction(dojo.xhrPut,_15);};bfree.api.XhrHelper.authenticity_token=null;bfree.api.XhrHelper.originalXhr=dojo.xhr;dojo.xhr=function(_16,_17,_18){if(bfree.api.XhrHelper.authenticity_token!=null){if(_16.toUpperCase()=="POST"){var _19=(_17.postData)?dojo.fromJson(_17.postData):{};_19["authenticity_token"]=bfree.api.XhrHelper.authenticity_token;_17.postData=dojo.toJson(_19);}if(_16.toUpperCase()=="PUT"){var _1a=(_17.putData)?dojo.fromJson(_17.putData):{};_1a["authenticity_token"]=bfree.api.XhrHelper.authenticity_token;_17.putData=dojo.toJson(_1a);}if(_16.toUpperCase()=="DELETE"){_17.rawBody=dojo.toJson({authenticity_token:bfree.api.XhrHelper.authenticity_token});}}if((_17.headers)&&_17.headers.hasOwnProperty("Range")){_17.headers["dojo-Range"]=_17.headers["Range"];}return bfree.api.XhrHelper.originalXhr(_16,_17,_18);};}