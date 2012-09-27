/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.api.CellDefinition"]){dojo._hasResource["bfree.api.CellDefinition"]=true;dojo.provide("bfree.api.CellDefinition");dojo.require("bfree.api._Object");dojo.require("bfree.api.Error");dojo.require("bfree.widget.document.DraggableGridItem");dojo.declare("bfree.api.CellDefinition",[bfree.api._Object],{constructor:function(_1){dojo.safeMixin(this,((!_1)?{}:_1));}});bfree.api.CellDefinition.clone=function(_2){return new bfree.api.CellDefinition({column_order:_2.column_order,table_name:_2.table_name,column_name:_2.column_name,label:_2.label,name:_2.name,noresize:_2.noresize,style:_2.style,width:_2.width,formatter:_2.formatter,date_format:_2.date_format});};bfree.api.CellDefinition.compare=function(_3,_4){return _3.column_order-_4.column_order;};bfree.api.CellDefinition.getDbName=function(_5){return dojo.replace("{table_name}.{column_name}",_5);};bfree.api.CellDefinition.formats={"none":0,"icon":1,"size":2,"status":4,"datetime":8,"date":16,"time":32};bfree.api.CellDefinition.formatStatus=function(_6,_7){var _8=this.grid.getItem(_7);var _9="none.16.png";try{if((_8)&&(_8.getState(bfree.api.Document.states.CHECKED_OUT))){_9="cko.16.png";}}catch(e){}return dojo.replace("<img name=\"statusIcon\" src=\"/images/icons/states/{0}\" width=\"16\" height=\"16\" style=\"position:relative;top:1px;left:1px\"/>",[_9]);};bfree.api.CellDefinition.formatIcon=function(_a,_b){if(!_a){return "";}var _c=this.grid.getItem(_b);var _d=bfree.api.Document.getIconUrl(_a,16);var _e=dojo.create("div");var _f=dojo.create("div",{style:{width:16,height:16,position:"relative"}},_e);dojo.create("img",{src:_d,width:16,height:16},_f);if(_c.isShare()){_d="/images/icons/states/shared.16.png";dojo.create("img",{src:_d,width:16,height:16,style:{position:"absolute",top:"2px",left:"2px"}},_f);}if(_c.is_dropbox){if(_c.is_synchronized){_d="/images/icons/states/dropbox.16.png";dojo.create("img",{src:_d,width:16,height:16,style:{position:"absolute",top:"2px",left:"2px"}},_f);}else{_d="/images/icons/states/dropbox.disabled.16.png";dojo.create("img",{src:_d,width:16,height:16,style:{position:"absolute",top:"2px",left:"2px"}},_f);}}return _e.innerHTML;};bfree.api.CellDefinition.formatSize=function(_10,_11){var _12=_10;var _13=bfree.api.Utilities.readablizeBytes({bytes:_12});return _13;};bfree.api.CellDefinition.formatData=function(_14,_15){return _14||"";};bfree.api.CellDefinition.formatBoolean=function(_16,_17){var wdg=new dijit.form.CheckBox({scrollOnFocus:false,disabled:true,checked:_16});return wdg;},bfree.api.CellDefinition.schema={type:"object",properties:{"id":{type:"integer"},"view_definition_id":{type:"integer"},"table_name":{type:"string"},"column_name":{type:"string"},"name":{type:"string"},"label":{type:"string"},"formatter":{type:"integer","default":bfree.api.CellDefinition.formats.none},"noresize":{type:"boolean","default":false},"width":{type:"string","default":"128px"},"style":{type:"string","default":""},"column_order":{type:"integer","default":1},"date_format":{type:"string","default":""}},prototype:new bfree.api.CellDefinition()};}