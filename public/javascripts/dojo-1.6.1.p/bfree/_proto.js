/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


var Browsers=["Chrome","FF","Opera","Safari","IE"];Array.prototype.clean=function(){for(var i=0;i<this.length;i++){if(!this[i]){this.splice(i,1);i--;}}return this;};Array.prototype.shuffle=function(){var s=[];while(this.length){s.push(this.splice(Math.random()*this.length,1));}while(s.length){this.push(s.pop()[0]);}return this;};Array.prototype.removeByValue=function(_1){for(var i=0;i<this.length;i++){if(this[i]==_1){this.splice(i,1);break;}}};Date.prototype.toUTC=function(){var _2=this.getTime()+(this.getTimezoneOffset()*60000);return new Date(_2);};if(!Object.keys){Object.keys=function(_3){var _4=[],k;for(k in _3){if(Object.prototype.hasOwnProperty.call(_3,k)){_4.push(k);}}return _4;};}String.isBlank=function(_5){return (!_5||/^\s*$/.test(_5));};String.isEmpty=function(_6){return (!_6||0===_6.length);};String.prototype.display_limit=function(_7){return (this.length>_7)?this.substr(0,_7)+"...":this;};if(typeof String.prototype.trim!=="function"){String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"");};}