/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.SortGrid"]){dojo._hasResource["bfree.widget.SortGrid"]=true;dojo.provide("bfree.widget.SortGrid");dojo.require("bfree.widget._Grid");dojo.declare("bfree.widget.SortGrid",[bfree.widget._Grid],{sort_field:null,_canSort:function(){return false;},_swapItems:function(_1,_2){this.beginUpdate();var _3=this.store.getValue(_1,this.sort_field);var _4=this.store.getValue(_2,this.sort_field);this.store.setValue(_1,this.sort_field,_4);this.store.setValue(_2,this.sort_field,_3);this.endUpdate();this.sort();},constructor:function(_5){this.canSort=this._canSort;this.sortInfo=(_5.sortInfo)?_5.sortInfo:1;},moveItem:function(_6,_7){var _8=this.getItemIndex(_6)+_7;if((_8<0)||(_8>=this.rowCount)){return;}var _9=this.getItem(_8);this._swapItems(_6,_9);_8=this.getItemIndex(_6);this.setSelectedIndex(_8);}});bfree.widget.SortGrid.move={"UP":-1,"DOWN":1};}