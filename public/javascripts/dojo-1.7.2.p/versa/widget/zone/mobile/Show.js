//>>built
define("versa/widget/zone/mobile/Show",["dojo/_base/declare","dijit/_WidgetBase","dijit/_TemplatedMixin","dojox/mobile/Heading","dojox/mobile/ScrollableView","dojox/mobile/EdgeToEdgeDataList","dojox/mobile/TabBar","dojox/mobile/TabBarButton","versa/api/Folders","versa/api/Documents","versa/api/Zones","versa/widget/folder/mobile/FolderView","versa/widget/document/mobile/DocumentPropertyView","versa/widget/document/mobile/DocumentContentView","versa/widget/document/mobile/LargeTextView","versa/widget/search/mobile/SearchView","versa/widget/search/mobile/SearchResultsView","versa/widget/mobile/TextBox","versa/widget/mobile/Heading","versa/widget/mobile/Footing","dojox/mobile/Button","dojo/data/ItemFileWriteStore"],function(_1){var o=_1("versa.widget.zone.mobile.Show",[dijit._WidgetBase],{folderViews:[],documentViews:[],documentContentViews:[],textViews:[],constructor:function(_2){this.zone=_2.zone;},postCreate:function(){this.inherited("postCreate",arguments);this.folderStore=this.activeLibrary.getFolders().store;this.refStore=this.activeLibrary.getReferences().store;this.rootFolder=this.folderStore.fetch({query:{parent_id:null}}).results[0];this.loadingView=dijit.byId("loadingView");this.onLoad(this);},onCommand:function(_3,_4){switch(_3){case versa.widget.zone.mobile.Show.COMMANDS.SHOW_FOLDER:this.showFolder(_4.parent,_4.folder);break;case versa.widget.zone.mobile.Show.COMMANDS.SHOW_DOCUMENT_PROPERTIES:this.showDocumentProperties(_4.from,_4.reference);break;case versa.widget.zone.mobile.Show.COMMANDS.SHOW_DOCUMENT_CONTENT:this.showDocumentContent(_4.document,_4.reference);break;case versa.widget.zone.mobile.Show.COMMANDS.SHOW_TEXT:this.showText(_4.document,_4.property,_4.label);break;case versa.widget.zone.mobile.Show.COMMANDS.SHOW_ROOT:this.showRoot(_4.from);break;case versa.widget.zone.mobile.Show.COMMANDS.SHOW_SEARCH:this.showSearch(_4.from);break;case versa.widget.zone.mobile.Show.COMMANDS.PERFORM_SEARCH:this.performSearch(_4.search);break;case versa.widget.zone.mobile.Show.COMMANDS.LOGOFF:this.logoff(_4.from);break;}},logoff:function(_5){var _6=true;if(_6){var _7="Continue to exit VersaFile?";if(!confirm(_7)){return;}}var _8=dojox.mobile.ProgressIndicator.getInstance();this.loadingView.domNode.appendChild(_8.domNode);_8.start();_5.performTransition(this.loadingView.id,1,"fade");this.zone.logoff();window.location.reload(true);},showRoot:function(_9){_9.performTransition("folder-"+this.rootFolder.id,-1,"slidev");},showSearch:function(_a){this.searchView.set("back",_a.id);_a.performTransition("searchView",1,"slidev");this.searchView.findAppBars();this.searchView.resize();},performSearch:function(_b){this.searchResultsView.set("search",_b);this.searchView.performTransition("searchResultsView",1,"slide");this.searchResultsView.findAppBars();this.searchResultsView.resize();},showFolder:function(_c,_d){if(!this.folderViews[_d.id]){this.folderViews[_d.id]=new versa.widget.folder.mobile.FolderView({id:"folder-"+_d.id,back:"folder-"+_c.id,library:this.activeLibrary,folder:_d,onCommand:dojo.hitch(this,this.onCommand),selected:true},dojo.create("div",{style:{height:"100%"}},dojo.body()));this.folderViews[_d.id].startup();}this.folderViews[_c.id].performTransition("folder-"+_d.id,1,"slide");this.folderViews[_d.id].findAppBars();this.folderViews[_d.id].resize();},showText:function(_e,_f,_10){if(!this.textViews[_e.id+"-"+_f]){this.textViews[_e.id+"-"+_f]=new versa.widget.document.mobile.LargeTextView({id:"document-"+_e.id+"-"+_f,back:"document-"+_e.id,label:_10,library:this.activeLibrary,document:_e,property:_f,onCommand:dojo.hitch(this,this.onCommand),selected:true},dojo.create("div",{style:{height:"100%"}},dojo.body()));this.textViews[_e.id+"-"+_f].startup();}this.documentViews[_e.id].performTransition("document-"+_e.id+"-"+_f,1,"slide");this.textViews[_e.id+"-"+_f].findAppBars();this.textViews[_e.id+"-"+_f].resize();},showDocumentProperties:function(_11,_12){this.activeLibrary.getDocuments().refreshAsync({scope:this,identity:_12.document_id,onItem:dojo.hitch(this,function(_13){if(!this.documentViews[_13.id]){this.documentViews[_13.id]=new versa.widget.document.mobile.DocumentPropertyView({id:"document-"+_13.id,library:this.activeLibrary,reference:_12,document:_13,onCommand:dojo.hitch(this,this.onCommand),selected:true},dojo.create("div",{style:{height:"100%"}},dojo.body()));this.documentViews[_13.id].startup();}this.documentViews[_13.id].set("back",_11.id);_11.performTransition("document-"+_13.id,1,"slide");this.documentViews[_13.id].findAppBars();this.documentViews[_13.id].resize();}),onError:this.__onDocumentLoadError});},showDocumentContent:function(_14,_15){if(_15.binary_content_type.indexOf("image")>=0||_15.binary_content_type.indexOf("text")>=0){if(!this.documentContentViews[_15.document_id]){this.documentContentViews[_15.document_id]=new versa.widget.document.mobile.DocumentContentView({id:"document-content-"+_15.document_id,back:"document-"+_15.document_id,zone:this.zone,library:this.activeLibrary,document:_14,reference:_15,onCommand:dojo.hitch(this,this.onCommand),selected:true},dojo.create("div",{style:{height:"100%"}},dojo.body()));this.documentContentViews[_15.document_id].startup();}this.documentViews[_15.document_id].performTransition("document-content-"+_15.document_id,1,"slide");this.documentContentViews[_15.document_id].findAppBars();this.documentContentViews[_15.document_id].resize();}else{var _16=_15.getCopyUrl(this.zone,this.activeLibrary);this.downloadUrl(_16);}},downloadUrl:function(url){window.location.href=url;},startup:function(){this.inherited("startup",arguments);this.searchView=new versa.widget.search.mobile.SearchView({id:"searchView",back:"folder-"+this.rootFolder.id,onCommand:dojo.hitch(this,this.onCommand)},dojo.create("div",{style:{height:"100%",width:"100%"}},dojo.body()));this.searchView.startup();this.searchResultsView=new versa.widget.search.mobile.SearchResultsView({id:"searchResultsView",zone:this.zone,library:this.activeLibrary,back:"searchView",view_id:this.rootFolder.view_definition_id,onCommand:dojo.hitch(this,this.onCommand)},dojo.create("div",{style:{height:"100%",width:"100%"}},dojo.body()));this.searchResultsView.startup();this.folderViews[this.rootFolder.id]=new versa.widget.folder.mobile.FolderView({id:"folder-"+this.rootFolder.id,library:this.activeLibrary,folder:this.rootFolder,onCommand:dojo.hitch(this,this.onCommand),selected:true},dojo.create("div",{style:{height:"100%",width:"100%"}},dojo.body()));this.folderViews[this.rootFolder.id].startup();this.loadingView.performTransition(this.folderViews[this.rootFolder.id].id,1,"fade");this.folderViews[this.rootFolder.id].findAppBars();this.folderViews[this.rootFolder.id].resize();}});o.COMMANDS={SHOW_FOLDER:0,SHOW_ROOT:1,SHOW_DOCUMENT_PROPERTIES:2,SHOW_DOCUMENT_CONTENT:3,SHOW_TEXT:4,SHOW_SEARCH:5,PERFORM_SEARCH:6,LOGOFF:7};return o;});