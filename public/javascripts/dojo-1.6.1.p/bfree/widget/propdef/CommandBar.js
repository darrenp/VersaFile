/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.propdef.CommandBar"]){dojo._hasResource["bfree.widget.propdef.CommandBar"]=true;dojo.provide("bfree.widget.propdef.CommandBar");dojo.require("bfree.widget.Bfree");dojo.require("dijit.Toolbar");dojo.require("dijit.form.Button");dojo.declare("bfree.widget.propdef.CommandBar",[dijit.Toolbar],{_btnSave:null,_btnUndo:null,_btnNew:null,_btnEdit:null,_btnDelete:null,_btnHelp:null,activeItem:null,propertyDefinitions:null,_onCommand:function(_1,e){this.onCommand(_1);},_setActiveItemAttr:function(_2){this.activeItem=_2;this._setState();},_setState:function(){var _3=this.propertyDefinitions.isDirty();var _4=(this.activeItem==null);var _5=!(_4||this.activeItem.is_system);this._btnSave.set("disabled",!_3);this._btnUndo.set("disabled",!_3);this._btnEdit.set("disabled",_4);this._btnDelete.set("disabled",!_5||_4);},constructor:function(_6){},destroy:function(){if(this._btnSave){this._btnSave.destroy();this._btnSave=null;}if(this._btnUndo){this._btnUndo.destroy();this._btnUndo=null;}if(this._btnNew){this._btnNew.destroy();this._btnNew=null;}if(this._btnEdit){this._btnEdit.destroy();this._btnEdit=null;}if(this._btnDelete){this._btnDelete.destroy();this._btnDelete=null;}if(this._btnHelp){this._btnHelp.destroy();this._btnHelp=null;}this.inherited("destroy",arguments);},onCommand:function(_7){},postCreate:function(){this.inherited("postCreate",arguments);this._btnSave=new bfree.widget.Button({id:"btnPropDefsSave",label:"Save Changes",showLabel:false,disabled:true,iconClass:"commandIcon bfreeIconSave",disabledIconClass:"commandIcon bfreeIconSaveD",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.SAVE)});this.addChild(this._btnSave);this._btnUndo=new bfree.widget.Button({label:"Undo Unsaved Changes",showLabel:false,disabled:true,iconClass:"commandIcon bfreeIconUndo",disabledIconClass:"commandIcon bfreeIconUndoD",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.UNDO)});this.addChild(this._btnUndo);this.addChild(new dijit.ToolbarSeparator());this._btnNew=new bfree.widget.Button({label:"New Property Definition...",showLabel:false,disabled:false,iconClass:"commandIcon bfreeIconPropDef",disabledIconClass:"commandIcon bfreeIconAdminD",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.NEW)});this.addChild(this._btnNew);this._btnEdit=new bfree.widget.Button({label:"Edit selected Property Definition...",showLabel:false,disabled:true,iconClass:"commandIcon bfreeIconEdit",disabledIconClass:"commandIcon bfreeIconEditD",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.EDIT)});this.addChild(this._btnEdit);this._btnDelete=new bfree.widget.Button({label:"Delete selected Property Definition",showLabel:false,disabled:true,iconClass:"commandIcon bfreeIconDelete",disabledIconClass:"commandIcon bfreeIconDeleteD",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.DELETE)});this.addChild(this._btnDelete);this.addChild(new dijit.ToolbarSeparator());}});}