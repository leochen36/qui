/**
 * Created by app on 15-2-7.
 */
define("demoTip", function (require) {
    var Module = {
        init: function (scope) {
            scope.clickTip = function (e) {
                var router = $(e.target).attr("router");
                var paths = router.split("/");
                if (e.type == paths[0]) {
                    var name = paths[1];

                    if(name=="popView"){
                        $.ui.popView({
                            url:"./subview.html",
                            html:'<div>343</div>',
                            shadeClose: true,
                            title:'填写信息'
                        })
                    }else{
                        $.ui[paths[1]]("卤素卤素卤素卤素卤素卤素卤素卤素<br/>卤素卤素卤素卤素卤素卤<br/>卤素卤素卤素卤素卤素卤素卤素");
                    }
                }
            }

        }
    };

    return Module
});