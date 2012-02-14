/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.NumberSpinner"]){dojo._hasResource["bfree.widget.NumberSpinner"]=true;dojo.provide("bfree.widget.NumberSpinner");dojo.require("dijit.form.NumberSpinner");dojo.declare("bfree.widget.NumberSpinner",[dijit.form.NumberSpinner],{adjust:function(_1,_2){var tc=this.constraints,v=isNaN(_1),_3=!isNaN(tc.max),_4=!isNaN(tc.min);if(v&&_2!=0){_1=0;}var _5=_1+_2;if(v||isNaN(_5)){return _1;}if(_3&&(_5>tc.max)){_5=tc.max;}if(_4&&(_5<tc.min)){_5=tc.min;}return _5;},constructor:function(_6){dojo.safeMixin(this,_6);},postCreate:function(){this.inherited("postCreate",arguments);},reset:function(){this.inherited("reset",arguments);this._hasBeenBlurred=true;},startup:function(){this._hasBeenBlurred=true;this.inherited("startup",arguments);this.validate();}});}