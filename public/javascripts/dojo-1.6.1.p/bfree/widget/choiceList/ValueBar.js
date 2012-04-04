/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.choiceList.ValueBar"]){dojo._hasResource["bfree.widget.choiceList.ValueBar"]=true;dojo.provide("bfree.widget.choiceList.ValueBar");dojo.require("bfree.widget.Bfree");dojo.require("dijit.Toolbar");dojo.require("bfree.widget.Button");dojo.declare("bfree.widget.choiceList.ValueBar",[dijit.Toolbar],{_btnAdd:null,_btnDown:null,_btnRemove:null,_btnUp:null,activeChoiceList:null,activeValue:null,disabled:false,grid:null,valueStore:null,_onCommand:function(_1,e){this.onCommand(_1);},_setActiveChoiceListAttr:function(_2){this.activeChoiceList=_2;this._setState();},_setActiveValueAttr:function(_3){this.activeValue=_3;this._setState();},_setDisabledAttr:function(_4){this.disabled=_4;this._setState();},_setState:function(){if(this.disabled){this._btnAdd.set("disabled",this.disabled);this._btnUp.set("disabled",this.disabled);this._btnDown.set("disabled",this.disabled);this._btnRemove.set("disabled",this.disabled);}else{var _5=(this.activeChoiceList==null);var _6=(this.activeValue==null);var _7=(this.activeValue)?this.activeValue.sort[0]:0;var _8=true;var _9=(_7>0);var _a=(_7<(this.grid.rowCount-1));var _b=!(_5||_6);this._btnAdd.set("disabled",!_8);this._btnUp.set("disabled",!_9);this._btnDown.set("disabled",!_a);this._btnRemove.set("disabled",!_b);}},constructor:function(_c){},destroy:function(){this.destroyDescendants();this.inherited("destroy",arguments);},onCommand:function(_d){},postCreate:function(){this.inherited("postCreate",arguments);this._btnAdd=new bfree.widget.Button({id:"btnAddValue",label:"Add Value to Choice List...",showLabel:false,disabled:true,iconClass:"sidebarIcon bfreeIconAdd",disabledIconClass:"sidebarIcon bfreeIconAddD",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.ADD)});this.addChild(this._btnAdd);this._btnUp=new bfree.widget.Button({id:"btnValueUp",label:"Move Value up...",showLabel:false,disabled:true,iconClass:"sidebarIcon bfreeIconUp",disabledIconClass:"sidebarIcon bfreeIconUpD",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.MOVE_UP)});this.addChild(this._btnUp);this._btnDown=new bfree.widget.Button({id:"btnValueDown",label:"Move Value down...",showLabel:false,disabled:true,iconClass:"sidebarIcon bfreeIconDown",disabledIconClass:"sidebarIcon bfreeIconDownD",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.MOVE_DOWN)});this.addChild(this._btnDown);this._btnRemove=new bfree.widget.Button({id:"btnRemoveValue",label:"Remove Value from Choice List...",showLabel:false,disabled:true,iconClass:"sidebarIcon bfreeIconRemove",disabledIconClass:"sidebarIcon bfreeIconRemoveD",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.REMOVE)});this.addChild(this._btnRemove);},startup:function(){this.inherited("startup",arguments);}});}