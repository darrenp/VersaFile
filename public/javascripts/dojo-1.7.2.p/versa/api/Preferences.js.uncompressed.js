//>>built
/**
 * @author mattk
 */
define("versa/api/Preferences", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Preference",
        "dojo/data/ItemFileReadStore"],
    function(declare){
        var o=declare("versa.api.Preferences", [versa.api._Collection], {
            constructor: function(/* Object */args){
                this.zone = args.zone;
                this.library=args.library;
                this.target = dojo.replace(versa.api.Preferences.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.Preference.schema;
                this.cache = true;

                this._dateEntryFormats = new dojo.data.ItemFileReadStore({
                    data: {
                        'identifier': 'id',
                        'label': 'name',
                        'items': [
                            {id: versa.api.Preference.dateEntryFormats._date, name: "Date only"},
                            {id: versa.api.Preference.dateEntryFormats._time, name: "Time only"},
                            {id: versa.api.Preference.dateEntryFormats._datetime, name: "Date and Time"}
                        ]
                    },
                    clearOnClose: true
                });

                this._initialize();
            },

            getDateEntryFormat: function(){
                var item = this.store.fetch({query: {name:"Date entry format"}}).results[0];
                return (item) ? parseInt(this.getValue(item, 'value')) : 1;
            }
        });

        o.TRGT='/zones{0}/libraries/${1}/preferences'

        return o;
    }
);

