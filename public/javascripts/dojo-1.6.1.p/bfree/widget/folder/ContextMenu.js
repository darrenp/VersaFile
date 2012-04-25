/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.folder.ContextMenu"]){dojo._hasResource["bfree.widget.folder.ContextMenu"]=true;dojo.provide("bfree.widget.folder.ContextMenu");dojo.require("bfree.widget.Bfree");dojo.require("bfree.widget.HeaderMenu");dojo.require("dijit.MenuSeparator");dojo.declare("bfree.widget.folder.ContextMenu",bfree.widget.HeaderMenu,{_arrDivides:[],_buttons:{},menuLabel:"Folder",activeLibrary:null,activeNode:null,activeUser:null,activeGroup:null,tree:null,_onCommand:function(_1,_2){((_1==bfree.widget.Bfree.Commands.NEW)&&(_2==bfree.widget.Bfree.ObjectTypes.SHARE))?this.onCommand(_1,_2,{folder:null}):this.onCommand(_1,_2,{folder:this.activeNode.item});},_openMyself:function(_3){if(this.activeNode.item.isSearch()){return;}this._setState();this.inherited("_openMyself",arguments);},_setActiveNodeAttr:function(_4){this.activeNode=_4;},_setState:function(){var _5=new Object();var _6=this.activeNode.item.isSpecial();var _7=this.activeNode.item;_5.RENAME=_7.isSpecial();_5.EDIT=!_7.isShare();_5.DELETE=_7.isSpecial();_5.NEW=_7.isSpecial();_5.ACL=_7.isSpecial()&&!_7.isShare();_5.EMPTY=!_7.isTrash();_5.SHARE=!_7.isShareRoot();_5.UNSHARE=!_7.isShare();_5.COPY=!_7.isShare();dojo.forEach(this._arrDivides,function(_8,_9){dojo.toggleClass(_8.domNode,"versaHide",_6);},this);dojo.toggleClass(this._buttons.RENAME.domNode,"versaHide",_5.RENAME);dojo.toggleClass(this._buttons.EDIT.domNode,"versaHide",_5.EDIT);dojo.toggleClass(this._buttons.DELETE.domNode,"versaHide",_5.DELETE);dojo.toggleClass(this._buttons.NEW.domNode,"versaHide",_5.NEW);dojo.toggleClass(this._buttons.ACL.domNode,"versaHide",_5.ACL);dojo.toggleClass(this._buttons.EMPTY.domNode,"versaHide",_5.EMPTY);dojo.toggleClass(this._buttons.SHARE.domNode,"versaHide",_5.SHARE);dojo.toggleClass(this._buttons.UNSHARE.domNode,"versaHide",_5.UNSHARE);dojo.toggleClass(this._buttons.COPY.domNode,"versaHide",_5.COPY);var _a=_7.getPermissionSet(this.activeLibrary,this.activeUser);this._buttons.RENAME.set("disabled",!(_a.getValue(versa.api.PermissionIndices.EDIT)));this._buttons.EDIT.set("disabled",!(_a.getValue(versa.api.PermissionIndices.EDIT)));this._buttons.DELETE.set("disabled",!(_a.getValue(versa.api.PermissionIndices.DELETE)));this._buttons.FLD_CREATE.set("disabled",!(_a.getValue(versa.api.PermissionIndices.CREATE)));this._buttons.DOC_CREATE.set("disabled",!(_a.getValue(versa.api.PermissionIndices.FILE)));this._buttons.NEW.set("disabled",(this._buttons.FLD_CREATE.disabled&&this._buttons.DOC_CREATE.disabled));this._buttons.ACL.set("disabled",!(_a.getValue(versa.api.PermissionIndices.SECURE)));this._buttons.EMPTY.set("disabled",((!_7.isTrash())||(!(this.activeUser.is_admin||this.activeGroup.is_admin))));this._buttons.SHARE.set("disabled",(!_7.isShareRoot()));this._buttons.UNSHARE.set("disabled",(!_7.isShare()));this._buttons.COPY.set("disabled",(!_7.isShare()));},constructor:function(_b){},onCommand:function(_c,_d){},onHide:function(){this.inherited("onHide",arguments);this.activeNode=null;},postCreate:function(){this.inherited("postCreate",arguments);this._buttons.RENAME=new dijit.MenuItem({label:"Rename",disabled:true,iconClass:"menuIcon bfreeIconEditFolder",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.RENAME,bfree.widget.Bfree.ObjectTypes.FOLDER)});this.addChild(this._buttons.RENAME);this._buttons.EDIT=new dijit.MenuItem({label:"Edit Properties...",disabled:true,iconClass:"menuIcon bfreeIconEditFolder",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.EDIT,bfree.widget.Bfree.ObjectTypes.SHARE)});this.addChild(this._buttons.EDIT);this._buttons.DELETE=new dijit.MenuItem({label:"Delete",disabled:true,iconClass:"menuIcon bfreeIconDeleteFolder",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.DESTROY,bfree.widget.Bfree.ObjectTypes.FOLDER)});this.addChild(this._buttons.DELETE);this._arrDivides[0]=new dijit.MenuSeparator();this.addChild(this._arrDivides[0]);var _e=new dijit.Menu({});this._buttons.FLD_CREATE=new dijit.MenuItem({label:"Folder",disabled:true,iconClass:"menuIcon bfreeIconNewFolder",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.NEW,bfree.widget.Bfree.ObjectTypes.FOLDER)});_e.addChild(this._buttons.FLD_CREATE);this._buttons.DOC_CREATE=new dijit.MenuItem({label:"Document(s)...",disabled:true,iconClass:"menuIcon bfreeIconNewDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.NEW,bfree.widget.Bfree.ObjectTypes.DOCUMENT)});_e.addChild(this._buttons.DOC_CREATE);this._buttons.NEW=new dijit.PopupMenuItem({label:"New",disabled:true,popup:_e,iconClass:"menuIcon bfreeIconNewSubFolder"});this.addChild(this._buttons.NEW);this._arrDivides[1]=new dijit.MenuSeparator();this.addChild(this._arrDivides[1]);this._buttons.ACL=new dijit.MenuItem({label:"Permissions...",disabled:true,iconClass:"menuIcon bfreeIconSecureFolder",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.SECURE,bfree.widget.Bfree.ObjectTypes.FOLDER)});this.addChild(this._buttons.ACL);this._buttons.EMPTY=new dijit.MenuItem({label:"Empty Recycle Bin",disabled:false,iconClass:"menuIcon bfreeTrashFolder",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.EMPTY)});this.addChild(this._buttons.EMPTY);this._buttons.SHARE=new dijit.MenuItem({label:"Create Share",disabled:false,iconClass:"menuIcon bfreeShareFolderClosed",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.NEW,bfree.widget.Bfree.ObjectTypes.SHARE)});this.addChild(this._buttons.SHARE);this._buttons.UNSHARE=new dijit.MenuItem({label:"Delete",disabled:false,iconClass:"menuIcon bfreeIconDeleteFolder",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.DESTROY,bfree.widget.Bfree.ObjectTypes.SHARE)});this.addChild(this._buttons.UNSHARE);this._buttons.COPY=new dijit.MenuItem({label:"Copy Link",disabled:true,iconClass:"menuIcon bfreeIconDeleteDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.COPY,bfree.widget.Bfree.ObjectTypes.SHARE)});this.addChild(this._buttons.COPY);},startup:function(){this.inherited("startup",arguments);}});}