//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 16/02/12
 * Time: 2:44 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/VersaFile", ["dojo/_base/declare",
         "versa/widget/dialog/MessageBox"],
    function(declare){
        var o = declare("versa.VersaFile", [], {});

        versa.alert = function(msg, onClose){
            var onCloseFn = (onClose) ? onClose: function() { };

            new versa.widget.dialog.MessageBox({
                id: 'versaAlert',
                title: 'VersaFile Message',
                message: msg,
                buttons: versa.MessageBoxButtons.OK,
                icon: versa.MessageBoxIcons.Warning,
                onClose: onCloseFn
            }).show();
        };

        versa.confirm = function(msg, onOk, onCancel){

            var onOkFn = (onOk) ? onOk: function() { };
            var onCancelFn = (onCancel) ? onCancel: function() { };

            var msgBox = new versa.widget.dialog.MessageBox({
                id: 'versaAlert',
                title: 'VersaFile Message',
                message: msg,
                buttons: versa.MessageBoxButtons.OKCancel,
                icon: versa.MessageBoxIcons.Question,
                onClose: function(dialogResult){
                    (dialogResult == versa.DialogResults.OK) ? onOkFn() : onCancelFn();
                }
            });

            setTimeout(versa.VersaFile._loadMsgBoxFnRef(msgBox), 1000);
        };

        o._loadMsgBoxFnRef = function(that){
            return ( function() {
               that.show();
            });
        };


        o.messages = {
            'TRIAL_REMAINING': 'You have <strong>{days_left}</strong> days remaining on your free trial.',
            'TRIAL_FINAL': '<strong>This is your final day remaining on your free trial.</strong>',
            'TRIAL_EXPIRED': '<strong>!!! YOUR TRIAL PERIOD HAS EXPIRED !!!</strong>',
            'ACTIVATE_LINK': 'Click <a href="http://www.versafile.com" class="dijitBoldLabel versaLink" target="_blank">here</a> to upgrade.'

        }
        return o;
    }
);

