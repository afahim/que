window.onload = function() {
    $(".list-group-item").click(function() {
        if (!$(this).hasClass('active')) {
            $(".list-group-item").removeClass("active");
            $(".panel-body").slideUp();
            $(this).addClass("active");
            $(this).next().slideDown(400);            
        } else {
            $(this).removeClass("active");
            $(this).next().slideUp(400);            
        }
    });

    $(".glyphicon-ok").click(function() {
       $(this).css("color", "#00D700");
    });

    $(".glyphicon-plus").click(function() {
        if ($(this).hasClass('rotated')){
            $(this).removeClass('rotated');
            $("#enqueue-panel").slideUp(400);
        } else {
            $(this).addClass('rotated');
            $("#enqueue-panel").slideDown(400);
        }
    });

    $(".btn").click(function() {
        var name = $("#name").text();
        var number = $("#number").text();

        $(".glyphicon-plus").removeClass('rotated');
        $("#enqueue-panel").slideUp(400);

    });

}