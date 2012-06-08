//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 08/09/11
 * Time: 12:00 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Version", ["dojo/_base/declare",
         "versa/api/_Object"],
    function(declare){
        var o=declare("versa.api.Version", [versa.api._Object], {
            zone: null,
            library: null,
            document: null,

            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            copyLocal: function(args){
                var zone = args.zone;
                var library = args.library;
                var document = args.document;

                var url = dojo.replace(versa.api.Version.CP_TRGT, [zone.subdomain, library.id, document.id, this.id]);
                versa.api.Utilities.saveUrl({
                    url: url,
                    window_name: 'versa_save'
                });

            },

            view: function(args){
                var zone = args.zone;
                var library = args.library;
                var document = args.document;

                var url = dojo.replace(versa.api.Version.VW_TRGT, [zone.subdomain, library.id, document.id, this.id]);

                versa.api.Utilities.viewUrl({
                    windowBox: args.windowBox,
                    url: url,
                    window_name: 'versa_viewer'
                });
            }
        });

        o.VW_TRGT = '/zones/{0}/libraries/{1}/documents/{2}/download/?disposition=inline&version_id={3}';
        o.CP_TRGT = '/zones/{0}/libraries/{1}/documents/{2}/download/?disposition=attachment&version_id={3}';


        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'binary_file_name': {
                    type: 'string',
                    'default': ''
                },
                'binary_content_type': {
                    type: 'string',
                    'default': ''
                }
            },
            prototype: new o()
        };

        return o;
    }
);

