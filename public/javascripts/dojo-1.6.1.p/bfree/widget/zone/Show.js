/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.zone.Show"]){dojo._hasResource["bfree.widget.zone.Show"]=true;dojo.provide("bfree.widget.zone.Show");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.require("dojox.widget.Toaster");dojo.require("bfree.widget.Bfree");dojo.require("bfree.widget.Dialog");dojo.require("bfree.widget.ErrorManager");dojo.require("bfree.widget.acl.Editor");dojo.require("bfree.widget.choiceList.Administration");dojo.require("bfree.widget.document.Accessor");dojo.require("bfree.widget.document.version.Accessor");dojo.require("bfree.widget.document.Grid");dojo.require("bfree.widget.document.Checkin");dojo.require("bfree.widget.document.Creator");dojo.require("bfree.widget.document.Move");dojo.require("bfree.widget.document.PropertyEditor");dojo.require("bfree.widget.document.version.Versions");dojo.require("bfree.widget.folder.Tree");dojo.require("bfree.widget.group.Administration");dojo.require("bfree.widget.doctype.Administration");dojo.require("bfree.widget.propdef.Administration");dojo.require("bfree.widget.search.TextBox");dojo.require("bfree.widget.user.ProfileButton");dojo.require("bfree.widget.user.ProfileEditor");dojo.require("bfree.widget.user.Administration");dojo.require("bfree.widget.view.Administration");dojo.require("bfree.widget.zone.CommandBar");dojo.require("bfree.widget.zone.ReLogon");dojo.require("bfree.widget.zone.Toolbar");dojo.require("bfree.widget.folder.DndSource");dojo.require("bfree.widget.ItemInfo");dojo.require("versa.widget.zone.metrics.Info");dojo.require("versa.VersaFile");dojo.declare("bfree.widget.zone.Show",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("bfree.widget.zone","template/Show.html","<div style=\"background:#D9D9D6;height:100%;width:100%;\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        style=\"height:100%;width:100%;\">\n\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            region=\"center\"\n            spitter=\"false\"\n            style=\"padding:8px 8px 0 8px\">\n\n        <div    dojoType=\"dijit.layout.BorderContainer\"\n                design=\"headline\"\n                gutters=\"false\"\n                style=\"height:100%;width:100%\">\n\n            <div    dojoType=\"dijit.layout.BorderContainer\"\n                    design=\"sidebar\"\n                    gutters=\"false\"\n                    region=\"top\"\n                    splitter=\"false\"\n                    class=\"versaTopPane\">\n\n                <div    dojoType=\"dijit.layout.ContentPane\"\n                        region=\"left\"\n                        splitter=\"false\"\n                        class=\"versaHeadPane\">\n                    <img src=\"/images/versafile-64-tm.png\" height=\"56\" style=\"position:relative;top:-8px;left:0\"/>\n                </div>\n\n                <div    dojoType=\"dijit.layout.BorderContainer\"\n                        design=\"sidebar\"\n                        gutters=\"false\"\n                        region=\"center\"\n                        class=\"versaBarPane\">\n\n                    <div    dojoType=\"dijit.layout.ContentPane\"\n                            region=\"center\"\n                            splitter=\"false\"\n                            style=\"padding:0;overflow:hidden;position:relative;\">\n\n                        <div    dojoAttachPoint=\"trialStateNode\"\n                                style=\"display:none;margin-left:auto;margin-right:auto;text-align: center\">\n                            <span dojoAttachPoint=\"trialMsgNode\" class=\"dijitMediumLabel dijitDarkLabelV\" style=\"display:inline-block\"></span>\n                            <span dojoAttachPoint=\"activateMsgNode\" class=\"dijitMediumLabel dijitDarkLabelV\" style=\"display:inline-block\"></span>\n                        </div>\n\n                        <div dojoAttachPoint=\"toolbarNode\"></div>\n\n                    </div>\n\n                    <div    dojoType=\"dijit.layout.BorderContainer\"\n                            design=\"headline\"\n                            gutters=\"false\"\n                            region=\"right\"\n                            splitter=\"false\"\n                            style=\"width:256px;\">\n\n                        <div    dojoType=\"dijit.layout.ContentPane\"\n                                region=\"center\"\n                                splitter=\"false\"\n                                style=\"position:relative;text-align:right;padding:2px 0 0 0\">\n\n                            <table cellpadding=\"0\" cellspacing=\"0\" style=\"position:absolute;right:0\"><tr>\n                                <td  style=\"padding-right:4px; border-right: 1px solid #75787B\">\n                                    <a href=\"javascript://\" class=\"versaLink\" title=\"Edit Profile\" dojoAttachEvent=\"onclick: _onUserEdit\">\n                                    <span  dojoAttachPoint=\"nameNode\"></span>\n                                    </a>\n                                </td>\n                                <td style=\"padding-left:4px;\"><a href=\"javascript://\" class=\"versaLink\" dojoAttachEvent=\"onclick: _onLogoff\">Logout</a></td>\n                            </tr>\n                            </table>\n\n                        </div>\n\n                        <div    dojoType=\"dijit.layout.ContentPane\"\n                                region=\"bottom\"\n                                splitter=\"false\"\n                                style=\"height:32px;padding:0;\">\n                            <div dojoAttachPoint=\"searchBoxNode\" style=\"\"></div>\n                        </div>\n\n                    </div>\n\n                </div>\n\n            </div>\n\n            <div    dojoType=\"dijit.layout.BorderContainer\"\n                    design=\"headline\"\n                    gutters=\"false\"\n                    region=\"center\"\n                    splitter=\"false\"\n                    class=\"versaMainPane\">\n\n                <div    dojoType=\"dijit.layout.BorderContainer\"\n                        design=\"sidebar\"\n                        gutters=\"true\"\n                        region=\"center\"\n                        splitter=\"false\"\n                        class=\"\">\n\n                    <div    dojoType=\"dijit.layout.ContentPane\"\n                            region=\"left\"\n                            splitter=\"true\"\n                            class=\"versaInfoPane\"\n                            style=\"padding:0;width:256px;\">\n\n                        <div style=\"height: 100%\">\n                           <div dojoAttachPoint=\"folderTreeNode\" style=\"height: 100%\"></div>\n                       </div>\n\n                    </div>\n\n                    <div    dojoType=\"dijit.layout.ContentPane\"\n                            region=\"center\"\n                            splitter=\"true\"\n                            class=\"versaInfoPane\"\n                            style=\"padding:0\">\n\n                        <div dojoAttachPoint=\"documentGridNode\"></div>\n\n                    </div>\n\n                </div>\n\n                <div    dojoType=\"dijit.layout.ContentPane\"\n                        region=\"bottom\"\n                        splitter=\"false\"\n                        style=\"height:96px;padding: 0 6px 8px 6px\">\n\n                    <div    dojoType=\"dojox.widget.Toaster\"\n                           dojoAttachPoint=\"errorToaster\"\n                           positionDirection=\"br-left\"\n                           style=\"height:88px\">\n                   </div>\n\n                   <div style=\"height:100%\" class=\"versaInfoPane\">\n                       <div dojoAttachPoint=\"itemInfoNode\" style=\"width: 100%\"></div>\n                   </div>\n\n                </div>\n\n            </div>\n\n\n        </div>\n\n    </div>\n\n\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            region=\"bottom\"\n            splitter=\"false\"\n            style=\"position:relative;height:16px;overflow:hidden;\">\n\n        <span class=\"dijitMediumLabel dijitDarkLabelV\">VersaFile is an RKO Business Solutions product. Copyright © 2012 All rights reserved.</span>\n\n        <span style=\"position:absolute;right:16px;\">\n            <span dojoAttachPoint=\"versionSpan\" class=\"dijitMediumLabel dijitDarkLabelV\"></span>\n            <a href=\"mailto:support@versafile.com\" class=\"versaLink\">Contact Support</a>\n        </span>\n\n    </div>\n\n</div>\n\n</div>\n\n\n\n"),widgetsInTemplate:true,_duration:60000,_btnAvatar:null,_cmdBar:null,_grdDocuments:null,activeDocument:null,activeGroup:null,activeLibrary:null,activeUser:null,zone:null,folders:null,__onCommand:function(_1,_2,_3){switch(_1){case bfree.widget.Bfree.Commands.ADMIN:this.__onAdmin(_2);break;case bfree.widget.Bfree.Commands.REFRESH:this.__onRefresh(_2);break;case bfree.widget.Bfree.Commands.EDIT:this.__onEdit(_2,_3);break;case bfree.widget.Bfree.Commands.NEW:this.__onNew(_2,_3);break;case bfree.widget.Bfree.Commands.VIEW:this.__onView(_2,_3);break;case bfree.widget.Bfree.Commands.VERSIONS:this.__onVersions(_2,_3);break;case bfree.widget.Bfree.Commands.COPY:this._onCopy(_2,_3);break;case bfree.widget.Bfree.Commands.MOVE:this.__onMove(_2,_3);break;case bfree.widget.Bfree.Commands.CHECKOUT:this._onCheckout(_2,_3);break;case bfree.widget.Bfree.Commands.CHECKIN:this._onCheckin(_2,_3);break;case bfree.widget.Bfree.Commands.CANCEL_CKO:this._onCancelCheckout(_2,_3);break;case bfree.widget.Bfree.Commands.DELETE:this.__onDelete(_2,_3);break;case bfree.widget.Bfree.Commands.RESTORE:this.__onRestore(_2,_3);break;case bfree.widget.Bfree.Commands.SECURE:this.__onSecure(_2,_3);break;case bfree.widget.Bfree.Commands.EMPTY:this._onEmpty();break;case bfree.widget.Bfree.Commands.PRINT:this._onPrint();break;case bfree.widget.Bfree.Commands.EXPORT:this._onExport(_2);break;case bfree.widget.Bfree.Commands.LOGOFF:this._onLogoff();break;}},__onAdmin:function(_4){switch(_4){case bfree.widget.Bfree.ObjectTypes.USER:this._onUserAdmin();break;case bfree.widget.Bfree.ObjectTypes.GROUP:this._onGroupAdmin();break;case bfree.widget.Bfree.ObjectTypes.PROP_DEF:this._onAdminPropDefs();break;case bfree.widget.Bfree.ObjectTypes.CHOICE_LIST:this._onChoiceListAdmin();break;case bfree.widget.Bfree.ObjectTypes.DOC_TYPE:this._onDocTypeAdmin();break;case bfree.widget.Bfree.ObjectTypes.VIEW_DEF:this._onViewDefAdmin();break;case bfree.widget.Bfree.ObjectTypes.QUOTA:this._onAdminQuota();break;}},__onEdit:function(_5,_6){switch(_5){case bfree.widget.Bfree.ObjectTypes.DOCUMENT:this._onDocumentEdit(_6.document);break;case bfree.widget.Bfree.ObjectTypes.Folder:this._onFolderEdit(_6.folder);break;case bfree.widget.Bfree.ObjectTypes.USER:this._onUserEdit();break;}},__onDelete:function(_7,_8){switch(_7){case bfree.widget.Bfree.ObjectTypes.DOCUMENT:this._onDocumentDelete(_8.document);break;case bfree.widget.Bfree.ObjectTypes.FOLDER:this._onFolderDelete(_8.folder);break;}},__onMove:function(_9,_a){switch(_9){case bfree.widget.Bfree.ObjectTypes.DOCUMENT:this._onDocumentMove(_a.document);break;}},__onNew:function(_b,_c){switch(_b){case bfree.widget.Bfree.ObjectTypes.DOCUMENT:this._onDocumentNew(_c.folder);break;case bfree.widget.Bfree.ObjectTypes.FOLDER:this._onFolderNew(_c.folder);break;}},__onRefresh:function(_d){switch(_d){case bfree.widget.Bfree.ObjectTypes.DOCUMENT:this._onDocumentsRefresh();break;}},__onRestore:function(_e,_f){switch(_e){case bfree.widget.Bfree.ObjectTypes.DOCUMENT:this._onDocumentRestore(_f.document);break;}},__onSecure:function(_10,_11){switch(_10){case bfree.widget.Bfree.ObjectTypes.DOCUMENT:this._onDocumentSecure(_11.document);break;case bfree.widget.Bfree.ObjectTypes.FOLDER:this._onFolderSecure(_11.folder);break;}},__onView:function(_12,_13){switch(_12){case bfree.widget.Bfree.ObjectTypes.DOCUMENT:this._onDocumentView(_13.document);break;case bfree.widget.Bfree.ObjectTypes.VERSION:this._onVersionView(_13.document,_13.version);break;}},__onVersions:function(_14,_15){switch(_14){case bfree.widget.Bfree.ObjectTypes.DOCUMENT:this._onDocumentVersions(_15.document);break;}},_checkSession:function(){var _16=false;try{_16=this.zone.isAlive();}catch(e){}if(_16){setTimeout(bfree.widget.zone.Show._buildCheckFnRef(this),this._duration);}else{this._showLogon();}},_doAdHocQuery:function(_17){if(_17.queryData==""){return;}var _18=this.activeLibrary.getFolders().getSearchFolder();if(_18){_18.setActiveQuery(_17);this._tvwFolders.setSelectedItem(_18);}},_grdDocuments_onSelectedItem:function(_19,evt){this.set("activeDocument",_19);},_grdDocuments_onSelectedItems:function(_1a){if(_1a.length==0){this._wdgItemInfo.setItem({item:this.activeFolder,type:bfree.widget.ItemInfo.Type.folder});}else{if(_1a.length==1){this._wdgItemInfo.setItem({item:_1a[0],type:bfree.widget.ItemInfo.Type.document});}else{this._wdgItemInfo.setItem({item:_1a,type:bfree.widget.ItemInfo.Type.documents});}}},_onAdminPropDefs:function(){try{function _1b(_1c,_1d){var _1e=this._grdDocuments.activeView;this.activeLibrary.getViewDefinitions().clearCache();this.activeLibrary.getViewDefinitions().fetch();var _1f=this.activeLibrary.getViewDefinitions().fetchById({id:_1e.id});var _20=_1f.getView(this.activeLibrary);this._grdDocuments.set("activeView",_20);this._grdDocuments.set("structure",_20);this._grdDocuments.set("sortInfo",_20.sort_column);this._grdDocuments.refresh();this._grdDocuments.refreshViews();return true;};bfree.widget.propdef.Administration.show({zone:this.zone,library:this.activeLibrary,user:this.activeUser,onClose:dojo.hitch(this,_1b)});}catch(e){var err=new bfree.api.Error("Failed to open 'Property Definition Administration' dialog",e);bfree.widget.ErrorManager.handleError({error:err});}},_onAdminQuota:function(){try{function _21(_22,_23){return true;};versa.widget.zone.metrics.Info.show({library:this.activeLibrary,zone:this.zone,onClose:dojo.hitch(this,_21)});}catch(e){var err=new bfree.api.Error("Failed to open 'Quota Information' dialog",e);bfree.widget.ErrorManager.handleError({error:err});}},_onCancelCheckout:function(_24,_25){switch(_24){case bfree.widget.Bfree.ObjectTypes.DOCUMENT:this._onDocumentCancelCKO(_25.document);break;}},_onCheckin:function(_26,_27){switch(_26){case bfree.widget.Bfree.ObjectTypes.DOCUMENT:this._onDocumentCKI(_27.document);break;}},_onCheckout:function(_28,_29){switch(_28){case bfree.widget.Bfree.ObjectTypes.DOCUMENT:this._onDocumentCKO(_29.document);break;}},_onCopy:function(_2a,_2b){switch(_2a){case bfree.widget.Bfree.ObjectTypes.DOCUMENT:this._onDocumentCopy(_2b.document);break;case bfree.widget.Bfree.ObjectTypes.VERSION:this._onVersionCopy(_2b.document,_2b.version);break;}},_onDocTypeAdmin:function(){try{bfree.widget.doctype.Administration.show({user:this.activeUser,zone:this.zone,library:this.activeLibrary,onClose:dojo.hitch(this,function(_2c,_2d){return true;})});}catch(e){var err=new bfree.api.Error("Failed to open 'Property Definition Administration' dialog",e);bfree.widget.ErrorManager.handleError({error:err});}},_onChoiceListAdmin:function(){try{bfree.widget.choiceList.Administration.show({user:this.activeUser,zone:this.zone,library:this.activeLibrary,onClose:dojo.hitch(this,function(_2e,_2f){return true;})});}catch(e){var err=new bfree.api.Error("Failed to open 'Choice List Administration' dialog",e);bfree.widget.ErrorManager.handleError({error:err});}},_onDocumentCancelCKO:function(_30){try{if(!_30){return;}var msg=dojo.replace("Are you sure you want to cancel the checkout of document '{name}'?",_30);if(!confirm(msg)){return;}this._grdDocuments.setBusy(_30);var _31=new bfree.widget.document.Accessor({library:this.activeLibrary,zone:this.zone});_31.doCancelCheckout(_30);this._grdDocuments_onSelectedItems(this._grdDocuments.selection.getSelected());}catch(e){var err=new bfree.api.Error("Failed to cancel checkout of document",e);bfree.widget.ErrorManager.handleError({error:err});}finally{this.set("activeDocument",_30);}},_onDocumentCKI:function(_32){try{function _33(){this._grdDocuments.setBusy(_32);};function _34(_35,_36){this._grdDocuments.endUpdate();var idx=this._grdDocuments.getItemIndex(_32);this._grdDocuments.updateRow(idx);this._cmdBar.set("activeDocument",this.activeDocument);this._grdDocuments_onSelectedItems(this._grdDocuments.selection.getSelected());return true;};if(!_32){return;}this._grdDocuments.beginUpdate();bfree.widget.document.Checkin.show({user:this.activeUser,document:this.activeDocument,library:this.activeLibrary,zone:this.zone,onClosing:dojo.hitch(this,_33),onClose:dojo.hitch(this,_34)});}catch(e){var err=new bfree.api.Error("Failed to checkin document",e);bfree.widget.ErrorManager.handleError({error:err});}},_onDocumentCKO:function(_37){try{if(!_37){return;}var _38=new bfree.widget.document.Accessor({library:this.activeLibrary,zone:this.zone});this._grdDocuments.setBusy(_37);_38.doCheckout(_37);_38.doCopyLocal(_37);this._grdDocuments_onSelectedItems(this._grdDocuments.selection.getSelected());}catch(e){var err=new bfree.api.Error("Failed to checkout document",e);bfree.widget.ErrorManager.handleError({error:err});}finally{this.set("activeDocument",_37);}},_onDocumentCopy:function(_39){try{if(!_39){return;}this._grdDocuments.setBusy(_39);var _3a=new bfree.widget.document.Accessor({library:this.activeLibrary,zone:this.zone});_3a.doCopyLocal(_39);}catch(e){var err=new bfree.api.Error("Failed to copy document",e);bfree.widget.ErrorManager.handleError({error:err});}finally{var idx=this._grdDocuments.getItemIndex(_39);this._grdDocuments.updateRow(idx);this._cmdBar.set("activeDocument",this.activeDocument);}},_onVersionCopy:function(_3b,_3c){try{if(!_3b||!_3c){return;}var _3d=new bfree.widget.document.version.Accessor({library:this.activeLibrary,zone:this.zone});_3d.doCopyLocal(_3b,_3c);}catch(e){var err=new bfree.api.Error("Failed to copy document",e);bfree.widget.ErrorManager.handleError({error:err});}finally{}},_onDocumentDelete:function(_3e){var idx=0;try{if(!_3e){return;}if(!_3e.length){_3e=[_3e];}dojo.forEach(_3e,dojo.hitch(this,function(it,idx){this._grdDocuments.setBusy(it);}));var msg=(_3e[0].getState(bfree.api.Document.states.DELETED))?"Are you sure you want to permanently delete the selected documents?\nWarning: This cannot be undone.":"Are you sure you want to delete the selected documents?";if(!confirm(msg)){dojo.forEach(_3e,dojo.hitch(this,function(it,idx){var idx=this._grdDocuments.getItemIndex(it);this._grdDocuments.updateRow(idx);}));return;}this._grdDocuments.set("deleting",true);var idx;dojo.forEach(_3e,dojo.hitch(this,function(it,idx){idx=this._grdDocuments.getItemIndex(it);this.activeLibrary.getDocuments().destroy({item:it,no_save:true});it.state|=bfree.api.Document.states.DELETED;}));this._grdDocuments.selection.clear();this.activeLibrary.getDocuments().save({onComplete:dojo.hitch(this,function(){this._grdDocuments.set("deleting",false);})});}catch(e){var err=new bfree.api.Error("Failed to delete document",e);bfree.widget.ErrorManager.handleError({error:err});}finally{}},_onDocumentEdit:function(_3f){try{function _40(_41,_42){if(_41==bfree.widget.Dialog.dialogResult.ok){this._grdDocuments.endUpdate();this._grdDocuments.sort();this.set("activeDocument",_3f);}return true;};if(!_3f){return;}this._grdDocuments.beginUpdate();bfree.widget.document.PropertyEditor.show({user:this.activeUser,document:_3f,library:this.activeLibrary,zone:this.zone,onClose:dojo.hitch(this,_40)});}catch(e){this._grdDocuments.endUpdate();var err=new bfree.api.Error("Failed to edit document properties",e);bfree.widget.ErrorManager.handleError({error:err});}},_onDocumentVersions:function(_43){try{if(!_43){return;}this._grdDocuments.beginUpdate();bfree.widget.document.version.Versions.show({document:_43,library:this.activeLibrary,zone:this.zone,onCommand:dojo.hitch(this,this.__onCommand)});}catch(e){this._grdDocuments.endUpdate();var err=new bfree.api.Error("Failed to edit document properties",e);bfree.widget.ErrorManager.handleError({error:err});}},_onDocumentMove:function(_44){try{if((!_44)){return;}bfree.widget.document.Move.show({folder:this.activeFolder,documents:_44,library:this.activeLibrary,zone:this.zone,onBeforeClose:dojo.hitch(this,function(_45){if(_45==bfree.widget.Dialog.dialogResult.ok){this._grdDocuments.selection.clear();this._grdDocuments.refresh();this._grdDocuments.update();this._grdDocuments.setSelectedIndex(0);}}),onClose:function(){return true;}});}catch(e){var err=new bfree.api.Error("Failed to move document",e);bfree.widget.ErrorManager.handleError({error:err});}},_onDocumentNew:function(_46){try{this._grdDocuments.beginUpdate();bfree.widget.document.Creator.show({folder:(_46),library:this.activeLibrary,zone:this.zone,onClose:dojo.hitch(this,function(_47,_48){this._grdDocuments.endUpdate();this._grdDocuments.refresh();return true;})});}catch(e){this._grdDocuments.endUpdate();var err=new bfree.api.Error("Failed to open 'Create Documents' dialog",e);bfree.widget.ErrorManager.handleError({error:err});}},_onDocumentRestore:function(_49){try{if(!_49){return;}if(!_49.length){_49=[_49];}dojo.forEach(_49,dojo.hitch(this,function(it,idx){this._grdDocuments.setBusy(it);}));var _4a=new bfree.widget.document.Accessor({library:this.activeLibrary,zone:this.zone});dojo.forEach(_49,dojo.hitch(this,function(it,idx){_4a.doRestore(it,false);}));this._grdDocuments.selection.clear();this.activeLibrary.getDocuments().save({onComplete:dojo.hitch(this,function(){this._grdDocuments.refresh();})});}catch(e){var err=new bfree.api.Error("Failed to restore document",e);bfree.widget.ErrorManager.handleError({error:err});}},_onDocumentSecure:function(_4b){try{function _4c(_4d,_4e){return true;};if(!_4b){return;}this._grdDocuments.setBusy(_4b);bfree.widget.acl.Editor.show({user:this.activeUser,group:this.activeGroup,zone:this.zone,item:_4b,onClose:dojo.hitch(this,_4c)});}catch(e){var err=new bfree.api.Error("Failed to edit document security",e);bfree.widget.ErrorManager.handleError({error:err});}finally{var idx=this._grdDocuments.getItemIndex(_4b);this._grdDocuments.updateRow(idx);this._cmdBar.set("activeDocument",this.activeItem);}},_onDocumentView:function(_4f){try{if(!_4f){return;}this._grdDocuments.setBusy(_4f);var _50=new bfree.widget.document.Accessor({library:this.activeLibrary,zone:this.zone});_50.doView(_4f);}catch(e){var err=new bfree.api.Error("Failed to view document",e);bfree.widget.ErrorManager.handleError({error:err});}finally{var idx=this._grdDocuments.getItemIndex(_4f);this._grdDocuments.updateRow(idx);this._cmdBar.set("activeDocument",this.activeDocument);}},_onVersionView:function(_51,_52){try{if(!_51&&!_52){return;}var _53=new bfree.widget.document.version.Accessor({library:this.activeLibrary,zone:this.zone});_53.doView(_51,_52);}catch(e){var err=new bfree.api.Error("Failed to view document",e);bfree.widget.ErrorManager.handleError({error:err});}finally{}},_onDocumentsRefresh:function(){this._grdDocuments.refresh();},_onFolderDelete:function(_54){try{if(!_54){return;}this.activeLibrary.getFolders().loadItem({item:_54,callback:dojo.hitch(this,function(_55){this._tvwFolders.deleteFolder(_55);})});}catch(e){var err=new bfree.api.Error("Failed to delete folder",e);bfree.widget.ErrorManager.handleError({error:err});}},_onFolderEdit:function(_56){try{if(!_56){return;}this.activeLibrary.getFolders().loadItem({item:_56,callback:dojo.hitch(this,function(_57){this._tvwFolders.editFolder(_57);})});}catch(e){var err=new bfree.api.Error("Failed to rename folder",e);bfree.widget.ErrorManager.handleError({error:err});}},_onFolderNew:function(_58){try{if(!_58){return;}if(_58.root){this._tvwFolders.createFolder(_58);}else{this.activeLibrary.getFolders().loadItem({item:_58,callback:dojo.hitch(this,function(_59){this._tvwFolders.createFolder(_59);})});}}catch(e){var err=new bfree.api.Error("Failed to create a new folder",e);bfree.widget.ErrorManager.handleError({error:err});}},_onFolderSecure:function(_5a){try{function _5b(_5c,_5d){return true;};if(!_5a){return;}if(_5a.root){bfree.widget.acl.Editor.show({user:this.activeUser,group:this.activeGroup,zone:this.zone,item:this.activeLibrary,onClose:dojo.hitch(this,_5b)});}else{this.activeLibrary.getFolders().loadItem({item:_5a,callback:dojo.hitch(this,function(_5e){bfree.widget.acl.Editor.show({user:this.activeUser,group:this.activeGroup,zone:this.zone,item:_5a,onClose:dojo.hitch(this,_5b)});})});}}catch(e){var err=new bfree.api.Error("Failed to create a new folder",e);bfree.widget.ErrorManager.handleError({error:err});}},_onExport:function(_5f){try{this._grdDocuments.export_results(_5f);}catch(e){var err=new bfree.api.Error("Failed to export results",e);bfree.widget.ErrorManager.handleError({error:err});}},_onPrint:function(){try{this._grdDocuments.print_results();}catch(e){var err=new bfree.api.Error("Failed to print results",e);bfree.widget.ErrorManager.handleError({error:err});}},_onGroupAdmin:function(){try{bfree.widget.group.Administration.show({user:this.activeUser,zone:this.zone,onClose:dojo.hitch(this,function(_60,_61){return true;})});}catch(e){var err=new bfree.api.Error("Failed to open 'Group Administration' dialog",e);bfree.widget.ErrorManager.handleError({error:err});}},_onLogoff:function(){try{var _62=true;if(_62){var msg="Continue to exit VersaFile?";if(!confirm(msg)){return;}}this.onWorking();this.zone.logoff();parent.frames["zoneframe"].location.reload(true);}catch(e){var err=new bfree.api.Error("Failed to logout",e);bfree.widget.ErrorManager.handleError({error:err});}},_onUserAdmin:function(){try{bfree.widget.user.Administration.show({user:this.activeUser,zone:this.zone,onClose:dojo.hitch(this,function(_63,_64){return true;})});}catch(e){var err=new bfree.api.Error("Failed to open 'User Administration' dialog",e);bfree.widget.ErrorManager.handleError({error:err});}},_onUserEdit:function(){try{if(!this.activeUser){return;}function _65(_66,_67){if(_66==bfree.widget.Dialog.dialogResult.ok){this.nameNode.innerHTML=this.activeUser.getFullName();}return true;};bfree.widget.user.ProfileEditor.show({user:this.activeUser,zone:this.zone,onClose:dojo.hitch(this,_65)});}catch(e){var err=new bfree.api.Error("Failed to edit user properties",e);bfree.widget.ErrorManager.handleError({error:err});}},_onViewDefAdmin:function(){try{function _68(_69,_6a){var _6b=this._grdDocuments.activeView;var _6c=this.activeLibrary.getViewDefinitions().fetchById({id:_6b.id});var _6d=_6c.getView(this.activeLibrary);this._grdDocuments.set("activeView",_6d);this._grdDocuments.set("structure",_6d);this._grdDocuments.set("sortInfo",_6d.sort_column);this._grdDocuments.refresh();this._grdDocuments.refreshViews();return true;};bfree.widget.view.Administration.show({user:this.activeUser,library:this.activeLibrary,zone:this.zone,onClose:dojo.hitch(this,_68)});}catch(e){var err=new bfree.api.Error("Failed to open 'View Definition' dialog",e);bfree.widget.ErrorManager.handleError({error:err});}},_queryDocuments:function(_6e){this._grdDocuments.set("activeQuery",_6e.getQuery());this._cmdBar.set("activeCount",this._grdDocuments.rowCount);},_setActiveDocumentAttr:function(_6f){var _70=(this.activeDocument!=_6f);this.activeDocument=_6f;this._cmdBar.set("activeDocument",this.activeDocument);var idx=this._grdDocuments.getItemIndex(this.activeDocument);this._grdDocuments.updateRow(idx);if(_70){this._grdDocuments.setSelectedIndex(idx);}},_setActiveFolderAttr:function(_71){this.activeFolder=_71;this._queryDocuments(this.activeFolder.getActiveQuery());this._grdDocuments.set("activeFolder",this.activeFolder);this.activeFolder.document_count=this._grdDocuments.rowCount;this._cmdBar.set("activeFolder",this.activeFolder);if(this._wdgItemInfo){this._wdgItemInfo.setItem({item:this.activeFolder,folders:this.activeLibrary.getFolders(),type:bfree.widget.ItemInfo.Type.folder});}},_showLogon:function(){function _72(_73){if(_73==bfree.widget.Dialog.dialogResult.ok){setTimeout(bfree.widget.zone.Show._buildCheckFnRef(this),this._duration);}else{this.logoff(false);}return true;};var dlg=new bfree.widget.Dialog({title:"Bfree Logon",widgetConstructor:bfree.widget.zone.ReLogon,widgetParams:{zone:this.zone,activeUser:this.activeUser},noResize:true,height:240,width:400,zIndex:1024,onClose:dojo.hitch(this,_72)});dlg.startup();dlg.show();},_tvwFolders_onSelected:function(_74,_75){this._grdDocuments.selection.clear();this.activeLibrary.getFolders().loadItem({item:_74,callback:dojo.hitch(this,function(_76){this.set("activeFolder",_76);})});},constructor:function(_77){dojo.safeMixin(this,_77);},editUserGroups:function(){var dlg=new bfree.widget.Dialog({title:"Edit User/Groups",widgetConstructor:bfree.widget.zone.UserGroupsAdmin,widgetParams:{zone:this.zone},noResize:true,height:240,width:400,zIndex:1024});dlg.startup();dlg.show();},onLoad:function(wdg){},onWorking:function(){},_onEmpty:function(){this.activeLibrary.getDocuments().empty_recycling({zone:this.zone,library:this.activeLibrary});this._grdDocuments.refresh();},postCreate:function(){this.inherited("postCreate",arguments);bfree.widget.ErrorManager.errorToaster=this.errorToaster;bfree.api.Application.getDataTypes();bfree.api.Application.getOperators();this.activeLibrary.getPropertyDefinitions().fetch();this.activeLibrary.getDocumentTypes().fetch();this.activeLibrary.getViewDefinitions().fetch();if((this.zone.trial_expiry!=bfree.api.Zone.TrialStates.NO_TRIAL)&&(this.zone.trial_expiry!=bfree.api.Zone.TrialStates.INFINITE)){if(this.zone.trial_expiry>bfree.api.Zone.TrialStates.EXPIRED+1){this.trialMsgNode.innerHTML=dojo.replace(versa.VersaFile.messages.TRIAL_REMAINING,{days_left:this.zone.trial_expiry});}else{if(this.zone.trial_expiry==bfree.api.Zone.TrialStates.EXPIRED+1){this.trialMsgNode.innerHTML=versa.VersaFile.messages.TRIAL_FINAL;}else{this.trialMsgNode.innerHTML=versa.VersaFile.messages.TRIAL_EXPIRED;}}dojo.style(this.trialStateNode,{display:"block"});}this.nameNode.innerHTML=this.activeUser.getFullName();this._cmdBar=new bfree.widget.zone.Toolbar({user:this.activeUser,group:this.activeGroup,library:this.activeLibrary,zone:this.zone,onCommand:dojo.hitch(this,this.__onCommand),style:"z-index: 512;bottom:4px;left:0;position:absolute"},this.toolbarNode);new bfree.widget.search.TextBox({library:this.activeLibrary,onSearch:dojo.hitch(this,this._doAdHocQuery),style:"width:100%"},this.searchBoxNode);this._tvwFolders=new bfree.widget.folder.Tree({library:this.activeLibrary,user:this.activeUser,folders:this.activeLibrary.getFolders(),documents:this.activeLibrary.getDocuments(),dndController:"bfree.widget.folder.DndSource",dndType:"Folder",onCommand:dojo.hitch(this,this.__onCommand),onSelected:dojo.hitch(this,this._tvwFolders_onSelected),refreshGrid:dojo.hitch(this,this._onDocumentsRefresh),style:"height: 100%"},this.folderTreeNode);this._grdDocuments=new bfree.widget.document.Grid({id:"grdDocuments",zone:this.zone,library:this.activeLibrary,user:this.activeUser,style:"width: 100%",onCommand:dojo.hitch(this,this.__onCommand),onSelectedItem:dojo.hitch(this,this._grdDocuments_onSelectedItem),onSelectedItems:dojo.hitch(this,this._grdDocuments_onSelectedItems)},this.documentGridNode);this._wdgItemInfo=new bfree.widget.ItemInfo({library:this.library,documentTypes:this.activeLibrary.getDocumentTypes(),propertyDefinitions:this.activeLibrary.getPropertyDefinitions(),propertyMappings:this.activeLibrary.getPropertyMappings(),root:this._tvwFolders.rootNode},this.itemInfoNode);bfree.widget.document.PropertyEditor.refresh=dojo.hitch(this,this._onDocumentsRefresh);bfree.widget.acl.Editor.refresh=dojo.hitch(this,this._onDocumentsRefresh);this.versionSpan.innerHTML="V"+this.version+" | ";this.onLoad(this);},showEditDocumentTypes:function(){try{function _78(_79,_7a){if(_79==bfree.widget.Dialog.dialogResult.ok){}return true;};}catch(e){var err=new bfree.api.Error("Failed to open 'Edit Property Definitions' dialog",e);bfree.widget.ErrorManager.handleError({error:err});}},startup:function(){this._grdDocuments.startup();this._cmdBar.set("activeLibrary",this.activeLibrary);this._cmdBar.set("activeUser",this.activeUser);this.inherited("startup",arguments);this._tvwFolders.startup();this._grdDocuments.auto();}});bfree.widget.zone.Show._buildCheckFnRef=function(_7b){return (function(){_7b._checkSession();});};}