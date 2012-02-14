/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.Error"]){dojo._hasResource["bfree.api.Error"]=true;dojo.provide("bfree.api.Error");dojo.declare("bfree.api.Error",null,{message:"",err:null,name:null,lineNumber:-1,fileName:null,stack:null,constructor:function(_1,_2){this.message=_1;this.err=_2;},getContent:function(_3){var _4=this.message;if(_3){_4+=":<br>"+this.err.message;}return _4;},getMessage:function(_5){var _6=this.message;if(_5){_6+=":\n"+this.err.message;}return _6;}});}