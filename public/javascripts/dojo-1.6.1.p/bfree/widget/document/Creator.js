/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.document.Creator"]){dojo._hasResource["bfree.widget.document.Creator"]=true;dojo.provide("bfree.widget.document.Creator");dojo.require("bfree.api.Document");dojo.require("bfree.widget._DialogWidget");dojo.require("bfree.widget.document.Editor");dojo.require("bfree.widget.document.FileGrid");dojo.require("bfree.widget.file.MultiUploader");dojo.require("bfree.widget.file.Preview");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.require("dojox.fx._base");dojo.declare("bfree.widget.document.Creator",[dijit._Widget,dijit._Templated,bfree.widget._DialogWidget],{templateString:dojo.cache("bfree/widget/document","template/Creator.html","<div style=\"height:100%;width:100%;position:relative\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        dojoAttachPoint=\"mainContainer\"\n        design=\"sidebar\"\n        gutters=\"false\"\n        style=\"height:100%;width:100%;\">\n\n    <div   dojoType=\"dijit.layout.ContentPane\"\n           dojoAttachPoint=\"previewPane\"\n           splitter=\"false\"\n           region=\"center\"\n           style=\"display:none\">\n\n        <div dojoAttachPoint=\"previewNode\"></div>\n\n    </div>\n\n    <div    dojoType=\"dijit.layout.BorderContainer\"\n            design=\"headline\"\n            gutters=\"false\"\n            region=\"right\"\n            splitter=\"false\"\n            style=\"width:480px\">\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                dojoAttachPoint=\"headerPane\"\n                region=\"top\"\n                splitter=\"false\"\n                class=\"versaTopHeader\"\n                style=\"height:12px;position:relative;\">\n\n            <span dojoAttachPoint=\"showPreviewNode\" style=\"position:absolute;left:8px;\">\n                <a href=\"javascript://\" class=\"versaLink\" dojoAttachEvent=\"onclick: _onShowPreview\">Show Preview</a>\n            </span>\n\n            <span dojoAttachPoint=\"hidePreviewNode\" style=\"position:absolute;left:8px;opacity:0;display:none\">\n                <a href=\"javascript://\" class=\"versaLink\" dojoAttachEvent=\"onclick: _onHidePreview\">Hide Preview</a>\n            </span>\n\n            <span style=\"position:absolute;right:16px;\">\n                File in Folder: <span dojoAttachPoint=\"folderNameNode\" class=\"dijitBoldLabel\"></span>\n            </span>\n\n        </div>\n\n        <div    dojoType=\"dijit.layout.BorderContainer\"\n                design=\"headline\"\n                gutters=\"false\"\n                region=\"center\"\n                splitter=\"false\">\n\n            <div    dojoType=\"dijit.layout.ContentPane\"\n                    region=\"top\"\n                    splitter=\"false\"\n                    style=\"height:32px;padding:4px 0 4px 0\">\n\n                <div dojoAttachPoint=\"uploaderNode\"></div>\n\n            </div>\n\n            <div    dojoType=\"dijit.layout.BorderContainer\"\n                    design=\"headline\"\n                    gutters=\"false\"\n                    region=\"center\"\n                    splitter=\"false\">\n\n                <div    dojoType=\"dijit.layout.ContentPane\"\n                        region=\"top\"\n                        splitter=\"false\"\n                        style=\"height:96px;padding:0 8px 8px 8px\">\n\n                        <div dojoAttachPoint=\"fileGridNode\"></div>\n\n                    </div>\n\n                <div    dojoType=\"dijit.layout.BorderContainer\"\n                        design=\"headline\"\n                        gutters=\"false\"\n                        region=\"center\"\n                        splitter=\"false\">\n\n                    <div    dojoType=\"dijit.layout.ContentPane\"\n                            dojoAttachPoint=\"midTitlePane\"\n                            region=\"top\"\n                            splitter=\"false\"\n                            class=\"versaMidHeader\"\n                            style=\"height:16px;padding:4px 8px 4px 8px;position:relative;\">\n                        Custom Properties\n                    </div>\n\n                    <div    dojoType=\"dijit.layout.BorderContainer\"\n                            design=\"headline\"\n                            gutters=\"false\"\n                            region=\"center\"\n                            splitter=\"false\">\n\n\n                        <div    dojoType=\"dijit.layout.ContentPane\"\n                                region=\"center\"\n                                splitter=\"false\"\n                                style=\"padding:0;\">\n\n                            <div dojoAttachPoint=\"editorNode\"></div>\n\n                        </div>\n\n                        <div    dojoType=\"dijit.layout.ContentPane\"\n                                region=\"bottom\"\n                                splitter=\"false\"\n                                style=\"height:32px;padding:0;position:relative\">\n\n                            <span style=\"position:absolute;top:0;left:8px\">\n                            <div dojoAttachPoint=\"addMinorNode\"></div>\n                            <span id=\"chkAddMinor\" class=\"bfree dijitDarkLabel boldLabel\" style=\"vertical-align:middle\">\n                                <label for=\"chkAddMinor\" dojoAttachPoint=\"lblInheritNode\">Add as Minor Version</label>\n                            </span>\n                            </span>\n\n                        </div>\n\n                    </div>\n\n                    <div    dojoType=\"dijit.layout.ContentPane\"\n                            region=\"bottom\"\n                            splitter=\"false\"\n                            style=\"height:32px;padding:0 8px 8px 8px;position:relative\">\n\n                        <div dojoAttachPoint=\"addButtonNode\"></div>\n\n                        <span style=\"position:absolute;top:0;right:8px;\">\n                            <img dojoAttachPoint=\"statusIcnNode\" src=\"/images/icons/states/none.16.png\" width=\"16\" height=\"16\"/>\n                            <span dojoAttachPoint=\"statusMsgNode\" class=\"dijitMediumLabel dijitDarkLabel\" style=\"position:relative;top:-2px;white-space:nowrap;\"></span>\n                        </span>\n\n                    </div>\n\n                </div>\n\n\n            </div>\n\n        </div>\n\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_activeItem:null,_btnAdd:null,_chkAddMinor:null,_documents:null,_editor:null,_fileGrid:null,_isPreviewShowing:false,_multiUploader:null,_uploading:false,folder:null,library:null,zone:null,filesLoaded:false,_btnAdd_onClick:function(_1){this._onSubmit();this.filesLoaded=false;},_chkAddMinor_onChange:function(_2){var _3=this._fileGrid.selection.getFirstSelected();if(!_3){return;}var _4=this._fileGrid.store.getValue(_3,"document");_4.isMinorVersion=_2;},_onFileSelect:function(_5){var _6=null;this._fileGrid.store.fetchItemByIdentity({identity:_5.name,onItem:function(_7){_6=_7;}});if(_6){return;}var _8=this._documentTypes.fetchByName("Document");var _9=new bfree.api.Document({name:_5.name,document_type_id:_8.id,folder_id:((this.folder)?this.folder.id:null),state:bfree.api.Document.states.PENDING,isMinorVersion:false,current_version:{binary_file_name:_5.name,binary_content_type:_5.type,binary_file_size:_5.size}});this._fileGrid.addFileItem({id:_5.name,name:_5.name,document:_9,state:bfree.api.Document.states.PENDING});this.filesLoaded=true;},_onFileUploaded:function(_a){alert(":>"+_a.name);var _b=this._fileGrid.store.fetchItemById(_a.name);var _c=this._fileGrid.store.getValue(_b,"document");_c.state=bfree.api.Document.states.UPLOADED;_c.current_version={binary_file_name:_a.file,binary_content_type:_a.content_type,binary_file_size:_a.size};this._onValidChange(_c);if((this._isPreviewShowing)&&(this._editor.activeItem==_c)){this._wdgPreview.set("activeItem",_c);}this._setState(this._activeItem);},_onHidePreview:function(e){try{this._wdgPreview.set("activeItem",null);dojo.style(this.showPreviewNode,{display:"block"});dojox.fx.crossFade({nodes:[this.hidePreviewNode,this.showPreviewNode],duration:1000,onEnd:dojo.hitch(this,function(){dojo.style(this.hidePreviewNode,{display:"none"});})}).play();dojo.style(this.previewPane.domNode,{display:"none"});dojo.removeClass(this.headerPane.domNode,"versaTopRightHeader");dojo.removeClass(this.midTitlePane.domNode,"versaMidRightHeader");this.dialog.resize({w:480});this.dialog._position();}finally{this._isPreviewShowing=false;dojo.stopEvent(e);}},_onSelectedFile:function(_d){this._activeItem=_d;if(!this._activeItem){return;}var _e=this._fileGrid.store.getValue(this._activeItem,"document");this._editor.set("activeItem",_e);this._chkAddMinor.set("checked",_e.isMinorVersion);this._setState(this._activeItem);if(_e.getState(bfree.api.Document.states.UPLOADED)&&this._isPreviewShowing){this._wdgPreview.set("activeItem",_e);}},_onShowPreview:function(e){try{var v=dijit.getViewport();var _f=(v.w>1216)?1216:v.w;dojo.style(this.hidePreviewNode,{display:"block"});dojox.fx.crossFade({nodes:[this.showPreviewNode,this.hidePreviewNode],duration:1000,onEnd:dojo.hitch(this,function(){dojo.style(this.showPreviewNode,{display:"none"});})}).play();dojo.addClass(this.headerPane.domNode,"versaTopRightHeader");dojo.addClass(this.midTitlePane.domNode,"versaMidRightHeader");dojo.style(this.previewPane.domNode,{display:"block"});this.dialog.resize({w:_f-16});this.dialog._position();var _10=this._fileGrid.selection.getFirstSelected();if(!_10){return;}var _11=this._fileGrid.store.getValue(_10,"document");if(!_11.getState(bfree.api.Document.states.UPLOADED)){return;}this._wdgPreview.set("activeItem",_11);}finally{this._isPreviewShowing=true;dojo.stopEvent(e);}},_onSubmit:function(){var _12=[];this._btnAdd.set("disabled",true);this._uploading=true;try{for(var idx=0;idx<this._fileGrid.rowCount;idx++){var _13=this._fileGrid.getItem(idx);var _14=this._fileGrid.store.getValue(_13,"document");_14.validate({library:this.library});if((_14.getState(bfree.api.Document.states.UPLOADED))&&(!_14.getState(bfree.api.Document.states.INVALID))){_14.state|=bfree.api.Document.states.PENDING;var idx=this._fileGrid.getItemIndex(_13);this._fileGrid.updateRow(idx);_12.push(this._documents.create(_14));}}if(this._activeItem){var _14=this._fileGrid.store.getValue(this._activeItem,"document");this._editor.set("activeItem",_14);this._setState(this._activeItem);}this._documents.save({onComplete:function(_15){dojo.forEach(_12,function(_16,idx){var _17=this._fileGrid.store.fetchItemById(_16.current_version.binary_file_name);this._fileGrid.store.setValue(_17,"document",_16);var idx=this._fileGrid.getItemIndex();this._fileGrid.updateRow(idx);},this);if(this._activeItem){var _18=this._fileGrid.store.getValue(this._activeItem,"document");this._editor.set("activeItem",_18);this._setState(this._activeItem);}},scope:this});}finally{this._uploading=false;}},_onValidChange:function(_19){_19.validate({library:this.library});var _1a=this._fileGrid.store.fetchItemById(_19.current_version.binary_file_name);if(_1a){var idx=this._fileGrid.getItemIndex(_1a);this._fileGrid.update(idx);}this._setState(_19);},_setState:function(_1b){var _1c=false;for(var idx=0;idx<this._fileGrid.rowCount;idx++){var _1d=this._fileGrid.getItem(idx);if(_1d){var _1e=this._fileGrid.store.getValue(_1d,"document");_1c|=(_1e.state==bfree.api.Document.states.UPLOADED);}}this._btnAdd.set("disabled",!_1c);var msg="";var _1f="none";var _20=true;var _1e=this._fileGrid.store.getValue(_1b,"document");if(_1e.getState(bfree.api.Document.states.INVALID)){msg="The file contains missing or invalid property values";_1f="invalid";}else{if(_1e.getState(bfree.api.Document.states.PENDING)&&_1e.getState(bfree.api.Document.states.UPLOADED)){msg="The file is being added to VersaFile";_1f="pending";}else{if(_1e.getState(bfree.api.Document.states.PENDING)){msg="Uploading...";_1f="pending";}else{if(_1e.getState(bfree.api.Document.states.UPLOADED)){msg="The file has been uploaded and is ready for addition";_1f="uploaded";}else{if(_1e.getState(bfree.api.Document.states.CHECKED_IN)){_20=false;msg="The file has been added to VersaFile";_1f="cki";}}}}}this._chkAddMinor.set("disabled",!_20);this.statusMsgNode.innerHTML=msg;this.statusIcnNode.src=dojo.replace("/images/icons/states/{0}.16.png",[_1f]);},constructor:function(_21){},destroy:function(){this.destroyDescendants();if(this._wdgPreview){this._wdgPreview.destroy();this._wdgPreview=null;}if(this._multiUploader!=null){this._multiUploader.destroy();this._multiUploader=null;}if(this._fileGrid!=null){this._fileGrid.destroy();this._fileGrid=null;}if(this._btnAdd){this._btnAdd.destroy();this._btnAdd=null;}if(this._editor!=null){this._editor.destroy();this._editor=null;}this.inherited("destroy",arguments);},focus:function(){this._btnAdd.focus();},isValid:function(){return true;},onDialogClosing:function(_22){var _23=false;try{if(this.filesLoaded){if(!confirm("Files have not been added to Varsafile, closing this dialog will cause them to be lost")){return false;}}if(this._uploading){alert("You must wait until all files are uploaded before closing this dialog.");return false;}if(_22==bfree.widget.Dialog.dialogResult.ok){}else{}if(this._multiUploader){this._multiUploader.clean();}_23=true;}catch(e){var err=new bfree.api.Error("Failed to close 'Create Documents' dialog",e);bfree.widget.ErrorManager.handleError({error:err});}return _23;},postCreate:function(){this.inherited("postCreate",arguments);this.folderNameNode.innerHTML=this.folder.text_path.length>32?(this.folder.text_path.substr(0,32)+"..."):this.folder.text_path;this._documentTypes=this.library.getDocumentTypes();this._documents=this.library.getDocuments();this._multiUploader=new bfree.widget.file.MultiUploader({id:"uploader1",zone:this.zone,onFileSelect:dojo.hitch(this,this._onFileSelect),onFileUploaded:dojo.hitch(this,this._onFileUploaded),style:"width:100%"},this.uploaderNode);this._fileGrid=new bfree.widget.document.FileGrid({id:"fileGrid1","class":"versaGridOutline versaNoHeader",onSelectedItem:dojo.hitch(this,this._onSelectedFile)},this.fileGridNode);this._editor=new bfree.widget.document.Editor({id:"editor1",library:this.library,onValidChange:dojo.hitch(this,this._onValidChange),onSubmit:dojo.hitch(this,this._onSubmit)},this.editorNode);this._chkAddMinor=new dijit.form.CheckBox({id:"chkAddMinor",checked:false,scrollOnFocus:false,disabled:true,onChange:dojo.hitch(this,this._chkAddMinor_onChange)},this.addMinorNode);this._btnAdd=new bfree.widget.Button({id:"btnAdd","class":"versaButtonLarge",iconClass:"buttonIcon bfreeIconAdd",disabledIconClass:"buttonIcon bfreeIconAddD",label:"Add Documents...",disabled:true,scrollOnFocus:false,onClick:dojo.hitch(this,this._btnAdd_onClick)},this.addButtonNode);this._wdgPreview=new bfree.widget.file.Preview({zone:this.zone},this.previewNode);},resize:function(){this.inherited("resize",arguments);this.mainContainer.resize();},startup:function(){this.inherited("startup",arguments);this._multiUploader.startup();this._fileGrid.startup();this._wdgPreview.startup();}});bfree.widget.document.Creator.show=function(_24){var v=dijit.getViewport();var h=((v.h>800)?800:v.h)-32;var dlg=new bfree.widget.Dialog({id:"dlgNewDocuments",title:"Add New Documents...",widgetConstructor:bfree.widget.document.Creator,widgetParams:{folder:_24.folder,library:_24.library,zone:_24.zone},noResize:true,height:h,width:480,zIndex:1024,buttons:bfree.widget.Dialog.buttons.close,onClose:_24.onClose});dlg.startup();dlg.show();};}