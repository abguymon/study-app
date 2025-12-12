<script>
    import { user } from '$lib/stores/auth';
    import { auth } from '$lib/firebase';
    import { signOut } from 'firebase/auth';

    async function handleLogout() {
        try {
            await signOut(auth);
        } catch (e) {
            console.error(e);
        }
    }
</script>

<div class="auth-control">
    {#if $user}
        <button class="auth-btn" on:click={handleLogout}>Logout</button>
    {:else}
        <a href="/login" class="auth-btn">Login/Register</a>
    {/if}
</div>

<style>
    .auth-control {
        display: flex;
        align-items: center;
        margin-right: 1rem;
    }

    .auth-btn {
        background: none;
        border: 1px solid var(--color-text);
        padding: 0.5em 1em;
        color: var(--color-text);
        text-decoration: none;
        cursor: pointer;
        font-size: 0.8rem;
        border-radius: 4px;
        transition: all 0.2s;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    .auth-btn:hover {
        background: var(--color-theme-1);
        color: white;
        border-color: var(--color-theme-1);
    }
</style>
