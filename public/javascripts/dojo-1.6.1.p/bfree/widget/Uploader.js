/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.Uploader"]){dojo._hasResource["bfree.widget.Uploader"]=true;dojo.provide("bfree.widget.Uploader");dojo.require("bfree.api.Uploader");dojo.require("bfree.api.Utilities");dojo.require("dojox.form.Uploader");if(!dojo.isIE||bfree.api.Uploader.useFlash()){dojo["require"]("dojox.form.uploader.plugins.Flash");}else{dojo["require"]("bfree.widget.IFrame");dojox.form.addUploaderPlugin(bfree.widget.IFrame);}dojo.declare("bfree.widget.Uploader",dojox.form.Uploader,{documents:0,maxDocuments:100,size:0,maxSize:314572800,devMode:false,isDebug:false,serverTimeout:60000,_createFlashUploader:function(){var _1=this.getUrl();if(_1){if(_1.toLowerCase().indexOf("http")<0&&_1.indexOf("/")!=0){var _2=window.location.href.split("/");_2.pop();_2=_2.join("/")+"/";_1=_2+_1;}}else{}this.inputNode=dojo.create("div",{className:"dojoxFlashNode"},this.domNode,"first");dojo.style(this.inputNode,{position:"absolute",top:"-2px",width:this.btnSize.w+"px",height:this.btnSize.h+"px",opacity:0});var w=this.btnSize.w+8;var h=this.btnSize.h+8;var _3={expressInstall:true,path:(this.swfPath.uri||this.swfPath)+"?cb_"+(new Date().getTime()),width:w,height:h,allowScriptAccess:"always",allowNetworking:"all",vars:{uploadDataFieldName:this.flashFieldName||this.name+"Flash",uploadUrl:_1,uploadOnSelect:this.uploadOnSelect,deferredUploading:this.deferredUploading||0,selectMultipleFiles:this.multiple,id:this.id,devMode:this.devMode,isDebug:this.isDebug,serverTimeout:this.serverTimeout},params:{scale:"noscale",wmode:"transparent",wmode:"opaque",allowScriptAccess:"always",allowNetworking:"all"}};this.flashObject=new dojox.embed.Flash(_3,this.inputNode);this.flashObject.onError=dojo.hitch(function(_4){});this.flashObject.onReady=dojo.hitch(this,function(){this.onReady(this);});this.flashObject.onLoad=dojo.hitch(this,function(_5){this.flashMovie=_5;this.flashReady=true;this.onLoad(this);});this._connectFlash();},_upload:function(_6){if((this.documents+_6.length)>this.maxDocuments){alert(dojo.replace("You can only upload {0} documents at once.",[this.maxDocuments]));this.reset();if(this.flashObject){this.flashObject.movie.reset();this._files=[];this._fileMap={};}return;}this.documents+=_6.length;var _7=0;dojo.forEach(_6,function(_8){_7+=_8.size;},this);if(this.size+_7>this.maxSize){alert(dojo.replace("You can only upload {0} at once.",[bfree.api.Utilities.readablizeBytes({bytes:this.maxSize})]));this.reset();if(this.flashObject){this.flashObject.movie.reset();this._files=[];this._fileMap={};}return;}this.onBeforeUpload(_6);if(this.uploadType=="iframe"){this.upload({preventDefault:function(){},stopPropagation:function(){}});}else{this.upload({authenticity_token:bfree.api.XhrHelper.authenticity_token,upload_type:this.uploadType});}},onAfterUpload:function(_9){},onBeforeUpload:function(_a){},constructor:function(_b){this.documents=0;this.uploadOnSelect=false;if(dojo.isOpera){this.force="iframe";}if(dojo.isIE&&!bfree.api.Uploader.useFlash()){this.onError=dojo.hitch(this,function(_c){this.reset();this.onErrorUpload(_c);});}},onErrorUpload:function(_d){},onChange:function(_e){var _f=bfree.widget.Uploader.buildUploadFnRef(this,_e);setTimeout(_f,1000);},onComplete:function(evt){var _10=[];try{this.reset();if(evt.hasOwnProperty("uploadedfiles")){_10=evt.uploadedfiles;}else{if(bfree.api.Utilities.isArray(evt)){for(var i=0;i<evt.length;i++){_10.push({name:decodeURI(evt[i].name),content_type:evt[i].type,size:evt[i].size,error:evt[i].error});}}else{_10.push({name:decodeURI(evt.name),content_type:evt.type,size:evt.size,error:evt.error});}}}catch(e){}this.onAfterUpload(_10);},onProgress:function(evt){},beforeUpload:function(){},onUploadComplete:function(_11){},postCreate:function(){if(this.uploadType=="html5"){var _12=this.uploadOnSelect;this.connectForm();this.inherited("postCreate",arguments);this.uploadOnSelect=_12;if(this.uploadOnSelect){dojo.connect(this,"onChange",function(_13){this.upload(_13[0]);});}}else{this.inherited("postCreate",arguments);}},uploadFlash:function(_14){this.onBegin(this.getFileList());this.flashMovie.doUpload(_14);}});bfree.widget.Uploader.buildUploadFnRef=function(_15,evt){return (function(){_15._upload(evt);});};}