/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.StatusIcon"]){dojo._hasResource["bfree.widget.StatusIcon"]=true;dojo.provide("bfree.widget.StatusIcon");dojo.require("bfree.IconManager");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.declare("bfree.widget.StatusIcon",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("bfree/widget","template/StatusIcon.html","<div style=\"height:100%;position:relative;width:100%\">\n\t\n\t<img dojoAttachPoint=\"imgIcon\" src=\"/images/icons/16/blank.png\" height=\"16\" width=\"16\"></img>\n\t\n</div>\n"),widgetsInTemplate:false,busy:false,state:0,_setBusyAttr:function(_1){this.busy=_1;if(this.busy){this.imgIcon.src="/images/loading/loading16-b.gif";}else{this.attr("state",this.state);}},_setStateAttr:function(_2){this.state=_2;this.imgIcon.src=bfree.IconManager.generateStatusImage({state:this.state,size:16});},postCreate:function(){this.inherited("postCreate",arguments);}});bfree.widget.StatusIcon.generateId=function(_3){return dojo.string.substitute("__stsicon_${0}",[_3.id]);};}