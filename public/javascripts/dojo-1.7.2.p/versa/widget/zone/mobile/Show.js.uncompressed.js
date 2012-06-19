//>>built
/**
 * Created by JetBrains RubyMine.
 * User: aarons
 * Date: 23/05/12
 * Time: 9:32 AM
 * To change this template use File | Settings | File Templates.
 */


define("versa/widget/zone/mobile/Show", ["dojo/_base/declare",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dojox/mobile/Heading",
         "dojox/mobile/ScrollableView",
         "dojox/mobile/EdgeToEdgeDataList",
         "dojox/mobile/TabBar",
         "dojox/mobile/TabBarButton",
         "versa/api/Folders",
         "versa/api/Documents",
         "versa/api/Zones",
         "versa/widget/folder/mobile/FolderView",
         "versa/widget/document/mobile/DocumentPropertyView",
         "versa/widget/document/mobile/DocumentContentView",
         "versa/widget/document/mobile/LargeTextView",
         "versa/widget/search/mobile/SearchView",
         "versa/widget/search/mobile/SearchResultsView",
         "versa/widget/mobile/TextBox",
         "versa/widget/mobile/Heading",
         "versa/widget/mobile/Footing",
         "dojox/mobile/Button",
         "dojo/data/ItemFileWriteStore"],
    function(declare){
        var o=declare("versa.widget.zone.mobile.Show", [dijit._WidgetBase], {
            folderViews: [],
            documentViews: [],
            documentContentViews: [],
            textViews: [],

            constructor: function(args){
                this.zone=args.zone;
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);
                this.folderStore=this.activeLibrary.getFolders().store;
                this.refStore=this.activeLibrary.getReferences().store;
                this.rootFolder=this.folderStore.fetch({query:{parent_id: null}}).results[0];
                this.loadingView=dijit.byId('loadingView');
                this.onLoad(this);
            },

            onCommand: function(cmd, args){
                switch(cmd){
                    case versa.widget.zone.mobile.Show.COMMANDS.SHOW_FOLDER:
                        this.showFolder(args.parent, args.folder);
                    break;
                    case versa.widget.zone.mobile.Show.COMMANDS.SHOW_DOCUMENT_PROPERTIES:
                        this.showDocumentProperties(args.from, args.reference);
                    break;
                    case versa.widget.zone.mobile.Show.COMMANDS.SHOW_DOCUMENT_CONTENT:
                        this.showDocumentContent(args.document, args.reference);
                    break;
                    case versa.widget.zone.mobile.Show.COMMANDS.SHOW_TEXT:
                        this.showText(args.document, args.property, args.label);
                    break;
                    case versa.widget.zone.mobile.Show.COMMANDS.SHOW_ROOT:
                        this.showRoot(args.from);
                    break;
                    case versa.widget.zone.mobile.Show.COMMANDS.SHOW_SEARCH:
                        this.showSearch(args.from);
                    break;
                    case versa.widget.zone.mobile.Show.COMMANDS.PERFORM_SEARCH:
                        this.performSearch(args.search);
                    break;
                    case versa.widget.zone.mobile.Show.COMMANDS.LOGOFF:
                        this.logoff(args.from);
                    break;
                }
            },

            logoff: function(from){
                var doConfirm = true;

                if(doConfirm){
                    var msg = 'Continue to exit VersaFile?';
                    if(!confirm(msg))
                        return;
                }

                var prog=dojox.mobile.ProgressIndicator.getInstance();
                this.loadingView.domNode.appendChild(prog.domNode);
                prog.start();
                from.performTransition(this.loadingView.id, 1, "fade");

                this.zone.logoff();
                window.location.reload(true);
            },

            showRoot: function(from){
                from.performTransition("folder-"+this.rootFolder.id, -1, "slidev");
            },

            showSearch: function(from){
                this.searchView.set("back", from.id);
                from.performTransition("searchView", 1, "slidev");
            },

            performSearch: function(search){
                this.searchResultsView.set('search', search);
                this.searchView.performTransition("searchResultsView", 1, "slide");
            },

            showFolder: function(parent, folder){
                if(!this.folderViews[folder.id]){
                    this.folderViews[folder.id]=new versa.widget.folder.mobile.FolderView({
                        id: "folder-"+folder.id,
                        back: "folder-"+parent.id,
                        library: this.activeLibrary,
                        folder: folder,
                        onCommand: dojo.hitch(this, this.onCommand),
                        selected: true
                    }, dojo.create("div", {style: {height: "100%"}}, dojo.body()));
                    this.folderViews[folder.id].startup();
                }
                this.folderViews[parent.id].performTransition("folder-"+folder.id, 1, "slide");
            },

            showText: function(document, property, label){
                if(!this.textViews[document.id+"-"+property]){
                    this.textViews[document.id+"-"+property]=new versa.widget.document.mobile.LargeTextView({
                        id: "document-"+document.id+"-"+property,
                        back: "document-"+document.id,
                        label: label,
                        library: this.activeLibrary,
                        document: document,
                        property: property,
                        onCommand: dojo.hitch(this, this.onCommand),
                        selected: true
                    }, dojo.create("div", {style: {height: "100%"}}, dojo.body()));
                    this.textViews[document.id+"-"+property].startup();
                }
                this.documentViews[document.id].performTransition("document-"+document.id+"-"+property, 1, "slide");
            },

            showDocumentProperties: function(from, reference){

                this.activeLibrary.getDocuments().refreshAsync({
                    scope: this,
                    identity: reference.document_id,
                    onItem: dojo.hitch(this, function(document){
                        if(!this.documentViews[document.id]){
                            this.documentViews[document.id]=new versa.widget.document.mobile.DocumentPropertyView({
                                id: "document-"+document.id,
                                library: this.activeLibrary,
                                reference: reference,
                                document: document,
                                onCommand: dojo.hitch(this, this.onCommand),
                                selected: true
                            }, dojo.create("div", {style: {height: "100%"}}, dojo.body()));
                            this.documentViews[document.id].startup();
                        }
                        this.documentViews[document.id].set('back', from.id);
                        from.performTransition("document-"+document.id, 1, "slide");
                    }),
                    onError: this.__onDocumentLoadError
                });
            },

            showDocumentContent: function(document, reference){
                if(reference.binary_content_type.indexOf('image')>=0||reference.binary_content_type.indexOf('text')>=0){
                    if(!this.documentContentViews[reference.document_id]){
                        this.documentContentViews[reference.document_id]=new versa.widget.document.mobile.DocumentContentView({
                            id: "document-content-"+reference.document_id,
                            back: "document-"+reference.document_id,
                            zone: this.zone,
                            library: this.activeLibrary,
                            document: document,
                            reference: reference,
                            onCommand: dojo.hitch(this, this.onCommand),
                            selected: true
                        }, dojo.create("div", {style: {height: "100%"}}, dojo.body()));
                        this.documentContentViews[reference.document_id].startup();
                    }
                    this.documentViews[reference.document_id].performTransition("document-content-"+reference.document_id, 1, "slide");
                }else{

                    if(dojo.isIos&&reference.binary_content_type.indexOf('pdf')>=0){
                        var file=reference.getViewUrl(this.zone, this.activeLibrary);
                        this.downloadUrl(file);
                    }else{
                        var file=reference.getCopyUrl(this.zone, this.activeLibrary);
                        this.downloadUrl(file);
                    }
                }



            },

            downloadUrl: function(url)
            {
                window.location.href=url;
            },


            startup: function(){
                this.inherited('startup', arguments);

                this.searchView=new versa.widget.search.mobile.SearchView({
                    id: "searchView",
                    back: "folder-"+this.rootFolder.id,
                    onCommand: dojo.hitch(this, this.onCommand)
                }, dojo.create("div", {}, dojo.body()));
                this.searchView.startup();

                this.searchResultsView=new versa.widget.search.mobile.SearchResultsView({
                    id: "searchResultsView",
                    zone: this.zone,
                    library: this.activeLibrary,
                    back: "searchView",
                    view_id: this.rootFolder.view_definition_id,
                    onCommand: dojo.hitch(this, this.onCommand)
                }, dojo.create("div", {style: {height: "100%", width: "100%"}}, dojo.body()));
                this.searchResultsView.startup();

                this.folderViews[this.rootFolder.id]=new versa.widget.folder.mobile.FolderView({
                    id: "folder-"+this.rootFolder.id,
                    library: this.activeLibrary,
                    folder: this.rootFolder,
                    onCommand: dojo.hitch(this, this.onCommand),
                    selected: true
                }, dojo.create("div", {style: {height: "100%", width: "100%"}}, dojo.body()));
                this.folderViews[this.rootFolder.id].startup();

                dojox.mobile.hideAddressBar();

                this.loadingView.performTransition(this.folderViews[this.rootFolder.id].id, 1, "fade");

            }
        });

        o.COMMANDS={
            SHOW_FOLDER:                0x0000,
            SHOW_ROOT:                  0x0001,
            SHOW_DOCUMENT_PROPERTIES:   0x0002,
            SHOW_DOCUMENT_CONTENT:      0x0003,
            SHOW_TEXT:                  0x0004,
            SHOW_SEARCH:                0x0005,
            PERFORM_SEARCH:             0x0006,
            LOGOFF:                     0x0007
        };

        return o;
    }
);

