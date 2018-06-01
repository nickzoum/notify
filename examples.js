var notifyList = [{
    Title: "Danger", Action: function () {
        Notify.notify(Notify.NotifyTypes.Danger, "Danger");
    }
}, {
    Title: "Warning", Action: function () {
        Notify.notify(Notify.NotifyTypes.Warning, "Warning");
    }
}, {
    Title: "Info", Action: function () {
        Notify.notify(Notify.NotifyTypes.Info, "Info");
    }
}, {
    Title: "Success", Action: function () {
        Notify.notify(Notify.NotifyTypes.Success, "Success");
    }
}, {
    Title: "Friend Request", Action: function () {
        Notify.showRequest(Notify.RequestTypes.FriendRequest, "Hello", "Some Person", getPrint("Notification Clicked"));
    }
}, {
    Title: "Game Request", Action: function () {
        Notify.showRequest(Notify.RequestTypes.GameRequest, "Hello", "Some Person", getPrint("Notification Clicked"));
    }
}, {
    Title: "Message", Action: function () {
        Notify.showRequest(Notify.RequestTypes.MessageRequest, "Hello", "Some Person", getPrint("Notification Clicked"));
    }
}, {
    Title: "AlertUser", Action: function () {
        Notify.alertUser("This is a title", "There are some options", [getPrint("Ok"), getPrint("Cancel")], ["Ok", "Cancel"]);
    }
}];

for (var index = 0; index < notifyList.length; index++) {
    var item = notifyList[index];
    var button = document.createElement("button");
    button.textContent = item.Title;
    button.addEventListener("click", item.Action);
    document.body.appendChild(button);
}


function getPrint(text) {
    return function () {
        console.log(text);
    };
}