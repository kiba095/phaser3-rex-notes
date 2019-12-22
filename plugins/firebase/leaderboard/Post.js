import GetTime from './GetTime.js';
import { TimeTagKeys, ScoreKeys } from './Const.js';

var Post = function (score, extraData) {
    var newRecord = {
        userID: this.userInfo.userID
    };
    if (this.boardID) {
        newRecord.boardID = this.boardID;
    }
    if (this.userInfo.userName) {
        newRecord.userName = this.userInfo.userName;
    }
    var curTimeData = GetTime();
    if (this.timeFilters !== false) {
        for (var t in this.timeFilters) {
            if (!this.timeFilters[t]) {
                continue;
            }
            newRecord[TimeTagKeys[t]] = curTimeData[t];
            newRecord[ScoreKeys[t]] = score;
        }
    } else { // No time filters
        newRecord.score = score;
    }
    if (this.tag) {
        newRecord.tag = this.tag;
    }
    if (extraData) {
        Object.assign(newRecord, extraData);
    }
    var curTimeData = GetTime();
    var self = this;
    return this.getRecordQuery(this.boardID, this.tag, this.userInfo.userID, undefined).limit(1).get()
        .then(function (querySnapshot) {
            var prevRecord, docID;
            if (querySnapshot.size > 0) {
                var doc = querySnapshot.docs[0];
                prevRecord = doc.data();
                docID = doc.id;
            }

            if (prevRecord) {
                if (self.timeFilters !== false) {
                    for (var t in self.timeFilters) {
                        if (!self.timeFilters[t]) {
                            continue;
                        }

                        var timeTagKey = TimeTagKeys[t];
                        if (prevRecord[timeTagKey] === newRecord[timeTagKey]) {
                            var scoreKey = ScoreKeys[t];
                            newRecord[scoreKey] = Math.max(prevRecord[scoreKey], newRecord[scoreKey]);
                        }
                    }
                } else { // No time filters
                    newRecord.score = Math.max(prevRecord.score, newRecord.score);
                }
            }
            if (docID === undefined) {
                docID = self.rootRef.doc().id;
            }
            return self.rootRef.doc(docID)
                .set(newRecord);
        });
}

export default Post;