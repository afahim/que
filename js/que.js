window.onload = function() {

    $(".list-group-item").click(function() {
        $(".list-group-item").removeClass("active");
        $(".panel-body").slideUp();
        $(this).addClass("active");
        $(this).next().slideDown(400);
    });

    $(".glyphicon-ok").click(function() {
       $(this).css("color", "#00D700");
    });
}