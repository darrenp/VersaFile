/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.document.version.ContextMenu"]){dojo._hasResource["bfree.widget.document.version.ContextMenu"]=true;dojo.provide("bfree.widget.document.version.ContextMenu");dojo.require("bfree.widget.Bfree");dojo.require("bfree.widget.HeaderMenu");dojo.declare("bfree.widget.document.version.ContextMenu",bfree.widget.HeaderMenu,{_btnDocCopy:null,_btnDocView:null,menuLabel:"Version",activeItem:null,versions:null,reference:null,refresh:function(){},_onCommand:function(_1,_2,e){this.onCommand(_1,_2,{document:this.document,version:this.activeItem});},_openMyself:function(_3){try{if((!this.rowHit)||(this.activeItem==null)){_3.cancelBubble=true;_3.returnValue=false;}else{this.inherited("_openMyself",arguments);}}finally{this.rowHit=false;}},_setActiveItemAttr:function(_4){this.activeItem=_4;if(this._btnDocSync){if(this.reference.getState(bfree.api.Document.states.SYNCHRONIZING)){this._btnDocSync.set("disabled",true);this._btnDocSync.set("label","Synchronizing...");}else{this._btnDocSync.set("disabled",this.activeItem.dropbox_uid!=null);this._btnDocSync.set("label","Synchronize");}}},constructor:function(_5){},onHide:function(){this.activeItem=null;this.inherited("onHide",arguments);},onCommand:function(_6,_7,_8){},postCreate:function(){this.inherited("postCreate",arguments);this._btnDocView=new dijit.MenuItem({label:"View",iconClass:"menuIcon bfreeIconViewDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.VIEW,bfree.widget.Bfree.ObjectTypes.VERSION)});this.addChild(this._btnDocView);this._btnDocCopy=new dijit.MenuItem({label:"Copy Local",iconClass:"menuIcon bfreeIconCopyDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.COPY,bfree.widget.Bfree.ObjectTypes.VERSION)});this.addChild(this._btnDocCopy);if(this.dropbox){this._btnDocSync=new dijit.MenuItem({label:"Synchronize",iconClass:"menuIcon bfreeDropboxRootFolder",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.SYNCHRONIZE,bfree.widget.Bfree.ObjectTypes.VERSION)});this.addChild(this._btnDocSync);}}});}