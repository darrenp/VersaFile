//>>built
define("versa/api/Search",["dojo/_base/declare","versa/api/_Object"],function(_1){var o=_1("versa.api.Search",[versa.api._Object],{type:0,queryData:null,view_definition_id:null,_getAdvancedQuery:function(){return {type:this.type,query:dojo.toJson(this.queryData),view:this.view_definition_id};},_getFolderQuery:function(){return {type:this.type,query:this.queryData,view:this.view_definition_id};},_getSimpleQuery:function(){return {type:this.type,query:this.queryData,view:this.view_definition_id};},constructor:function(_2){_1.safeMixin(this,((!_2)?{}:_2));},getQuery:function(){var _3={type:bfree.api.Search.types.NONE};switch(this.type){case bfree.api.Search.types.FOLDER:case bfree.api.Search.types.TRASH:_3=this._getFolderQuery();break;case bfree.api.Search.types.SIMPLE:_3=this._getSimpleQuery();break;case bfree.api.Search.types.ADVANCED:_3=this._getAdvancedQuery();break;case bfree.api.Search.types.TRASH:break;}return _3;}});o.types={"NONE":0,"FOLDER":1,"SIMPLE":2,"ADVANCED":3,"TRASH":4};return o;});