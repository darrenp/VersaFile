//>>built
define("versa/api/Group",["dojo/_base/declare","versa/api/_Object"],function(_1){var o=_1("versa.api.Group",[versa.api._Object],{description:null,constructor:function(_2){dojo.safeMixin(this,((!_2)?{}:_2));},isValid:function(){var _3=true;if(String.isEmpty(this.name.trim())){_3=false;}return _3;}});o.schema={type:"object",properties:{"id":{type:"integer"},"name":{type:"string","default":""},"description":{type:"string"},"active_users":{type:"array",items:{type:"integer"}},"created_at":{type:"date",format:"date-time"},"created_by":{type:"string"},"updated_at":{type:"date",format:"date-time"},"updated_by":{type:"string"}},prototype:new o()};return o;});