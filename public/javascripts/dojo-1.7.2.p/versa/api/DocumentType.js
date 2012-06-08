//>>built
define("versa/api/DocumentType",["dojo/_base/declare","versa/api/_Object","versa/api/XhrHelper","versa/api/PropertyMapping"],function(_1){var o=_1("versa.api.DocumentType",[versa.api._Object],{constructor:function(_2){dojo.safeMixin(this,((!_2)?{}:_2));},getMetrics:function(_3){var _4=dojo.replace(versa.api.DocumentType.MT_TRGT,[_3.zone.subdomain,_3.library.id,this.id]);var _5=versa.api.XhrHelper.doGetAction({target:_4});return true;},hasProperty:function(id){var _6=dojo.some(this.property_mappings,function(_7,_8){return (_7.property_definition_id==id);},this);return _6;},isValid:function(){var _9=true;if(String.isEmpty(this.name.trim())){_9=false;}return _9;}});o.MT_TRGT="/zones/{0}/libraries/{1}/document_types/{2}/dtmetrics.json";o.schema={type:"object",properties:{"id":{type:"integer"},"name":{type:"string","default":""},"is_system":{type:"boolean","default":false},"property_mappings":{type:"array","default":[],items:{type:"object",properties:{"property_definition_id":{type:"integer"},"choice_list_id":{type:"integer"},"default_value":{type:"string"},"is_required":{type:"boolean"},"sort_order":{type:"integer"},prototype:new versa.api.PropertyMapping()}}},"created_at":{type:"date",format:"date-time"},"created_by":{type:"string"},"description":{type:"string","default":""},"updated_at":{type:"date",format:"date-time"},"updated_by":{type:"string"}},prototype:new o()};return o;});