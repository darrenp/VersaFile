/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.References"]){dojo._hasResource["bfree.api.References"]=true;dojo.provide("bfree.api.References");dojo.require("bfree.api._Collection");dojo.require("bfree.api.Reference");dojo.declare("bfree.api.References",bfree.api._Collection,{library:null,zone:null,_isUpdateable:function(_1){return false;},_softDelete:function(_2){var _3=dojo.replace(bfree.api.References.SDEL_TRGT,[this.zone.subdomain,this.library.getId(),_2.getId()]);var _4={};var _5=bfree.api.XhrHelper.doPutAction({target:_3,putData:_4});return _5;},constructor:function(_6){this.zone=_6.zone;this.library=_6.library;this.target=dojo.replace(bfree.api.References.TRGT,[this.zone.subdomain,this.library.id]);this.schema=bfree.api.Reference.schema;this.cache=false;this._initialize();this.store.isUpdateable=dojo.hitch(this,this._isUpdateable);},destroy:function(_7){var _8=_7.item;if((_8.isInstanceOf(bfree.api.Reference))&&(_7.soft)){_8=this._softDelete(_8);this.store.onDelete(_8);}else{this.inherited("destroy",arguments);}},export_query:function(_9){var _a=dojo.objectToQuery(_9.query);var _b=dojo.replace("sort({0}{1})",[(_9.sort.descending?"-":"+"),encodeURIComponent(_9.sort.attribute)]);var _c="json";switch(_9.type){case bfree.api.References.ExportTypes.CSV:_c="csv";break;case bfree.api.References.ExportTypes.PDF:_c="pdf";break;case bfree.api.References.ExportTypes.XML:_c="xml";break;}var _d=dojo.replace(bfree.api.References.EXPORT_TRGT,[_9.zone.subdomain,_9.library.id,_a,_b,_c]);if(_9.type==bfree.api.Documents.ExportTypes.PDF){bfree.api.Utilities.viewUrl({windowBox:_9.windowBox,url:_d,window_name:"versa_save"});}else{bfree.api.Utilities.saveUrl({url:_d,window_name:"versa_save"});}},print_query:function(_e){var _f=dojo.objectToQuery(_e.query);var _10=dojo.replace("sort({0}{1})",[(_e.sort.descending?"-":"+"),encodeURIComponent(_e.sort.attribute)]);var url=dojo.replace(bfree.api.References.PRINT_TRGT,[_e.zone.subdomain,_e.library.id,_f,_10,"html"]);bfree.api.Utilities.viewUrl({windowBox:_e.windowBox,url:url,window_name:"versa_printer"});}});bfree.api.References.ExportTypes={"NONE":0,"CSV":1,"PDF":2,"XML":3};bfree.api.References.TRGT="/zones/{0}/libraries/{1}/references";bfree.api.References.SDEL_TRGT="/zones/{0}/libraries/{1}/references/{2}/soft_delete.json";bfree.api.References.PRINT_TRGT="/zones/{0}/libraries/{1}/references?{2}&{3}";bfree.api.References.EXPORT_TRGT="/zones/{0}/libraries/{1}/references.{4}?{2}&{3}";}