/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.document.Creator"]){dojo._hasResource["bfree.widget.document.Creator"]=true;dojo.provide("bfree.widget.document.Creator");dojo.require("bfree.api.Document");dojo.require("bfree.widget._DialogWidget");dojo.require("bfree.widget.document.Editor");dojo.require("bfree.widget.document.FileGrid");dojo.require("bfree.widget.file.MultiUploader");dojo.require("bfree.widget.file.Preview");dojo.require("bfree.api.Application");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.require("dojox.fx._base");dojo.declare("bfree.widget.document.Creator",[dijit._Widget,dijit._Templated,bfree.widget._DialogWidget],{templateString:dojo.cache("bfree/widget/document","template/Creator.html","<div style=\"height:100%;width:100%;position:relative\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        dojoAttachPoint=\"mainContainer\"\n        design=\"sidebar\"\n        gutters=\"false\"\n        style=\"height:100%;width:100%;\">\n\n    <div   dojoType=\"dijit.layout.ContentPane\"\n           dojoAttachPoint=\"previewPane\"\n           splitter=\"false\"\n           region=\"center\"\n           style=\"display:none\">\n\n        <div dojoAttachPoint=\"previewNode\"></div>\n\n    </div>\n\n    <div    dojoType=\"dijit.layout.BorderContainer\"\n            design=\"headline\"\n            gutters=\"false\"\n            region=\"right\"\n            splitter=\"false\"\n            style=\"width:480px\">\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                dojoAttachPoint=\"headerPane\"\n                region=\"top\"\n                splitter=\"false\"\n                class=\"versaTopHeader\"\n                style=\"height:12px;position:relative;\">\n\n            <span dojoAttachPoint=\"showPreviewNode\" style=\"position:absolute;left:8px;\">\n                <a href=\"javascript://\" class=\"versaLink\" dojoAttachEvent=\"onclick: _onShowPreview\">Show Preview</a>\n            </span>\n\n            <span dojoAttachPoint=\"hidePreviewNode\" style=\"position:absolute;left:8px;opacity:0;display:none\">\n                <a href=\"javascript://\" class=\"versaLink\" dojoAttachEvent=\"onclick: _onHidePreview\">Hide Preview</a>\n            </span>\n\n            <span style=\"position:absolute;right:16px;\">\n                File in Folder: <span dojoAttachPoint=\"folderNameNode\" class=\"dijitBoldLabel\"></span>\n            </span>\n\n        </div>\n\n        <div    dojoType=\"dijit.layout.BorderContainer\"\n                design=\"headline\"\n                gutters=\"false\"\n                region=\"center\"\n                splitter=\"false\">\n\n            <div    dojoType=\"dijit.layout.ContentPane\"\n                    region=\"top\"\n                    splitter=\"false\"\n                    style=\"height:32px;padding:4px 0 4px 0\">\n\n                <div dojoAttachPoint=\"uploaderNode\"></div>\n\n            </div>\n\n            <div    dojoType=\"dijit.layout.BorderContainer\"\n                    design=\"headline\"\n                    gutters=\"false\"\n                    region=\"center\"\n                    splitter=\"false\">\n\n                <div    dojoType=\"dijit.layout.ContentPane\"\n                        region=\"top\"\n                        splitter=\"false\"\n                        style=\"height:96px;padding:0 8px 8px 8px\">\n\n                        <div dojoAttachPoint=\"fileGridNode\"></div>\n\n                    </div>\n\n                <div    dojoType=\"dijit.layout.BorderContainer\"\n                        design=\"headline\"\n                        gutters=\"false\"\n                        region=\"center\"\n                        splitter=\"false\">\n\n                    <div    dojoType=\"dijit.layout.ContentPane\"\n                            dojoAttachPoint=\"midTitlePane\"\n                            region=\"top\"\n                            splitter=\"false\"\n                            class=\"versaMidHeader\"\n                            style=\"height:16px;padding:4px 8px 4px 8px;position:relative;\">\n                        Custom Properties\n                    </div>\n\n                    <div    dojoType=\"dijit.layout.BorderContainer\"\n                            design=\"headline\"\n                            gutters=\"false\"\n                            region=\"center\"\n                            splitter=\"false\">\n\n\n                        <div    dojoType=\"dijit.layout.ContentPane\"\n                                region=\"center\"\n                                splitter=\"false\"\n                                style=\"padding:0;\">\n\n                            <div dojoAttachPoint=\"editorNode\"></div>\n\n                        </div>\n\n                        <div    dojoType=\"dijit.layout.ContentPane\"\n                                region=\"bottom\"\n                                splitter=\"false\"\n                                style=\"height:0;padding:0;position:relative;display:none\">\n\n                            <span style=\"position:absolute;top:0;left:8px\">\n                            <div dojoAttachPoint=\"addMinorNode\"></div>\n                            <span id=\"chkAddMinor\" class=\"bfree dijitDarkLabel boldLabel\" style=\"vertical-align:middle\">\n                                <label for=\"chkAddMinor\" dojoAttachPoint=\"lblInheritNode\">Add as Minor Version</label>\n                            </span>\n                            </span>\n\n                        </div>\n\n                    </div>\n\n                    <div    dojoType=\"dijit.layout.ContentPane\"\n                            region=\"bottom\"\n                            splitter=\"false\"\n                            style=\"height:32px;padding:0 8px 8px 8px;position:relative\">\n\n                        <div dojoAttachPoint=\"addButtonNode\"></div>\n\n                        <span style=\"position:absolute;top:0;right:8px;\">\n                            <img dojoAttachPoint=\"statusIcnNode\" src=\"/images/icons/states/none.16.png\" width=\"16\" height=\"16\"/>\n                            <span dojoAttachPoint=\"statusMsgNode\" class=\"dijitMediumLabel dijitDarkLabel\" style=\"position:relative;top:-2px;white-space:nowrap;\"></span>\n                        </span>\n\n                    </div>\n\n                </div>\n\n\n            </div>\n\n        </div>\n\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_activeItem:null,_btnAdd:null,_chkAddMinor:null,_documents:null,_editor:null,_fileGrid:null,_isPreviewShowing:false,_multiUploader:null,_uploading:false,folder:null,library:null,zone:null,filesLoaded:false,__setNextItem:function(_1,_2){for(var i=_1;i<this._fileGrid.rowCount;i++){if((i+1)>=this._fileGrid.rowCount){if(_2){i=-1;_2=false;}else{break;}}var _3=this._fileGrid.getItem(i+1);var _4=this._fileGrid.store.getValue(_3,"document");if(_4.getState(bfree.api.Document.states.UPLOADED)&&!(_4.getState(bfree.api.Document.states.PENDING))){this._fileGrid.setSelectedIndex(i+1);this._fileGrid.scrollToRow(i+1);break;}}},_btnAdd_onClick:function(_5){this._onSubmit();this.filesLoaded=false;},_chkAddMinor_onChange:function(_6){var _7=this._fileGrid.selection.getFirstSelected();if(!_7){return;}var _8=this._fileGrid.store.getValue(_7,"document");_8.isMinorVersion=_6;},_loadItem:function(){try{}finally{this.onWidgetLoaded();}},_onFileSelect:function(_9){var _a=null;this._fileGrid.store.fetchItemByIdentity({identity:_9.name,onItem:function(_b){_a=_b;}});if(_a){return;}var _c=this._documentTypes.getSystem();var _d=_c[0];var _e=new bfree.api.Document({name:_9.name,document_type_id:_d.id,folder_id:((this.folder)?this.folder.id:null),state:bfree.api.Document.states.PENDING,isMinorVersion:false,binary_file_name:_9.name,binary_content_type:_9.type,binary_file_size:_9.size});dojo.forEach(_d.property_mappings,dojo.hitch(this,function(_f,idx){var def=this.library.getPropertyDefinitions().fetchById({id:_f.property_definition_id});var _10=bfree.api.Application.getDataTypes().fetchById({id:def.data_type_id});if(_10.isFloat()||_10.isInteger()){this._documents.setValue(_e,def.column_name,0);}var _11=bfree.api.PropertyMappings.getDefault(_f,this.library.getPropertyDefinitions());if(_11){this._documents.setValue(_e,def.column_name,_11);}}));this._fileGrid.addFileItem({id:_9.name,name:_9.name,document:_e,state:bfree.api.Document.states.PENDING});this.filesLoaded=true;},_onFileUploaded:function(_12){var _13=this._fileGrid.store.fetchItemById(_12.name);var _14=this._fileGrid.store.getValue(_13,"document");_14.state=bfree.api.Document.states.UPLOADED;_14.binary_file_name=_12.name;_14.binary_content_type=_12.content_type;_14.binary_file_size=_12.size;this._onValidChange(_14);if((this._isPreviewShowing)&&(this._editor.activeItem==_14)){this._wdgPreview.set("activeItem",_14);}this._setState(this._activeItem);},_onHidePreview:function(e){try{this._wdgPreview.set("activeItem",null);dojo.style(this.showPreviewNode,{display:"block"});dojox.fx.crossFade({nodes:[this.hidePreviewNode,this.showPreviewNode],duration:1000,onEnd:dojo.hitch(this,function(){dojo.style(this.hidePreviewNode,{display:"none"});})}).play();dojo.style(this.previewPane.domNode,{display:"none"});dojo.removeClass(this.headerPane.domNode,"versaTopRightHeader");dojo.removeClass(this.midTitlePane.domNode,"versaMidRightHeader");this.dialog.resize({w:480});this.dialog._position();}finally{this._isPreviewShowing=false;dojo.stopEvent(e);}},_onSelectedFiles:function(_15){this._activeItem=_15[0];if(!this._activeItem){return;}var _16=this._fileGrid.store.getValue(this._activeItem,"document");this._editor.set("activeItem",_16);this._chkAddMinor.set("checked",_16.isMinorVersion);this._setState(this._activeItem);if((_16.getState(bfree.api.Document.states.UPLOADED)||(_16.getState(bfree.api.Document.states.CHECKED_IN)))&&this._isPreviewShowing){this._wdgPreview.set("activeItem",_16);}},_onShowPreview:function(e){try{var v=dijit.getViewport();var _17=(v.w>1216)?1216:v.w;dojo.style(this.hidePreviewNode,{display:"block"});dojox.fx.crossFade({nodes:[this.showPreviewNode,this.hidePreviewNode],duration:1000,onEnd:dojo.hitch(this,function(){dojo.style(this.showPreviewNode,{display:"none"});})}).play();dojo.addClass(this.headerPane.domNode,"versaTopRightHeader");dojo.addClass(this.midTitlePane.domNode,"versaMidRightHeader");dojo.style(this.previewPane.domNode,{display:"block"});this.dialog.resize({w:_17-16});this.dialog._position();var _18=this._fileGrid.selection.getFirstSelected();if(!_18){return;}var _19=this._fileGrid.store.getValue(_18,"document");if(_19.getState(bfree.api.Document.states.UPLOADED)||(_19.getState(bfree.api.Document.states.CHECKED_IN))){this._wdgPreview.set("activeItem",_19);}}finally{this._isPreviewShowing=true;dojo.stopEvent(e);}},_onSubmit:function(){var _1a=[];var idx=this._fileGrid.getItemIndex(this._activeItem);this._btnAdd.set("disabled",true);this._uploading=true;try{var _1b=this._fileGrid.store.getValue(this._activeItem,"document");if(!_1b.getState(bfree.api.Document.states.UPLOADED)){alert("The file has not completed uploading");return;}_1b.clean_properties({library:this.library});if(!_1b.validate({library:this.library})){throw new Error("One or more properties are missing or invalid");}this._btnAdd.set("disabled",true);_1b.state|=bfree.api.Document.states.PENDING;this._fileGrid.updateRow(idx);var _1c=this._documents.create(_1b);this._editor.set("activeItem",_1b);this._setState(this._activeItem);function _1d(_1e){this._fileGrid.store.setValue(this._activeItem,"document",_1c);this._fileGrid.updateRow(idx);this._editor.set("activeItem",_1c);this._setState(this._activeItem);this.__setNextItem(idx,true);};this._documents.save({onComplete:_1d,scope:this});}catch(e){_1b.state=bfree.api.Document.states.ERROR;this._fileGrid.updateRow(idx);this._documents.create(_1b);this._editor.set("activeItem",_1b);this._setState(this._activeItem);var err=new bfree.api.Error("Failed to add document to the library",e);bfree.widget.ErrorManager.handleError({error:err});this._documents.revert();}finally{this._uploading=false;}},_onUploadError:function(_1f,err){var err=new bfree.api.Error(dojo.replace("Failed to upload file '{0}'",[_1f.name]),err);bfree.widget.ErrorManager.handleError({error:err});var _20=this._fileGrid.store.fetchItemById(_1f.name);var _21=this._fileGrid.store.getValue(_20,"document");_21.state=bfree.api.Document.states.ERROR;this._onValidChange(_21);this._editor.set("activeItem",_21);this._setState(this._activeItem);},_onValidChange:function(_22){_22.validate({library:this.library});var _23=this._fileGrid.store.fetchItemById(_22.binary_file_name);if(_23){var idx=this._fileGrid.getItemIndex(_23);this._fileGrid.update(idx);}this._setState(this._activeItem);},_setState:function(_24){var _25=!this._uploading;var idx=this._fileGrid.getItemIndex(_24);this._fileGrid.updateRow(idx);var _26=this._fileGrid.store.getValue(_24,"document");_25|=(_26.state==bfree.api.Document.states.UPLOADED);if(_26.getState(bfree.api.Document.states.CHECKED_IN)||_26.getState(bfree.api.Document.states.ERROR)||_26.getState(bfree.api.Document.states.INVALID)){_25=false;}this._btnAdd.set("disabled",!_25);var msg="";var _27=false;var _26=(_24)?this._fileGrid.store.getValue(_24,"document"):null;var msg=bfree.api.Document.getStateMessage(_26.state);var _28=bfree.api.Document.getStateIcon(_26.state);this.statusMsgNode.innerHTML=msg;this.statusIcnNode.src=dojo.replace("/images/icons/states/{0}",[_28]);},constructor:function(_29){},destroy:function(){this.destroyDescendants();if(this._wdgPreview){this._wdgPreview.destroy();this._wdgPreview=null;}if(this._multiUploader!=null){this._multiUploader.destroy();this._multiUploader=null;}if(this._fileGrid!=null){this._fileGrid.destroy();this._fileGrid=null;}if(this._btnAdd){this._btnAdd.destroy();this._btnAdd=null;}if(this._editor!=null){this._editor.destroy();this._editor=null;}this.inherited("destroy",arguments);},focus:function(){this._btnAdd.focus();},isValid:function(){return true;},onDialogClosing:function(_2a){var _2b=false;try{if(this.filesLoaded){if(!confirm("Files have not been added to VersaFile, closing this dialog will cause them to be lost.")){return false;}}if(this._uploading){alert("You must wait until all files are uploaded before closing this dialog.");return false;}if(_2a==bfree.widget.Dialog.dialogResult.ok){}else{}if(this._multiUploader){this._multiUploader.clean();}_2b=true;}catch(e){var err=new bfree.api.Error("Failed to close 'Create Documents' dialog",e);bfree.widget.ErrorManager.handleError({error:err});}return _2b;},postCreate:function(){this.inherited("postCreate",arguments);this.folderNameNode.innerHTML=this.folder.name.display_limit(32);this._documentTypes=this.library.getDocumentTypes();this._documents=this.library.getDocuments();this._multiUploader=new bfree.widget.file.MultiUploader({id:"uploader1",zone:this.zone,onFileSelect:dojo.hitch(this,this._onFileSelect),onFileUploaded:dojo.hitch(this,this._onFileUploaded),onError:dojo.hitch(this,this._onUploadError),style:"width:100%"},this.uploaderNode);this._fileGrid=new bfree.widget.document.FileGrid({id:"fileGrid1","class":"versaGridOutline versaNoHeader",onSelectedItems:dojo.hitch(this,this._onSelectedFiles)},this.fileGridNode);this._editor=new bfree.widget.document.Editor({id:"editor1",library:this.library,onValidChange:dojo.hitch(this,this._onValidChange),onSubmit:dojo.hitch(this,this._onSubmit)},this.editorNode);this._chkAddMinor=new dijit.form.CheckBox({id:"chkAddMinor",checked:false,scrollOnFocus:false,disabled:true,onChange:dojo.hitch(this,this._chkAddMinor_onChange)},this.addMinorNode);this._btnAdd=new bfree.widget.Button({id:"btnAdd","class":"versaButtonLarge",iconClass:"buttonIcon bfreeIconAdd",disabledIconClass:"buttonIcon bfreeIconAddD",label:"Add Document",disabled:true,scrollOnFocus:false,onClick:dojo.hitch(this,this._btnAdd_onClick)},this.addButtonNode);this._wdgPreview=new bfree.widget.file.Preview({zone:this.zone},this.previewNode);},resize:function(){this.inherited("resize",arguments);this.mainContainer.resize();},startup:function(){this.inherited("startup",arguments);this._multiUploader.startup();this._fileGrid.startup();this._wdgPreview.startup();setTimeout(bfree.widget.document.Creator._loadFnRef(this),10);}});bfree.widget.document.Creator._loadFnRef=function(_2c){return (function(){_2c._loadItem();});};bfree.widget.document.Creator.show=function(_2d){var v=dijit.getViewport();var h=((v.h>800)?800:v.h)-32;var dlg=new bfree.widget.Dialog({id:"dlgNewDocuments",title:"Add New Document(s)",widgetConstructor:bfree.widget.document.Creator,widgetParams:{folder:_2d.folder,library:_2d.library,zone:_2d.zone},noResize:true,height:h,width:480,zIndex:1024,buttons:bfree.widget.Dialog.buttons.close,onClose:_2d.onClose});dlg.startup();dlg.show();};}