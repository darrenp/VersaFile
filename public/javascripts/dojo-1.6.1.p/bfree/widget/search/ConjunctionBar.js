/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.search.ConjunctionBar"]){dojo._hasResource["bfree.widget.search.ConjunctionBar"]=true;dojo.provide("bfree.widget.search.ConjunctionBar");dojo.require("bfree.widget.Bfree");dojo.require("dijit.Toolbar");dojo.require("bfree.widget.Button");dojo.declare("bfree.widget.search.ConjunctionBar",[dijit.Toolbar],{_btnAdd:null,_btnRemove:null,disabled:false,_onCommand:function(_1,e){this.onCommand(_1);if(_1==bfree.widget.Bfree.Commands.ADD){dojo.toggleClass(this._btnAdd.domNode,"versaHide",true);dojo.toggleClass(this._btnRemove.domNode,"versaHide",false);}},_setDisabledAttr:function(_2){this.disabled=_2;this._setState();},_setState:function(){this._btnAdd.set("disabled",this.disabled);this._btnRemove.set("disabled",this.disabled);},constructor:function(_3){},destroy:function(){this.destroyDescendants();this.inherited("destroy",arguments);},onCommand:function(_4){},postCreate:function(){this.inherited("postCreate",arguments);this._btnAdd=new bfree.widget.Button({label:"Add Row...",showLabel:false,disabled:false,iconClass:"commandIcon bfreeIconAdd",disabledIconClass:"sidebarIcon bfreeIconAddD",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.ADD)});this.addChild(this._btnAdd);this._btnRemove=new bfree.widget.Button({label:"Remove Row...",showLabel:false,disabled:false,iconClass:"sidebarIcon bfreeIconRemove",disabledIconClass:"commandIcon bfreeIconRemoveD",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.REMOVE)});this.addChild(this._btnRemove);dojo.toggleClass(this._btnRemove.domNode,"versaHide",true);},startup:function(){this.inherited("startup",arguments);}});}