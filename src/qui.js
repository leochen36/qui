/**
 * Created by app on 15-2-7.
 */
(function (Q) {
    var REG_VAR = /\$\{\s*[\w_\.-]*\s*\}/g;
    var templateDialog = '<div class="qui qui-pop ${type}">' +
        '<div class="qui-pop-wrap  ${dialog}">' +
        '<a href="javascript:" class="qui-close qui-no">x</a>' +
        '<div class="qui-pop-head qui-no">${title} </div>' +
        '<div class="qui-pop-body"><i class="qui-icon qui-icon-${dialogType} qui-icon-sprite"></i><div class="qui-msg-content">${msg}</div> </div>' +
        '<div class="qui-pop-foot"><c class="qui-btn qui-btn-cancel" style="display:none;">取消</c><c class="qui-btn qui-btn-ok">确定</c></div>' +
        '</div>' +
        '</div>';
    var templateView = '<div class="qui qui-pop qui-view" style="visibility: hidden">' +
        '<div class="qui-pop-head qui-no">${title} </div>' +
        '<a href="javascript:" class="qui-close qui-clr-white qui-no">x</a>' +
        '<div class="qui-pop-wrap ${moveBottom}">' +
        '<div class="qui-pop-body"><iframe src="${url}" width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"/></div>' +
        '</div>' +
        '</div>';
    var g_param = {
        shadeClose: true
    };
    var g_dialog_type = {
        ok: "ok",
        confirm: "confirm",
        tip: "tip",
        alert: "alert"
    };
    var g_css_keys = "width height";
    var g_dialog;

    /** */
    function UI() {
        Q(function () {
            Q(".qui .qui-close").live({
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
                    Q(this).closest(".qui-pop").remove();
                    Q(".qui-bg").remove();
                }
            });
            Q(".qui-bg").live({
                click: function (e) {
                    Q(this).remove();
                    g_dialog && g_dialog.remove();
                }
            });
            Q(window).on({
                keydown: function (e) {
                    //console.log(e);
                },
                touchmove: function (e) {
                    //console.log("move");
                }
            });
        });
    }

    Q.extend(UI.prototype, {
        DIALOG_TYPE: g_dialog_type,
        alert: function (msg, callback) {
            var me = this;
            Q(".qui-alert").remove();
            addBG();
            g_dialog = makeDialog({
                msg: msg,
                type: 'qui-alert',
                dialogType: me.DIALOG_TYPE.alert
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
        tip: function (msg, param) {
            var me = this;
            param = param || {};
            Q(".qui-msg").remove();
            g_dialog = makeDialog({
                msg: msg,
                type: 'qui-tip',
                dialogType: param.dialogType || me.DIALOG_TYPE.tip
            });
            return g_dialog;
        },
        loading: function (time, param) {
            Q(".qui-load").remove();
            var qload = Q('<div class="qui qui-loading"></div>');
            Q("body").append(qload);
            return qload;
        },
        popView: function (param) {//弹出iframe
            Q(".qui-alert").remove();

            var newParam = Q.extend({}, g_param, param);
            if (newParam.shadeClose) {
                addBG();
            }
            makeView(newParam);
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
        param.type = param.type + " qui-pop";
        param.dialog = "qui-dialog";
        var html = replaceVar(templateDialog, param);
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

    function makeView(param) {
        var html = replaceVar(templateView, param);
        var qdom = Q(html);
        qdom.find("iframe").on({
            load: function (e) {
                var qbody = Q(this.contentWindow.document.body);
                var width = qbody.width();
                var height = Math.min(window.innerHeight - 100, qbody.height());
                var top = 0;
                if (param.title) {
                    top = qdom.find(".qui-pop-head").height();
                }
                qdom.find(".qui-pop-wrap").css({
                    width: width,
                    height: height,
                    top: top
                });
                Q(this).css({
                    height: qbody.height() + qdom.find(".qui-pop-head").height()
                });
                qdom.css({
                    top: (window.innerHeight - height) / 3,
                    left: (window.innerWidth - width) / 2,
                    visibility: "visible"
                });
                Q(this.contentWindow).on({
                    resize: function () {
                        Q(this).css({
                            height: qbody.height() + qdom.find(".qui-pop-head").height()
                        });
                    }
                });
                scroll(qdom);
            }
        });

        g_dialog = qdom;
        Q('body').append(qdom);
        Q.delay(function () {
            qdom.css({
                visibility: "visible"
            });
        }, 1000);
        makeEventScroll(qdom);
        makeEventDrag(qdom);
        return qdom;
    }

    function makeEventScroll(qdom) {
        qdom.on({
            mousewheel: function (e) {
                var wheelDelta = e.wheelDelta;
                var qblock = qdom.find(".qui-scroll .qui-scroll-block");
                var qbody = qdom.find(".qui-pop-body");

                var countHeight = qdom.find(".qui-scroll").height();
                var countHeightBody = qbody.height() + qdom.find(".qui-pop-head").height() * 2;

                var _topBody = parseFloat(qbody.css("top")) || 0;
                var _top = parseFloat(qblock.css("top")) || 0;

                Q.log("body top:", _topBody);

                _top = _top - wheelDelta * 2;
                _topBody = _topBody - wheelDelta * 2;
                var maxTop = countHeight - qblock.height();
                var maxTopBody = countHeightBody - qdom.height();
                var minTop = 0;
                var minTopBody = 0;

                if (wheelDelta < 0) {
                    _top = Math.min(_top, maxTop);
                    _topBody = Math.max(minTopBody, _topBody);
                } else {
                    _top = Math.max(minTop, _top);
                    _topBody = Math.min(_topBody, maxTopBody);
                }
                console.log("topbody:", _topBody, " top:", _top);
                qblock.css({
                    top: _top
                });
                qbody.css({
                    "top": -_topBody
                });
                e.stopPropagation();
                e.preventDefault();
            }
        });
    }

    /** 手动窗口 */
    function makeEventDrag(qdom) {

        var isLa = false;
        var site = {};

        function start(e) {
            end(e);
            Q(window).on({
                mousemove: move,
                mouseup: end
            });
            qdom.find(".qui-pop-head").on({
                mouseup: end
            });
            isLa = true;
            site = {
                x: e.clientX,
                y: e.clientY
            };
            qdom.find(".qui-pop-wrap").append('<div class="qui-mask-abs"></div>');

        }

        function end(e) {
            isLa = false;
            qdom.find(".qui-mask-abs").remove();
            Q(window).off("mousemove", move).off("mouseup", end);
            qdom.find(".qui-pop-head").off("mousemove", move).off("mouseup", end)
        }

        function move(e) {
            if (isLa) {
                var diff = {
                    x: e.clientX - site.x,
                    y: e.clientY - site.y
                };
                var moveX = (parseFloat(qdom.css("left")) || 0) + diff.x;
                var moveY = (parseFloat(qdom.css("top")) || 0) + diff.y;
                if (moveY < 10) {
                    moveY = 0;
                }
                if (moveY > window.innerHeight - qdom.height() - 10) {
                    moveY = window.innerHeight - qdom.height();
                }
                if (moveX < 10) {
                    moveX = 0;
                }
                if (moveX > window.innerWidth - qdom.width() - 10) {
                    moveX = window.innerWidth - qdom.width();
                }
                qdom.css({
                    left: moveX,
                    top: moveY
                });
                site = {
                    x: e.clientX,
                    y: e.clientY
                };
                e.preventDefault();
            }
        }

        qdom.find(".qui-pop-head").off("mousedown", start).on({
            mousedown: start
        });
    }

    /**  */

    Q.fn.tip = function (msg, param) {
        var qtip = Q.ui.tip(msg, param);
    }
    Q.fn.loading = function () {
        var me = this, qme = Q(me);
        var qtip = Q.ui.loading();
        var site = qme.position();
        var width = 20;
        var height = 20;
        qme.parent().children(".qui-loading").remove();
        qme.parent().append(qtip);

        var style = {
            position: "relative",
            top: site.top - qme.height(),
            left: site.left,
            backgroundSize: width + "px " + height + "px",
            width: qme.width(),
            height: qme.height(),
            backgroundColor: "rgba(9,9,9,0.4)",
            "border-radius": qme.css("border-radius")
        }
        qtip.css(style);

    }
    function getScrollRatio(qdom) {
        return qdom.height() / qdom.find(".qui-pop-body").height();
    }

    function scroll(qdom) {
        qdom.find(".qui-pop-wrap").append('<div class="qui-scroll"><div class="qui-scroll-block"></div></div>');
        var scrollHeight = qdom.height() - qdom.find(".qui-pop-head").height() - 10;
        var block = scrollHeight * getScrollRatio(qdom);
        qdom.find(".qui-scroll").css({
            height: scrollHeight
        });
        qdom.find(".qui-scroll-block").css({
            height: block
        });
    }

    Q.ui = new UI();
    Q.define("lib/qmik/qui", function (require, exports, module) {
        module.exports = Q.ui;
    });
})(Qmik);