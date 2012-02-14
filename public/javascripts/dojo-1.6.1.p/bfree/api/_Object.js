/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api._Object"]){dojo._hasResource["bfree.api._Object"]=true;dojo.provide("bfree.api._Object");dojo.declare("bfree.api._Object",null,{id:null,name:null,created_at:null,created_by:null,updated_at:null,updated_by:null,constructor:function(_1){if((this.created_at!=null)&&(typeof this.created_at=="string")){this.created_at=dojo.date.stamp.fromISOString(this.created_at);}if((this.updated_at!=null)&&(typeof this.updated_at=="string")){this.updated_at=dojo.date.stamp.fromISOString(this.created_at);}},isNew:function(){return ((this.id==undefined)||(this.id==null));},isValid:function(){return true;}});}