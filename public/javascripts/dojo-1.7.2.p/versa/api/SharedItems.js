//>>built
define("versa/api/SharedItems",["dojo/_base/declare","versa/api/_Collection","versa/api/SharedItem"],function(_1){var o=_1("versa.api.SharedItems",[versa.api._Collection],{zone:null,share:null,constructor:function(_2){this.zone=_2.zone;this.share=_2.share;this.target=dojo.replace(versa.api.SharedItems.TRGT,[this.zone.subdomain,this.share.fingerprint]);this.schema=versa.api.SharedItem.schema;this.cache=true;this._initialize();}});o.TRGT="/zones/{0}/shares/{1}/shared_items";return o;});