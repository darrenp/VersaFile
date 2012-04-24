/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.folder.Tree"]){dojo._hasResource["bfree.widget.folder.Tree"]=true;dojo.provide("bfree.widget.folder.Tree");dojo.require("bfree.api.Search");dojo.require("bfree.widget.folder.ContextMenu");dojo.require("dijit.InlineEditBox");dojo.require("dijit.Tree");dojo.require("dijit.tree.TreeStoreModel");dojo.declare("bfree.widget._TreeNode",dijit._TreeNode,{_editor:null,_isEditing:false,library:null,group:null,user:null,_createEditor:function(){dojo.attr(this.labelNode,"innerHTML","");var _1=dojo.create("span",{innerHTML:this.label},this.labelNode,"first");var nc=dojo.coords(this.labelNode);var tc=dojo.coords(this.tree.domNode);this._editor=new dijit.InlineEditBox({id:"wdgEditor",intermediateChanges:false,tree:this.tree,node:this,autoSave:true,onChange:dojo.hitch(this,this._editor_onChange),onCancel:dojo.hitch(this,this._editor_onCancel),width:(tc.w-nc.l-25)+"px",scrollIntoView:false,value:this.item.name},_1);this._editor.startup();},_destroyEditor:function(){try{this._editor.destroyRecursive();this._editor=null;}catch(e){}},_editor_onCancel:function(){try{this.set("label",this.item.name);var _2;if(this.item.parent_id==0){_2=this.tree.rootNode.item;}else{_2=this.tree.folders.fetchById({id:this.item.parent_id});}if(this.item.isNew()){var _3=this.tree.getNodesByItem(_2);dojo.forEach(_3,function(_4,_5){var _6=_4.getChildren();_6.removeByValue(this);for(var i in _6){if(_6[i].item){_6[i]=_6[i].item;}}_4.setChildItems(_6);},this);this.tree.folders.destroy({item:this.item});this.tree.folders.save();}else{this.tree.folders.revert();this.tree.folders.save();}}catch(e){}finally{this.tree.setEditing(false);this._destroyEditor();}},_editor_onChange:function(_7,_8){var _9=false;try{var _a;if(this.item.parent_id==0){_a=this.tree.rootNode.item;}else{_a=this.tree.folders.fetchById({id:this.item.parent_id});}for(var i in _a.children){if(i!="__parent"&&_a.children[i].declaredClass=="bfree.api.Folder"&&_a.children[i].name.toLowerCase()==_7.toLowerCase()&&_a.children[i].id!=this.item.id){alert("Duplicate folder names are not allowed.");this._destroyEditor();setTimeout(dojo.hitch(this,function(){this.edit();}),100);return;}}if(_7==""){this.set("label",this.item.name);this.tree.folders.revert();this.tree._afterSelected(this);this.tree.setEditing(false);this._destroyEditor();return;}this.set("label",_7);this.tree._beforeSelected(this);_9=this.item.isNew();this.tree.folders.setValue(this.item,"name",_7);this.tree.folders.save();var _b=this.tree.getNodesByItem(_a);dojo.forEach(_b,function(_c,_d){_c.setChildItems(_c.item.children);},this);(_9)?this.tree.onNewNode(this):this.tree.onUpdateNode(this);this.tree._afterSelected(this);this.tree.setEditing(false);this._destroyEditor();}catch(e){}finally{this.setSelected(true);}},constructor:function(_e){},edit:function(){this._createEditor();this._editor.edit();this.tree.setEditing(true);this._editor.wrapperWidget.editWidget.domNode.focus();},hide:function(){dojo.style(this.domNode,"display","none");},show:function(){dojo.style(this.domNode,"display","block");},postCreate:function(){this.inherited("postCreate",arguments);},startup:function(){this.inherited("startup",arguments);}});dojo.declare("bfree.widget.folder.Tree",dijit.Tree,{_nodeStyles:["dijitTreeExpandoLoading","dijitTreeExpandoOpened","dijitTreeExpandoClosed","dijitTreeExpandoLeaf"],folders:null,isSearchHidden:true,isShareRootHidden:false,isTrashHidden:false,openOnDblClick:true,library:null,_afterSelected:function(_f){var i=_f.isExpandable?(_f.isExpanded?1:2):3;dojo.replaceClass(_f.expandoNode,this._nodeStyles[i],this._nodeStyles);},_beforeSelected:function(_10){dojo.replaceClass(_10.expandoNode,this._nodeStyles[0],this._nodeStyles);},_mnuFolder_onClose:function(evt){dojo.removeClass(this._mnuFolder.activeNode.rowNode,"dijitTreeMenuRow");},_mnuFolder_onOpen:function(evt){dojo.addClass(this._mnuFolder.activeNode.rowNode,"dijitTreeMenuRow");},_createTreeNode:function(_11){return new bfree.widget._TreeNode(_11);},_hideNodesByItem:function(_12){var _13=this.getNodesByItem(_12);dojo.forEach(_13,function(_14,idx){_14.hide();});},_showNodesByItem:function(_15){var _16=this.getNodesByItem(_15);dojo.forEach(_16,function(_17,idx){_17.show();});},_onChildrenChange:function(_18,_19){_18.children.sort(bfree.api.Folder.sort);},_onKeyPress:function(e){if(this.tree._isEditing){return;}this.inherited(arguments);},_mayHaveChildren:function(_1a){if((_1a.isTrash())||(_1a.isSearch())){return false;}return dojo.isArray(_1a.children)?(_1a.children.length>0):(_1a.children);},_node_onClick:function(_1b,_1c){if(!(this.tree._isEditing&&_1c._editor)){this._beforeSelected(_1c);this.inherited("onClick",arguments);this._onSelected(_1b,_1c);this._afterSelected(_1c);}},_onCommand:function(_1d,_1e,_1f){this.onCommand(_1d,_1e,_1f);},_onSelected:function(_20,_21){this.onSelected(_20,_21);},constructor:function(_22){this["class"]="versafile";this.model=new dijit.tree.TreeStoreModel({store:_22.folders.store,deferItemLoadingUntilExpand:true,query:"root",mayHaveChildren:this._mayHaveChildren});this.persist=false;this.openOnClick=false;},createFolder:function(_23){var _24={parent:_23,attribute:"children"};var _25=this.folders.generateUniqueName({base_name:"Folder",parent:_23});var _26=this.folders.store.newItem({name:"",parent_id:_23.id,children:[]},_24);var _27=this.getNodesByItem(_23);dojo.forEach(_27,function(_28,idx){this._expandNode(_28);},this);_27=this.getNodesByItem(_26);dojo.forEach(_27,function(_29,idx){_29.edit();},this);},deleteFolder:function(_2a){var msg="";if(_2a.isShare()){msg=dojo.replace("Are you sure you want to delete the shared folder '{name}'?",_2a);}else{msg=dojo.replace("Are you sure you want to delete the folder '{name}'?\n\n"+"NOTE: this will delete all existing sub-folders and contained documents.",_2a);}if(!confirm(msg)){this.setBusy(_2a,false);return;}var _2b=_2a.path;var _2c=this.getNodesByItem(_2a);dojo.forEach(_2c,function(_2d,idx){var _2e=_2d.getParent();var _2f=_2e.getChildren();_2f.removeByValue(_2d);for(var i in _2f){if(_2f[i].item){_2f[i]=_2f[i].item;}}_2e.setChildItems(_2f);},this);this.folders.destroy({item:_2a});this.folders.save();_2b.pop();this.setSelectedPath(_2b);},editFolder:function(_30){if(_30.is_trash||_30.is_search){return;}var _31=this.getNodesByItem(_30);dojo.forEach(_31,function(_32,idx){var _33=_32.domNode;while(_33!=null){var wgt=dijit.getEnclosingWidget(_33);if(wgt.declaredClass=="bfree.widget.folder.Tree"){_32.edit();break;}_33=_33.parentNode;}},this);},getIconClass:function(_34,_35){var _36="dijitFolderOpened";if(_34.isRoot()){_36="folderIcon bfreeRootFolder";}else{if(_34.isTrash()){_36="folderIcon bfreeTrashFolder";}else{if(_34.isSearch()){_36="folderIcon bfreeSearchFolder";}else{if(_34.isShareRoot()){_36="folderIcon bfreeShareRootFolder";}else{if(_34.isShare()){_36=(!_34||this.model.mayHaveChildren(_34))?(_35?"folderIcon bfreeShareFolderOpened":"folderIcon bfreeShareFolderClosed"):"folderIcon bfreeShareFolderClosed";}else{_36=(!_34||this.model.mayHaveChildren(_34))?(_35?"dijitFolderOpened":"dijitFolderClosed"):"dijitFolderClosed";}}}}}return _36;},hideSearch:function(){var _37=this.library.getFolders().getSearchFolder();this._hideNodesByItem(_37);},hideShareRoot:function(){var _38=this.library.getFolders().getShareRootFolder();this._hideNodesByItem(_38);},hideTrash:function(){var _39=this.library.getFolders().getTrashFolder();this._hideNodesByItem(_39);},showSearch:function(){var _3a=this.library.getFolders().getSearchFolder();this._showNodesByItem(_3a);},getNodesByItem:function(_3b){if(!_3b){return [];}var _3c=dojo.isString(_3b)?_3b:this.model.getIdentity(_3b);if(this._itemNodesMap[_3c]){return [].concat(this._itemNodesMap[_3c]);}else{return [].concat(this._itemNodesMap[_3b.__clientId.substring(_3b.__clientId.lastIndexOf("/")+1)]);}},onNewNode:function(_3d){this.setSelectedItem(_3d.item);},onUpdateNode:function(_3e){},postCreate:function(){this.inherited("postCreate",arguments);this._mnuFolder=new bfree.widget.folder.ContextMenu({tree:this,activeLibrary:this.library,activeUser:this.user,onCommand:dojo.hitch(this,this._onCommand),onOpen:dojo.hitch(this,this._mnuFolder_onOpen),onClose:dojo.hitch(this,this._mnuFolder_onClose),targetNodeIds:[this.id]});dojo.connect(this,"onClick",this._node_onClick);dojo.connect(this,"onMouseDown",this,this._onMouseDown);this.dndController.onCommand=dojo.hitch(this,this.onCommand);},_onMouseDown:function(evt){var _3f=dijit.getEnclosingWidget(evt.target);if(this.tree._isEditing&&_3f._editor){}else{this.dndController.startNode=_3f;if(evt.button==2){this._mnuFolder.set("activeNode",_3f);}}},onSelected:function(_40,_41){},selectRoot:function(){this.setSelectedNode(this.rootNode);},setBusy:function(_42,_43){var _44=this.getNodesByItem(_42);dojo.forEach(_44,function(_45,idx){(_43)?_45.markProcessing():_45.unmarkProcessing();},this);},setEditing:function(_46){this._isEditing=_46;},setSelectedItem:function(_47){var _48=this.getNodesByItem(_47);this.set("selectedNode",_48[0]);this._onSelected(_47,_48[0]);},setSelectedNode:function(_49){this.set("selectedNode",_49);this._onSelected(_49.item,_49);},setSelectedPath:function(_4a){this.set("path",_4a);this.setSelectedNode(this.selectedNode);},startup:function(){this.inherited("startup",arguments);this._mnuFolder.startup();if(this.isSearchHidden){this.hideSearch();}if(this.isTrashHidden){this.hideTrash();}if(this.isShareRootHidden){this.hideShareRoot();}},_onClick:function(_4b,e){if(!(this.tree._isEditing&&_4b._editor)){var _4c=e.target,_4d=this.isExpandoNode(_4c,_4b);if((this.openOnClick&&_4b.isExpandable)||_4d){if(_4b.isExpandable){this._onExpandoClick({node:_4b});}}else{setTimeout(dojo.hitch(this,function(){this._publish("execute",{item:_4b.item,node:_4b,evt:e});this.onClick(_4b.item,_4b,e);this.focusNode(_4b);}),50);}dojo.stopEvent(e);}}});}