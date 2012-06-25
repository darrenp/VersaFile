//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 16/04/12
 * Time: 12:06 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/SharedItem", ["dojo/_base/declare",
         "versa/api/_Object",
         "versa/api/Utilities"],
    function(declare){
        var o=declare("versa.api.SharedItem", [versa.api._Object], {
            zone: null,

            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));

            },

            copyLocal: function(args){
                var zone = args.zone;
                var share = args.share;
                var form = args.form;

                var url = dojo.replace(versa.api.SharedItem.CP_TRGT, [zone.subdomain, share.fingerprint, this.getId()]);

                form.set('action', url);
                form.set('target', '_self');
                form.set('method', 'post');
                form.submit();

            },

            view: function(args){
                var zone = args.zone;
                var share = args.share;
                var form = args.form;

                var url = dojo.replace(versa.api.SharedItem.VW_TRGT, [zone.subdomain, share.fingerprint, this.getId()]);

                versa.api.Utilities.viewUrl({
                    windowBox: args.windowBox,
                    url: url,
                    window_name: 'versa_viewer'
                });

        //        form.set('action', url);
        //        form.set('target', '_blank');
        //        form.set('method', 'post');
        //        form.submit();
            }
        });

        o.VW_TRGT = '/zones/{0}/shares/{1}/download/?item_id={2}&disposition=inline';
        o.CP_TRGT = '/zones/{0}/shares/{1}/download/?item_id={2}&disposition=attachment';

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                }
            },

            prototype: new o()
        };

        return o;
    }
);

