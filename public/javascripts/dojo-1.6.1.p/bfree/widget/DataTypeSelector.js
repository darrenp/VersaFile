/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.DataTypeSelector"]){dojo._hasResource["bfree.widget.DataTypeSelector"]=true;dojo.provide("bfree.widget.DataTypeSelector");dojo.require("dijit._Templated");dojo.require("dijit._Widget");dojo.require("bfree.api.DataTypes");dojo.require("bfree.api.Application");dojo.require("dijit.form.RadioButton");dojo.declare("bfree.widget.DataTypeSelector",[dijit._Widget,dijit._Templated],{templateString:null,templateString:dojo.cache("bfree/widget","template/DataTypeSelector.html","<div style=\"height:100%;position:relative;width:100%\">\t\n\n\t<table style=\"width:100%\">\n\t\t<tr>\t\t\t\n\t\t\t<td style=\"text-align:left;vertical-align:top;white-space:nowrap;;width:96px;\">\n\t\t\t\t<input dojoAttachPoint=\"rdoDataTypeStrNode\" type=\"radio\"></input>\n\t\t\t\t<label dojoAttachPoint=\"lblDataTypeStrNode\" class=\"mediumLabel darkLabel\">String</label>\n\t\t\t</td>\n\t\t</tr>\t\t\n\t\t<tr>\t\t\n\t\t\t<td style=\"text-align:left;vertical-align:top;white-space:nowrap;\">\n\t\t\t\t<input dojoAttachPoint=\"rdoDataTypeDttNode\" type=\"radio\"></input>\n\t\t\t\t<label dojoAttachPoint=\"lblDataTypeDttNode\" class=\"mediumLabel darkLabel\">Date</label>\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\t\t\n\t\t\t<td style=\"text-align:left;vertical-align:top;white-space:nowrap;\">\n\t\t\t\t<input dojoAttachPoint=\"rdoDataTypeIntNode\" type=\"radio\"></input>\n\t\t\t\t<label dojoAttachPoint=\"lblDataTypeIntNode\" class=\"mediumLabel darkLabel\">Integer</label>\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\t\t\n\t\t\t<td style=\"text-align:left;vertical-align:top;white-space:nowrap;\">\n\t\t\t\t<input dojoAttachPoint=\"rdoDataTypeFltNode\" type=\"radio\"></input>\n\t\t\t\t<label dojoAttachPoint=\"lblDataTypeFltNode\" class=\"mediumLabel darkLabel\">Decimal</label>\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\t\t\n\t\t\t<td style=\"text-align:left;vertical-align:top;white-space:nowrap;\">\n\t\t\t\t<input dojoAttachPoint=\"rdoDataTypeBlnNode\" type=\"radio\"></input>\n\t\t\t\t<label dojoAttachPoint=\"lblDataTypeBlnNode\" class=\"mediumLabel darkLabel\">Boolean</label>\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\t\t\n\t\t\t<td style=\"text-align:left;vertical-align:top;white-space:nowrap;\">\n\t\t\t\t<input dojoAttachPoint=\"rdoDataTypeTxtNode\" type=\"radio\"></input>\n\t\t\t\t<label dojoAttachPoint=\"lblDataTypeTxtNode\" class=\"mediumLabel darkLabel\">Text</label>\n\t\t\t</td>\n\t\t</tr>\n\t\t\t\t\n\t</table>\n\n</div>\n"),widgetsInTemplate:true,disabled:false,_rdoDataTypes:null,_dataTypes:null,_getDisabledAttr:function(){return _rdoDataTypes[1].attr("disabled");},_getValueAttr:function(){for(var _1 in bfree.api.DataTypes.Types){var _2=bfree.api.DataTypes.Types[_1];var _3=this._rdoDataTypes[_2];if((_3)&&(_3.attr("checked"))){return _2;}}return bfree.api.DataTypes.Types._void;},_setDisabledAttr:function(_4){if(this._rdoDataTypes==null){return;}for(var _5 in bfree.api.DataTypes.Types){var _6=bfree.api.DataTypes.Types[_5];var _7=this._rdoDataTypes[_6];if(_7){_7.attr("disabled",_4);}}},_setValueAttr:function(_8){for(var _9 in bfree.api.DataTypes.Types){var _a=bfree.api.DataTypes.Types[_9];var _b=this._rdoDataTypes[_a];if(_b){_b.attr("checked",(_a==_8));}}},_rdoDataTypes_onChange:function(_c){var _d=bfree.api.DataTypes.Types._string;dojo.forEach(this._rdoDataTypes,function(_e){if(!_e){return;}if(_e.attr("checked")){_d=_e.attr("value");}},this);this.onChange(_d);},clear:function(){for(var _f in bfree.api.DataTypes.Types){var _10=bfree.api.DataTypes.Types[_f];var rdo=this._rdoDataTypes[_10];if(rdo){rdo.attr("checked",false);}}},onChange:function(_11){},postCreate:function(){this.inherited("postCreate",arguments);this._dataTypes=bfree.api.Application.getDataTypes();}});}