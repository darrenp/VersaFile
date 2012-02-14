/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.zone.ReLogon"]){dojo._hasResource["bfree.widget.zone.ReLogon"]=true;dojo.provide("bfree.widget.zone.ReLogon");dojo.require("bfree.widget._DialogWidget");dojo.require("bfree.widget.zone.Logon");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.declare("bfree.widget.zone.ReLogon",[dijit._Widget,dijit._Templated,bfree.widget._DialogWidget],{templateString:dojo.cache("bfree/widget/zone","template/ReLogon.html","<div style=\"padding:8px;height:100%;width:100%;\">\n\n    <div>\n        Your session has expired. Please logon to continue.\n    </div>\n\n    <div dojoAttachPoint=\"logonNode\">\n    </div>\n\n</div>\n"),widgetsInTemplate:false,activeUser:null,zone:null,_onLogon:function(){this.dialogResult=bfree.widget.Dialog.dialogResult.ok;this._closeDialog();},constructor:function(_1){},postCreate:function(){this.inherited("postCreate",arguments);new bfree.widget.zone.Logon({zone:this.zone,user:this.activeUser,onLogon:dojo.hitch(this,this._onLogon)},this.logonNode);}});}