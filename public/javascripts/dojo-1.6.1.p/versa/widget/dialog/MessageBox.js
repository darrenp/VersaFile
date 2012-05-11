/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["versa.widget.dialog.MessageBox"]){dojo._hasResource["versa.widget.dialog.MessageBox"]=true;dojo.provide("versa.widget.dialog.MessageBox");dojo.require("versa.widget.dialog._Base");dojo.declare("versa.widget.dialog.MessageBox",versa.widget.dialog._Base,{_activeButtons:{},_buttonPaneNode:null,_closing:false,_contentNode:null,_dialogResult:versa.DialogResults.Cancel,_displayNode:null,buttons:versa.MessageBoxButtons.None,icon:versa.MessageBoxIcons.None,message:"",_initializeIcon:function(){if(this.icon==versa.MessageBoxIcons.None){return;}dojo.style(this._displayNode,{paddingLeft:"56px"});var _1="error";switch(this.icon){case versa.MessageBoxIcons.Question:_1="question";break;case versa.MessageBoxIcons.Exclamation:_1="exclamation";break;case versa.MessageBoxIcons.Asterisk:_1="asterisk";break;case versa.MessageBoxIcons.Stop:_1="stop";break;case versa.MessageBoxIcons.Error:_1="error";break;case versa.MessageBoxIcons.Warning:_1="warning";break;case versa.MessageBoxIcons.Information:_1="information";break;}var _2=dojo.replace("/images/icons/32/{0}.png",[_1]);dojo.create("img",{src:_2,style:{position:"absolute",left:"16px",top:"18px"}},this._displayNode);},_onHide:function(_3){this._dialogResult=_3;for(var b in this._activeButtons){this._activeButtons[b].set("disabled",true);}this.hide();},constructor:function(){},destroy:function(){this.destroyDescendants();this.inherited("destroy",arguments);},hide:function(_4){if(this._closing){return;}this._closing=true;this.inherited("hide",arguments);},onClose:function(_5){},onHide:function(){setTimeout(versa.widget.dialog.MessageBox._closeFnRef(this),this.duration);},postCreate:function(){this.inherited("postCreate",arguments);this._displayNode=dojo.create("div",{style:{display:"table-cell",maxWidth:"480px",height:"48px",minWidth:"164px",padding:"16px 16px 16px 16px",verticalAlign:"middle"}},this._widgetNode);this._initializeIcon();},startup:function(){this.inherited("startup",arguments);}});versa.widget.dialog.MessageBox._closeFnRef=function(_6){return (function(){_6.onClose(_6._dialogResult);_6.destroy();});};}