import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from "../firebase";


const Login = () => {

    const [err, setErr] = useState(false);
    const [invalidLoginErr, setInvalidLoginErr] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        }
        catch (err) {
            console.log(err.code);
            if (err.code === "auth/invalid-login-credentials") {
                setInvalidLoginErr(true);          
            }
            else {
                setErr(true);
            }
        }
    }
    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo"> Rita Chat</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" id="email" placeholder="email"/>
                    <input type="password" id="password" placeholder="password"/>
                    <button>Sign in</button>
                    {err && <span>Something went wrong...</span>}
                    {invalidLoginErr && <span>Invalid user credentials</span>}

                </form>
                <p>Don't have an account yet? <Link to="/register">Register here</Link></p>


            </div>
        </div>
    )
}

export default Login;