//>>built
require(["dojo/_base/declare",
         "dijit/_WidgetBase",
         "dojox/mobile/Heading",
         "dojox/mobile/ScrollableView",
         "dojox/mobile/EdgeToEdgeDataList",
         "dojox/mobile/ToolBarButton",
         "versa/api/Folders",
         "versa/api/Documents",
         "versa/api/Zones",
         "dojo/data/ItemFileWriteStore"],
    function(declare){
        declare("versa.widget.search.mobile.SearchResultsView", [dijit._WidgetBase, dojox.mobile.ScrollableView], {
            folder: null,
            library: null,

            folders: null,
            references: null,

            folderStore: null,
            refStore: null,

            etedlMain: null,
            header: null,
            footer: null,

            constructor: function(args){
            },

            _setSearchAttr: function(search){
                if(this.search!=search){
                    this.search=search;

                    var documents=this.refStore.fetch({query: {type: 2, query: search, view: this.view_id}}).results;

                    var entries=[];

                    dojo.forEach(documents, function(document){
                        entries.push(
                            {
                                label: document.name,
                                item: document,
                                from: this,
                                onCommand: this.onCommand,
                                icon: '../../images/mimetypes/32/default.png',
                                clickable: true,
                                onClick: function(){
                                    this.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_DOCUMENT_PROPERTIES, {from: this.from, reference:this.item});
                                }
                            }
                        );
                    }, this);

                    var storeData = {
                        items: entries
                    };

                    var store = new dojo.data.ItemFileWriteStore({
                        data: storeData
                    });

                    this.etedlMain.setStore(store);
                }
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);

                this.folders=this.library.getFolders();
                this.references=this.library.getReferences();

                this.folderStore=this.folders.store;
                this.refStore=this.references.store;



                this.header=new versa.widget.mobile.Heading({
                    label: "Search",
                    from: this,
                    back: this.back,
                    onCommand: this.onCommand
                });

                this.footer=new versa.widget.mobile.Footing({
                    onCommand: this.onCommand,
                    from: this
                });

                this.etedlMain=new dojox.mobile.EdgeToEdgeDataList({
                    iconBase: '../../images/mimetypes/48/default.png'
                });

                this.addChild(this.header);
                this.addChild(this.footer);
                this.addChild(this.etedlMain);
            },

            onBeforeTransitionIn: function(){
                this.findAppBars();
                this.resize();
            },

            onBeforeTransitionOut: function(){
                this.findAppBars();
                this.resize();
            },

            startup: function(){
                this.inherited('startup', arguments);
                this.etedlMain.startup();
            }
        });
    }
);

