//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 10/05/12
 * Time: 11:40 AM
 * To change this template use File | Settings | File Templates.
 */


define("versa/widget/dialog/_Base", ["dojo/_base/declare",
         "dijit/Dialog",
         "versa/widget/Button"],
    function(declare){
        var o=declare("versa.widget.dialog._Base", [dijit.Dialog], {
            _buttonPaneNode: null,
            _contentNode: null,
            _widgetNode: null,

            _initializeButtons: function(){

                if((this.buttons & versa.MessageBoxButtons.OK) == versa.MessageBoxButtons.OK){
                    this._activeButtons.OK = new bfree.widget.Button({
                        id: 'btnOk',
                        'class': 'versaButton',
                        label: 'OK',
                        onClick: dojo.hitch(this, this._onHide, versa.DialogResults.OK)
                    });
                    this._activeButtons.OK.placeAt(this._buttonPaneNode);
                }
                if((this.buttons & versa.MessageBoxButtons.Yes) == versa.MessageBoxButtons.Yes){
                    new bfree.widget.Button({
                        'class': 'versaButton',
                        label: 'Yes',
                        onClick: dojo.hitch(this, this._onHide, versa.DialogResults.Yes)
                    }).placeAt(this._buttonPaneNode);
                }
                if((this.buttons & versa.MessageBoxButtons.No) == versa.MessageBoxButtons.No){
                    new bfree.widget.Button({
                        'class': 'versaButton',
                        label: 'No',
                        onClick: dojo.hitch(this, this._onHide, versa.DialogResults.No)
                    }).placeAt(this._buttonPaneNode);
                }
                if((this.buttons & versa.MessageBoxButtons.Retry) == versa.MessageBoxButtons.Retry){
                    new bfree.widget.Button({
                        'class': 'versaButton',
                        label: 'Retry',
                        onClick: dojo.hitch(this, this._onHide, versa.DialogResults.Retry)
                    }).placeAt(this._buttonPaneNode);
                }
                if((this.buttons & versa.MessageBoxButtons.Cancel) == versa.MessageBoxButtons.Cancel){
                    new bfree.widget.Button({
                        'class': 'versaButton',
                        label: 'Cancel',
                        onClick: dojo.hitch(this, this._onHide, versa.DialogResults.Cancel)
                    }).placeAt(this._buttonPaneNode);
                }
                if((this.buttons & versa.MessageBoxButtons.Abort) == versa.MessageBoxButtons.Abort){
                    new bfree.widget.Button({
                        'class': 'versaButton',
                        label: 'Abort',
                        onClick: dojo.hitch(this, this._onHide, versa.DialogResults.Abort)
                    }).placeAt(this._buttonPaneNode);
                }
                if((this.buttons & versa.MessageBoxButtons.Ignore) == versa.MessageBoxButtons.Ignore){
                    new bfree.widget.Button({
                        'class': 'versaButton',
                        label: 'Ignore',
                        onClick: dojo.hitch(this, this._onHide, versa.DialogResults.Ignore)
                    }).placeAt(this._buttonPaneNode);
                }

            },

            constructor: function(args){

            },

            destroy: function(){
                this.destroyDescendants();
                this.inherited('destroy', arguments);
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);

                //Set title icon
                dojo.create('img', {
                    src: '/images/icons/16/logo.png',
                    style: { position:'absolute',left:'2px',top:'5px' }
                }, this.titleBar);

                dojo.style(this.titleNode, {marginLeft: '12px'});
                dojo.style(this.containerNode, {padding: '0'});

                //Create content 'wrapper' div
                this._contentNode = dojo.create('div');
                this._widgetNode = dojo.create('div', { }, this._contentNode);

                //Create button node and buttons
                this._buttonPaneNode = dojo.create(
                    'div',
                    {
                        'class': 'versaDialogButtonPane',
                        style: {height: '40px',padding:'10px 4px 0 0',textAlign:'right'}
                    },
                    this._contentNode
                );
                this._initializeButtons();



            },

            startup: function(){
                this.set('content', this._contentNode);
                this.inherited('startup', arguments);
            }
        });

        versa.DialogResults = {
            'None':     0x0000,
            'OK':       0x0001,
            'Cancel':   0x0002,
            'Abort':    0x0003,
            'Retry':    0x0004,
            'Ignore':   0x0005,
            'Yes':      0x0006,
            'No':       0x0007
        };

        versa.MessageBoxButtons = {
            'None':                 0x0000,
            'OK':                   0x0001,
            'Cancel':               0x0002,
            'OKCancel':             0x0003,
            'Abort':                0x0004,
            'Retry':                0x0008,
            'Ignore':               0x0010,
            'RetryCancel':          0x000A,
            'AbortRetryIgnore':     0x001C,
            'Yes':                  0x0020,
            'No':                   0x0040,
            'YesNo':                0x0060,
            'YesNoCancel':          0x0062
        };

        versa.MessageBoxIcons = {
            'None':         0x0000,
            'Question':     0x0001,
            'Exclamation':  0x0002,
            'Asterisk':     0x0003,
            'Stop':         0x0004,
            'Error':        0x0005,
            'Warning':      0x0006,
            'Information':  0x0007
        };
        return o;
    }
);
