//>>built
define("versa/api/_Collection",["dojo/_base/declare","dojox/data/ClientFilter","dojox/data/JsonRestStore","versa/api/Error","versa/api/Utilities"],function(_1){return _1("versa.api._Collection",[],{store:null,target:null,schema:null,syncMode:true,cache:false,first:null,isLoaded:false,_fetch_onComplete:function(_2,_3){this.isLoaded=true;if((_2!=null)&&(_2.length>1)){this.first=_2[0];}this.onFetchComplete(_2);},_getExistingNames:function(_4){var _5=[];var _6=this.fetch();var _7=null;if(_4){_7=_4.exclude;}dojo.forEach(_6,function(_8){if((_8!=_7)&&(this.store.hasAttribute(_8,"name"))){_5.push(_8.name);}},this);return _5;},_getIdentity:function(_9){var id=_9.id;if(id){return id;}id=_9.__clientId||_9.__id;if(!id){return id;}var _a=this.service.servicePath.replace(/[^\/]*$/,"");return id.substring(0,_a.length)!=_a?id:id.substring(_a.length);},_initialize:function(){this.store=new dojox.data.JsonRestStore({target:this.target,idAttribute:"id",labelAttribute:"name",schema:this.schema,syncMode:this.syncMode,cacheByDefault:this.cache,clearOnClose:true,loadLazyValues:false,alwaysPostNewItems:true});},clearCache:function(){this.store.clearCache();},clone:function(_b){this.store.changing(_b.item);},constructor:function(){},containsValue:function(_c,_d,_e){return this.store.containsValue(_c,_d,_e);},create:function(_f){var _10=this.store.newItem(_f);this.store.changing(_10);return _10;},destroy:function(_11){var _12=(_11)?_11.no_save:false;try{this.store.deleteItem(_11.item);if(!_12){this.save({alwaysPostNewItems:true,onComplete:((_11)&&(_11.onComplete))?_11.onComplete:function(){},scope:((_11)&&(_11.scope))?_11.scope:this});}}finally{_11.item.__isDirty=false;}},fetch:function(_13){var _14=this.store.fetch({query:{},queryOptions:{cache:this.cache},onComplete:dojo.hitch(this,this._fetch_onComplete)});return _14.results;},fetchById:function(_15){var _16=this.store.fetchItemByIdentity({identity:_15.id});return _16;},fetchByName:function(_17){var _18=null;function _19(_1a,_1b){dojo.some(_1a,function(_1c){if(_1c.name==_17){_18=_1c;return false;}},this);};this.store.fetch({query:{},queryOptions:{cache:true},onComplete:_19});return _18;},fetchItemsByName:function(_1d){var _1e=new Array();function _1f(_20,_21){dojo.some(_20,function(_22){if(_22.name==_1d){_1e.push(_22);}},this);};this.store.fetch({query:{},queryOptions:{cache:true},onComplete:_1f});return _1e;},forEach:function(_23,_24){function _25(_26,_27){dojo.forEach(_26,_23,_24);};this.store.fetch({query:{},onComplete:_25});},isDirty:function(_28){var _29=(_28)?_28.item:null;return this.store.isDirty(_29);},isNew:function(_2a){return ((_2a.item.id==undefined)||(_2a.item.id==null));},invalidate:function(_2b){var _2c=this.store.service.servicePath.replace(/[^\/]*$/,"");var _2d=(_2c||"")+_2b;var _2e=this.store._index[_2d];if(_2e){delete this.store._index[_2d];}},isItemLoaded:function(_2f){return this.store.isItemLoaded(_2f);},loadItem:function(_30){var err=null;var _31=_30.item;if(_30.callback){_30.onItem=_30.callback;}var _32=(_30.scope)?_30.scope:this;this.store.loadItem({item:_31,scope:_32,onItem:_30.onItem,onError:_30.onError});},merge:function(_33,_34){for(var _35 in _33){var _36=_33[_35];if((_36!=null)&&(typeof _36=="object")&&(typeof _36.getMonth!="function")){continue;}if(_34.hasOwnProperty(_35)){var _37=_34[_35];if(_37!=_36){this.store.setValue(_33,_35,_37);}}}},onFetchComplete:function(_38){},query:function(_39){var _3a=[];var _3b=this.store.fetch({query:_39.query,queryOptions:{cache:false},sort:_39.sort});if((_3b)&&(_3b.results)){_3a=_3b.results;}return _3a;},refresh:function(){this.store.clearCache();this.fetch();},refreshAsync:function(_3c){if(_3c.invalidate){this.invalidate(_3c.identity);}this.store.fetchItemByIdentity({scope:_3c.scope,identity:_3c.identity,onItem:_3c.onItem,onError:_3c.onError});},refreshItem:function(_3d){var _3e=this.store.fetch({query:_3d,queryOptions:{cache:false}});return _3e.results;},revert:function(_3f){this.store.revert();},save:function(_40){var err=null;_40=(!_40)?{scope:this,onComplete:function(){}}:_40;function _41(_42){err=new versa.api.Error(_42.responseText,_42);};this.store.save({alwaysPostNewItems:true,revertOnError:false,onError:_41,onComplete:((_40)&&(_40.onComplete))?_40.onComplete:function(){},scope:((_40)&&(_40.scope))?_40.scope:this});if(err){throw err;}},setDirty:function(_43){this.store.changing(_43);},setValue:function(_44,_45,_46){this.store.setValue(_44,_45,_46);},getValue:function(_47,_48){return this.store.getValue(_47,_48);},generateUniqueName:function(_49){var _4a=this.getExistingNames();var _4b=_49.base_name;var _4c=_49.appendix;return versa.api.Utilities.generateUniqueName({names:_4a,base_name:_4b,appendix:_4c});},getExistingNames:function(_4d){var _4e=[];var _4f=this.fetch();var _50=null;if(_4d){_50=_4d.exclude;}dojo.forEach(_4f,function(_51){if((_51!=_50)&&(this.store.hasAttribute(_51,"name"))){_4e.push(_51.name);}},this);return _4e;},fetchDirtyItems:function(_52){var _53=[];var _54=this.store.fetch({query:{__isDirty:true},queryOptions:{cache:false}});if((_54)&&(_54.results)){_53=_54.results;}return _53;}});});