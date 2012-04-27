/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["versa.widget.share.Editor"]){dojo._hasResource["versa.widget.share.Editor"]=true;dojo.provide("versa.widget.share.Editor");dojo.require("bfree.widget.Bfree");dojo.require("bfree.widget._DialogWidget");dojo.require("bfree.widget.DateTextBox");dojo.require("bfree.widget.ValidationTextBox");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.form.CheckBox");dojo.require("dijit.form.Form");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.require("dojox.layout.TableContainer");dojo.declare("versa.widget.share.Editor",[dijit._Widget,dijit._Templated,bfree.widget._DialogWidget],{templateString:dojo.cache("versa/widget/share","template/Editor.html","<div style=\"height:100%;width:100%\">\n\n<div    dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        style=\"padding:8px 8px 4px 8px;height:100%;width:100%;\">\n\n    <div    dojoType=\"dijit.layout.BorderContainer\"\n            design=\"headline\"\n            gutters=\"false\"\n            splitter=\"false\"\n            region=\"center\">\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"center\"\n                splitter=\"true\"\n                class=\"highlightPane\"\n                style=\"padding:8px;overflow:hidden;\">\n\n            <div dojoAttachPoint=\"formNode\">\n                <div dojoAttachPoint=\"tableNode\"></div>\n            </div>\n\n        </div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,_chkExpires:null,_form:null,_tblProperties:null,_txtExpiryDate:null,_txtName:null,_txtPassword:null,_txtRepeat:null,creation:false,item:null,seed:null,share:null,library:null,zone:null,__doCancel:function(){return true;},__doSave:function(){var _1=false;try{if(this.library.getFolders().isDirty({item:this.share})){this.library.getFolders().save();}_1=true;}catch(e){var _2=new bfree.api.Error("Failed to save shared folder",e);bfree.widget.ErrorManager.handleError({error:_2});this.library.getFolders().clone({item:this.share});}return _1;},__onItemError:function(e){try{var _3=new bfree.api.Error("Failed to load share information",e);bfree.widget.ErrorManager.handleError({error:_3});}finally{this.onWidgetLoaded();}},__onItemLoaded:function(_4){try{if(this.share){this.share=this.library.getFolders().refreshItem(this.share.getId());this.library.getFolders().clone({item:this.share});this._txtExpiryDate.set("value",this.share.expiry);this._chkExpires.set("checked",(this.share.expiry));}else{var _5=(this.seed)?this.seed.name:"";this.share=this.library.createShare({name:_5,seed:this.seed,expiry:null});this._chkPassword.set("checked",true);}this._txtName.set("value",this.share.name);this._txtName.setFocus(true);}finally{this.onWidgetLoaded();}},_chkExpires_onChange:function(_6){this._txtExpiryDate.set("disabled",!_6);if(_6){if(!this._txtExpiryDate.get("value")){this._txtExpiryDate.set("value",dojo.date.add(new Date(),"week",1));}}else{this._txtExpiryDate.reset();}},_chkPassword_onChange:function(_7){this._txtPassword.set("value","");this._txtRepeat.set("value","");this._txtPassword.set("disabled",!_7);this._txtRepeat.set("disabled",!_7);if(_7){this._txtPassword.validate();this._txtRepeat.validate();}this.onValueChange();},_expiryValidator:function(_8,_9){if(this._txtExpiryDate){var _a=new Date();var _b=this._txtExpiryDate.parse(_8,_9);_b=dojo.date.add(_b,"day",1);_b=dojo.date.add(_b,"second",-1);if(dojo.date.compare(_b,_a,"date")<0){this._txtExpiryDate.set("invalidMessage","Selected date has already passed");return false;}}return true;},_nameValidator:function(_c,_d){if(this._txtName){if(String.isBlank(_c)){this._txtName.set("invalidMessage","Document type name cannot be blank");return false;}}return true;},_passwordValidator:function(_e,_f){if(this._txtPassword){if(String.isBlank(_e)){this._txtPassword.set("invalidMessage","Password cannot be blank");return false;}else{if(_e.trim().length<8){this._txtPassword.set("invalidMessage","Passwords must be at least 8 characters in length.");return false;}}}return true;},_repeatValidator:function(_10,_11){if(this._txtRepeat){if(String.isBlank(_10)){this._txtRepeat.set("invalidMessage","Password cannot be blank");return false;}else{if(this._txtPassword.value!=_10.trim()){this._txtRepeat.set("invalidMessage","Passwords do not match");return false;}}}return true;},_loadItem:function(){this.library.getFolders().loadItem({item:this.library.getFolders().getShareRootFolder(),scope:this,onItem:this.__onItemLoaded,onError:this.__onItemError});},_onExpiryChange:function(id,_12){this._txtExpiryDate.validate();if(_12){_12.setHours(23,59,59,999);}this._onValueChange(id,_12);},_onRepeatChange:function(_13){this.onValueChange();},_onValueChange:function(id,_14){var _15=(id=="expiry")?(dojo.date.compare(_14,this.share.expiry,"date")!=0):!this.share.valueEquals(id,_14);if(_15){this.library.getFolders().setValue(this.share,id,_14);this.onValueChange();}},constructor:function(_16){},destroy:function(){this.inherited("destroy",arguments);},isValid:function(){var _17=false;var _18=this.library.getFolders().isDirty({item:this.share});var _17=(!_18)?false:((this._txtName.isValid())&&(this._txtPassword.disabled||this._txtPassword.isValid())&&(this._txtRepeat.disabled||this._txtRepeat.isValid())&&(this._txtExpiryDate.disabled||this._txtExpiryDate.isValid()));return _17&&_18;},onDialogClosing:function(_19){var _1a=false;try{_1a=(_19==bfree.widget.Dialog.dialogResult.ok)?this.__doSave():this.__doCancel();this.returnValue=this.share;}catch(e){var err=new bfree.api.Error("Failed to close Share Creation dialog",e);bfree.widget.ErrorManager.handleError({error:err});}finally{this.library.getFolders().revert();}return _1a;},postCreate:function(){this.inherited("postCreate",arguments);this._tblProperties=new dojox.layout.TableContainer({id:"tblProps1",customClass:"versa",showLabels:true,cols:1,labelWidth:104,style:"width:100%"},this.tableNode);this._txtName=new bfree.widget.ValidationTextBox({id:"txtName",label:"Name",selectOnClick:true,intermediateChanges:true,required:true,trim:true,style:"width:100%",validator:dojo.hitch(this,this._nameValidator),onChange:dojo.hitch(this,this._onValueChange,"name")});this._tblProperties.addChild(this._txtName);this._chkPassword=new dijit.form.CheckBox({name:"chkPassword",label:"Change Password",onChange:dojo.hitch(this,this._chkPassword_onChange)});if(this.share){this._tblProperties.addChild(this._chkPassword);}this._txtPassword=new bfree.widget.ValidationTextBox({id:"txtPassword",type:"password",label:"Password",disabled:true,selectOnClick:true,intermediateChanges:true,required:true,style:"width:100%",validator:dojo.hitch(this,this._passwordValidator),onChange:dojo.hitch(this,this._onValueChange,"password")});this._tblProperties.addChild(this._txtPassword);this._txtRepeat=new bfree.widget.ValidationTextBox({id:"txtRepeat",type:"password",label:"Repeat Password",disabled:true,selectOnClick:true,intermediateChanges:true,required:true,style:"width:100%",validator:dojo.hitch(this,this._repeatValidator),onChange:dojo.hitch(this,this._onRepeatChange)});this._tblProperties.addChild(this._txtRepeat);this._chkExpires=new dijit.form.CheckBox({name:"chkExpires",label:"Share Expires",onChange:dojo.hitch(this,this._chkExpires_onChange)});this._tblProperties.addChild(this._chkExpires);this._txtExpiryDate=new bfree.widget.DateTextBox({id:"txtExpiry",label:"Expiry Date",disabled:true,required:true,scrollOnFocus:false,selectOnClick:true,intermediateChanges:true,constraints:{min:new Date(),selector:"date"},validator:dojo.hitch(this,this._expiryValidator),onChange:dojo.hitch(this,this._onExpiryChange,"expiry")});this._tblProperties.addChild(this._txtExpiryDate);},startup:function(){this.inherited("startup",arguments);setTimeout(versa.widget.share.Editor._loadFnRef(this),0);}});versa.widget.share.Editor._loadFnRef=function(_1b){return (function(){_1b._loadItem();});};versa.widget.share.Editor.show=function(_1c){var h=(!_1c.share)?212:228;var dlg=new bfree.widget.Dialog({id:"dlgShareShow",title:"Shared Folder",widgetConstructor:versa.widget.share.Editor,widgetParams:{mode:_1c.mode,share:_1c.share,seed:_1c.seed,library:_1c.library,zone:_1c.zone},noResize:true,height:h,width:368,buttons:bfree.widget.Dialog.buttons.ok|bfree.widget.Dialog.buttons.cancel,onClose:_1c.onClose});dlg.startup();dlg.show();};}