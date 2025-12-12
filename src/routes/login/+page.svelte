<script>
    import { auth } from '$lib/firebase';
    import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
    import { goto } from '$app/navigation';
    import { user } from '$lib/stores/auth';

    let email = '';
    let password = '';
    let isRegistering = false;
    let error = '';

    $: if ($user) {
        goto('/');
    }

    async function handleSubmit() {
        error = '';
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (e) {
            error = e.message;
        }
    }
</script>

<svelte:head>
    <title>{isRegistering ? 'Register' : 'Login'}</title>
</svelte:head>

<h1>{isRegistering ? 'Register' : 'Login'}</h1>

{#if error}
    <p style="color: red">{error}</p>
{/if}

<form on:submit|preventDefault={handleSubmit}>
    <label>
        Email:
        <input type="email" bind:value={email} required />
    </label>
    <br>
    <label>
        Password:
        <input type="password" bind:value={password} required />
    </label>
    <br>
    <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
</form>

<button on:click={() => isRegistering = !isRegistering}>
    {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
</button>
