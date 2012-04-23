/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Documents"]){dojo._hasResource["bfree.api.Documents"]=true;dojo.provide("bfree.api.Documents");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Document");dojo.require("bfree.api.Utilities");dojo.declare("bfree.api.Documents",[bfree.api._Collection],{library:null,_isUpdateable:function(_1){return false;},_softDelete:function(_2){var _3=dojo.replace(bfree.api.Documents.SDEL_TRGT,[this.zone.subdomain,this.library.getId(),_2.getId()]);var _4={};var _5=bfree.api.XhrHelper.doPutAction({target:_3,putData:_4});return _5;},constructor:function(_6){this.zone=_6.zone;this.library=_6.library;this.target=dojo.replace(bfree.api.Documents.TRGT,[this.zone.subdomain,this.library.id]);this.schema=bfree.api.Document.schema;this.cache=false;this.syncMode=false;this._initialize();this.store.isUpdateable=dojo.hitch(this,this._isUpdateable);},destroy:function(_7){var _8=_7.item;if((_8.isInstanceOf(bfree.api.Document))&&(_7.soft)){_8=this._softDelete(_8);this.store.onDelete(_8);}else{this.inherited("destroy",arguments);}},empty_recycling:function(_9){var _a=_9.zone;var _b=_9.library;var _c=dojo.replace(bfree.api.Documents.EMPTY,[_a.subdomain,_b.id]);var _d=bfree.api.XhrHelper.doPostAction({target:_c,postData:{}});return true;},export_query:function(_e){var _f=dojo.objectToQuery(_e.query);var _10=dojo.replace("sort({0}{1})",[(_e.sort.descending?"-":"+"),encodeURIComponent(_e.sort.attribute)]);var _11="json";switch(_e.type){case bfree.api.Documents.ExportTypes.CSV:_11="csv";break;case bfree.api.Documents.ExportTypes.PDF:_11="pdf";break;case bfree.api.Documents.ExportTypes.XML:_11="xml";break;}var url=dojo.replace(bfree.api.Documents.EXPORT_TRGT,[_e.zone.subdomain,_e.library.id,_f,_10,_11]);if(_e.type==bfree.api.Documents.ExportTypes.PDF){bfree.api.Utilities.viewUrl({windowBox:_e.windowBox,url:url,window_name:"versa_save"});}else{bfree.api.Utilities.saveUrl({url:url,window_name:"versa_save"});}},isValid:function(_12){this.validate(_12);return this.getState(bfree.api.Document.states.INVALID);},print_query:function(_13){var _14=dojo.objectToQuery(_13.query);var _15=dojo.replace("sort({0}{1})",[(_13.sort.descending?"-":"+"),encodeURIComponent(_13.sort.attribute)]);var url=dojo.replace(bfree.api.Documents.EXPORT_TRGT,[_13.zone.subdomain,_13.library.id,_14,_15,"html"]);bfree.api.Utilities.viewUrl({windowBox:_13.windowBox,url:url,window_name:"versa_printer"});}});bfree.api.Documents.States={pending:0,checked_in:1,checked_out:2,busy:16384,deleted:32768};bfree.api.Documents.ExportTypes={"NONE":0,"CSV":1,"PDF":2,"XML":3};bfree.api.Documents.TRGT="/zones/{0}/libraries/{1}/documents";bfree.api.Documents.PRINT_TRGT="/zones/{0}/libraries/{1}/documents?{2}&{3}";bfree.api.Documents.EXPORT_TRGT="/zones/{0}/libraries/{1}/documents.{4}?{2}&{3}";bfree.api.Documents.EMPTY="/zones/{0}/libraries/{1}/documents/empty";bfree.api.Documents.SDEL_TRGT="/zones/{0}/libraries/{1}/documents/{2}/soft_delete.json";bfree.api.Documents.isCheckedOut=function(_16){var _17;if(_16.document){_17=_16.document.state;}else{if(_16.state){_17=_16.state;}}return ((_17&bfree.api.Documents.States.checked_out)>0);};bfree.api.Documents.isBusy=function(_18){return ((_18.state&bfree.api.Documents.States.busy)>0);};}