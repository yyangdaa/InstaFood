const functions = require("firebase-functions/v2");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const admin = require("firebase-admin");

exports.unfollow = functions.https.onCall(async (request) => {

    const otherUserID = request.data.otherUserID;
    const userOwnID = request.data.userOwnID;

    if (otherUserID === undefined) {
        return { result: "No otherUserID provided!!" };
    }

    if (userOwnID === undefined) {
        return { result: "No userOwnID provided!!" };
    }

    const otherSnapshot = await db.collection('backend_userID_UID').doc(otherUserID).get();
    const otherUID = otherSnapshot.data().UID;

    const userOwnSnapshot = await db.collection('backend_userID_UID').doc(userOwnID).get();
    const userOwnUID = userOwnSnapshot.data().UID;

    await db.collection('users').doc(otherUID).update(
        {
            followers: admin.firestore.FieldValue.arrayRemove(userOwnID),
        }
    );

    await db.collection('users').doc(userOwnUID).update(
        {
            following: admin.firestore.FieldValue.arrayRemove(otherUserID),
        }
    );

    return { result: "Unfollowed!!" };

});