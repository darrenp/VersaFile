/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["versa.widget.dialog.MessageBox"]){dojo._hasResource["versa.widget.dialog.MessageBox"]=true;dojo.provide("versa.widget.dialog.MessageBox");dojo.require("bfree.widget.Button");dojo.require("dijit.Dialog");versa.DialogResults={"None":0,"OK":1,"Cancel":2,"Abort":3,"Retry":4,"Ignore":5,"Yes":6,"No":7};versa.MessageBoxButtons={"None":0,"OK":1,"Cancel":2,"OKCancel":3,"Abort":4,"Retry":8,"Ignore":16,"RetryCancel":10,"AbortRetryIgnore":28,"Yes":32,"No":64,"YesNo":96,"YesNoCancel":98};versa.MessageBoxIcons={"None":0,"Question":1,"Exclamation":2,"Asterisk":3,"Stop":4,"Error":5,"Warning":6,"Information":7};dojo.declare("versa.widget.dialog.MessageBox",dijit.Dialog,{_activeButtons:{},_buttonPaneNode:null,_closing:false,_contentNode:null,_dialogResult:versa.DialogResults.Cancel,_displayNode:null,buttons:versa.MessageBoxButtons.None,icon:versa.MessageBoxIcons.None,message:"",_initializeButtons:function(){if((this.buttons&versa.MessageBoxButtons.OK)==versa.MessageBoxButtons.OK){this._activeButtons.OK=new bfree.widget.Button({id:"btnOk","class":"versaButton",label:"OK",onClick:dojo.hitch(this,this._onHide,versa.DialogResults.OK)});this._activeButtons.OK.placeAt(this._buttonPaneNode);}if((this.buttons&versa.MessageBoxButtons.Yes)==versa.MessageBoxButtons.Yes){new bfree.widget.Button({"class":"versaButton",label:"Yes",onClick:dojo.hitch(this,this._onHide,versa.DialogResults.Yes)}).placeAt(this._buttonPaneNode);}if((this.buttons&versa.MessageBoxButtons.No)==versa.MessageBoxButtons.No){new bfree.widget.Button({"class":"versaButton",label:"No",onClick:dojo.hitch(this,this._onHide,versa.DialogResults.No)}).placeAt(this._buttonPaneNode);}if((this.buttons&versa.MessageBoxButtons.Retry)==versa.MessageBoxButtons.Retry){new bfree.widget.Button({"class":"versaButton",label:"Retry",onClick:dojo.hitch(this,this._onHide,versa.DialogResults.Retry)}).placeAt(this._buttonPaneNode);}if((this.buttons&versa.MessageBoxButtons.Cancel)==versa.MessageBoxButtons.Cancel){new bfree.widget.Button({"class":"versaButton",label:"Cancel",onClick:dojo.hitch(this,this._onHide,versa.DialogResults.Cancel)}).placeAt(this._buttonPaneNode);}if((this.buttons&versa.MessageBoxButtons.Abort)==versa.MessageBoxButtons.Abort){new bfree.widget.Button({"class":"versaButton",label:"Abort",onClick:dojo.hitch(this,this._onHide,versa.DialogResults.Abort)}).placeAt(this._buttonPaneNode);}if((this.buttons&versa.MessageBoxButtons.Ignore)==versa.MessageBoxButtons.Ignore){new bfree.widget.Button({"class":"versaButton",label:"Ignore",onClick:dojo.hitch(this,this._onHide,versa.DialogResults.Ignore)}).placeAt(this._buttonPaneNode);}},_initializeIcon:function(){if(this.icon==versa.MessageBoxIcons.None){return;}dojo.style(this._displayNode,{paddingLeft:"48px"});var _1="error";switch(this.icon){case versa.MessageBoxIcons.Question:_1="question";break;case versa.MessageBoxIcons.Exclamation:_1="exclamation";break;case versa.MessageBoxIcons.Asterisk:_1="asterisk";break;case versa.MessageBoxIcons.Stop:_1="stop";break;case versa.MessageBoxIcons.Error:_1="error";break;case versa.MessageBoxIcons.Warning:_1="warning";break;case versa.MessageBoxIcons.Information:_1="information";break;}var _2=dojo.replace("/images/icons/32/{0}.png",[_1]);dojo.create("img",{src:_2,style:{position:"absolute",left:"8px",top:"8px"}},this._displayNode);},_onHide:function(_3){this._dialogResult=_3;for(var b in this._activeButtons){this._activeButtons[b].set("disabled",true);}this.hide();},constructor:function(){},destroy:function(){this.destroyDescendants();this.inherited("destroy",arguments);},hide:function(_4){if(this._closing){return;}this._closing=true;this.inherited("hide",arguments);},onClose:function(_5){},onHide:function(){setTimeout(versa.widget.dialog.MessageBox._closeFnRef(this),this.duration);},postCreate:function(){this.inherited("postCreate",arguments);dojo.create("img",{src:"/images/icons/16/logo.png",style:{position:"absolute",left:"2px",top:"5px"}},this.titleBar);dojo.style(this.titleNode,{marginLeft:"12px"});dojo.style(this.containerNode,{padding:"0"});this._contentNode=dojo.create("div");this._displayNode=dojo.create("div",{style:{display:"table-cell",maxWidth:"480px",height:"48px",minWidth:"164px",padding:"0 8px 0 8px",verticalAlign:"middle"}},this._contentNode);this._initializeIcon();dojo.create("p",{"class":"dijitDarkLabel",innerHTML:this.message},this._displayNode);this._buttonPaneNode=dojo.create("div",{"class":"versaDialogButtonPane",style:{height:"32px",padding:"4px 4px 0 0",textAlign:"right"}},this._contentNode);this._initializeButtons();this.set("content",this._contentNode);},startup:function(){this.inherited("startup",arguments);}});versa.widget.dialog.MessageBox._closeFnRef=function(_6){return (function(){_6.onClose(_6._dialogResult);_6.destroy();});};}