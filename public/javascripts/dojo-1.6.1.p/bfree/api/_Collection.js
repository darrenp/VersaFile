/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api._Collection"]){dojo._hasResource["bfree.api._Collection"]=true;dojo.provide("bfree.api._Collection");dojo.require("dojox.data.ClientFilter");dojo.require("dojox.data.JsonRestStore");dojo.require("bfree.api.Error");dojo.require("bfree.api.Utilities");dojo.declare("bfree.api._Collection",null,{store:null,target:null,schema:null,syncMode:true,cache:false,first:null,isLoaded:false,_fetch_onComplete:function(_1,_2){this.isLoaded=true;if((_1!=null)&&(_1.length>1)){this.first=_1[0];}this.onFetchComplete(_1);},_getExistingNames:function(_3){var _4=[];var _5=this.fetch();var _6=null;if(_3){_6=_3.exclude;}dojo.forEach(_5,function(_7){if((_7!=_6)&&(this.store.hasAttribute(_7,"name"))){_4.push(_7.name);}},this);return _4;},_getIdentity:function(_8){var id=_8.id;if(id){return id;}id=_8.__clientId||_8.__id;if(!id){return id;}var _9=this.service.servicePath.replace(/[^\/]*$/,"");return id.substring(0,_9.length)!=_9?id:id.substring(_9.length);},_initialize:function(){this.store=new dojox.data.JsonRestStore({target:this.target,idAttribute:"id",labelAttribute:"name",schema:this.schema,syncMode:this.syncMode,cacheByDefault:this.cache,clearOnClose:true,loadLazyValues:false,alwaysPostNewItems:true});this.store.getIdentity=dojo.hitch(this.store,this._getIdentity);},clearCache:function(){this.store.clearCache();},clone:function(_a){this.store.changing(_a.item);},constructor:function(){},containsValue:function(_b,_c,_d){return this.store.containsValue(_b,_c,_d);},create:function(_e){var _f=this.store.newItem(_e);this.store.changing(_f);return _f;},destroy:function(_10){var _11=(_10)?_10.no_save:false;try{this.store.deleteItem(_10.item);if(!_11){this.save({alwaysPostNewItems:true,onComplete:((_10)&&(_10.onComplete))?_10.onComplete:function(){},scope:((_10)&&(_10.scope))?_10.scope:this});}}finally{_10.item.__isDirty=false;}},fetch:function(_12){var _13=this.store.fetch({query:{},queryOptions:{cache:this.cache},onComplete:dojo.hitch(this,this._fetch_onComplete)});return _13.results;},fetchById:function(_14){var _15=this.store.fetchItemByIdentity({identity:_14.id});return _15;},fetchByName:function(_16){var _17=null;function _18(_19,_1a){dojo.some(_19,function(_1b){if(_1b.name==_16){_17=_1b;return false;}},this);};this.store.fetch({query:{},queryOptions:{cache:true},onComplete:_18});return _17;},fetchItemsByName:function(_1c){var _1d=new Array();function _1e(_1f,_20){dojo.some(_1f,function(_21){if(_21.name==_1c){_1d.push(_21);}},this);};this.store.fetch({query:{},queryOptions:{cache:true},onComplete:_1e});return _1d;},forEach:function(_22,_23){function _24(_25,_26){dojo.forEach(_25,_22,_23);};this.store.fetch({query:{},onComplete:_24});},isDirty:function(_27){var _28=(_27)?_27.item:null;return this.store.isDirty(_28);},isNew:function(_29){return ((_29.item.id==undefined)||(_29.item.id==null));},invalidate:function(_2a){var _2b=this.store.service.servicePath.replace(/[^\/]*$/,"");var _2c=(_2b||"")+_2a;var _2d=this.store._index[_2c];if(_2d){delete this.store._index[_2c];}},isItemLoaded:function(_2e){return this.store.isItemLoaded(_2e);},loadItem:function(_2f){var err=null;var _30=_2f.item;if(_2f.callback){_2f.onItem=_2f.callback;}var _31=(_2f.scope)?_2f.scope:this;this.store.loadItem({item:_30,scope:_31,onItem:_2f.onItem,onError:_2f.onError});},merge:function(_32,_33){for(var _34 in _32){var _35=_32[_34];if((_35!=null)&&(typeof _35=="object")&&(typeof _35.getMonth!="function")){continue;}if(_33.hasOwnProperty(_34)){var _36=_33[_34];if(_36!=_35){this.store.setValue(_32,_34,_36);}}}},onFetchComplete:function(_37){},query:function(_38){var _39=[];var _3a=this.store.fetch({query:_38.query,queryOptions:{cache:false},sort:_38.sort});if((_3a)&&(_3a.results)){_39=_3a.results;}return _39;},refresh:function(){this.store.clearCache();this.fetch();},refreshAsync:function(_3b){if(_3b.invalidate){this.invalidate(_3b.identity);}this.store.syncMode=false;var _3c=this.syncMode;var _3d=_3b.onItem;this.store.fetchItemByIdentity({scope:_3b.scope,identity:_3b.identity,onItem:dojo.hitch(this,function(_3e){this.store.syncMode=_3c;_3d(_3e);}),onError:_3b.onError});},refreshItem:function(_3f){var _40=this.store.fetch({query:_3f,queryOptions:{cache:false}});return _40.results;},revert:function(_41){this.store.revert();},save:function(_42){var err=null;_42=(!_42)?{scope:this,onComplete:function(){}}:_42;function _43(_44){err=new bfree.api.Error(_44.responseText,_44);};this.store.save({alwaysPostNewItems:true,revertOnError:false,onError:_43,onComplete:((_42)&&(_42.onComplete))?_42.onComplete:function(){},scope:((_42)&&(_42.scope))?_42.scope:this});if(err){throw err;}},setDirty:function(_45){this.store.changing(_45);},setValue:function(_46,_47,_48){this.store.setValue(_46,_47,_48);},getValue:function(_49,_4a){return this.store.getValue(_49,_4a);},generateUniqueName:function(_4b){var _4c=this.getExistingNames();var _4d=_4b.base_name;var _4e=_4b.appendix;return bfree.api.Utilities.generateUniqueName({names:_4c,base_name:_4d,appendix:_4e});},getExistingNames:function(_4f){var _50=[];var _51=this.fetch();var _52=null;if(_4f){_52=_4f.exclude;}dojo.forEach(_51,function(_53){if((_53!=_52)&&(this.store.hasAttribute(_53,"name"))){_50.push(_53.name);}},this);return _50;},fetchDirtyItems:function(_54){var _55=[];var _56=this.store.fetch({query:{__isDirty:true},queryOptions:{cache:false}});if((_56)&&(_56.results)){_55=_56.results;}return _55;}});}