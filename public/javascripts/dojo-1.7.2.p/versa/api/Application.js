//>>built
define("versa/api/Application",["dojo/_base/declare","versa/api/DataTypes","versa/api/Operators"],function(_1){var o=_1("versa.api.Application",[],{});o._data_types=null;o._operators=null;o.getDataTypes=function(){if(!versa.api.Application._data_types){versa.api.Application._data_types=new versa.api.DataTypes();versa.api.Application._data_types.fetch();}return versa.api.Application._data_types;};o.getOperators=function(){if(!versa.api.Application._operators){versa.api.Application._operators=new versa.api.Operators();versa.api.Application._operators.fetch();}return versa.api.Application._operators;};return o;});