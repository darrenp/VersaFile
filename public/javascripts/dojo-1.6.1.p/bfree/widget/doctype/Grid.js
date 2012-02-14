/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.doctype.Grid"]){dojo._hasResource["bfree.widget.doctype.Grid"]=true;dojo.provide("bfree.widget.doctype.Grid");dojo.require("bfree.widget._Grid");dojo.declare("bfree.widget.doctype.Grid",[bfree.widget._Grid],{documentTypes:null,_canEdit:function(_1,_2){return false;},_canSort:function(_3){return true;},constructor:function(_4){this.updateDelay=0;this.rowsPerPage=25;this.formatterScope=this;this.query={};this.queryOptions={cache:true};this.selectionMode="single";this.clientSort=false;this.canEdit=this._canEdit;this.canSort=this._canSort;this.noDataMessage="No Document Types found";this.sortInfo=2;},postCreate:function(){this.inherited("postCreate",arguments);this.set("structure",bfree.widget.doctype.Grid.view);},startup:function(){this.inherited("startup",arguments);this.setStore(this.documentTypes.store,{},{cache:true});}});bfree.widget.doctype.Grid.getState=function(_5,_6){if(!_6){return 0;}if((_6.hasOwnProperty("isValid"))&&(!_6.isValid())){return -1;}if(this.grid.documentTypes.isNew({item:_6})){return 1;}if(this.grid.documentTypes.isDirty({item:_6})){return 2;}return 0;};bfree.widget.doctype.Grid.formatState=function(_7,_8){var _9="";switch(_7){case -1:_9="statusIcon bfreeIconInvalid";break;case 1:_9="statusIcon bfreeIconNew";break;case 2:_9="statusIcon bfreeIconEdit";break;}return dojo.replace("<img src=\"/images/icons/16/blank.png\" width=\"16\" height=\"16\" class=\"{0}\"/>",[_9]);};bfree.widget.doctype.Grid.view=[{cells:[{field:"state",name:"&nbsp;",width:"16px",get:bfree.widget.doctype.Grid.getState,formatter:bfree.widget.doctype.Grid.formatState},{field:"name",name:"Name",width:"auto"}],width:"auto"}];}