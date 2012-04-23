/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["versa.widget.dnd.Avatar"]){dojo._hasResource["versa.widget.dnd.Avatar"]=true;dojo.provide("versa.widget.dnd.Avatar");dojo.require("dojo.dnd.Avatar");dojo.declare("versa.widget.dnd.Avatar",dojo.dnd.Avatar,{_generateText:function(){return this.manager.nodes.length.toString();}});versa.widget.dnd._makeAvatar=function(){return new versa.widget.dnd.Avatar(this);};}