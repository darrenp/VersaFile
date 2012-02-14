/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.admin.AdminMenu"]){dojo._hasResource["bfree.widget.admin.AdminMenu"]=true;dojo.provide("bfree.widget.admin.AdminMenu");dojo.require("dijit.Menu");dojo.require("dijit.MenuItem");dojo.declare("bfree.widget.admin.AdminMenu",[dijit.Menu],{_onCommand:function(_1,e){this.onCommand(_1);},constructor:function(_2){},onCommand:function(_3){},postCreate:function(){this.addChild(new dijit.MenuItem({label:"Users",showLabel:false,iconClass:"commandIcon bfreeIconUser",onClick:dojo.hitch(this,this._onCommand,bfree.widget.admin.CommandBar.COMMANDS.USERS)}));this.addChild(new dijit.MenuItem({label:"Servers",showLabel:false,iconClass:"commandIcon bfreeIconAdmin",onClick:dojo.hitch(this,this._onCommand,bfree.widget.admin.CommandBar.COMMANDS.SERVERS)}));this.addChild(new dijit.MenuItem({label:"Accounts",showLabel:false,iconClass:"commandIcon bfreeIconLock",onClick:dojo.hitch(this,this._onCommand,bfree.widget.admin.CommandBar.COMMANDS.ACCOUNTS)}));this.addChild(new dijit.MenuItem({label:"Zones",showLabel:false,iconClass:"commandIcon bfreeIconEdit",onClick:dojo.hitch(this,this._onCommand,bfree.widget.admin.CommandBar.COMMANDS.ZONES)}));}});}