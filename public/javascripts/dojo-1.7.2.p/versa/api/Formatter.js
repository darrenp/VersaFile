//>>built
define("versa/api/Formatter",["dojo/_base/declare","dojo/date/locale"],function(_1){var o=_1("versa.api.Formatter",[],{});o.formatDateTime=function(_2){var _3=_2;if(String.isEmpty(_2)){return "";}if(typeof _2=="string"){_3=dojo.date.stamp.fromISOString(_2);}return dojo.date.locale.format(_3,{selector:"date",formatLength:"short"});};return o;});