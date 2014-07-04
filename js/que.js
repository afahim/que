function populate() {
    var queItem = Parse.Object.extend("QueItem");
    var query = new Parse.Query(queItem);
    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + results.length + " items.");
        for (var i = 0; i < results.length; i++) { 
          var object = results[i];
          displayOnQue(object.get("name"), object.get("number"), object.get("que_position"));
        }
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
}

window.onload = function() {
    Parse.initialize("aOSEqkHWWIy0ngtzGjkYlAVRuujho3NZs6Aw2q9t", "H3i7PKGPBbnHMEwJN0QLM2mQh7Kqbfjqtb4GzoWz");

    populate();

    $(".list-group-item").click(queueItemHandler);

    $(".glyphicon-ok").click(glyphOKHandler);

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

function queueItemHandler() {
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

function glyphOKHandler() {
        $(this).css("color", "#00D700");

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

function enqueue() {
    var newName = document.getElementById('name').value;
    var newNumber = document.getElementById('number').value;
    var newCount = document.getElementsByClassName('onqueue').length + 1;
    
    var queItem = Parse.Object.extend("QueItem");
    var newQueItem = new queItem();
    newQueItem.set("name", newName);
    newQueItem.set("number", parseInt(newNumber));
    newQueItem.set("que_position", parseInt(newCount));

    newQueItem.save(null, {
      success: function(newQueItem) {
        document.getElementById('name').value = "";
        document.getElementById('number').value = "";
        displayOnQue(newName, newNumber, newCount)
      },
      newQueItem: function(newQueItem, error) {
        console.log("enqueue operation failed");
      }
    });
}

function displayOnQue(name, number, count) {

    $(".glyphicon-plus").removeClass('rotated');
    $("#enqueue-panel").slideUp(400);


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
    badge.className = "badge onqueue"

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
}