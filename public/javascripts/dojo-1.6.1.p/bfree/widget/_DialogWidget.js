/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget._DialogWidget"]){dojo._hasResource["bfree.widget._DialogWidget"]=true;dojo.provide("bfree.widget._DialogWidget");dojo.require("bfree.widget.Dialog");dojo.declare("bfree.widget._DialogWidget",null,{dialog:null,dialogResult:bfree.widget.Dialog.dialogResult.none,returnValue:null,_isDirty:false,_closeDialog:function(_1){this.onDialogClose(this.dialogResult,this.returnValue);},_setIsDirty:function(_2){var _3=(this._isDirty!=_2);if(!_3){return;}this._isDirty=_2;this.onDirtyChanged(this._isDirty);},_workEnd:function(_4){this.onWorkEnd();},_workStart:function(_5){this.onWorkStart();},canClose:function(){return true;},constructor:function(_6){},focus:function(){},isValid:function(){return true;},onDialogClose:function(_7,_8){},onValueChange:function(){},onDialogClosing:function(_9){return true;},onWorkEnd:function(_a){},onWorkStart:function(_b){},resize:function(){}});}