import React, { useState } from 'react';
import Add from "../img/add_photo.png";
import { useNavigate, Link } from 'react-router-dom';


// import { Auth0Provider } from '@auth0/auth0-react';

// import { createRoot } from 'react-dom/client';

// const root = createRoot(document.getElementById('root'));

// root.render(
// <Auth0Provider
//     domain="dev-jynf02pxm1sqtc4i.us.auth0.com"
//     clientId="TVwHeiMQZwO9DuV44Sz5fUfjJyhRvPB1"
//     authorizationParams={{
//       redirect_uri: window.location.origin
//     }}
//   >
//     <App />
//   </Auth0Provider>,
// );

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const Register = () => {
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const profilePic = e.target[3].files[0];

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const storageRef = ref(storage, displayName);

            const userId = res.user.uid;
            await uploadBytesResumable(storageRef, profilePic).then(() => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(storageRef).then( async (downloadURL) => {
                    try {
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL
                        });
                        console.log('File available at', downloadURL);
                        const user = {
                            uid: userId,
                            displayName,
                            email,
                            photoURL: downloadURL
                        }
                        await setDoc(doc(db, "users", userId), user);
                        // create empty user chats
                        await setDoc(doc(db, "userChats", userId), {});
                        navigate("/login");
                    } catch (err) {
                        console.log(err);
                        setErr(true);
                        setLoading(false);
                    }
                });
            })
        } catch (err) {
            console.log(err)
            setErr(true);
            setLoading(false);
        }
        // .then((userCredential) => {
        //     // Signed in 
        //     const user = userCredential.user;
        // })
        // .catch((error) => {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        // });
    }

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo"> Rita Chat</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" id="username" placeholder="username"/>
                    <input type="email" id="email" placeholder="email"/>
                    <input type="password" id="password" placeholder="password"/>
                    <input style={{display:"none"}} type="file" id="file"/>
                    <label htmlFor="file">
                        <img src={Add} alt="" />
                        <span>Add an avatar</span>
                    </label>
                    <button disabled={loading}>Sign up</button>
                    {loading && "Uploading the image, please wait..."}
                    {err && <span>Something went wrong...</span>}
                </form>
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </div>
    )
}

export default Register;