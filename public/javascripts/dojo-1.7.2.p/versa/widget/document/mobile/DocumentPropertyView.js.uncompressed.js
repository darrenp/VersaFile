//>>built
/**
 * Created by JetBrains RubyMine.
 * User: aaron
 * Date: 30/05/12
 * Time: 5:09 PM
 * To change this template use File | Settings | File Templates.
 */
require(["dojo/_base/declare",
         "dijit/_WidgetBase",
         "dojox/mobile/Heading",
         "dojox/mobile/ScrollableView",
         "dojox/mobile/EdgeToEdgeDataList",
         "dojox/mobile/ToolBarButton",
         "versa/api/Folders",
         "versa/api/Documents",
         "versa/api/Zones",
         "dojo/data/ItemFileWriteStore",
         "dojo/date/locale"],
    function(declare){
        declare("versa.widget.document.mobile.DocumentPropertyView", [dijit._WidgetBase, dojox.mobile.ScrollableView], {
            document: null,
            reference: null,
            library: null,

            folders: null,
            references: null,
            documents: null,
            documentTypes: null,

            folderStore: null,
            refStore: null,
            docStore: null,
            docTypeStore: null,

            etedlMain: null,
            header: null,
            footer: null,

            constructor: function(args){
            },

            _setBackAttr: function(back){
                this.back=back;
                if(this.header){
                    this.header.set("back", back)
                }
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);

                this.folders=this.library.getFolders();
                this.references=this.library.getReferences();
                this.documents=this.library.getDocuments();
                this.documentTypes=this.library.getDocumentTypes();

                this.folderStore=this.folders.store;
                this.refStore=this.references.store;
                this.docStore=this.documents.store;
                this.docTypeStore=this.documentTypes.store;

                this.header=new versa.widget.mobile.Heading({
                    label: this.document.name,
                    from: this,
                    back: this.back,
                    onCommand: this.onCommand
                });

                this.footer=new versa.widget.mobile.Footing({
                    reference: this.reference,
                    onCommand: this.onCommand,
                    from: this
                });

                var entries=[];

                entries.push(
                    {
                        label: "Type",
                        rightText: this.document.document_type_name
                    }
                );

                entries.push(
                    {
                        label: "Version",
                        rightText: this.document.getFullVersion()
                    }
                );

                entries.push(
                    {
                        label: "Size",
                        rightText: versa.api.Utilities.readablizeBytes({bytes: this.document.binary_file_size})
                    }
                );

                entries.push(
                    {
                        label: "Checked Out By",
                        rightText: (this.document.getState(versa.api.Document.states.CHECKED_OUT) ? this.document.checked_out_by : '')
                    }
                );

                entries.push(
                    {
                        label: (this.document.isDeleted() ? 'Deletion Date' : 'Last Modified Date'),
                        rightText: versa.api.Formatter.formatDateTime(this.document.updated_at).toString()
                    }
                );

                this.documentType = this.documentTypes.fetchById({
                    id: this.document.document_type_id
                });

                dojo.forEach(this.documentType.property_mappings, function(propMapItem){
                    var idx = 0;

                    var propDef = this.library.getPropertyDefinitions().fetchById({
                        id: propMapItem.property_definition_id
                    });

                    if(!(propDef.is_system)){
                        var value = this.document[propDef.column_name];
                        value = versa.api.PropertyMapping.formatValue(propDef, value);

                        var entry={
                            label: propDef.name,
                            rightText: value
                        };

                        if(propDef.isTypeText()){
                            entry.rightText=entry.rightText.display_limit(10);
                            entry.clickable=true;
                            entry.property=propDef.column_name;
                            entry.document=this.document;
                            entry.onCommand=this.onCommand;
                            entry.onClick=function(){
                                this.select(true);
                                setTimeout('var caller=dijit.byId(\''+this.id+'\');' +
                                           'caller.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_TEXT, {document: caller.document, property: caller.property, label: caller.label});', 3);
                            }
                        }

                        entries.push(
                            entry
                        );
                    }
                }, this);

                var storeData = {
                    items: entries
                };

                var store = new dojo.data.ItemFileWriteStore({
                    data: storeData
                });

                this.etedlMain=new dojox.mobile.EdgeToEdgeDataList({
                    store: store
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

