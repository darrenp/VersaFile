/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.user.Editor"]){dojo._hasResource["bfree.widget.user.Editor"]=true;dojo.provide("bfree.widget.user.Editor");dojo.require("bfree.widget.ValidationTextBox");dojo.require("bfree.widget.user.Info");dojo.require("bfree.widget.user.PasswordBox");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.require("dojox.layout.TableContainer");dojo.declare("bfree.widget.user.Editor",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("bfree/widget/user","template/Editor.html","<div style=\"height:100%;width:100%\">\n\n<div    dojoAttachPoint=\"mainNode\"\n        dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        liveSplitters=\"true\"\n        style=\"width:100%;height:100%\">\n\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            splitter=\"false\"\n            region=\"center\"\n            style=\"overflow:hidden;padding:0\">\n\n         <div dojoAttachPoint=\"formNode\">\n\n            <div dojoAttachPoint=\"tableNode\"></div>\n\n        </div>\n\n    </div>\n\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            splitter=\"false\"\n            region=\"bottom\"\n            style=\"overflow:hidden;height: 88px;\">\n\n        <div dojoAttachPoint=\"infoNode\"></div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_form:null,_chkDisabled:null,_cmbGroup:null,_tblProperties:null,_txtEmail:null,_txtFirstName:null,_txtLastName:null,_txtName:null,_txtPassword:null,_wdgInfo:null,activeItem:null,groups:null,users:null,_setActiveItemAttr:function(_1){this.activeItem=_1;this._txtName.set("value",this.activeItem.name);this._txtFirstName.set("value",this.activeItem.first_name);this._txtLastName.set("value",this.activeItem.last_name);this._txtEmail.set("value",this.activeItem.email);this._cmbGroup.set("value",this.activeItem.active_group);this._txtPassword.set("activeItem",this.activeItem);this._chkDisabled.set("checked",this.activeItem.disabled);this._txtEmail.set("required",this.activeItem.is_admin);this._wdgInfo.set("activeItem",this.activeItem);this._setState();},_setState:function(){var _2=this.users.isDirty({item:this.activeItem});var _3=this.users.isNew({item:this.activeItem});var _4=this.activeItem.is_admin;this._txtName.set("disabled",!(_2&&_3));this._txtFirstName.set("disabled",!_2);this._txtLastName.set("disabled",!_2);this._txtEmail.set("disabled",!_2);this._txtPassword.set("disabled",!_2);this._cmbGroup.set("disabled",!(_2&&!_4));this._chkDisabled.set("disabled",!(_2&&!_4));},_onValueChange:function(_5,_6){if(!this.activeItem){return;}if(!this.activeItem.hasOwnProperty(_5)){return;}var _7=this.users.getValue(this.activeItem,_5);if(String.isEmpty(_7)&&String.isEmpty(_6)){return;}if(_7!=_6){this.users.store.setValue(this.activeItem,_5,_6);this.onValueChange(this.activeItem,_5,_7,_6);}},_onCmbGroupChange:function(_8){this._onValueChange("active_group",_8);this._txtEmail.validate();},constructor:function(_9){},destroy:function(){this.destroyDescendants();if(this._txtPassword){this._txtPassword.destroy();this._txtPassword=null;}if(this._tblProperties){this._tblProperties.destroyRecursive();this._tblProperties=null;}if(this._form){this._form.destroy();this._form=null;}this.inherited("destroy",arguments);},focus:function(){this._txtName.setFocus(true);},onValueChange:function(_a,_b,_c,_d){},postCreate:function(){this.inherited("postCreate",arguments);this._form=new dijit.form.Form({id:"userForm"},this.formNode);this._tblProperties=new dojox.layout.TableContainer({id:"tblUsers1",customClass:"versa",showLabels:true,cols:1,labelWidth:96,style:"width:100%"},this.tableNode);this._txtName=new bfree.widget.ValidationTextBox({id:"txtName",label:"Username",required:true,intermediateChanges:true,selectOnClick:true,style:"width:100%",trim:true,validator:dojo.hitch(this,this._txtNameValidator),onChange:dojo.hitch(this,this._onValueChange,"name")});this._tblProperties.addChild(this._txtName);this._txtFirstName=new bfree.widget.ValidationTextBox({id:"txtFirstName",intermediateChanges:true,label:"First Name",selectOnClick:true,style:"width:100%",onChange:dojo.hitch(this,this._onValueChange,"first_name")});this._tblProperties.addChild(this._txtFirstName);this._txtLastName=new bfree.widget.ValidationTextBox({id:"txtLastName",intermediateChanges:true,label:"Last Name",selectOnClick:true,style:"width:100%",onChange:dojo.hitch(this,this._onValueChange,"last_name")});this._tblProperties.addChild(this._txtLastName);this._txtEmail=new bfree.widget.ValidationTextBox({id:"txtEmail",label:"Email Address",selectOnClick:true,style:"width:100%",validator:dojo.hitch(this,this._emailValidator),onChange:dojo.hitch(this,this._onValueChange,"email")});this._tblProperties.addChild(this._txtEmail);this._txtPassword=new bfree.widget.user.PasswordBox({id:"txtPwdBox",label:"Password",disabled:true,style:"width:100%",validator:dojo.hitch(this,this._passwordValidator),onChange:dojo.hitch(this,this._onValueChange,"password")});this._tblProperties.addChild(this._txtPassword);this._cmbGroup=new bfree.widget.FilteringSelect({label:"Group",store:this.groups.store,query:{},queryOptions:{cache:true},onChange:dojo.hitch(this,this._onCmbGroupChange),searchAttr:"name"});this._tblProperties.addChild(this._cmbGroup);this._chkDisabled=new dijit.form.CheckBox({label:"User is disabled",onChange:dojo.hitch(this,this._onValueChange,"disabled")});this._tblProperties.addChild(this._chkDisabled);this._wdgInfo=new bfree.widget.user.Info({id:"wdgInfo1"},this.infoNode);},_txtNameValidator:function(_e){if(this._txtName){_e=_e.trim();if(_e==""){this._txtName.set("invalidMessage","Username cannot be blank");return false;}if(_e.length<4){this._txtName.set("invalidMessage","Username must be longer than 4 characters");return false;}if(_e.indexOf(" ")>=0){this._txtName.set("invalidMessage","Username must be one word");return false;}var _f=this.users.fetch();for(var i=0;i<_f.length;i++){if(_f[i].name&&_f[i].name.toLowerCase().trim()==_e.toLowerCase().trim()&&_f[i].__id!=this.activeItem.__id){this._txtName.set("invalidMessage","Duplicate username");return false;}}}return true;},_passwordValidator:function(_10){var _11=_10;if(this.activeItem.isNew()){if(_11.length<8){return false;}}else{if(!String.isEmpty(_11)){return true;}if(_11.length>0&&_11.length<8){return false;}}return true;},_emailValidator:function(_12){if(this._txtEmail){if(_12.trim()==""){this._txtEmail.set("invalidMessage","Email cannot be blank");return false;}if(!bfree.api.Utilities.validateEmail(_12)){this._txtEmail.set("invalidMessage","You must enter a valid email");return false;}}return true;},resize:function(){this.inherited("resize",arguments);this.mainNode.resize();},startup:function(){this.inherited("startup",arguments);this._tblProperties.startup();}});}