/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["versa.widget.reference.ContextMenu"]){dojo._hasResource["versa.widget.reference.ContextMenu"]=true;dojo.provide("versa.widget.reference.ContextMenu");dojo.require("bfree.widget.Bfree");dojo.require("bfree.widget.HeaderMenu");dojo.require("versa.api.PermissionSet");dojo.declare("versa.widget.reference.ContextMenu",bfree.widget.HeaderMenu,{menuLabel:"Document",_arrDivides:[],_buttons:{},activeItems:null,activeFolder:null,activeLibrary:null,activeUser:null,grid:null,_onCommand:function(_1,_2,e){this.onCommand(_1,_2,{items:this.activeItems});},_openMyself:function(_3){if(this.grid.views.views[0].scrollboxNode===_3.target){return;}this._setState();this.inherited("_openMyself",arguments);},_setActiveItemsAttr:function(_4){this.activeItems=(!_4)?[]:_4;},_setState:function(){var _5=new Object();var _6=(this.activeItems.length==1);var _7=dojo.some(this.activeItems,function(_8,_9){return (_8.isDeleted()||this.activeFolder.isTrash());},this);var _a=dojo.some(this.activeItems,function(_b,_c){return _b.isShare();},this);var _d=(_7||_a);_5.VIEW=false;_5.COPY=_a;_5.EDIT=(_7||_a);_5.VERSIONS=(_7||_a);_5.MOVE=(_7||_a);_5.CKO=(_7||_a);_5.CKI=(_7||_a);_5.CANCEL_CKO=(_7||_a);_5.DELETE=(_7||_a);_5.SECURE=(_7);_5.RESTORE=(!_7);_5.DESTROY=(!_7);_5.UNSHARE=(!_a);dojo.forEach(this._arrDivides,function(_e,_f){dojo.toggleClass(_e.domNode,"versaHide",_d);},this);dojo.toggleClass(this._buttons.VIEW.domNode,"versaHide",_5.VIEW);dojo.toggleClass(this._buttons.COPY.domNode,"versaHide",_5.COPY);dojo.toggleClass(this._buttons.EDIT.domNode,"versaHide",_5.EDIT);dojo.toggleClass(this._buttons.VERSIONS.domNode,"versaHide",_5.VERSIONS);dojo.toggleClass(this._buttons.MOVE.domNode,"versaHide",_5.MOVE);dojo.toggleClass(this._buttons.CKO.domNode,"versaHide",_5.CKO);dojo.toggleClass(this._buttons.CKI.domNode,"versaHide",_5.CKI);dojo.toggleClass(this._buttons.XCKO.domNode,"versaHide",_5.CANCEL_CKO);dojo.toggleClass(this._buttons.DELETE.domNode,"versaHide",_5.DELETE);dojo.toggleClass(this._buttons.ACL.domNode,"versaHide",_5.SECURE);dojo.toggleClass(this._buttons.RESTORE.domNode,"versaHide",_5.RESTORE);dojo.toggleClass(this._buttons.DESTROY.domNode,"versaHide",_5.DESTROY);dojo.toggleClass(this._buttons.UNSHARE.domNode,"versaHide",_5.UNSHARE);var _10=(this.activeItems.length>0)?true:false;var _11=new versa.api.PermissionSet(_10);dojo.forEach(this.activeItems,function(_12,idx){var _13=_12.getPermissionSet(this.activeFolder,this.activeLibrary,this.activeUser);_11=_11.andSet(_13);},this);this._buttons.VIEW.set("disabled",!(_11.getValue(versa.api.PermissionIndices.VIEW)&&_6));this._buttons.COPY.set("disabled",!(_11.getValue(versa.api.PermissionIndices.COPY)&&_6));this._buttons.EDIT.set("disabled",!(_11.getValue(versa.api.PermissionIndices.EDIT)&&_6));this._buttons.VERSIONS.set("disabled",!(_11.getValue(versa.api.PermissionIndices.EDIT)&&_6));this._buttons.CKO.set("disabled",!(_11.getValue(versa.api.PermissionIndices.CKO)&&_6));this._buttons.CKI.set("disabled",!(_11.getValue(versa.api.PermissionIndices.CKI)&&_6));this._buttons.XCKO.set("disabled",!(_11.getValue(versa.api.PermissionIndices.CANCEL_CKO)&&_6));this._buttons.MOVE.set("disabled",!(_11.getValue(versa.api.PermissionIndices.MOVE)));this._buttons.DELETE.set("disabled",!(_11.getValue(versa.api.PermissionIndices.DELETE)));this._buttons.ACL.set("disabled",!(_11.getValue(versa.api.PermissionIndices.SECURE)&&_6));this._buttons.RESTORE.set("disabled",!(_11.getValue(versa.api.PermissionIndices.RESTORE)));this._buttons.DESTROY.set("disabled",!(_11.getValue(versa.api.PermissionIndices.DESTROY)));this._buttons.UNSHARE.set("disabled",!(_11.getValue(versa.api.PermissionIndices.DESTROY)));},constructor:function(_14){},onCommand:function(_15,_16,_17){},postCreate:function(){this.inherited("postCreate",arguments);this._buttons.VIEW=new dijit.MenuItem({label:"View",disabled:true,iconClass:"menuIcon bfreeIconViewDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.VIEW,bfree.widget.Bfree.ObjectTypes.DOCUMENT)});this.addChild(this._buttons.VIEW);this._buttons.COPY=new dijit.MenuItem({label:"Copy Local",disabled:true,iconClass:"menuIcon bfreeIconCopyDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.COPY,bfree.widget.Bfree.ObjectTypes.DOCUMENT)});this.addChild(this._buttons.COPY);this._buttons.EDIT=new dijit.MenuItem({label:"Edit Properties...",disabled:true,iconClass:"menuIcon bfreeIconEditDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.EDIT,bfree.widget.Bfree.ObjectTypes.DOCUMENT)});this.addChild(this._buttons.EDIT);this._buttons.VERSIONS=new dijit.MenuItem({label:"Versions",disabled:true,iconClass:"menuIcon bfreeIconNewDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.EDIT,bfree.widget.Bfree.ObjectTypes.VERSION)});this.addChild(this._buttons.VERSIONS);this._arrDivides[0]=new dijit.MenuSeparator();this.addChild(this._arrDivides[0]);this._buttons.MOVE=new dijit.MenuItem({label:"Move To Folder...",disabled:true,iconClass:"menuIcon bfreeIconMoveDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.MOVE,bfree.widget.Bfree.ObjectTypes.DOCUMENT)});this.addChild(this._buttons.MOVE);this._arrDivides[1]=new dijit.MenuSeparator();this.addChild(this._arrDivides[1]);this._buttons.CKO=new dijit.MenuItem({label:"Checkout",disabled:true,iconClass:"menuIcon bfreeIconCkoDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.CHECKOUT,bfree.widget.Bfree.ObjectTypes.DOCUMENT)});this.addChild(this._buttons.CKO);this._buttons.CKI=new dijit.MenuItem({label:"Checkin...",disabled:true,iconClass:"menuIcon bfreeIconCkiDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.CHECKIN,bfree.widget.Bfree.ObjectTypes.DOCUMENT)});this.addChild(this._buttons.CKI);this._buttons.XCKO=new dijit.MenuItem({label:"Cancel Checkout",disabled:true,iconClass:"menuIcon bfreeIconCancelCkoDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.CANCEL_CKO,bfree.widget.Bfree.ObjectTypes.DOCUMENT)});this.addChild(this._buttons.XCKO);this._arrDivides[2]=new dijit.MenuSeparator();this.addChild(this._arrDivides[2]);this._buttons.DELETE=new dijit.MenuItem({label:"Delete",disabled:true,iconClass:"menuIcon bfreeIconDeleteDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.DELETE,bfree.widget.Bfree.ObjectTypes.DOCUMENT)});this.addChild(this._buttons.DELETE);this._arrDivides[3]=new dijit.MenuSeparator();this.addChild(this._arrDivides[3]);this._buttons.ACL=new dijit.MenuItem({label:"Permissions...",disabled:true,iconClass:"menuIcon bfreeIconSecureDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.SECURE,bfree.widget.Bfree.ObjectTypes.DOCUMENT)});this.addChild(this._buttons.ACL);this._buttons.RESTORE=new dijit.MenuItem({label:"Restore",disabled:true,iconClass:"menuIcon bfreeIconCkoDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.RESTORE,bfree.widget.Bfree.ObjectTypes.DOCUMENT)});this.addChild(this._buttons.RESTORE);this._buttons.DESTROY=new dijit.MenuItem({label:"Delete Permanently",disabled:true,iconClass:"menuIcon bfreeIconDeleteDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.DESTROY,bfree.widget.Bfree.ObjectTypes.DOCUMENT)});this.addChild(this._buttons.DESTROY);this._buttons.UNSHARE=new dijit.MenuItem({label:"Remove from Share",disabled:true,iconClass:"menuIcon bfreeIconDeleteDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.UNSHARE,bfree.widget.Bfree.ObjectTypes.DOCUMENT)});this.addChild(this._buttons.UNSHARE);}});}