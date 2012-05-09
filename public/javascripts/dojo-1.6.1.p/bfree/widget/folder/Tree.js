/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.folder.Tree"]){dojo._hasResource["bfree.widget.folder.Tree"]=true;dojo.provide("bfree.widget.folder.Tree");dojo.require("bfree.api.Search");dojo.require("bfree.widget.ValidationTextBox");dojo.require("bfree.widget.folder.ContextMenu");dojo.require("bfree.widget.folder.DndSource");dojo.require("dijit.InlineEditBox");dojo.require("dijit.Tree");dojo.require("dijit.tree.TreeStoreModel");dojo.declare("bfree.widget._TreeNode",dijit._TreeNode,{_editor:null,_isEditing:false,library:null,group:null,user:null,_createEditor:function(){dojo.attr(this.labelNode,"innerHTML","");var _1=dojo.create("span",{innerHTML:this.label},this.labelNode,"first");var nc=dojo.coords(this.labelNode);var tc=dojo.coords(this.tree.domNode);this._editor=new dijit.InlineEditBox({id:"wdgEditor",editor:"bfree.widget.ValidationTextBox",intermediateChanges:false,tree:this.tree,node:this,autoSave:true,onChange:dojo.hitch(this,this._editor_onChange),onCancel:dojo.hitch(this,this._editor_onCancel),width:(tc.w-nc.l-25)+"px",scrollIntoView:false,value:this.item.name},_1);this._editor.startup();},_destroyEditor:function(){try{this._editor.destroyRecursive();this._editor=null;}catch(e){}},_editor_onCancel:function(){try{this.set("label",this.item.name);var _2;if(this.item.parent_id==0){_2=this.tree.rootNode.item;}else{_2=this.tree.folders.fetchById({id:this.item.parent_id});}if(this.item.isNew()){var _3=this.tree.getNodesByItem(_2);dojo.forEach(_3,function(_4){var _5=_4.getChildren();_5.removeByValue(this);for(var i in _5){if(_5[i].item){_5[i]=_5[i].item;}}_4.setChildItems(_5);},this);this.tree.folders.destroy({item:this.item});this.tree.folders.save();}else{this.tree.folders.revert();this.tree.folders.save();}}catch(e){}finally{this.tree.setEditing(false);this._destroyEditor();}},_editor_onChange:function(_6){var _7=false;try{var _8;if(this.item.parent_id==0){_8=this.tree.rootNode.item;}else{_8=this.tree.folders.fetchById({id:this.item.parent_id});}for(var i in _8.children){if(i!="__parent"&&_8.children[i].declaredClass=="bfree.api.Folder"&&_8.children[i].name.toLowerCase()==_6.toLowerCase()&&_8.children[i].id!=this.item.id){alert("Duplicate folder names are not allowed.");this._destroyEditor();setTimeout(dojo.hitch(this,function(){this.edit();}),100);return;}}if(_6.trim()==""){this._editor_onCancel();return;}this.set("label",_6);this.tree._beforeSelected(this);_7=this.item.isNew();this.tree.folders.setValue(this.item,"name",_6);this.tree.folders.save();var _9=this.tree.getNodesByItem(_8);dojo.forEach(_9,function(_a){_a.item.children.sort(bfree.api.Folder.sort);_a.setChildItems(_a.item.children);},this);(_7)?this.tree.onNewNode(this):this.tree.onUpdateNode(this);this.tree._afterSelected(this);this.tree.setEditing(false);this._destroyEditor();}catch(e){}finally{this.setSelected(true);}},constructor:function(_b){},edit:function(){this.tree.setEditing(true);this._createEditor();this._editor.edit();this._editor.wrapperWidget.editWidget.domNode.focus();},hide:function(){dojo.style(this.domNode,"display","none");},show:function(){dojo.style(this.domNode,"display","block");},postCreate:function(){this.inherited("postCreate",arguments);},startup:function(){this.inherited("startup",arguments);}});dojo.declare("bfree.widget.folder.Tree",dijit.Tree,{_isEditing:false,_nodeStyles:["dijitTreeExpandoLoading","dijitTreeExpandoOpened","dijitTreeExpandoClosed","dijitTreeExpandoLeaf"],_rootItem:null,dndController:"bfree.widget.folder.DndSource",folders:null,isSearchHidden:true,isShareRootHidden:false,isTrashHidden:false,openOnDblClick:true,library:null,zone:null,_afterSelected:function(_c){var i=_c.isExpandable?(_c.isExpanded?1:2):3;dojo.replaceClass(_c.expandoNode,this._nodeStyles[i],this._nodeStyles);},_beforeSelected:function(_d){dojo.replaceClass(_d.expandoNode,this._nodeStyles[0],this._nodeStyles);},_mnuFolder_onClose:function(_e){if(this._mnuFolder.activeNode.rowNode){dojo.removeClass(this._mnuFolder.activeNode.rowNode,"dijitTreeMenuRow");}},_mnuFolder_onOpen:function(_f){if(this._mnuFolder.activeNode.rowNode){dojo.addClass(this._mnuFolder.activeNode.rowNode,"dijitTreeMenuRow");}},_createTreeNode:function(_10){return new bfree.widget._TreeNode(_10);},_hideNodesByItem:function(_11){var _12=this.getNodesByItem(_11);dojo.forEach(_12,function(_13,idx){_13.hide();});},_showNodesByItem:function(_14){var _15=this.getNodesByItem(_14);dojo.forEach(_15,function(_16,idx){_16.show();});},_onChildrenChange:function(_17,_18){_17.children.sort(bfree.api.Folder.sort);},_onKeyPress:function(e){if(this.tree._isEditing){return;}this.inherited(arguments);},_mayHaveChildren:function(_19){if((_19.isTrash())||(_19.isSearch())){return false;}return dojo.isArray(_19.children)?(_19.children.length>0):(_19.children);},_node_onClick:function(_1a,_1b){if(!(this.tree._isEditing&&_1b._editor)){this._beforeSelected(_1b);this.inherited("onClick",arguments);this._onSelected(_1a,_1b);this._afterSelected(_1b);}},_onCommand:function(_1c,_1d,_1e){this.onCommand(_1c,_1d,_1e);},_onMouseDown:function(evt){this.onFocus();var _1f=dijit.getEnclosingWidget(evt.target);if(this.tree._isEditing&&_1f._editor){}else{if(this.dndController){this.dndController.startNode=_1f;}if(dojo.mouseButtons.isRight(evt)){this._mnuFolder.set("activeNode",_1f);}}},_onSelected:function(_20,_21){this.onSelected(_20,_21);},constructor:function(_22){this["class"]="versafile";this.model=new dijit.tree.TreeStoreModel({store:_22.folders.store,deferItemLoadingUntilExpand:true,query:"root",mayHaveChildren:this._mayHaveChildren});this.persist=false;this.openOnClick=false;},createFolder:function(_23){var _24={parent:_23,attribute:"children"};var _25=this.folders.generateUniqueName({base_name:"Folder",parent:_23});var _26=this.folders.store.newItem({name:"",parent_id:_23.id,children:[]},_24);var _27=this.getNodesByItem(_23);dojo.forEach(_27,function(_28,idx){this._expandNode(_28);},this);_27=this.getNodesByItem(_26);dojo.forEach(_27,function(_29,idx){_29.edit();},this);},deleteFolder:function(_2a){var msg="";if(_2a.isShare()){msg=dojo.replace("Are you sure you want to remove the shared folder '{name}'?",_2a);}else{msg=dojo.replace("Are you sure you want to delete the folder '{name}'?\n\n"+"NOTE: this will delete all existing sub-folders and contained documents.",_2a);}if(!confirm(msg)){this.setBusy(_2a,false);return;}var _2b=_2a.path;var _2c=this.getNodesByItem(_2a);dojo.forEach(_2c,function(_2d,idx){var _2e=_2d.getParent();var _2f=_2e.getChildren();_2f.removeByValue(_2d);for(var i in _2f){if(_2f[i].item){_2f[i]=_2f[i].item;}}_2e.setChildItems(_2f);},this);this.folders.destroy({item:_2a});_2b.pop();this.setSelectedPath(_2b);},editFolder:function(_30){if(_30.is_trash||_30.is_search){return;}var _31=this.getNodesByItem(_30);dojo.forEach(_31,function(_32,idx){var _33=_32.domNode;while(_33!=null){var wgt=dijit.getEnclosingWidget(_33);if(wgt.declaredClass=="bfree.widget.folder.Tree"){_32.edit();break;}_33=_33.parentNode;}},this);},getIconClass:function(_34,_35){var _36="dijitFolderOpened";if(_34.isRoot()){_36="folderIcon bfreeRootFolder";}else{if(_34.isTrash()){_36="folderIcon bfreeTrashFolder";}else{if(_34.isSearch()){_36="folderIcon bfreeSearchFolder";}else{if(_34.isShareRoot()){_36="folderIcon bfreeShareRootFolder";}else{if(_34.isShare()){_36=(!_34||this.model.mayHaveChildren(_34))?(_35?"folderIcon bfreeShareFolderOpened":"folderIcon bfreeShareFolderClosed"):"folderIcon bfreeShareFolderClosed";}else{if(_34.isError()){_36="folderIcon bfreeIconError";}else{_36=(!_34||this.model.mayHaveChildren(_34))?(_35?"dijitFolderOpened":"dijitFolderClosed"):"dijitFolderClosed";}}}}}}return _36;},getNodesByItem:function(_37){if(!_37){return [];}var _38=dojo.isString(_37)?_37:this.model.getIdentity(_37);if(this._itemNodesMap[_38]){return [].concat(this._itemNodesMap[_38]);}else{return [].concat(this._itemNodesMap[_37.__clientId.substring(_37.__clientId.lastIndexOf("/")+1)]);}},getRoot:function(){if(!this._rootItem){this.model.getRoot(dojo.hitch(this,function(_39){this._rootItem=_39;}));}return this._rootItem;},hideSearch:function(){var _3a=this.getRoot().getSearchFolder();if(_3a){this._hideNodesByItem(_3a);}},hideShareRoot:function(){var _3b=this.getRoot().getShareRootFolder();if(_3b){this._hideNodesByItem(_3b);}},hideTrash:function(){var _3c=this.getRoot().getTrashFolder();if(_3c){this._hideNodesByItem(_3c);}},moveFolder:function(_3d,_3e){var _3f=this.getNodesByItem(_3e)[0];var _40=this.getNodesByItem(_3d)[0];var _41=_3f.getParent();_40.expand();this.library.getFolders().setValue(_3e,"parent_id",_3d.getId());this.model.pasteItem(_3e,_41.item,_3d,false);this.library.getFolders().save();this.setSelectedPath(_3e.path);},onNewNode:function(_42){this.setSelectedItem(_42.item);},onUpdateNode:function(_43){},postCreate:function(){this.inherited("postCreate",arguments);this._mnuFolder=new bfree.widget.folder.ContextMenu({tree:this,activeLibrary:this.library,activeGroup:this.group,activeUser:this.user,onCommand:dojo.hitch(this,this._onCommand),onOpen:dojo.hitch(this,this._mnuFolder_onOpen),onClose:dojo.hitch(this,this._mnuFolder_onClose),targetNodeIds:[this.id]});dojo.connect(this,"onClick",this._node_onClick);dojo.connect(this,"onMouseDown",this,this._onMouseDown);this.dndController.onCommand=dojo.hitch(this,this.onCommand);},onSelected:function(_44,_45){},selectRoot:function(){this.setSelectedNode(this.rootNode);},setBusy:function(_46,_47){var _48=this.getNodesByItem(_46);dojo.forEach(_48,function(_49,idx){(_47)?_49.markProcessing():_49.unmarkProcessing();},this);},setEditing:function(_4a){this._isEditing=_4a;},setSelectedItem:function(_4b){var _4c=this.getNodesByItem(_4b);this.set("selectedNode",_4c[0]);this._onSelected(_4b,_4c[0]);},setSelectedNode:function(_4d){this.set("selectedNode",_4d);this._onSelected(_4d.item,_4d);},setSelectedPath:function(_4e){this.set("path",_4e);this.setSelectedNode(this.selectedNode);},showSearch:function(){var _4f=this.getRoot().getSearchFolder();if(_4f){this._showNodesByItem(_4f);}},startup:function(){this.inherited("startup",arguments);this._mnuFolder.startup();var _50=(this.isShareRootHidden)?null:this.getRoot().getShareRootFolder();this.isShareRootHidden=((!_50)||(!_50.hasRights(bfree.api._Securable.permissions.VIEW)));if(this.isSearchHidden){this.hideSearch();}if(this.isTrashHidden){this.hideTrash();}if(this.isShareRootHidden){this.hideShareRoot();}},_onClick:function(_51,e){if(!(this.tree._isEditing&&_51._editor)){var _52=e.target,_53=this.isExpandoNode(_52,_51);if((this.openOnClick&&_51.isExpandable)||_53){if(_51.isExpandable){this._onExpandoClick({node:_51});}}else{setTimeout(dojo.hitch(this,function(){this._publish("execute",{item:_51.item,node:_51,evt:e});this.onClick(_51.item,_51,e);this.focusNode(_51);}),50);}dojo.stopEvent(e);}}});}