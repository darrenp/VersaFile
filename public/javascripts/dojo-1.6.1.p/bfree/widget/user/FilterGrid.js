/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.user.FilterGrid"]){dojo._hasResource["bfree.widget.user.FilterGrid"]=true;dojo.provide("bfree.widget.user.FilterGrid");dojo.require("bfree.api.Application");dojo.require("bfree.widget._Grid");dojo.require("bfree.api.ItemFileWriteStore");dojo.declare("bfree.widget.user.FilterGrid",[bfree.widget._Grid],{_store:null,_view:[{cells:[{field:"name",name:"Name",width:"auto"},{field:"filter",name:"Filter",width:"64px",hidden:true}],width:"auto"}],selectionMode:"single",users:null,idFilter:[],_buildStore:function(){var _1=[];this.users.forEach(function(_2,_3){_1.push({id:_2.id,name:_2.getFullName(),filter:dojo.has(this.idFilter,_2.id)});},this);this._store=new bfree.api.ItemFileWriteStore({data:{identifier:"id",label:"name",items:_1}});},_canEdit:function(_4,_5){return false;},_canSort:function(_6){return true;},constructor:function(_7){this.updateDelay=0;this.rowsPerPage=25;this.formatterScope=this;this.query={};this.queryOptions={cache:true};this.clientSort=false;this.canEdit=this._canEdit;this.canSort=this._canSort;this.noDataMessage="No Users found";this.sortInfo=1;},postCreate:function(){this.inherited("postCreate",arguments);this._buildStore();this.set("structure",this._view);},startup:function(){this.inherited("startup",arguments);this.setStore(this._store);this.filter({filter:false});}});}