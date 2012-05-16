/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


var Browsers=["Chrome","FF","Opera","Safari","IE"];Array.prototype.clean=function(){for(var i=0;i<this.length;i++){if(!this[i]){this.splice(i,1);i--;}}return this;};Array.prototype.shuffle=function(){var s=[];while(this.length){s.push(this.splice(Math.random()*this.length,1));}while(s.length){this.push(s.pop()[0]);}return this;};Array.prototype.removeByValue=function(_1){for(var i=0;i<this.length;i++){if(this[i]==_1){this.splice(i,1);break;}}};Array.prototype.max=function(){return Math.max.apply(Math,this);};Array.prototype.min=function(){return Math.min.apply(Math,this);};Date.prototype.toUTC=function(){var _2=this.getTime()+(this.getTimezoneOffset()*60000);return new Date(_2);};String.isBlank=function(_3){return (!_3||/^\s*$/.test(_3));};String.isEmpty=function(_4){return (!_4||0===_4.length);};String.prototype.display_limit=function(_5){return (this.length>_5)?this.substr(0,_5)+"...":this;};if(typeof String.prototype.trim!=="function"){String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"");};}