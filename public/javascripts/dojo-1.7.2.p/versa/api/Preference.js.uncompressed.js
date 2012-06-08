//>>built
/**
 * @author mattk
 */
define("versa/api/Preference", ["dojo/_base/declare",
        "versa/api/_Object",
        "dojo/data/ItemFileReadStore"],
    function(declare){
        var o=declare("versa.api.Preference", [versa.api._Object], {
            constructor: function(/* Object */args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            }
        });

        o.dateEntryFormats = {_date: 1, _time: 2, _datetime: 3};

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string'
                },
                'value': {
                    type: 'string'
                },
                'created_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'created_by': {
                    type: 'string',
                    'default': ''
                },
                'updated_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'updated_by': {
                    type: 'string',
                    'default': ''
                }
            }
        };

        return o;
    }
);



