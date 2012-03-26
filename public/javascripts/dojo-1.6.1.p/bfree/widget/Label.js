/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.Label"]){dojo._hasResource["bfree.widget.Label"]=true;dojo.provide("bfree.widget.Label");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.declare("bfree.widget.Label",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("bfree/widget","template/Label.html","<div style=\"display:inline-block\">\n    <div dojoAttachPoint=\"labelNode\" class=\"dijitDarkLabel dijitBoldLabel\" style=\"vertical-align:middle;height:100%;white-space:nowrap;\"></div>\n</div>\n"),widgetsInTemplate:false,isError:false,value:null,_setValueAttr:function(_1){this.value=_1;this.labelNode.innerHTML=this.value;},constructor:function(_2){},destroy:function(){this.inherited("destroy",arguments);},postCreate:function(){this.inherited("postCreate",arguments);if(this.isError){dojo.addClass(this.labelNode,"dijitStrongErrorLabel");}this.labelNode.innerHTML=this.value;},reset:function(_3,_4){this.set("label",((_3==null)?"":_3));this.labelNode.innerHTML=((_4==null)?"":_4);},startup:function(){this.inherited("startup",arguments);}});}