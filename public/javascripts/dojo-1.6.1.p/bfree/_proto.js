/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


var Browsers=["Chrome","FF","Opera","Safari","IE"];Array.prototype.clean=function(){for(var i=0;i<this.length;i++){if(!this[i]){this.splice(i,1);i--;}}return this;};Array.prototype.shuffle=function(){var s=[];while(this.length){s.push(this.splice(Math.random()*this.length,1));}while(s.length){this.push(s.pop()[0]);}return this;};Array.prototype.removeByValue=function(_1){for(var i=0;i<this.length;i++){if(this[i]==_1){this.splice(i,1);break;}}};Array.prototype.max=function(_2){return Math.max.apply(Math,this);};Array.prototype.min=function(_3){return Math.min.apply(Math,this);};Date.prototype.toUTC=function(){var _4=this.getTime()+(this.getTimezoneOffset()*60000);return new Date(_4);};if(!Object.keys){Object.keys=function(_5){var _6=[],k;for(k in _5){if(Object.prototype.hasOwnProperty.call(_5,k)){_6.push(k);}}return _6;};}String.isBlank=function(_7){return (!_7||/^\s*$/.test(_7));};String.isEmpty=function(_8){return (!_8||0===_8.length);};String.prototype.display_limit=function(_9){return (this.length>_9)?this.substr(0,_9)+"...":this;};if(typeof String.prototype.trim!=="function"){String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"");};}