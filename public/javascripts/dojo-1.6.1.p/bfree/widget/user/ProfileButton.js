/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.user.ProfileButton"]){dojo._hasResource["bfree.widget.user.ProfileButton"]=true;dojo.provide("bfree.widget.user.ProfileButton");dojo.require("bfree.widget.user.UserMenu");dojo.require("dijit.form.ComboButton");dojo.declare("bfree.widget.user.ProfileButton",[dijit.form.ComboButton],{_avatarNode:null,_avatarUrl:null,scrollOnFocus:false,user:null,zone:null,_onCommand:function(_1,_2,e){this.onCommand(_1,_2);},_setIconNode:function(_3){if(this._avatarNode){dojo.destroy(this._avatarNode);this._avatarNode=null;}this._avatarNode=dojo.create("img",{src:_3,width:"64",height:"64"},this.iconNode);},constructor:function(_4){},onCommand:function(_5,_6){},postCreate:function(){this.inherited("postCreate",arguments);var _7=this.user.getAvatarUrl({zone:this.zone});this._setIconNode(_7);this.dropDown=new bfree.widget.user.UserMenu({activeUser:this.user,zone:this.zone,onCommand:dojo.hitch(this,this._onCommand)});},refresh:function(){var _8=this.user.getAvatarUrl({zone:this.zone});this._setIconNode(_8);},startup:function(){this.inherited("startup",arguments);}});}