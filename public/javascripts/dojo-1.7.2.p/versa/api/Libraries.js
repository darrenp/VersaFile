//>>built
define("versa/api/Libraries",["dojo/_base/declare","versa/api/_Collection","versa/api/Library"],function(_1){var o=_1("versa.api.Libraries",[versa.api._Collection],{zone:null,constructor:function(_2){this.zone=_2.zone;this.target=dojo.replace(versa.api.Libraries.TRGT,this.zone);this.schema=versa.api.Library.schema;this.cache=true;this._initialize();}});o.TRGT="/zones/{subdomain}/libraries";return o;});