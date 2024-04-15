<script>
    // login/+page.svelte
    import { goto } from "$app/navigation";
    import {
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
    } from "firebase/auth";
    import { auth } from "../../lib/firebase.client";
    import { session } from "../../lib/session";

    let email = "";
    let password = "";
    let isLogin = true; // Default to login mode

    function toggleLogin() {
        isLogin = !isLogin;
        console.log("TOGGLE LGN", isLogin)
    }

    async function handleSubmit() {
        if (isLogin) {
            await signInWithEmailAndPassword(auth, email, password)
                .then((result) => {
                    const { user } = result;
                    session.set({
                        loggedIn: true,
                        user: {
                            displayName: user?.displayName,
                            email: user?.email,
                            uid: user?.uid,
                        },
                    });
                    goto("/");
                })
                .catch((error) => {
                    return error;
                });
        } else {
            await createUserWithEmailAndPassword(auth, email, password)
                .then((result) => {
                    const { user } = result;
                    session.set({
                        loggedIn: true,
                        user: {
                            displayName: user?.displayName,
                            email: user?.email,
                            uid: user?.uid,
                        },
                    });
                    goto("/");
                })
                .catch((error) => {
                    return error;
                });
        }
    }
</script>

<div class="login-form">
    <h1>{isLogin ? "Login" : "Sign Up"}</h1>
    <form on:submit={handleSubmit}>
        <input bind:value={email} type="text" placeholder="Email" />
        <input bind:value={password} type="password" placeholder="Password" />
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        <button type="button" on:click={toggleLogin}>
            {isLogin ? "Switch to Sign Up" : "Switch to Login"}
        </button>
    </form>

    <div>Don't you have an account? <a href="/register"> Register</a></div>
</div>
