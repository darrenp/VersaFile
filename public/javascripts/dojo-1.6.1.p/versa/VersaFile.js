/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["versa.VersaFile"]){dojo._hasResource["versa.VersaFile"]=true;dojo.provide("versa.VersaFile");dojo.require("versa.widget.dialog.MessageBox");dojo.declare("versa.VersaFile",null,{});versa.alert=function(_1){new versa.widget.dialog.MessageBox({id:"versaAlert",title:"VersaFile Message",message:_1,buttons:versa.MessageBoxButtons.OK,icon:versa.MessageBoxIcons.Warning,onClose:function(_2){}}).show();};versa.confirm=function(_3){};versa.VersaFile.messages={"TRIAL_REMAINING":"You have <strong>{days_left}</strong> days remaining on your free trial.","TRIAL_FINAL":"<strong>This is your final day remaining on your free trial.</strong>","TRIAL_EXPIRED":"<strong>!!! YOUR TRIAL PERIOD HAS EXPIRED !!!</strong>","ACTIVATE_LINK":"Click <a href=\"http://www.versafile.com\" class=\"dijitBoldLabel versaLink\" target=\"_blank\">here</a> to upgrade."};}