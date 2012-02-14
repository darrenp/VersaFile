/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.search.DropDown"]){dojo._hasResource["bfree.widget.search.DropDown"]=true;dojo.provide("bfree.widget.search.DropDown");dojo.require("dijit.TooltipDialog");dojo.require("dijit.form.DropDownButton");dojo.require("bfree.widget.search.Advanced");dojo.declare("bfree.widget.search.DropDown",dijit.form.DropDownButton,{library:null,constructor:function(_1){dojo.safeMixin(this,_1);this.baseClass="versaSearchDropDown";},onSearch:function(_2){},postCreate:function(){this.inherited("postCreate",arguments);var _3=new bfree.widget.search.Advanced({library:this.library,onSearch:dojo.hitch(this,this.onSearch)});this.dropDown=new dijit.TooltipDialog({content:_3});}});}