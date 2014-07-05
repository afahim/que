var queRef = null;
var rootRef = null;

function enqueue() {
    var dateObj = new Date();
    var newTime = dateObj.getTime();

    var newName = document.getElementById('name').value;
    var newNumber = document.getElementById('number').value;

    var newPushRef = queRef.push({name: newName,
        number: parseInt(newNumber),
        created_at: parseInt(newTime),
        completed: false
    });
}


function sync() {
    queRef.on('child_added', function(snapshot, prevChildName) {
        var queID = snapshot.name();
        var queItem = snapshot.val();
        displayItem(queID, queItem.name, queItem.number,
            prevChildName, queItem.completed
        );
    });

    queRef.on('child_changed', function(snapshot, prevChildName) {
        var queID = snapshot.name();
        var queItem = snapshot.val();
        updateItem(queID, queItem.number, prevChildName, queItem.completed
        );
    });
}

function updateItem(objectID, number, prevChildName, completed) {
    var updatedItem = $("#" + objectID);

    //if completed
    if (completed) {
        updatedItem.children(".glyphicon").addClass("completed");

        var badge = updatedItem.children(".badge");

        badge.removeClass("onqueue");

        badge.html("<span class=\"glyphicon glyphicon-remove\"></span>");
        badge.addClass("removable");
        badge.click(removeHandler);
    }


    //if position changed

    updatedItem.next().text(number);

    renumerate();        
}


window.onload = function() {
    rootRef = new Firebase('https://qu.firebaseIO.com/');
    queRef = rootRef.child('clients').child('woqod').child('que');

    sync();

    $(".list-group-item").click(queueItemHandler);

    $(".glyphicon-ok").click(completedHandler);

    $(".glyphicon-plus").click(function() {
        if ($(this).hasClass('rotated')){
            $(".btn").hide();
            $("#enqueue-panel").slideUp(400, function(){
                $(".glyphicon-plus").removeClass('rotated');
            });
        } else {
            $("#enqueue-panel").slideDown(400, function(){
                $(".btn").show();
                $(".glyphicon-plus").addClass('rotated');
            });
        }
    });

    $(".btn").click(enqueue);
}

function removeHandler(){
    $(this).parent().next(".panel-body").remove();
    $(this).parent().slideUp(300);
}

function queueItemHandler(e) {
        e.preventDefault();
        if (!$(this).hasClass('active')) {
            $(".list-group-item").removeClass("active");
            $(".panel-body").slideUp();
            $(this).addClass("active");
            $(this).next(".panel-body").slideDown(300);            
        } else {
            $(this).removeClass("active");
            $(this).next(".panel-body").slideUp(300);            
        }
}

function completedHandler(e) {
        $(this).addClass("completed");

        var badge = $(this).next(".badge");

        badge.removeClass("onqueue");
        renumerate();

        badge.html("<span class=\"glyphicon glyphicon-remove\"></span>");
        badge.addClass("removable");
        badge.click(removeHandler);
}

function renumerate() {
    $(".onqueue").each(function(index, node) {
        $(this).text(index + 1);
    });
}

function displayItem(objectID, name, number, prevChildName, completed) {

    $(".glyphicon-plus").removeClass('rotated');
    $("#enqueue-panel").slideUp(400);


    var node=document.createElement("a");
    node.href = "#";
    node.className = "list-group-item";
    node.id = objectID;

    var icon=document.createElement("span");

    if (completed) {
        icon.className = "glyphicon glyphicon-ok completed"
    } else {
        icon.className = "glyphicon glyphicon-ok"        
        $(icon).click(completedHandler);
    }

    node.appendChild(icon);

    var textnode = document.createTextNode(name);
    node.appendChild(textnode);

    var badge = document.createElement("span");

    if (completed) {
        badge.className = "badge removable"

        var removeIcon = document.createElement("span");
        removeIcon.className = "glyphicon glyphicon-remove";

        badge.appendChild(removeIcon);
        $(badge).click(removeHandler);

    } else {
        badge.className = "badge onqueue"
    }

    node.appendChild(badge);

    $(node).click(queueItemHandler);

    var numNode = document.createElement("div");
    numNode.className = "panel-body";

    var textnode = document.createTextNode(number);
    numNode.appendChild(textnode);

    console.log("prevChildName " + prevChildName);
    if (prevChildName == null) {
        $(".list-group").prepend(node);

        node.parentNode.insertBefore(numNode, node.nextSibling);
    } else {
        referenceNode = document.getElementById(prevChildName);
        referenceNode.parentNode.insertBefore(node, referenceNode.nextSibling.nextSibling);
        node.parentNode.insertBefore(numNode, node.nextSibling);
    }
    
    renumerate();
}