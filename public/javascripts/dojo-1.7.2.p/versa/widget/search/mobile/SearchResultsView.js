//>>built
require(["dojo/_base/declare","dijit/_WidgetBase","dojox/mobile/Heading","dojox/mobile/ScrollableView","dojox/mobile/EdgeToEdgeDataList","dojox/mobile/ToolBarButton","versa/api/Folders","versa/api/Documents","versa/api/Zones","dojo/data/ItemFileWriteStore"],function(_1){_1("versa.widget.search.mobile.SearchResultsView",[dijit._WidgetBase,dojox.mobile.ScrollableView],{folder:null,library:null,folders:null,references:null,folderStore:null,refStore:null,etedlMain:null,header:null,footer:null,constructor:function(_2){},_setSearchAttr:function(_3){if(this.search!=_3){this.search=_3;var _4=this.refStore.fetch({query:{type:2,query:_3,view:this.view_id}}).results;var _5=[];dojo.forEach(_4,function(_6){_5.push({label:_6.name,item:_6,from:this,onCommand:this.onCommand,icon:"../../images/mimetypes/32/default.png",clickable:true,onClick:function(){this.select(true);setTimeout("var caller=dijit.byId('"+this.id+"');"+"caller.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_DOCUMENT_PROPERTIES, {from: caller.from, reference:caller.item});",3);}});},this);var _7={items:_5};var _8=new dojo.data.ItemFileWriteStore({data:_7});this.etedlMain.setStore(_8);}},postCreate:function(){this.inherited("postCreate",arguments);this.folders=this.library.getFolders();this.references=this.library.getReferences();this.folderStore=this.folders.store;this.refStore=this.references.store;this.header=new versa.widget.mobile.Heading({label:"Search",from:this,moveTo:this.back,onCommand:this.onCommand});this.footer=new versa.widget.mobile.Footing({onCommand:this.onCommand,from:this});this.etedlMain=new dojox.mobile.EdgeToEdgeDataList({iconBase:"../../images/mimetypes/48/default.png"});this.addChild(this.header);this.addChild(this.footer);this.addChild(this.etedlMain);},onBeforeTransitionIn:function(){this.findAppBars();this.resize();},onBeforeTransitionOut:function(){this.findAppBars();this.resize();},startup:function(){this.inherited("startup",arguments);this.etedlMain.startup();}});});