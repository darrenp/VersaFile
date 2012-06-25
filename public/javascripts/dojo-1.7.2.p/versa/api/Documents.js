//>>built
define("versa/api/Documents",["dojo/_base/declare","versa/api/_Collection","versa/api/Document","versa/api/Utilities"],function(_1){var o=_1("versa.api.Documents",[versa.api._Collection],{library:null,_isUpdateable:function(_2){return false;},_softDelete:function(_3){var _4=dojo.replace(versa.api.Documents.SDEL_TRGT,[this.zone.subdomain,this.library.getId(),_3.getId()]);var _5={};var _6=versa.api.XhrHelper.doPutAction({target:_4,putData:_5});return _6;},constructor:function(_7){this.zone=_7.zone;this.library=_7.library;this.target=dojo.replace(versa.api.Documents.TRGT,[this.zone.subdomain,this.library.id]);this.schema=versa.api.Document.schema;this.cache=false;this.syncMode=false;this._initialize();this.store.isUpdateable=dojo.hitch(this,this._isUpdateable);},destroy:function(_8){var _9=_8.item;if((_9.isInstanceOf(versa.api.Document))&&(_8.soft)){_9=this._softDelete(_9);this.store.onDelete(_9);}else{this.inherited("destroy",arguments);}},empty_recycling:function(_a){var _b=_a.zone;var _c=_a.library;var _d=dojo.replace(versa.api.Documents.EMPTY,[_b.subdomain,_c.id]);var _e=versa.api.XhrHelper.doPostAction({target:_d,postData:{}});return true;},export_query:function(_f){var _10=dojo.objectToQuery(_f.query);var _11=dojo.replace("sort({0}{1})",[(_f.sort.descending?"-":"+"),encodeURIComponent(_f.sort.attribute)]);var _12="json";switch(_f.type){case versa.api.Documents.ExportTypes.CSV:_12="csv";break;case versa.api.Documents.ExportTypes.PDF:_12="pdf";break;case versa.api.Documents.ExportTypes.XML:_12="xml";break;}var url=dojo.replace(versa.api.Documents.EXPORT_TRGT,[_f.zone.subdomain,_f.library.id,_10,_11,_12]);if(_f.type==versa.api.Documents.ExportTypes.PDF){versa.api.Utilities.viewUrl({windowBox:_f.windowBox,url:url,window_name:"versa_save"});}else{versa.api.Utilities.saveUrl({url:url,window_name:"versa_save"});}},isValid:function(_13){this.validate(_13);return this.getState(versa.api.Document.states.INVALID);},print_query:function(_14){var _15=dojo.objectToQuery(_14.query);var _16=dojo.replace("sort({0}{1})",[(_14.sort.descending?"-":"+"),encodeURIComponent(_14.sort.attribute)]);var url=dojo.replace(versa.api.Documents.EXPORT_TRGT,[_14.zone.subdomain,_14.library.id,_15,_16,"html"]);versa.api.Utilities.viewUrl({windowBox:_14.windowBox,url:url,window_name:"versa_printer"});}});o.States={pending:0,checked_in:1,checked_out:2,busy:16384,deleted:32768};o.ExportTypes={"NONE":0,"CSV":1,"PDF":2,"XML":3};o.TRGT="/zones/{0}/libraries/{1}/documents";o.PRINT_TRGT="/zones/{0}/libraries/{1}/documents?{2}&{3}";o.EXPORT_TRGT="/zones/{0}/libraries/{1}/documents.{4}?{2}&{3}";o.EMPTY="/zones/{0}/libraries/{1}/documents/empty";o.SDEL_TRGT="/zones/{0}/libraries/{1}/documents/{2}/soft_delete.json";o.isCheckedOut=function(_17){var _18;if(_17.document){_18=_17.document.state;}else{if(_17.state){_18=_17.state;}}return ((_18&versa.api.Documents.States.checked_out)>0);};o.isBusy=function(_19){return ((_19.state&versa.api.Documents.States.busy)>0);};return o;});