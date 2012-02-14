/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.user.UserMenu"]){dojo._hasResource["bfree.widget.user.UserMenu"]=true;dojo.provide("bfree.widget.user.UserMenu");dojo.require("bfree.widget.Bfree");dojo.require("dijit.Menu");dojo.declare("bfree.widget.user.UserMenu",[dijit.Menu],{activeUser:null,zone:null,_onCommand:function(_1,_2,e){this.onCommand(_1,_2);},constructor:function(_3){},onCommand:function(_4,_5){},postCreate:function(){this.inherited("postCreate",arguments);this.addChild(new dijit.MenuItem({label:"Edit Profile",iconClass:"menuIcon bfreeIconEdit",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.EDIT,bfree.widget.Bfree.ObjectTypes.USER)}));this.addChild(new dijit.MenuItem({label:"Logout",iconClass:"menuIcon bfreeIconLogout",onClick:dojo.hitch(this,this._onCommand,bfree.widget.Bfree.Commands.LOGOFF)}));}});}