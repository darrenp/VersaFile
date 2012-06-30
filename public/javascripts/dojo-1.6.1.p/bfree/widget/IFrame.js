/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.IFrame"]){dojo._hasResource["bfree.widget.IFrame"]=true;dojo.provide("bfree.widget.IFrame");dojo.require("dojox.form.uploader.plugins.HTML5");dojo.require("dojo.io.iframe");dojo.declare("bfree.widget.IFrame",[],{force:"",postMixInProperties:function(){this.inherited(arguments);if(!this.supports("multiple")){this.uploadType="iframe";}},upload:function(_1){if(!this.supports("multiple")||this.force=="iframe"){this.uploadIFrame(_1);dojo.stopEvent(_1);return;}},uploadIFrame:function(){var _2=this.getUrl();var _3=dojo.io.iframe.send({url:this.getUrl(),form:this.form,handleAs:"json",error:dojo.hitch(this,function(_4){this.onError(_4);}),load:dojo.hitch(this,function(_5,_6,_7){this.onComplete(_5);})});}});}