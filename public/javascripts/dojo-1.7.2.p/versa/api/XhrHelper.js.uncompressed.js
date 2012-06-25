//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 07/09/11
 * Time: 5:06 PM
 * To change this template use File | Settings | File Templates.
 */

/**
 * Class to wrap DOJO AJAX calls
 * @classDecription Class to wrap DOJO AJAX calls, specifically handling success/error conditions
 * @author ScottH
 * @version 1.1
 * @since 1.0
 */
define("versa/api/XhrHelper", ["dojo/_base/declare",
        "dojox/json/ref",
        "versa/api/Error"],
    function(declare){
        var o=declare("versa.api.XhrHelper", [], {});

        o._doXhrAction = function(xhrFn, args){
            var rsp = null;
            var err =  null;

            function _onComplete(response, ioArgs){
                rsp = response;
            }
            function _onError(response, ioArgs){
                err = new versa.api.Error(response.responseText, response);
            }

            args.contentType = 'application/json';
            args.handleAs = 'json';
            args.sync = true;
            args.load = _onComplete;
            args.error = _onError;

            xhrFn(args);

            if (err != null)
                throw err; //new Error(err.message);

            return rsp;
        };

        /**
         * Performs a XHR GET AJAX call
         * @param {Object} args Consisting of:
         *     target {String}: the URL to request data from
         *     getData {Object}:  data to be passed to server
         * @return {Object} response from server
         * @author ScottH
         * @version 1.1
         * @since 1.0
         * @memberOf versa.api.XhrHelper (Static)
         */
        o.doGetAction = function(args){

            var getDataJson = (args.getData) ? dojo.toJson(args.getData) : null;

            var xhrArgs = {
                url: args.target,
                content: getDataJson
            };

            return versa.api.XhrHelper._doXhrAction(dojo.xhrGet, xhrArgs);

        };

        o.doPostAction = function(args){

            var postData = args.postData;
            var postDataJson = dojo.toJson(postData);

            var xhrArgs = {
                url: args.target,
                postData: postDataJson
            };

            return versa.api.XhrHelper._doXhrAction(dojo.xhrPost, xhrArgs);
        };

        o.doPutAction = function(args){

            var putData = args.putData;
            var putDataJson = dojo.toJson(putData);

            var xhrArgs = {
                url: args.target,
                putData: putDataJson
            }

            return versa.api.XhrHelper._doXhrAction(dojo.xhrPut, xhrArgs);

        };

        o.authenticity_token = null;
        o.originalXhr = dojo.xhr;
        dojo.xhr = function(httpVerb, xhrArgs, hasHTTPBody){

            if(versa.api.XhrHelper.authenticity_token !=  null){
                if(httpVerb.toUpperCase() == 'POST'){
                    var postData = (xhrArgs.postData) ? dojo.fromJson(xhrArgs.postData) : {};
                    postData['authenticity_token'] = versa.api.XhrHelper.authenticity_token;
                    xhrArgs.postData = dojo.toJson(postData);
                }
                if(httpVerb.toUpperCase() == 'PUT'){
                    var putData = (xhrArgs.putData) ? dojo.fromJson(xhrArgs.putData) : {};
                    putData['authenticity_token'] = versa.api.XhrHelper.authenticity_token;
                    xhrArgs.putData = dojo.toJson(putData);
                }
                if(httpVerb.toUpperCase() == 'DELETE'){
                    xhrArgs.rawBody = dojo.toJson({ authenticity_token: versa.api.XhrHelper.authenticity_token});
                }
            }

            //fix for Opera: doesn't allow 'Range' to be set for xhr.setRequestHeader: crazy?
            if((xhrArgs.headers) && xhrArgs.headers.hasOwnProperty('Range')){
                xhrArgs.headers['dojo-Range'] = xhrArgs.headers['Range'];
            }

            return versa.api.XhrHelper.originalXhr(httpVerb, xhrArgs, hasHTTPBody);
        };

        return o;
    }
);

