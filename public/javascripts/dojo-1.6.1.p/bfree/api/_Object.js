/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api._Object"]){dojo._hasResource["bfree.api._Object"]=true;dojo.provide("bfree.api._Object");dojo.declare("bfree.api._Object",null,{id:null,name:null,created_at:null,created_by:null,updated_at:null,updated_by:null,constructor:function(_1){if((this.created_at!=null)&&(typeof this.created_at=="string")){this.created_at=dojo.date.stamp.fromISOString(this.created_at);}if((this.updated_at!=null)&&(typeof this.updated_at=="string")){this.updated_at=dojo.date.stamp.fromISOString(this.created_at);}},valueEquals:function(_2,_3){if(!this.hasOwnProperty(_2)){return false;}var _4=this[_2];if((_4==null)&&(_3==null)){return true;}if((typeof _4=="string")||(typeof _3=="string")){_4=(_4==null)?"":_4;_3=(_3==null)?"":_3;}return (_4==_3);},getId:function(){return (this.$ref?this.$ref:this.id);},isNew:function(){return ((this.id==undefined)||(this.id==null));},isValid:function(){return true;}});}