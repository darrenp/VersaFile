/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api._Configurable"]){dojo._hasResource["bfree.api._Configurable"]=true;dojo.provide("bfree.api._Configurable");dojo.declare("bfree.api._Configurable",null,{configuration:{configuration_settings:[]},constructor:function(_1){_1=(!_1)?{}:_1;dojo.safeMixin(this,_1);},getValue:function(_2){var _3=null;dojo.some(this.configuration.configuration_settings,function(_4,_5){if(_4.name.toLowerCase()==_2.toLowerCase()){_3=_4.value;return true;}return false;},this);return _3;}});}