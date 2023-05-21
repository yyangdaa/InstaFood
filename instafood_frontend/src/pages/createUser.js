import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function CreateUser() {
    const [username, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [userID, setUserID] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

    const user = auth.currentUser;

    const navigate = useNavigate();

    const [userIDUnique, setUserIDUnique] = useState(false);

    const logicRef = doc(db, 'backend_logic', 'uXGhybdqAbR8zIDfaf7I');

    useEffect(() => {
        async function isUserIDUnique() {
            const logicSnapshot = await getDoc(logicRef);
            const logicData = logicSnapshot.data();
            const userIDs = logicData.userIDs;
            setUserIDUnique(!userIDs.includes(userID));
        }
        isUserIDUnique();
    }, [userID]);

    const handleSubmitUserInfo = async (e) => {
        e.preventDefault();

        const userDoc = {
            username: username,
            bio: bio,
            isPrivate: isPrivate,
            user_id: userID,
            followers: [],
            following: [],
            saved_posts: [],
            personal_posts: [],
        };

        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, userDoc);
        console.log('User created successfully!');
        navigate('/');
    };

    return (
        <div>
            <h2>Create User</h2>
            <div>
                <label>Username</label>
                <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>
            <div>
                <label>Bio</label>
                <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </div>

            <div>
                <p>UserID cannot be changed later</p>
                <label>User ID</label>
                <input
                    type="text"
                    required
                    value={userID}
                    onChange={(e) => setUserID(e.target.value)}
                />
            </div>

            <div>
                <label>Set as private</label>
                <input
                    type="checkbox"
                    required
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                />
            </div>

            {
                userIDUnique ? (
                    <div>
                        <p>User ID is unique!</p>
                        <button onClick={handleSubmitUserInfo}>Submit</button>
                    </div>
                )
                    : (<p>User ID is not unique!</p>)
            }

        </div>
    )

}

export default CreateUser;