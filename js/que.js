window.onload = function() {
    $(".panel-body").hide();

    $(".list-group-item").click(function() {
        $(".list-group-item").removeClass("active");
        $(".panel-body").hide();
        $(this).addClass("active");
        $(this).next().slideDown(400);
    });
}