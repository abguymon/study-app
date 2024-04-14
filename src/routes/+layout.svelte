<script>
	import Header from "./Header.svelte";
	import "./styles.css";
	import { onMount } from "svelte";
	import { session } from "$lib/session";
	import { goto } from "$app/navigation";
	import { signOut } from "firebase/auth";
	import { auth } from "$lib/firebase.client";

	export let data;

	let loading = true;
	let loggedIn = false;

	session.subscribe((cur) => {
		loading = cur?.loading;
		loggedIn = cur?.loggedIn;
	});

	onMount(async () => {
		const user = await data.getAuthUser();

		const loggedIn = !!user && user?.emailVerified;
		session.update((cur) => {
			loading = false;
			return {
				...cur,
				user,
				loggedIn,
				loading: false,
			};
		});

		if (loggedIn) {
			goto("/");
		}
	});
</script>

<div class="app">
	<Header />

	<main>
		{#if loading}
			<div>Loading...</div>
		{:else if loggedIn}
			<button
				on:click={async () => {
					await signOut(auth);
					session.update((cur) => {
						return {
							...cur,
							user: null,
							loggedIn: false,
						};
					});
					goto("/");
				}}
			>
				Logout
			</button>
		{:else}
			<button
				on:click={async () => {
					goto("/login");
				}}
			>
				Login
			</button>
		{/if}
		<slot />
	</main>

	<!-- <footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer> -->
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	/* footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	} */

	/* footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	} */
</style>
