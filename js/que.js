var queRef = null;
var rootRef = null;
var archiveRef = null;

function enqueueFire() {
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

function dequeueFire() {
    var thisID = this.parentNode.id;
    thisRef = queRef.child(thisID);

    var thisName;
    var thisNumber; 
    var thisMakeTime;
    var thisCompleted;

    thisRef.once('value', function(snapshot) {
        thisName = snapshot.val().name;
        thisNumber = snapshot.val().number;
        thisMakeTime = snapshot.val().created_at;
        thisCompleted = snapshot.val().completed;
    });

    var dateObj = new Date();
    var removeTime = dateObj.getTime();

    var newPushRef = archiveRef.push({
        name: thisName,
        number: thisNumber,
        created_at: thisMakeTime,
        completed: thisCompleted,
        removed_at: removeTime,
    });

    thisRef.remove();

}

function completedFire() {
    queRef.child(this.parentNode.id).child("completed")
        .set(true);
}

function syncFire() {
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

    queRef.on('child_removed', function(snapshot, prevChildName) {
        var queID = snapshot.name();
        var queItem = snapshot.val();

        removeItem(queID, queItem.name, queItem.number,
            queItem.created_at, queItem.completed
        );
    });
}

window.onload = function() {
    rootRef = new Firebase('https://qu.firebaseIO.com/');
    queRef = rootRef.child('clients').child('woqod').child('que');
    archiveRef = rootRef.child('clients').child('woqod').child('archive');

    syncFire();

    $(".list-group-item").click(queueItemHandler);

    $(".glyphicon-ok").click(completedFire);

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

    $(".btn").click(function(){
        enqueueFire();
        document.getElementById("name").value = "";
        document.getElementById("number").value = "";
    });
}

function removeItem(objectID){
    thisItem = $("#" + objectID);
    thisItem.next(".panel-body").remove();
    thisItem.slideUp(300);
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

function renumerate() {
    $(".onqueue").each(function(index, node) {
        $(this).text(index + 1);
    });
}

function displayItem(objectID, name, number, prevChildName, completed) {

    var node=document.createElement("a");
    node.href = "#";
    node.className = "list-group-item";
    node.id = objectID;

    var icon=document.createElement("span");

    if (completed) {
        icon.className = "glyphicon glyphicon-ok completed"
    } else {
        icon.className = "glyphicon glyphicon-ok"        
        $(icon).click(completedFire);
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
        $(badge).click(dequeueFire);

    } else {
        badge.className = "badge onqueue"
    }

    node.appendChild(badge);

    $(node).click(queueItemHandler);

    var numNode = document.createElement("div");
    numNode.className = "panel-body";

    var textnode = document.createTextNode(number);
    numNode.appendChild(textnode);

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

function updateItem(objectID, number, prevChildName, completed) {
    var updatedItem = $("#" + objectID);

    //if completed
    if (completed) {
        updatedItem.children(".glyphicon").addClass("completed");

        var badge = updatedItem.children(".badge");

        badge.removeClass("onqueue");

        badge.html("<span class=\"glyphicon glyphicon-remove\"></span>");
        badge.addClass("removable");
        badge.click(dequeueFire);
    }

    //if number changed
    updatedItem.next().text(number);
    renumerate();    
}