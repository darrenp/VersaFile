/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.admin.Logon"]){dojo._hasResource["bfree.widget.admin.Logon"]=true;dojo.provide("bfree.widget.admin.Logon");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.form.Button");dojo.require("dijit.form.Form");dojo.require("bfree.api.User");dojo.require("bfree.widget.ValidationTextBox");dojo.declare("bfree.widget.admin.Logon",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("bfree.widget.admin","template/Logon.html","<div align=\"center\" style=\"height:68px;width:408px;position:relative\">\n\n<div dojoAttachPoint=\"logonNode\">\n<div dojoAttachPoint=\"logonFormNode\" >\n\n    <span style=\"position:absolute;top:24px;left:0\" class=\"logonLabel\">Username</span>\n    <div style=\"position:absolute;top:38px\"><input dojoAttachPoint=\"userNameNode\"/></div>\n\n    <span style=\"position:absolute;top:24px;left:168px\" class=\"logonLabel\">Password</span>\n    <div style=\"position:absolute;top:38px;left:168px;\"><input dojoAttachPoint=\"passwordNode\"/></div>\n\n    <div style=\"position:absolute;top:32px;left:332px;\">\n        <button dojoAttachPoint=\"logonButtonNode\" type=\"submit\"></button>\n    </div>\n\n</div>\n</div>\n</div>\n"),_btnSubmit:null,_frmLogon:null,_txtPassword:null,_txtUserName:null,_onSubmit:function(e){try{if(this._frmLogon.isValid()){var _1=this._txtUsername.get("value");var _2=this._txtPassword.get("value");var _3=this.users.logon(_1,_2);var _4=dojo.replace(bfree.widget.admin.Logon.OK_MESSAGE,_3);this._setStatus(bfree.widget.admin.Logon.STS_CODES.OK,_4);this.onLogon(_3);}else{this._txtUsername._hasBeenBlurred=true;this._txtUsername.validate();}}catch(e){var _5=dojo.replace(bfree.widget.admin.Logon.ERR_MESSAGE,e);this._setStatus(bfree.widget.admin.Logon.STS_CODES.ERR,_5);this._txtPassword.reset();this._txtUsername.setFocus(true);}finally{e.preventDefault();}},_setStatus:function(_6,_7){switch(_6){case bfree.widget.admin.Logon.STS_CODES.ERR:dojo.removeClass(this.statusNode,"dijitOkLabel");dojo.removeClass(this.statusImgNode,"statusIcon bfreeIconOk");dojo.addClass(this.statusImgNode,"statusIcon bfreeIconError");dojo.addClass(this.statusNode,"dijitErrorLabel");break;case bfree.widget.admin.Logon.STS_CODES.OK:dojo.removeClass(this.statusNode,"dijitErrorLabel");dojo.removeClass(this.statusImgNode,"statusIcon bfreeIconError");dojo.addClass(this.statusImgNode,"statusIcon bfreeIconOk");dojo.addClass(this.statusNode,"dijitOkLabel");break;}this.statusNode.innerHTML=_7;},constructor:function(_8){},onLogon:function(){},postCreate:function(){this.inherited("postCreate",arguments);this._frmLogon=new dijit.form.Form({onSubmit:dojo.hitch(this,this._onSubmit)},this.logonFormNode);this._txtUsername=new bfree.widget.ValidationTextBox({name:"txtUsername",required:true,placeHolder:"Enter your username",style:"width: 160px;"},this.userNameNode);this._txtPassword=new dijit.form.TextBox({name:"txtPassword",placeHolder:"Enter your password",type:"password",style:"width: 160px;"},this.passwordNode);this._btnSubmit=new dijit.form.Button({"class":"bfreeButton",iconClass:"buttonIcon bfreeIconLock",label:"Logon",type:"submit"},this.logonButtonNode);this.statusNode=dojo.byId("statusMsgNode");this.statusImgNode=dojo.byId("statusImgNode");this._txtUsername.focus();}});bfree.widget.admin.Logon.STS_CODES={"ERR":0,"OK":1};bfree.widget.admin.Logon.ERR_MESSAGE="Error: <b>{message}</b>";bfree.widget.admin.Logon.OK_MESSAGE="Success: <b>Logged in as username '{name}'.</b>";}