/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.folder.Tree"]){dojo._hasResource["bfree.widget.folder.Tree"]=true;dojo.provide("bfree.widget.folder.Tree");dojo.require("bfree.api.Search");dojo.require("bfree.widget.folder.ContextMenu");dojo.require("dijit.InlineEditBox");dojo.require("dijit.Tree");dojo.require("dijit.tree.ForestStoreModel");dojo.declare("bfree.widget._TreeNode",dijit._TreeNode,{_editor:null,_isEditing:false,library:null,user:null,_createEditor:function(){dojo.attr(this.labelNode,"innerHTML","");var _1=dojo.create("span",{innerHTML:this.label},this.labelNode,"first");var nc=dojo.coords(this.labelNode);var tc=dojo.coords(this.tree.domNode);this._editor=new dijit.InlineEditBox({id:"wdgEditor",intermediateChanges:false,tree:this.tree,node:this,autoSave:true,onChange:dojo.hitch(this,this._editor_onChange),onCancel:dojo.hitch(this,this._editor_onCancel),width:(tc.w-nc.l-16)+"px",value:this.item.name},_1);this._editor.startup();},_destroyEditor:function(){try{this._editor.destroyRecursive();this._editor=null;}catch(e){}},_editor_onCancel:function(){try{this.set("label",this.item.name);this.tree.folders.revert();var _2;if(this.item.parent_id==0){_2=this.tree.rootNode.item;}else{_2=this.tree.folders.fetchById({id:this.item.parent_id});}var _3=this.tree.getNodesByItem(_2);dojo.forEach(_3,function(_4,_5){if(_4.getChildren().length==0){this.tree._collapseNode(_4);}},this);}catch(e){}finally{this.tree.setEditing(false);this._destroyEditor();}},_editor_onChange:function(_6,_7){var _8=false;try{var _9;if(this.item.parent_id==0){_9=this.tree.rootNode.item;}else{_9=this.tree.folders.fetchById({id:this.item.parent_id});}for(var i in _9.children){if(_9.children[i].declaredClass=="bfree.api.Folder"&&_9.children[i].name==_6){alert("Duplicate folder names are not allowed");this._destroyEditor();this.edit();return;}}if(_6==""){this.set("label",this.item.name);this.tree.folders.revert();this.tree._afterSelected(this);this.tree.setEditing(false);this._destroyEditor();return;}this.set("label",_6);this.tree._beforeSelected(this);_8=this.item.isNew();this.tree.folders.setValue(this.item,"name",_6);this.tree.folders.save();var _a=this.tree.getNodesByItem(_9);dojo.forEach(_a,function(_b,_c){_b.item.children.sort(bfree.api.Folder.sort);_b.setChildItems(_b.item.children);},this);(_8)?this.tree.onNewNode(this):this.tree.onUpdateNode(this);this.tree._afterSelected(this);this.tree.setEditing(false);this._destroyEditor();}catch(e){}finally{}},constructor:function(_d){if(!_d){_d={};}dojo.safeMixin(this,_d);},edit:function(){this._createEditor();this._editor.edit();this.tree.setEditing(true);this._editor.wrapperWidget.editWidget.domNode.focus();},hide:function(){dojo.style(this.domNode,"display","none");},postCreate:function(){this.inherited("postCreate",arguments);},startup:function(){this.inherited("startup",arguments);}});dojo.declare("bfree.widget.folder.Tree",dijit.Tree,{_nodeStyles:["dijitTreeExpandoLoading","dijitTreeExpandoOpened","dijitTreeExpandoClosed","dijitTreeExpandoLeaf"],folders:null,isSearchHidden:false,isTrashHidden:false,library:null,_afterSelected:function(_e){var i=_e.isExpandable?(_e.isExpanded?1:2):3;dojo.replaceClass(_e.expandoNode,this._nodeStyles[i],this._nodeStyles);},_beforeSelected:function(_f){dojo.replaceClass(_f.expandoNode,this._nodeStyles[0],this._nodeStyles);},_mnuFolder_onClose:function(evt){dojo.removeClass(this._mnuFolder.activeNode.rowNode,"dijitTreeMenuRow");},_mnuFolder_onOpen:function(evt){dojo.addClass(this._mnuFolder.activeNode.rowNode,"dijitTreeMenuRow");},_createTreeNode:function(_10){return new bfree.widget._TreeNode(_10);},_hideNodesByItem:function(_11){var _12=this.getNodesByItem(_11);dojo.forEach(_12,function(_13,idx){_13.hide();});},_onChildrenChange:function(_14,_15){_14.children.sort(bfree.api.Folder.sort);},_onKeyPress:function(e){if(this.tree._isEditing){return;}this.inherited(arguments);},_mayHaveChildren:function(_16){if((_16.is_trash)||(_16.is_search)){return false;}return dojo.isArray(_16.children)?(_16.children.length>0):(_16.children);},_node_onClick:function(_17,_18){if(!(this.tree._isEditing&&_18._editor)){this._beforeSelected(_18);this.inherited("onClick",arguments);this.onSelected(_17,_18);this._afterSelected(_18);}},_onCommand:function(_19,_1a,_1b){this.onCommand(_19,_1a,_1b);},constructor:function(_1c){this["class"]="versafile";this.model=new dijit.tree.ForestStoreModel({store:_1c.folders.store,query:{parent_id:0},rootId:0,rootLabel:_1c.library.name,deferItemLoadingUntilExpand:true,childrenAttrs:["children"],mayHaveChildren:this._mayHaveChildren,onChildrenChange:this._onChildrenChange});this.persist=false;this.openOnClick=false;},createFolder:function(_1d){var _1e={parent:_1d,attribute:"children"};var _1f=this.folders.generateUniqueName({base_name:"Folder",parent:_1d});var _20=this.folders.store.newItem({name:"",parent_id:_1d.id,children:[]},_1e);_1d.children.sort(bfree.api.Folder.sort);var _21=this.getNodesByItem(_1d);dojo.forEach(_21,function(_22,idx){this._expandNode(_22);},this);_21=this.getNodesByItem(_20);dojo.forEach(_21,function(_23,idx){var _24=_23.getParent();_24.item.children.sort(bfree.api.Folder.sort);_24.setChildItems(_24.item.children);_23.edit();},this);},deleteFolder:function(_25){var msg=dojo.replace("Are you sure you want to delete the folder '{name}'?\n\n"+"NOTE: this will delete all existing sub-folders and contained documents.",_25);if(!confirm(msg)){return;}var _26=_25.path;this.folders.destroy({item:_25});this.folders.save();_26.pop();this.setSelectedPath(_26);},editFolder:function(_27){if(_27.is_trash||_27.is_search){return;}var _28=this.getNodesByItem(_27);dojo.forEach(_28,function(_29,idx){_29.edit();},this);},getIconClass:function(_2a,_2b){if(_2a.is_trash){return "folderIcon bfreeTrashFolder";}if(_2a.is_search){return "folderIcon bfreeSearchFolder";}return (!_2a||this.model.mayHaveChildren(_2a))?(_2b?"dijitFolderOpened":"dijitFolderClosed"):((this.selectedItem===_2a)?"dijitFolderOpened":"dijitFolderClosed");},hideSearch:function(){var _2c=this.library.getFolders().getSearchFolder();this._hideNodesByItem(_2c);},hideTrash:function(){var _2d=this.library.getFolders().getTrashFolder();this._hideNodesByItem(_2d);},onNewNode:function(_2e){this.setSelectedNode(_2e);},onUpdateNode:function(_2f){},postCreate:function(){this.inherited("postCreate",arguments);this._mnuFolder=new bfree.widget.folder.ContextMenu({tree:this,activeLibrary:this.library,activeUser:this.user,onCommand:dojo.hitch(this,this._onCommand),onOpen:dojo.hitch(this,this._mnuFolder_onOpen),onClose:dojo.hitch(this,this._mnuFolder_onClose),targetNodeIds:[this.id]});this.connect(this,"onClick",this._node_onClick);dojo.connect(this,"onMouseDown",this,this._onMouseDown);},_onMouseDown:function(evt){var _30=dijit.getEnclosingWidget(evt.target);if(this.tree._isEditing&&_30._editor){}else{this.dndController.startNode=_30;if(evt.button==2){this._mnuFolder.set("activeNode",_30);}}},setEditing:function(_31){this._isEditing=_31;},setSelectedItem:function(_32){var _33=this.getNodesByItem(_32);this.set("selectedNode",_33[0]);this.onSelected(_32,_33[0]);},setSelectedNode:function(_34){this.set("selectedNode",_34);this.onSelected(_34.item,_34);},setSelectedPath:function(_35){this.set("path",_35);this.setSelectedNode(this.selectedNode);},startup:function(){this.inherited("startup",arguments);this._mnuFolder.startup();dojo.safeMixin(this.rootNode.item,{"active_permissions":this.library.active_permissions,"name":this.library.name,"text_path":"/","updated_at":this.library.updated_at,"getActiveQuery":dojo.hitch(this.rootNode.item,function(){return new bfree.api.Search({type:bfree.api.Search.types.FOLDER,queryData:0});}),"hasRights":dojo.hitch(this.rootNode.item,function(_36){return ((this.active_permissions&_36)==_36);})});if(this.isSearchHidden){this.hideSearch();}if(this.isTrashHidden){this.hideTrash();}this.rootNode.item.children.sort(bfree.api.Folder.sort);this.rootNode.setChildItems(this.rootNode.item.children);this.setSelectedNode(this.rootNode);},getNodesByItem:function(_37){if(!_37){return [];}var _38=dojo.isString(_37)?_37:this.model.getIdentity(_37);if(this._itemNodesMap[_38]){return [].concat(this._itemNodesMap[_38]);}else{return [].concat(this._itemNodesMap[_37.__clientId.substring(_37.__clientId.lastIndexOf("/")+1)]);}},_onClick:function(_39,e){if(!(this.tree._isEditing&&_39._editor)){var _3a=e.target,_3b=this.isExpandoNode(_3a,_39);if((this.openOnClick&&_39.isExpandable)||_3b){if(_39.isExpandable){this._onExpandoClick({node:_39});}}else{this._publish("execute",{item:_39.item,node:_39,evt:e});this.onClick(_39.item,_39,e);this.focusNode(_39);}dojo.stopEvent(e);}}});}