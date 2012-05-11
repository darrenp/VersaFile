/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.doctype.Editor"]){dojo._hasResource["bfree.widget.doctype.Editor"]=true;dojo.provide("bfree.widget.doctype.Editor");dojo.require("bfree.api.Application");dojo.require("bfree.widget.Bfree");dojo.require("bfree.widget.SortGrid");dojo.require("bfree.widget.ValidationTextBox");dojo.require("bfree.widget.doctype.Info");dojo.require("bfree.widget.doctype.PropMapBar");dojo.require("bfree.widget.propdef.List");dojo.require("bfree.widget.propdef.Widget");dojo.require("bfree.widget.Calendar");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.form.CheckBox");dojo.require("dijit.form.Form");dojo.require("dijit.form.SimpleTextarea");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.ContentPane");dojo.require("dojox.layout.TableContainer");dojo.declare("bfree.widget.doctype.Editor",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("bfree/widget/doctype","template/Editor.html","<div style=\"height:100%;width:100%\">\n\n<div    dojoAttachPoint=\"mainNode\"\n        dojoType=\"dijit.layout.BorderContainer\"\n        design=\"headline\"\n        gutters=\"false\"\n        liveSplitters=\"true\"\n        style=\"width:100%;height:100%\">\n\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            splitter=\"false\"\n            region=\"top\"\n            style=\"overflow:hidden;padding:0;height: 76px;\">\n\n         <div dojoAttachPoint=\"formNode\">\n\n            <div dojoAttachPoint=\"tableNode\"></div>\n\n        </div>\n\n    </div>\n\n    <div    dojoType=\"dijit.layout.BorderContainer\"\n            splitter=\"false\"\n            region=\"center\"\n            design=\"sidebar\"\n            gutters=\"false\"\n            liveSplitters=\"true\"\n            style=\"width:100%;height:100%\">\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"center\"\n                style=\"overflow:hidden;padding:16px 8px 8px 0;position:relative\">\n\n            <span class=\"dijitMediumLabel dijitDarkLabel\" style=\"position:absolute;top:0;left:0\">Properties</span>\n            <div dojoAttachPoint=\"propertyMappingsNode\" style=\"height:100%\"></div>\n\n        </div>\n\n        <div    dojoType=\"dijit.layout.ContentPane\"\n                splitter=\"false\"\n                region=\"right\"\n                style=\"overflow:hidden;padding:16px 0 0 0;width:24px\">\n\n            <div dojoAttachPoint=\"propMapBarNode\"></div>\n\n        </div>\n\n    </div>\n\n    <div    dojoType=\"dijit.layout.ContentPane\"\n            splitter=\"false\"\n            region=\"bottom\"\n            style=\"padding:0 8px 0 8px;height: 104px;\">\n\n        <div dojoAttachPoint=\"infoNode\"></div>\n\n    </div>\n\n</div>\n\n</div>\n"),widgetsInTemplate:true,activeItem:null,choiceLists:null,documentTypes:null,propertyDefinitions:null,_onNewHandle:null,_onDeleteHandle:null,_onSetHandle:null,_dataTypes:null,_form:null,_propMapStore:null,_cmdBar:null,_grdPropertyMappings:null,_tblProperties:null,_txtDescription:null,_txtName:null,__onPropMapDlgClose:function(_1,_2){if(_1==bfree.widget.Dialog.dialogResult.ok){var _3=null;try{var _4=this._grdPropertyMappings.rowCount;this._grdPropertyMappings.beginUpdate();dojo.forEach(_2,function(id,_5){var _6=this.propertyDefinitions.fetchById({id:id});var _7=this._dataTypes.fetchById({id:_6.data_type_id});var _8;if(_7.isDateTime()){_8=null;}else{if(_7.isBoolean()){_8=false;}else{_8="";}}_3=this._propMapStore.newItem({sort:_4,id:_6.id,name:_6.name,data_type:_7,is_required:false,choice_list_id:null,default_value:_8,default_type:0,max_length:_6.max_length,is_system:_6.is_system,is_name:_6.is_name});_4++;},this);}finally{this._grdPropertyMappings.endUpdate();}if(_3){this._grdPropertyMappings.selectItem(_3);}}return true;},_setActiveItemAttr:function(_9){this.activeItem=_9;this._grdPropertyMappings.selection.clear();if(this.activeItem){this._txtName.set("value",this.activeItem.name);this._txtDescription.set("value",this.activeItem.description);}else{this._txtName.reset();this._txtDescription.reset();}this._cmdBar.set("activeDocType",this.activeItem);this._wdgInfo.set("activeItem",this.activeItem);this._setStore();this._setState();this._grdPropertyMappings.resize();},_setState:function(){var _a=false;var _b=false;if(this.activeItem){_a=this.documentTypes.isDirty({item:this.activeItem});_b=this.activeItem.isNew();}this._txtName.set("disabled",!_a);this._txtDescription.set("disabled",!_a);this._cmdBar.set("disabled",!_a);},_setStore:function(){var _c=[];if(this.activeItem){dojo.forEach(this.activeItem.property_mappings,function(_d,_e){var _f=this.propertyDefinitions.fetchById({id:_d.property_definition_id});var _10=this._dataTypes.fetchById({id:_f.data_type_id});_c.push({sort:_d.sort_order,id:_f.id,name:_f.name,data_type:_10,is_required:_d.is_required,default_value:_d.default_value,default_type:_d.default_type,choice_list_id:_d.choice_list_id,max_length:_f.max_length,is_system:_f.is_system,is_name:_f.is_name});},this);}if(this._onNewHandle){dojo.disconnect(this._onNewHandle);this._onNewHandle=null;}if(this._onDeleteHandle){dojo.disconnect(this._onDeleteHandle);this._onDeleteHandle=null;}if(this._onSetHandle){dojo.disconnect(this._onSetHandle);this._onSetHandle=null;}this._propMapStore=new bfree.api.ItemFileWriteStore({data:{identifier:"id",label:"name",items:_c}});this._onNewHandle=dojo.connect(this._propMapStore,"onNew",this,this._onPropertyMapCreated);this._onDeleteHandle=dojo.connect(this._propMapStore,"onDelete",this,this._onPropertyMapDeleted);this.__onSetHandle=dojo.connect(this._propMapStore,"onSet",this,this._onPropertyMapUpdated);this._grdPropertyMappings.setStore(this._propMapStore);},_chkIsRequired_onChange:function(id,_11){this._propMapStore.fetchItemByIdentity({identity:id,onItem:dojo.hitch(this,function(_12){this._propMapStore.setValue(_12,"is_required",_11);})});},_cmbChoiceList_onChange:function(id,_13){this._propMapStore.fetchItemByIdentity({identity:id,onItem:dojo.hitch(this,function(_14){if(_13==-1){_13=null;}this._propMapStore.setValue(_14,"choice_list_id",_13);this._propMapStore.setValue(_14,"default_type",0);this._propMapStore.setValue(_14,"default_value",null);})});},_grdPropMap_onSelectedItems:function(_15){var _16=null;if(dojo.isArray(_15)&&_15.length>0){_16=_15[0];}this._cmdBar.set("activePropMap",_16);},_onPropMapCommand:function(_17){switch(_17){case bfree.widget.Bfree.Commands.ADD:this._onPropertyMapAdd();break;case bfree.widget.Bfree.Commands.MOVE_UP:this._onPropertyMapUp();break;case bfree.widget.Bfree.Commands.MOVE_DOWN:this._onPropertyMapDown();break;case bfree.widget.Bfree.Commands.REMOVE:this._onPropertyMapRemove();break;}},_onPropertyMapAdd:function(){try{var _18=[];dojo.forEach(this.activeItem.property_mappings,function(_19,idx){_18.push(_19.property_definition_id);},this);bfree.widget.propdef.List.show({filter:_18,propertyDefinitions:this.library.getPropertyDefinitions(),onClose:dojo.hitch(this,this.__onPropMapDlgClose)});}catch(e){var err=new bfree.api.Error("Failed to open 'Property Definitions' dialog",e);bfree.widget.ErrorManager.handleError({error:err});}},_onPropertyMapCreated:function(_1a,_1b){var _1c=this._propMapStore.getValue(_1a,"data_type");this.activeItem.property_mappings.push({sort_order:this._propMapStore.getValue(_1a,"sort"),property_definition_id:this._propMapStore.getIdentity(_1a),is_required:false,choice_list_id:null,default_value:_1c.isBoolean()?false:null,default_type:0});this.onValueChange(this.activeItem,"property_mappings",[],this.activeItem.property_mappings);},_onPropertyMapDeleted:function(_1d){var id=this._propMapStore.getIdentity(_1d);for(var idx=0;idx<this.activeItem.property_mappings.length;idx++){if(this.activeItem.property_mappings[idx].property_definition_id==id){this.activeItem.property_mappings.splice(idx,1);break;}}this.activeItem.property_mappings.sort(bfree.api.PropertyMapping.compare);for(var i=0;i<this.activeItem.property_mappings.length;i++){this.activeItem.property_mappings[i].sort_order=i;}this.onValueChange(this.activeItem,"property_mappings",[],this.activeItem.property_mappings);},_onPropertyMapDown:function(){var _1e=this._grdPropertyMappings.selection.getFirstSelected();if(_1e){this._grdPropertyMappings.moveItem(_1e,bfree.widget.SortGrid.move.DOWN);}var _1f=this._grdPropertyMappings.getItemIndex(_1e);var _20=_1f-1;var _21=this._grdPropertyMappings.getItem(_20);var _22=this._propMapStore.getValue(_1e,"sort");var _23=this._propMapStore.getValue(_21,"sort");for(var i in this.activeItem.property_mappings){if(_1e.id[0]==this.activeItem.property_mappings[i].property_definition_id){this.activeItem.property_mappings[i].sort_order=_22;}if(_21.id[0]==this.activeItem.property_mappings[i].property_definition_id){this.activeItem.property_mappings[i].sort_order=_23;}}this.documentTypes.setValue(this.activeItem,"property_mappings",this.activeItem.property_mappings);},_onPropertyMapUp:function(){var _24=this._grdPropertyMappings.selection.getFirstSelected();if(_24){this._grdPropertyMappings.moveItem(_24,bfree.widget.SortGrid.move.UP);}var _25=this._grdPropertyMappings.getItemIndex(_24);var _26=_25+1;var _27=this._grdPropertyMappings.getItem(_26);var _28=this._propMapStore.getValue(_24,"sort");var _29=this._propMapStore.getValue(_27,"sort");for(var i in this.activeItem.property_mappings){if(_24.id[0]==this.activeItem.property_mappings[i].property_definition_id){this.activeItem.property_mappings[i].sort_order=_28;}if(_27.id[0]==this.activeItem.property_mappings[i].property_definition_id){this.activeItem.property_mappings[i].sort_order=_29;}}this.documentTypes.setValue(this.activeItem,"property_mappings",this.activeItem.property_mappings);},_onPropertyMapRemove:function(){if(!confirm("WARNING: There may be data associated with this document property. "+"If you delete this property all data associated with this property will be deleted. "+"Do you wish to continue?")){return;}var idx=0;try{this._grdPropertyMappings.beginUpdate();var _2a=this._grdPropertyMappings.selection.getFirstSelected();idx=this._grdPropertyMappings.getItemIndex(_2a);this._propMapStore.deleteItem(_2a);var _2b=this._propMapStore._arrayOfTopLevelItems;_2b.sort(function(_2c,_2d){return _2c.sort[0]-_2d.sort[0];});for(var i=0;i<_2b.length;i++){if(_2b[i]){this._propMapStore.setValue(_2b[i],"sort",i);}}this._propMapStore.save();}catch(e){var err=new bfree.api.Error("Failed to remove Property Mapping",e);bfree.widget.ErrorManager.handleError({error:err});}finally{this._grdPropertyMappings.endUpdate();}this._grdPropertyMappings.setSelectedIndex(idx);},_onPropertyMapUpdated:function(_2e,_2f,_30,_31){var id=this._propMapStore.getIdentity(_2e);for(var i=0;i<this.activeItem.property_mappings.length;i++){if(this.activeItem.property_mappings[i].property_definition_id==id){if(this.activeItem.property_mappings[i].hasOwnProperty(_2f)){if(this.activeItem.property_mappings[i][_2f]!=_31){this.activeItem.property_mappings[i][_2f]=_31;}}}}this.onValueChange(this.activeItem,"property_mappings",[],this.activeItem.property_mappings);},_txtDescription_onChange:function(_32){if(!this.activeItem){return;}if(this.activeItem.description!=_32){this.documentTypes.store.setValue(this.activeItem,"description",_32);}},_txtName_onChange:function(_33){if(!this.activeItem){return;}if(this.activeItem.name!=_33){this.propertyDefinitions.store.setValue(this.activeItem,"name",_33);}},_wdgDefault_onChange:function(id,_34){var _35=null;this._propMapStore.fetchItemByIdentity({identity:id,onItem:dojo.hitch(this,function(_36){this._propMapStore.setValue(_36,"default_value",_34);})});for(var i in this.activeItem.property_mappings){if(this.activeItem.property_mappings[i].property_definition_id==id){if(this.activeItem.property_mappings[i].default_value!=_34){this.activeItem.property_mappings[i].default_value=_34;this.documentTypes.setValue(this.activeItem,"property_mappings",this.activeItem.property_mappings);}}}},_wdgDefaultDate_onChange:function(id,_37){var _38=null;for(var i in this.activeItem.property_mappings){if(this.activeItem.property_mappings[i].property_definition_id==id){this.activeItem.property_mappings[i].default_type=_37;if(_37==bfree.api.PropertyMapping.types.date.fixed){this.activeItem.property_mappings[i].default_type=bfree.api.PropertyMapping.types.date.fixed;bfree.widget.Calendar.show({onDateSelected:dojo.hitch(this,function(_39){this.activeItem.property_mappings[i].default_value=_39;this._setStore();this._grdPropertyMappings.refresh();})});}else{if(_37==bfree.api.PropertyMapping.types.date.floating){this.activeItem.property_mappings[i].default_value=0;}else{if(_37==-1){this.activeItem.property_mappings[i].default_type=bfree.api.PropertyMapping.types.date.fixed;this.activeItem.property_mappings[i].default_value=null;}else{return;}}}this.documentTypes.setValue(this.activeItem,"property_mappings",this.activeItem.property_mappings);return;}}},constructor:function(_3a){this._propMapStore=new bfree.api.ItemFileWriteStore({data:{identifier:"id",label:"name",items:[]}});},destroy:function(){if(this._txtName){this._txtName.destroy();this._txtName=null;}if(this._txtDescription){this._txtDescription.destroy();this._txtDescription=null;}if(this._grdPropertyMappings){this._grdPropertyMappings.destroyDescendants();this._grdPropertyMappings.destroy();this._grdPropertyMappings=null;}if(this._tblProperties){this._tblProperties.destroyDescendants();this._tblProperties.destroy();this._tblProperties=null;}if(this._form){this._form.destroy();this._form=null;}this.inherited("destroy",arguments);},focus:function(){this._txtName.setFocus(true);},onValueChange:function(_3b,_3c,_3d,_3e){},postCreate:function(){this.inherited("postCreate",arguments);this._dataTypes=bfree.api.Application.getDataTypes();this._form=new dijit.form.Form({id:"docTypeForm"},this.formNode);this._tblProperties=new dojox.layout.TableContainer({id:"tblProps1",customClass:"versa",showLabels:true,cols:1,labelWidth:96,style:"width:100%"},this.tableNode);this._txtName=new bfree.widget.ValidationTextBox({label:"Name",required:true,selectOnClick:true,style:"width:100%",trim:true,validator:dojo.hitch(this,this._txtNameValidator),onChange:dojo.hitch(this,this._txtName_onChange)});this._tblProperties.addChild(this._txtName);this._txtDescription=new dijit.form.SimpleTextarea({label:"Description","class":"bfree",rows:2,style:"resize:none;width:100%",onChange:dojo.hitch(this,this._txtDescription_onChange)});this._tblProperties.addChild(this._txtDescription);this._grdPropertyMappings=new bfree.widget.SortGrid({"class":"versaGridOutlineNoPad",query:{},noDataMessage:"No Properties Defined",store:this._propMapStore,sort_field:"sort",structure:bfree.widget.doctype.Editor.view1,formatterScope:this,rowsPerPage:1000,style:"width:100%;height:100%",onSelectedItems:dojo.hitch(this,this._grdPropMap_onSelectedItems)},this.propertyMappingsNode);this._cmdBar=new bfree.widget.doctype.PropMapBar({id:"wdgPropDefBar","class":"versaSidebar",grid:this._grdPropertyMappings,onCommand:dojo.hitch(this,this._onPropMapCommand)},this.propMapBarNode);this._wdgInfo=new bfree.widget.doctype.Info({id:"wdgGroupInfo1"},this.infoNode);this._grdPropertyMappings.startup();},_txtNameValidator:function(_3f){if(this._txtName){if(_3f.trim()==""){this._txtName.set("invalidMessage","Document type name cannot be blank");return false;}var _40=this.documentTypes.fetch();for(var i=0;i<_40.length;i++){if(_40[i].name&&_40[i].name.toLowerCase().trim()==_3f.toLowerCase().trim()&&_40[i].__id!=this.activeItem.__id){this._txtName.set("invalidMessage","Duplicate document type");return false;}}}return true;},resize:function(){this.inherited("resize",arguments);this.mainNode.resize();},startup:function(){this.inherited("startup",arguments);}});bfree.widget.doctype.Editor.generateChoiceListWidget=function(_41,_42){var wdg=null;var _43=this._grdPropertyMappings.getItem(_42);var _44=this._propMapStore.getValue(_43,"data_type");var _45=this.documentTypes.isDirty({item:this.activeItem});if((_45)&&(_44.allow_choice_list)){var _46=this.choiceLists.store.fetch({query:{data_type_id:_44.id},queryOptions:{cache:true,clientFetch:true}}).results;var _47=new Array();var _48=new Object();_48[-1]="None";_47.push(_48);for(var i=0;i<_46.length;i++){_48=new Object();_48[_46[i].id]=_46[i].name;_47.push(_48);}var _49=new dojox.data.KeyValueStore({dataVar:_47});wdg=new bfree.widget.FilteringSelect({store:_49,searchAttr:"name",required:false,value:_41,style:"width:128px",scrollOnFocus:false,onChange:dojo.hitch(this,this._cmbChoiceList_onChange,this._propMapStore.getIdentity(_43))});}else{if(_41){var _4a=this.choiceLists.fetchById({id:_41});wdg=_4a.name;}else{wdg="";}}return wdg;};bfree.widget.doctype.Editor.generateDefaultWidget=function(_4b,_4c){var wdg=null;var _4d=this._grdPropertyMappings.getItem(_4c);var _4e=this.documentTypes.isDirty({item:this.activeItem});var _4f=this._propMapStore.getValue(_4d,"data_type");var _50=this._propMapStore.getValue(_4d,"default_type");var _51=this._propMapStore.getValue(_4d,"max_length");if(_4e){if(_4d.choice_list_id[0]!=null){var _52=this.choiceLists.fetchById({id:_4d.choice_list_id[0]});wdg=bfree.widget.propdef.Widget.getChoiceListWidget(null,"",_52,true,_4b);wdg.onChange=dojo.hitch(this,this._wdgDefault_onChange,this._propMapStore.getIdentity(_4d));wdg.set("style",{width:"128px"});wdg.set("required",false);}else{if(_4f.isDateTime()){wdg=bfree.widget.doctype.Editor.generateDateTimeDefaultWidget(_4b,_50);wdg.onChange=dojo.hitch(this,this._wdgDefaultDate_onChange,this._propMapStore.getIdentity(_4d));}else{wdg=bfree.widget.propdef.Widget.getWidget(_4f,null,"",bfree.widget.propdef.Widget.formats.SHORT,_4b,_51);wdg.set("intermediateChanges",false);wdg.set("trim",true);wdg.onChange=dojo.hitch(this,this._wdgDefault_onChange,this._propMapStore.getIdentity(_4d));}}}else{if(_4f.isDateTime()&&_4b){if(_50==bfree.api.PropertyMapping.types.date.floating){wdg="Current Date";}else{_4b=_4b.split("T");_4b=dojo.date.locale.parse(_4b[0],{datePattern:"yyyy-MM-dd",selector:"date"});wdg=versa.api.Formatter.formatDateTime(_4b);}}else{if(_4f.isBoolean()){wdg=bfree.widget.propdef.Widget.getWidget(_4f,null,"",bfree.widget.propdef.Widget.formats.SHORT,_4b);wdg.set("disabled",true);}else{wdg=(!_4b)?"":_4b;}}}return wdg;};bfree.widget.doctype.Editor.generateDateTimeDefaultWidget=function(_53,_54){var _55=[];_55.push({id:-1,display:"None"});_55.push({id:0,display:"Fixed Date"});_55.push({id:1,display:"Current Date"});if(_53&&_54==bfree.api.PropertyMapping.types.date.fixed){_55.push({id:_53,display:versa.api.Formatter.formatDateTime(_53)});}var _56=new bfree.api.ItemFileWriteStore({data:{identifier:"id",label:"display",items:_55}});var def;if(_54==bfree.api.PropertyMapping.types.date.fixed){def=_53?_53:-1;}else{def=bfree.api.PropertyMapping.types.date.floating;}var wdg=new bfree.widget.FilteringSelect({query:{},store:_56,value:def,scrollOnFocus:false,searchAttr:"display",style:"width:100%"});return wdg;};bfree.widget.doctype.Editor.generateRequiredWidget=function(_57,_58){var _59=this._grdPropertyMappings.getItem(_58);var _5a=this.documentTypes.isDirty({item:this.activeItem});var _5b=this._propMapStore.getValue(_59,"data_type");return new dijit.form.CheckBox({checked:_57,scrollOnFocus:false,disabled:!_5a||_5b.isText()||_5b.isBoolean(),onChange:dojo.hitch(this,this._chkIsRequired_onChange,this._propMapStore.getIdentity(_59))});};bfree.widget.doctype.Editor.formatDataType=function(_5c,_5d){return _5c.name;};bfree.widget.doctype.Editor.view1=[{cells:[{field:"sort",name:"&nbsp",width:"16px",hidden:true},{field:"name",name:"Property",width:"auto"},{field:"data_type",name:"Data Type",width:"96px",hidden:true,formatter:bfree.widget.doctype.Editor.formatDataType},{field:"choice_list_id",name:"Choice List",width:"132px",noresize:true,formatter:bfree.widget.doctype.Editor.generateChoiceListWidget},{field:"default_value",name:"Default",width:"128px",noresize:true,formatter:bfree.widget.doctype.Editor.generateDefaultWidget,styles:"padding:0 2px 0 2px;"},{field:"is_required",name:"Required?",width:"64px",formatter:bfree.widget.doctype.Editor.generateRequiredWidget,styles:"text-align:center;"}],width:"auto"}];}