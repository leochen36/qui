/**
 * Created by app on 15-2-7.
 */
(function (Q) {
    var REG_VAR = /\$\{\s*[\w_\.-]*\s*\}/g;
    var template = '<div class="qui ${type}">' +
        '<div class="qui-p-wrap  ${dialog}">' +
        '<a href="javascript:" class="qui-p-close qui-icon">x</a>' +
        '<div class="qui-p-head">${title} </div>' +
        '<div class="qui-p-body"><i class="qui-icon qui-icon-${dialogType} qui-icon-sprite"></i><div class="qui-msg-content">${msg}</div> </div>' +
        '<div class="qui-p-foot"><c class="qui-btn qui-btn-cancel" style="display:none;">取消</c><c class="qui-btn qui-btn-ok">确定</c></div>' +
        '</div>' +
        '</div>';

    var g_param = {
        shadeClose: true
    };
    var g_dialog_type = {
        ok: "ok",
        info: "info",
        confirm: "confirm"
    };
    var g_css_keys = "width height";
    var g_dialog;

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
                    var qme = Q(this);
                    var qui = Q(this).closest(".qui");
                    if (qui.hasClass("qui-alert") ||
                        qui.hasClass("qui-confirm")) {
                        var bool = qme.hasClass("qui-btn-ok");
                        Q.execCatch(function () {
                            qui[0].__quidialog && qui[0].__quidialog(bool);
                        });
                    }
                    Q(this).closest(".qui").remove();
                    Q(".qui-bg").remove();
                }
            });
            Q(".qui-bg").live({
                click: function (e) {
                    Q(this).remove();
                    g_dialog && g_dialog.remove();
                }
            });
        });
    }

    Q.extend(UI.prototype, {
        DIALOG_TYPE: g_dialog_type,
        msg: function (msg) {
            var me = this;
            Q(".qui-msg").remove();
            g_dialog = makeDialog({
                msg: msg,
                type: 'qui-msg',
                dialogType: me.DIALOG_TYPE.info
            });
            return g_dialog;
        },
        alert: function (msg, callback) {
            var me = this;
            Q(".qui-alert").remove();
            addBG();
            g_dialog = makeDialog({
                msg: msg,
                type: 'qui-alert',
                dialogType: me.DIALOG_TYPE.info
            });
            return g_dialog;
        },
        confirm: function (msg, callback) {
            var me = this;
            Q(".qui-confirm").remove();
            addBG();
            g_dialog = makeDialog({
                msg: msg,
                type: 'qui-confirm',
                dialogType: me.DIALOG_TYPE.confirm,
                callback: callback
            });
            g_dialog.find(".qui-btn-cancel").css("display", "inline-block");
            return g_dialog;
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
        Q(".qui-bg").remove();
        Q('body').append('<div class="qui-bg"></div>');
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
        param.dialog = "qui-dialog";
        var html = replaceVar(template, param);
        var qdom = Q(html);
        style = Q.cssPrefix(style);
        qdom.css(style);
        Q('body').append(qdom);
        qdom.css({
            left: (window.innerWidth - qdom.width()) / 2 + "px",
            top: (window.innerHeight - qdom.height()) / 2 + "px"
        });
        qdom[0].__quidialog = param.callback;
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