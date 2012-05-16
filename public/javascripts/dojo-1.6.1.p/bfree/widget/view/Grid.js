/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.view.Grid"]){dojo._hasResource["bfree.widget.view.Grid"]=true;dojo.provide("bfree.widget.view.Grid");dojo.require("bfree.widget._Grid");dojo.declare("bfree.widget.view.Grid",[bfree.widget._Grid],{selectionMode:"single",viewDefinitions:null,_canEdit:function(_1,_2){return false;},_canSort:function(_3){return true;},constructor:function(_4){this.updateDelay=0;this.rowsPerPage=25;this.formatterScope=this;this.query={};this.queryOptions={cache:true};this.clientSort=false;this.canEdit=this._canEdit;this.canSort=this._canSort;this.noDataMessage="No View Definitions found";this.sortInfo=3;},postCreate:function(){this.inherited("postCreate",arguments);this.set("structure",bfree.widget.view.Grid.view1);},startup:function(){this.inherited("startup",arguments);this.setStore(this.viewDefinitions.store,{is_template:true},{cache:true});}});bfree.widget.view.Grid.getState=function(_5,_6){if(!_6){return 0;}if(!_6.isValid()){return -1;}if(this.grid.viewDefinitions.isNew({item:_6})){return 1;}if(this.grid.viewDefinitions.isDirty({item:_6})){return 2;}return 0;};bfree.widget.view.Grid.formatState=function(_7,_8){var _9="";switch(_7){case -1:_9="statusIcon bfreeIconInvalid";break;case 1:_9="statusIcon bfreeIconNew";break;case 2:_9="statusIcon bfreeIconEdit";break;}return dojo.replace("<img src=\"/images/icons/16/blank.png\" width=\"16\" height=\"16\" class=\"{0}\"/>",[_9]);};bfree.widget.view.Grid.view1=[{cells:[{field:"state",name:"&nbsp;",width:"16px",get:bfree.widget.view.Grid.getState,formatter:bfree.widget.view.Grid.formatState},{field:"name",name:"Name",width:"auto"},{field:"sort_id",name:"Sort",hidden:true}],width:"auto"}];}