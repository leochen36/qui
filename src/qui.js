/**
 * Created by app on 15-2-7.
 */
(function (Q) {
    var REG_VAR = /\$\{\s*[\w_\.-]*\s*\}/g;
    var template = '<div class="qui ${type}">' +
        '<div class="qui-p-wrap  ${dialog}">' +
        '<a href="javascript:" class="qui-p-close qui-icon">x</a>' +
        '<div class="qui-p-head">${title} </div>' +
        '<div class="qui-p-body"><i class="qui-icon qui-icon-${dialogType} qui-icon-sprite"></i><div class="qui-msg">${msg}</div> </div>' +
        '<div class="qui-p-foot"><c class="qui-btn qui-btn-${dialogType}">确定</c> </div>' +
        '</div>' +
        '</div>';

    var g_param = {
        shadeClose: true
    };
    var g_dialog_type = {
        ok: "ok"
    };
    var g_css_keys = "width height";

    function UI() {
        Q(function () {
            Q(".qui .qui-p-close").live({
                click: function (e) {
                    Q(this).closest(".qui").remove();
                    Q(".qui-bg").remove();
                }
            });
            Q(".qui .qui-btn").live({
                click: function (e) {
                    Q(this).closest(".qui").remove();
                    Q(".qui-bg").remove();
                }
            });
        });
    }

    Q.extend(UI.prototype, {
        DIALOG_TYPE: g_dialog_type,
        msg: function (msg) {

        },
        alert: function (msg, callback) {
            var me = this;
            Q(".qui-alert").remove();
            addBG();
            return makeDialog({
                msg: msg,
                type: 'qui-alert',
                dialogType: me.DIALOG_TYPE.ok
            });
        },
        confirm: function (msg, callback) {
            Q(".qui-alert").remove();
            addBG();
            make({
                msg: msg,
                type: 'qui-confirm'
            });
        },
        tip: function (dom, msg) {

        },
        loading: function (time, param) {

        },
        popView: function (param) {//弹出iframe
            Q(".qui-alert").remove();
            addBG();
            make(msg, {
                type: 'q-ui-pop-alert'
            });
        },
        popHtml: function (param) {//弹出html

        }
    });

    function addBG() {
        Q(".q-ui-bg").remove();
        Q('body').append('<div class="q-ui-bg"></div>');
    }

    function replaceVar(template, data) {
        return template.replace(REG_VAR, function (val) {
            var name = val.replace(/(^\$\{)|(\}$)/g, "").trim();
            return data[name] || "";
        });
    }

    function makeDialog(param) {
        var style = {};
        param.style = param.style || {};
        Q.each(g_css_keys.split(" "), function (i, key) {
            style[key] = param.style[key];
        });
        param.type = param.type + " qui-p";
        param.dialog="qui-dialog";
        var html = replaceVar(template, param);
        var qdom = Q(html);
        style = Q.cssPrefix(style);
        qdom.css(style);
        Q('body').append(qdom);
        return qdom;
    }

    function make(msg, param) {

        var html = replaceVar(template, param);
        var qdom = Q(html);
        Q('body').append(qdom);
        return qdom;
    }

    Q.ui = new UI();
})(Qmik);