/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.file.MultiUploader"]){dojo._hasResource["bfree.widget.file.MultiUploader"]=true;dojo.provide("bfree.widget.file.MultiUploader");dojo.require("bfree.api.XhrHelper");dojo.require("bfree.widget._Grid");dojo.require("bfree.widget.Uploader");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.ProgressBar");dojo.require("dijit.form.Form");dojo.require("dijit.form.TextBox");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.require("bfree.api.ItemFileWriteStore");dojo.declare("bfree.widget.file.MultiUploader",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("bfree/widget/file","template/MultiUploader.html","<div style=\"height:100%;width:100%;\">\n\n<div    dojoAttachPoint=\"mainNode\"\n        dojoType=\"dijit.layout.BorderContainer\"\n        design=\"sidebar\"\n        gutters=\"false\"\n        style=\"height:100%;width:100%\">\n\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            splitter=\"false\"\n            region=\"leading\"\n            style=\"padding:4px 0 0 8px;width:120px;position:relative;overflow:hidden;\">\n\n        <div dojoAttachPoint=\"formNode\">\n            <input dojoAttachPoint=\"tokenNode\"></input>\n            <input dojoAttachPoint=\"uploadTypeNode\"></input>\n            <div dojoAttachPoint=\"uploaderNode\" style=\"width:118px;height:32px;\"></div>\n        </div>\n\n    </div>\n\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            splitter=\"false\"\n            region=\"center\"\n            style=\"overflow:hidden;padding:7px 12px 10px 4px\">\n\n        <div dojoAttachPoint=\"progressNode\"></div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_frmUpload:null,_prgBar:null,_txtToken:null,_txtUploadType:null,_uploader:null,isPackage:false,multiple:true,scrollOnFocus:false,zone:null,_onBeforeUpload:function(_1){dojo.forEach(_1,function(_2,_3){this.onFileSelect({name:_2.name,size:_2.size,type:_2.type});},this);this._prgBar.set("style",{opacity:1});},_onAfterUpload:function(_4){dojo.forEach(_4,function(_5,_6){this.onFileUploaded(_5);},this);dojo.fadeOut({node:this._prgBar.domNode,duration:2000,onEnd:dojo.hitch(this,function(){this._prgBar.set("value",(this._uploader.uploadType=="iframe")?(Infinity):0);})}).play();},_onProgress:function(_7){this._prgBar.set("value",_7.decimal*100);},_setUrlAttr:function(_8){this._uploader.set("url",_8);},clean:function(){bfree.api.Uploader.clean({zone:this.zone});},constructor:function(_9){},destroy:function(){if(this._uploader!=null){this._uploader.destroyRecursive();this._uploader=null;}this.inherited("destroy",arguments);},onFileSelect:function(_a){},onFileUploaded:function(_b){},postCreate:function(){this.inherited("postCreate",arguments);this._frmUpload=new dijit.form.Form({method:"POST",encType:"multipart/form-data"},this.formNode);this._txtToken=new dijit.form.TextBox({name:"authenticity_token",type:"hidden",value:bfree.api.XhrHelper.authenticity_token},this.tokenNode);this._uploader=new bfree.widget.Uploader({label:"Choose File(s)...",multiple:this.multiple,uploadOnSelect:false,url:bfree.api.Uploader.getUploadUrl({zone:this.zone,isPackage:this.isPackage}),style:"width:108px",maxDocuments:50,onBeforeUpload:dojo.hitch(this,this._onBeforeUpload),onAfterUpload:dojo.hitch(this,this._onAfterUpload),onProgress:dojo.hitch(this,this._onProgress)},this.uploaderNode);this._txtUploadType=new dijit.form.TextBox({name:"upload_type",type:"hidden",value:this._uploader.uploadType},this.uploadTypeNode);this._prgBar=new dijit.ProgressBar({value:(this._uploader.uploadType=="iframe")?(Infinity):0,style:"margin-right:32px;width:100%;opacity:0"},this.progressNode);},redraw:function(){if(this.uploadType=="flash"){if(this._uploader!=null){this._uploader.destroy();this._uploader=null;}}},startup:function(){this.inherited("startup",arguments);this.mainNode.resize();this._uploader.set("scrollOnFocus",false);dojo.fadeOut({node:this._prgBar.domNode,duration:10,onEnd:dojo.hitch(this,function(){this._prgBar.set("value",(this._uploader.uploadType=="iframe")?(Infinity):0);})}).play();}});}