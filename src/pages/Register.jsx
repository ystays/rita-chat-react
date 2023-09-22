import React from 'react';
import Add from "../img/add_photo.png"

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

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";

const Register = () => {
    const [err, setErr] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const profilePic = e.target[3].value;

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
    
        } catch (err) {
            setErr(true);
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
                    <input type="text" placeholder="username"/>
                    <input type="email" placeholder="email"/>
                    <input type="password" placeholder="password"/>
                    <input style={{display:"none"}} type="file"/>
                    <label htmlFor="file">
                        <img src={Add} alt="" />
                        <span>Add an avatar</span>
                    </label>
                    <button>Sign up</button>
                    {err && <span>Something went wrong...</span>}
                </form>
                <p>Already have an account? Login here</p>


            </div>
        </div>
    )
}

export default Register;