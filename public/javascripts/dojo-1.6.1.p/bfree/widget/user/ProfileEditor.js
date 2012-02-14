/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.user.ProfileEditor"]){dojo._hasResource["bfree.widget.user.ProfileEditor"]=true;dojo.provide("bfree.widget.user.ProfileEditor");dojo.require("bfree.widget._DialogWidget");dojo.require("bfree.widget.file.AvatarUploader");dojo.require("bfree.widget.Label");dojo.require("bfree.widget.ValidationTextBox");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.require("dojox.layout.TableContainer");dojo.declare("bfree.widget.user.ProfileEditor",[dijit._Widget,dijit._Templated,bfree.widget._DialogWidget],{templateString:dojo.cache("bfree/widget/user","template/ProfileEditor.html","<div style=\"height:100%;width:100%;\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        design=\"sidebar\"\n        gutters=\"false\"\n        style=\"padding:8px;height:100%;width:100%;\">\n\n     <div    dojoType=\"dijit.layout.ContentPane\"\n            region=\"leading\"\n            splitter=\"false\"\n            style=\"padding:0;overflow:hidden;width:0px\">\n\n            <div dojoAttachPoint=\"avatarNode\"></div>\n\n    </div>\n\n    <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"center\"\n                style=\"padding:8px;overflow:hidden\"\n                class=\"highlightPane\">\n\n        <div dojoAttachPoint=\"formNode\">\n            <div dojoAttachPoint=\"tableNode\"></div>\n        </div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_btnAvatar:null,_chkEditPassword:null,_lblName:null,_txtConfirmPassword:null,_txtEmail:null,_txtFirstName:null,_txtLastName:null,_txtOldPassword:null,_txtNewPassword:null,_users:null,zone:null,user:null,_chkEditPassword_onChange:function(_1){this._txtOldPassword.reset();this._txtNewPassword.reset();this._txtConfirmPassword.reset();this._txtOldPassword.attr("disabled",!_1);this._txtNewPassword.attr("disabled",!_1);this._txtConfirmPassword.attr("disabled",!_1);if(_1){this._txtOldPassword.focus();}this._users.setDirty(this.user);this.onValueChange();},_onAvatarChange:function(_2){this._users.setValue(this.user,"temp_file",_2);this.onValueChange();},_onValueChange:function(id,_3){if(this.user.hasOwnProperty(id)&&(this.user[id]!=_3)){this._users.setValue(this.user,id,_3);this.onValueChange();}},_passwordValidator:function(_4,_5){return this._txtNewPassword.attr("value")==_4;},_passwordLengthValidator:function(_6,_7){if(this._txtOldPassword.get("value")==_6){return false;}return _6.length>=8;},_txtConfirmPassword_onChange:function(_8){this.onValueChange();},_txtNewPassword_onChange:function(_9){this._txtConfirmPassword.reset();this._users.setValue(this.user,"new_password",_9);this.onValueChange();},_txtOldPassword_onChange:function(_a){this._users.setValue(this.user,"old_password",_a);this.onValueChange();},constructor:function(_b){},destroy:function(){if(this._btnAvatar){this._btnAvatar.destroy();this._btnAvatar=null;}this.inherited("destroy",arguments);},focus:function(){this._txtFirstName.focus(true);},isValid:function(){var _c=true;if(this._chkEditPassword.checked){_c=(this._txtOldPassword.isValid()&&this._txtNewPassword.isValid()&&this._txtConfirmPassword.isValid());}if(this.user.is_admin&&String.isBlank(this.user.email)){_c=false;}var _d=this.user.reset_password;if(!(!_d||_d==null||_d==""||_d.length==0)){if(_d.length>0&&_d.length<8){_c=false;}}return (this._users.isDirty({item:this.user})&&_c);},onDialogClosing:function(_e){var _f=false;try{if(_e==bfree.widget.Dialog.dialogResult.ok){this._users.save();this._users.loadItem({item:this.user});}else{this._users.revert();}_f=true;}catch(e){var err=new bfree.api.Error("Failed to close Profile Editor dialog",e);bfree.widget.ErrorManager.handleError({error:err});}finally{}return _f;},postCreate:function(){this.inherited("postCreate",arguments);this._users=this.zone.getUsers();this._tblProperties=new dojox.layout.TableContainer({id:"tblUsers1",customClass:"versa",showLabels:true,cols:1,labelWidth:112,style:"width:100%"},this.tableNode);this._lblName=new bfree.widget.Label({id:"lblName",label:"Username",value:this.user.name,style:"width:100%"});this._tblProperties.addChild(this._lblName);this._txtFirstName=new bfree.widget.ValidationTextBox({id:"txtFirstName",intermediateChanges:true,label:"First Name",selectOnClick:true,value:this.user.first_name,style:"width:100%",onChange:dojo.hitch(this,this._onValueChange,"first_name")});this._tblProperties.addChild(this._txtFirstName);this._txtLastName=new bfree.widget.ValidationTextBox({id:"txtLastName",intermediateChanges:true,label:"Last Name",selectOnClick:true,value:this.user.last_name,style:"width:100%",onChange:dojo.hitch(this,this._onValueChange,"last_name")});this._tblProperties.addChild(this._txtLastName);this._txtEmail=new bfree.widget.ValidationTextBox({id:"txtEmail",intermediateChanges:true,label:"Email",selectOnClick:true,value:this.user.email,required:this.user.is_admin,style:"width:100%",onChange:dojo.hitch(this,this._onValueChange,"email")});this._tblProperties.addChild(this._txtEmail);this._chkEditPassword=new dijit.form.CheckBox({name:"chkEditPassword",label:"Change Password",onChange:dojo.hitch(this,this._chkEditPassword_onChange)});this._tblProperties.addChild(this._chkEditPassword);this._txtOldPassword=new bfree.widget.ValidationTextBox({id:"txtOldPassword",placeHolder:"Enter old password",intermediateChanges:true,label:"Old Password",selectOnClick:true,required:true,disabled:true,type:"password",style:"width:100%",onChange:dojo.hitch(this,this._txtOldPassword_onChange)});this._tblProperties.addChild(this._txtOldPassword);this._txtNewPassword=new bfree.widget.ValidationTextBox({id:"txtNewPassword",placeHolder:"Enter new password",intermediateChanges:true,label:"New Password",selectOnClick:true,required:true,disabled:true,type:"password",style:"width:100%",validator:dojo.hitch(this,this._passwordLengthValidator),onChange:dojo.hitch(this,this._txtNewPassword_onChange)});this._tblProperties.addChild(this._txtNewPassword);this._txtConfirmPassword=new dijit.form.ValidationTextBox({id:"txtConfirmPassword",label:"Validate",intermediateChanges:true,invalidMessage:"Passwords do not match",placeHolder:"Confirm new password",required:true,disabled:true,type:"password",validator:dojo.hitch(this,this._passwordValidator),style:"width:100%",onChange:dojo.hitch(this,this._txtConfirmPassword_onChange)});this._tblProperties.addChild(this._txtConfirmPassword);},startup:function(){this.inherited("startup",arguments);this._txtEmail.validate();}});bfree.widget.user.ProfileEditor.show=function(_10){var dlg=new bfree.widget.Dialog({id:"dlgProfileEditor",title:"Edit Profile: "+_10.user.name,widgetConstructor:bfree.widget.user.ProfileEditor,widgetParams:{user:_10.user,zone:_10.zone},noResize:true,height:280,width:420,zIndex:1024,buttons:bfree.widget.Dialog.buttons.ok|bfree.widget.Dialog.buttons.cancel,onClose:_10.onClose});dlg.startup();dlg.show();};}