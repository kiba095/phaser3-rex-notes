import Delay from '../../utils/promise/Delay.js';

var Join = function (userID, userName) {
    if (userID === undefined) {
        userID = this.userID;
        userName = this.userName;
    }

    if (this.contains(userID)) {
        return Promise.resolve();  // Promise
    }

    // Prepare data
    var self = this;
    var d = {
        userID: userID,
        userName: userName
    };
    var rootRef = this.database.ref(this.rootPath);
    var userRef = rootRef.push();

    userRef.onDisconnect().remove();
    // Go promise
    if (this.maxUsers === 0) { // Unlimit user list
        return userRef.set(d);

    } else { // Limited user list
        return userRef.set(d)
            .then(function () {
                return Delay(0);
            })
            .then(function () {
                return rootRef.limitToFirst(self.maxUsers).once('value');
            })
            .then(function (snapshot) {
                if (Contains(snapshot, userID)) {
                    return Promise.resolve();
                }
                // UserID is not in firstN list
                userRef.remove()
                    .then(function () {
                        userRef.onDisconnect().cancel();
                    });
                return Promise.reject();
            });
    }
};

var Contains = function (snapshot, userID) {
    var result = false;
    snapshot.forEach(function (childSnapshot) {
        var user = childSnapshot.val();
        if (user.userID === userID) {
            result = true;
            return true;
        }
    });
    return result;
}

export default Join;