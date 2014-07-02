window.onload = function() {
    $(".list-group-item").click(queueItemHandler);

    $(".glyphicon-ok").click(glyphOKHandler);

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
        var name = document.getElementById('name').value;
        var number = document.getElementById('number').value;

        $(".glyphicon-plus").removeClass('rotated');
        $("#enqueue-panel").slideUp(400);

        var count = document.getElementsByClassName('list-group-item').length + 1;

        var node=document.createElement("a");
        node.href = "#";
        node.className = "list-group-item";

        var icon=document.createElement("span");
        icon.className = "glyphicon glyphicon-ok"
        node.appendChild(icon);

        $(icon).click(glyphOKHandler);

        var textnode=document.createTextNode(name);
        node.appendChild(textnode);

        var badge=document.createElement("span");
        badge.className = "badge"

        var badgeText = document.createTextNode(count);
        badge.appendChild(badgeText);

        node.appendChild(badge);

        $(node).click(queueItemHandler);

        document.getElementById("queue").appendChild(node);

        var numNode=document.createElement("div");
        numNode.className = "panel-body";

        var textnode=document.createTextNode(number);
        numNode.appendChild(textnode);

        document.getElementById("queue").appendChild(numNode);

        document.getElementById('name').value = "";
        document.getElementById('number').value = "";
    });

}

function queueItemHandler() {
        if (!$(this).hasClass('active')) {
            $(".list-group-item").removeClass("active");
            $(".panel-body").slideUp();
            $(this).addClass("active");
            $(this).next().slideDown(400);            
        } else {
            $(this).removeClass("active");
            $(this).next().slideUp(400);            
        }
}

function glyphOKHandler() {
        $(this).css("color", "#00D700");   
}