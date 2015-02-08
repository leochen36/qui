/**
 * Created by app on 15-2-7.
 */
define("demoTip", function(require){
    var Module = {
        init: function(scope){
            scope.clickTip = function(e){

                var router = $(e.target).attr("router");
                var paths = router.split("/");
                if(e.type == paths[0]){
                    $.ui[paths[1]]("卤素卤素卤素卤素卤素卤素卤素卤素<br/>卤素卤素卤素卤素卤素卤<br/>卤素卤素卤素卤素卤素卤素卤素");
                }
            }
        }
    };

    return Module
});