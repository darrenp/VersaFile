//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 02/05/12
 * Time: 3:56 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/widget/dialog/MessageBox", ["dojo/_base/declare",
         "versa/widget/dialog/_Base"],
    function(declare){
        var o=declare("versa.widget.dialog.MessageBox", [versa.widget.dialog._Base], {
            _activeButtons: {},
            _buttonPaneNode: null,
            _closing: false,
            _contentNode: null,
            _dialogResult: versa.DialogResults.Cancel,
            _displayNode: null,

            buttons: versa.MessageBoxButtons.None,
            icon: versa.MessageBoxIcons.None,
            message: '',



            _initializeIcon: function(){

                if(this.icon == versa.MessageBoxIcons.None)
                    return;

                dojo.style(this._displayNode, {paddingLeft: '56px'});

                var icon = 'error';

                switch(this.icon){
                    case versa.MessageBoxIcons.Question:
                        icon = 'question';
                        break;
                    case versa.MessageBoxIcons.Exclamation:
                        icon = 'exclamation';
                        break;
                    case versa.MessageBoxIcons.Asterisk:
                        icon = 'asterisk';
                        break;
                    case versa.MessageBoxIcons.Stop:
                        icon = 'stop';
                        break;
                    case versa.MessageBoxIcons.Error:
                        icon = 'error';
                        break;
                    case versa.MessageBoxIcons.Warning:
                        icon = 'warning';
                        break;
                    case versa.MessageBoxIcons.Information:
                        icon = 'information';
                        break;
                }

                var imgSrc = dojo.replace('/images/icons/32/{0}.png', [icon]);
                dojo.create('img', {
                    src: imgSrc,
                    style: { position:'absolute',left:'16px',top:'18px' }
                }, this._displayNode);

            },

            _onHide: function(dialogResult){
                this._dialogResult = dialogResult;
                for(var b in this._activeButtons){
                    this._activeButtons[b].set('disabled', true);
                }
                this.hide();
            },

            constructor: function(){
            },

            destroy: function(){
                this.destroyDescendants();
                this.inherited('destroy', arguments);
            },

            hide: function(dialog){
                if(this._closing)
                    return;
                this._closing = true;
                this.inherited('hide', arguments);
            },

            onClose: function(dialogResult){
            },

            onHide: function(){
                setTimeout(versa.widget.dialog.MessageBox._closeFnRef(this), this.duration);
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);



                //console.log('one');

                //create div that contains both image and text
                this._displayNode = dojo.create(
                    'div',
                    {
                        style: {
                            display: 'table-cell',
                            maxWidth: '480px',
                            height: '48px',
                            minWidth: '164px',
                            padding: '16px 16px 16px 16px',
                            verticalAlign: 'middle'
                        }
                    },
                    this._widgetNode
                );

                this._initializeIcon();
            },

            startup: function(){
                this.inherited('startup', arguments);
            }
        });

        o._closeFnRef= function(that){
            return ( function(){
                that.onClose(that._dialogResult);
                that.destroy();
            });
        };

        return o;
    }
);





