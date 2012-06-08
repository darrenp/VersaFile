//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 15/04/12
 * Time: 9:31 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Share", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/SharedItems"],
    function(declare){
        var o=declare("versa.api.Share", [versa.api._Object], {
            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            authorize: function(zone){
                var url = dojo.replace(versa.api.Share.AUTH_URL, [zone.id, this.fingerprint]);

                var postData = {
                    password: this.password
                };

                var results = versa.api.XhrHelper.doPostAction({
                    target: url,
                    postData: postData
                });

                return true;
            },

            getSharedItems: function(args){
                return new versa.api.SharedItems({zone: args.zone, share: this});
            }
        });

        o.AUTH_URL = '/zones/{0}/shares/{1}/authorize.json';

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


