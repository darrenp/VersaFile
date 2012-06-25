//>>built
// wrapped by build app
define("versa/_proto", ["dijit","dojo","dojox"], function(dijit,dojo,dojox){
//>>built
// wrapped by build app
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 14/09/11
 * Time: 2:57 PM
 * To change this template use File | Settings | File Templates.
 */
var Browsers = ['Chrome', 'FF', 'Opera', 'Safari','IE'];

Array.prototype.clean = function(){
    for(var i = 0; i < this.length; i++){
        if(!this[i]){
            this.splice(i, 1);
            i--;
        }
    }
    return this;
}

Array.prototype.shuffle = function() {
    var s = [];
    while (this.length) s.push(this.splice(Math.random() * this.length, 1));
    while (s.length) this.push(s.pop()[0]);
    return this;
}

Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}

Array.prototype.max = function(){
    return Math.max.apply(Math, this);
}
Array.prototype.min = function(){
    return Math.min.apply(Math, this);
}

Date.prototype.toUTC = function(){
    var utc = this.getTime() + (this.getTimezoneOffset() * 60000);
    return new Date(utc);
}

/*
if(!Object.keys){
    Object.keys = function(obj){
        var keys = [], k;
        for(k in obj){
            if(Object.prototype.hasOwnProperty.call(obj, k)){
                keys.push(k);
            }
        }
        return keys;
    }
}
*/

String.isBlank = function(str){
    return (!str || /^\s*$/.test(str));
}

String.isEmpty = function(str){
    return (!str || 0 === str.length);
}

String.prototype.display_limit = function(max_length){
    return (this.length > max_length) ?
                this.substr(0, max_length) + '...' :
                this;
}

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  }
}



});
