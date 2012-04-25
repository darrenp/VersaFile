/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.view.CellBar"]){dojo._hasResource["bfree.widget.view.CellBar"]=true;dojo.provide("bfree.widget.view.CellBar");dojo.require("bfree.widget.Bfree");dojo.require("dijit.Toolbar");dojo.require("bfree.widget.Button");dojo.declare("bfree.widget.view.CellBar",[dijit.Toolbar],{_btnAdd:null,_btnDown:null,_btnRemove:null,_btnUp:null,_btnEdit:null,activeView:null,activeCell:null,disabled:false,grid:null,cellStore:null,_onCommand:function(_1,e){this.onCommand(_1);},_setActiveViewAttr:function(_2){this.activeView=_2;this._setState();},_setActiveCellAttr:function(_3){this.activeCell=_3;this._setState();},_setDisabledAttr:function(_4){this.disabled=_4;this._setState();},_setState:function(){if(this.disabled){this._btnAdd.set("disabled",this.disabled);this._btnUp.set("disabled",this.disabled);this._btnDown.set("disabled",this.disabled);this._btnRemove.set("disabled",this.disabled);}else{var _5=(this.activeView==null);var _6=(this.activeCell==null);var _7=(this.activeCell)?this.activeCell.sort[0]:0;var _8=true;var _9=(_7>3);var _a=((_7<(this.grid.rowCount-1))&&(_7>2));var _b=(_7>2);var _c=((!_6)&&(_7>1));this._btnAdd.set("disabled",!_8);this._btnUp.set("disabled",!_9);this._btnDown.set("disabled",!_a);this._btnRemove.set("disabled",!_b);}},constructor:function(_d){},destroy:function(){this.destroyDescendants();this.inherited("destroy",arguments);},onCommand:function(_e){},postCreate:function(){this.inherited("postCreate",arguments);this._btnAdd=new bfree.widget.Button({id:"btnAddCell",label:"Add Column to View...",showLabel:false,disabled:false,iconClass:"sidebarIcon bfreeIconAdd",disabledIconClass:"sidebarIcon bfreeIconAddD",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.ADD)});this.addChild(this._btnAdd);this._btnUp=new bfree.widget.Button({id:"btnCellUp",label:"Move Column to the left",showLabel:false,disabled:false,iconClass:"sidebarIcon bfreeIconUp",disabledIconClass:"sidebarIcon bfreeIconUpD",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.MOVE_UP)});this.addChild(this._btnUp);this._btnDown=new bfree.widget.Button({id:"btnCellDown",label:"Move Column to the right",showLabel:false,disabled:false,iconClass:"sidebarIcon bfreeIconDown",disabledIconClass:"sidebarIcon bfreeIconDownD",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.MOVE_DOWN)});this.addChild(this._btnDown);this._btnRemove=new bfree.widget.Button({id:"btnRemoveCell",label:"Remove Column from View",showLabel:false,disabled:false,iconClass:"sidebarIcon bfreeIconRemove",disabledIconClass:"sidebarIcon bfreeIconRemoveD",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.REMOVE)});this.addChild(this._btnRemove);},startup:function(){this.inherited("startup",arguments);}});}