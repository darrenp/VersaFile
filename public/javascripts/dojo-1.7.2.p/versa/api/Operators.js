//>>built
define("versa/api/Operators",["dojo/_base/declare","versa/api/_Collection","versa/api/Operator"],function(_1){var o=_1("versa.api.Operators",[versa.api._Collection],{_andOp:null,_fetch_onComplete:function(_2,_3){this.isLoaded=true;if((_2!=null)&&(_2.length>1)){this.first=_2[0];}dojo.forEach(_2,function(_4,_5){if(_4.name=="and"){this._andOp=_4;}},this);},constructor:function(_6){this.target=versa.api.Operators.TRGT;this.schema=versa.api.Operator.schema;this.cache=true;this._initialize();},byDataType:function(id){var _7=[];this.forEach(function(_8){if(_8.data_type_id==id){_7.push(_8);}},this);return _7;},getAndOp:function(){return this._andOp;}});o.TRGT="/operators";return o;});