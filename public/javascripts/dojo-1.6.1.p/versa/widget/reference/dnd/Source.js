/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["versa.widget.reference.dnd.Source"]){dojo._hasResource["versa.widget.reference.dnd.Source"]=true;dojo.provide("versa.widget.reference.dnd.Source");dojo.require("dojo.dnd.Source");dojo.declare("versa.widget.reference.dnd.Source",dojo.dnd.Source,{selfAccept:false,grid:null,_dndCreator:function(_1,_2){var _3=null;if(_2=="avatar"){var _4=bfree.api.Document.getIconUrl(_1.binary_content_type,16);_3=dojo.create("div",{"class":"dijitDarkLabel",innerHTML:_1.name,style:{paddingLeft:"20px",height:"16px",paddingTop:"2px",position:"relative"}});dojo.create("img",{src:_4,style:{left:"0",position:"absolute",top:"0"}},_3);}else{_3=dojo.create("div",{innerHTML:_1?_1.name:"",style:{display:"none"}});}return {node:_3,data:_1,type:"document"};},checkAcceptance:function(_5,_6){return false;},constructor:function(_7,_8){this.creator=dojo.hitch(this,this._dndCreator);this.grid=_8.grid;},copyState:function(){return false;},destroy:function(){this.inherited("destroy",arguments);},onDndStart:function(_9,_a,_b){var _c=this.grid.selection.getSelected();for(var i=0;i<_c.length;i++){if(!_c[i]){dojo.dnd.manager().stopDrag();return;}}this.inherited("onDndStart",arguments);}});versa.widget.reference.dnd.Source.creator=function(_d,_e){var n=dojo.create("div",{innerHTML:_d});return {node:n,data:_d};};}