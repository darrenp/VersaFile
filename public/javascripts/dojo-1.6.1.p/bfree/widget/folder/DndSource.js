/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["bfree.widget.folder.DndSource"]){dojo._hasResource["bfree.widget.folder.DndSource"]=true;dojo.provide("bfree.widget.folder.DndSource");dojo.require("dijit.tree.dndSource");dojo.declare("bfree.widget.folder.DndSource",[dijit.tree.dndSource],{singular:true,onDndDrop:function(_1,_2,_3){try{if(this.containerState!=""&&this.targetAnchor!=null){if(_2[0].type=="Document"){var _4=dijit.getEnclosingWidget(_2[0]);var _5=_4.payload;dojo.forEach(_5,dojo.hitch(this,function(_6,_7){if(this.targetAnchor.item.is_trash){this.tree.documents.setValue(_6,"state",_6.setState(bfree.api.Document.states.DELETED,true));}else{if(_6.getState(bfree.api.Document.states.DELETED)){this.tree.documents.setValue(_6,"state",_6.setState(bfree.api.Document.states.DELETED,false));}this.tree.documents.setValue(_6,"folder_id",this.targetAnchor.item.$ref?this.targetAnchor.item.$ref:(this.targetAnchor.item.id));}}));this.tree.documents.save({onComplete:function(){_4.grid.selection.clear();_4.grid.refresh();}});}else{if(this.anchor.item.root){this.moveFolder();}else{this.tree.folders.loadItem({item:this.anchor.item,callback:dojo.hitch(this,this.moveFolder,{anchor:this.anchor,targetAnchor:this.targetAnchor})});}}}}catch(e){}finally{this.inherited("onDndCancel",arguments);}},onDndStart:function(_8,_9,_a){if(_9[0].type!="Document"&&this.startNode.declaredClass!="bfree.widget._TreeNode"){dojo.dnd.manager().stopDrag();return;}if(_8.anchor.item&&(_8.anchor.item.is_trash||_8.anchor.item.is_search)){dojo.dnd.manager().stopDrag();return;}this.inherited("onDndStart",arguments);},moveFolder:function(_b){var _c=_b.anchor;var _d=_b.targetAnchor;var _e=_c.getParent();var _f=_e.getChildren();this.tree.folders.setValue(_c.item,"parent_id",_d.item.$ref?_d.item.$ref:(_d.item.id));var _10=false;for(var i=0;i<_f.length;i++){if(_10){_f[i-1]=_f[i].item;}else{if((_f[i].item.$ref?_f[i].item.$ref:_f[i].item.id)==(_c.item.$ref?_c.item.$ref:_c.item.id)){_10=true;}_f[i]=_f[i].item;}}_f.length=_f.length-1;_f.sort(bfree.api.Folder.sort);_e.setChildItems(_f);if(!_d.item.root){_f=_d.getChildren();for(var i=0;i<_f.length;i++){_f[i]=_f[i].item;}_f[_f.length]=_c.item;_f.sort(bfree.api.Folder.sort);_d.setChildItems(_f);}this.tree.folders.save();this.tree.set("selectedNode",_c);this.tree.onSelected(_c.item,_c);dojo.removeClass(_d.domNode,"dijitTreeRowSelected");_d.expand();},checkItemAcceptance:function(_11,_12,_13){var _14=dijit.getEnclosingWidget(_11);var _15=dijit.getEnclosingWidget(_12.anchor);if(!_12.anchor){return false;}if(_12.anchor.item&&_14.item.id==_12.anchor.item.parent_id){return false;}var _16=_14.getChildren();for(var i in _16){if(_16[i].item&&_16[i].item.name&&_16[i].item.name==_12.anchor.item.name){return false;}}if(_14.item.is_search||_14.item.is_trash){if(_12.anchor.type=="Document"&&_14.item.is_trash&&!_15.document.getState(bfree.api.Document.states.DELETED)){return true;}return false;}return true;},constructor:function(_17){},onMouseDown:function(e){if(!(e.target.type&&e.target.type=="text")){this.mouseDown=true;this.mouseButton=e.button;this._lastX=e.pageX;this._lastY=e.pageY;this.inherited(arguments);}}});}