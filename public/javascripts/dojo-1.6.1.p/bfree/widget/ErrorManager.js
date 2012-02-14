/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.ErrorManager"]){dojo._hasResource["bfree.widget.ErrorManager"]=true;dojo.provide("bfree.widget.ErrorManager");dojo.declare("bfree.widget.ErrorManager",null,{});bfree.widget.ErrorManager.errorToaster=null;bfree.widget.ErrorManager.handleError=function(_1){bfree.widget.ErrorManager.errorToaster.setContent(_1.error.getContent(true),"error");bfree.widget.ErrorManager.errorToaster.show();};}