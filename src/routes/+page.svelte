<script>
	// import Counter from './Counter.svelte';
	// import welcome from '$lib/images/svelte-welcome.webp';
	// import welcome_fallback from '$lib/images/svelte-welcome.png';
 	import logo from '$lib/images/logotransparent.png'
</script>

<svelte:head>
	<title>Study App</title>
	<meta name="description" content="My Study App" />
</svelte:head>

<section>
	<img src= {logo} alt='Studdy Buddy'>
	<h1>Welcome to Studdy Buddy!</h1>

	<!-- <Counter />  -->
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	/* .welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	} */
</style>
