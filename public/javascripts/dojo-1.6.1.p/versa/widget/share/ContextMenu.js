/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["versa.widget.share.ContextMenu"]){dojo._hasResource["versa.widget.share.ContextMenu"]=true;dojo.provide("versa.widget.share.ContextMenu");dojo.require("bfree.widget.Bfree");dojo.require("bfree.widget.HeaderMenu");dojo.declare("versa.widget.share.ContextMenu",bfree.widget.HeaderMenu,{menuLabel:"Shared Document",_arrDivides:[],_buttons:{},_onCommand:function(_1,_2,e){this.onCommand(_1,_2,{items:this.activeItems});},constructor:function(_3){},onCommand:function(_4,_5,_6){},postCreate:function(){this.inherited("postCreate",arguments);this._buttons.VIEW=new dijit.MenuItem({label:"View",iconClass:"menuIcon bfreeIconViewDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.VIEW,bfree.widget.Bfree.ObjectTypes.DOCUMENT)});this.addChild(this._buttons.VIEW);this._buttons.COPY=new dijit.MenuItem({label:"Copy Local...",iconClass:"menuIcon bfreeIconCopyDocument",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.COPY,bfree.widget.Bfree.ObjectTypes.DOCUMENT)});this.addChild(this._buttons.COPY);}});}