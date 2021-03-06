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
        declare("versa.widget.folder.mobile.FolderView", [dijit._WidgetBase, dojox.mobile.ScrollableView], {
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

            postCreate: function(){
                this.inherited('postCreate', arguments);

                this.folders=this.library.getFolders();
                this.references=this.library.getReferences();

                this.folderStore=this.folders.store;
                this.refStore=this.references.store;

                this.folderStore.clearCache();
                var folders=this.folderStore.fetch({query:{parent_id: this.folder.id}}).results;
                var documents=this.refStore.fetch({query: {type: 1, query: this.folder.id, view: this.folder.view_definition_id}}).results;

                folders.sort(versa.api.Folder.sort);

                var entries=[];
                dojo.forEach(folders, function(folder){
                    if(!(folder.isSearch()||folder.isTrash()||folder.isShareRoot())){
                        entries.push(
                            {
                                label: folder.name,
                                item: folder,
                                parent: this.folder,
                                onCommand: this.onCommand,
                                icon: '../../images/icons/32/folder.png',
                                clickable: true,
                                onClick: function(){
                                    this.select(true);
                                    setTimeout('var caller=dijit.byId(\''+this.id+'\');' +
                                               'caller.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_FOLDER, {parent: caller.parent, folder:caller.item});', 3);
//                                    this.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_FOLDER, {parent: this.parent, folder:this.item});
                                }
                            }
                        );
                    }
                }, this);

                dojo.forEach(documents, function(document){
                    entries.push(
                        {
                            label: document.name,
                            item: document,
                            from: this,
                            onCommand: this.onCommand,
                            icon: versa.api.Document.getIconUrl(document.binary_content_type, 32),
                            clickable: true,
                            onClick: function(){
                                this.select(true);
                                setTimeout('var caller=dijit.byId(\''+this.id+'\');' +
                                           'caller.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_DOCUMENT_PROPERTIES, {from: caller.from, reference:caller.item});', 3);
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

                this.header=new versa.widget.mobile.Heading({
                    label: this.folder.name,
                    from: this,
                    moveTo: this.back,
                    onCommand: this.onCommand
                });

                this.footer=new versa.widget.mobile.Footing({
                    showRoot: !this.folder.isRoot(),
                    onCommand: this.onCommand,
                    from: this
                });

                this.etedlMain=new dojox.mobile.EdgeToEdgeDataList({
                    store: store,
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

