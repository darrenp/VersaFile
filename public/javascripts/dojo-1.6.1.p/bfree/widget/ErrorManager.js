/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.ErrorManager"]){dojo._hasResource["bfree.widget.ErrorManager"]=true;dojo.provide("bfree.widget.ErrorManager");dojo.require("bfree.widget.Dialog");dojo.require("versa.widget.error.Show");dojo.declare("bfree.widget.ErrorManager",null,{});bfree.widget.ErrorManager.errorToaster=null;bfree.widget.ErrorManager._errorQueue=[];bfree.widget.ErrorManager.handleError=function(_1){var _2=null;function _3(){while(bfree.widget.ErrorManager._errorQueue.length){var _4=bfree.widget.ErrorManager._errorQueue.pop();if(_4){_2.widget.addError(_4);}}};console.error(_1.error.getMessage(true));bfree.widget.ErrorManager._errorQueue.push(_1.error);_2=dijit.byId("dlgError");if(!_2){_2=new bfree.widget.Dialog({id:"dlgError",title:"ERROR",widgetConstructor:versa.widget.error.Show,widgetParams:{error:_1.error},noResize:true,height:200,width:400,buttons:bfree.widget.Dialog.buttons.close,onLoad:_3});_2.startup();_2.show();}else{if(_2.widget){_3();}}};}