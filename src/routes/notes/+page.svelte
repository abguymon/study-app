<script>
    import { notes } from '$lib/stores/notes';
    import { user } from '$lib/stores/auth';

    let title = '';
    let content = '';

    function handleSubmit() {
        if (title.trim() === '' || content.trim() === '') {
            alert('Please fill in both title and content');
            return;
        }

        notes.add({ title, content });

        title = '';
        content = '';
    }
</script>

<svelte:head>
    <title>Notes</title>
</svelte:head>

<h1>Notes</h1>

{#if !$user}
    <p><i>You are not logged in. Notes will be saved to your browser.</i></p>
{/if}

<form on:submit|preventDefault={handleSubmit}>
    <label>
      Title:
      <input type="text" bind:value={title} />
    </label>
    <br>
    <label>
      Content:
      <textarea rows="4" bind:value={content}></textarea>
    </label>
    <br>
    <button type="submit">Submit</button>
</form>

<div class="notes-list">
    {#each $notes as note (note.id)}
        <div class="note">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button on:click={() => notes.remove(note.id)}>Delete</button>
        </div>
    {/each}
</div>

<style>
    .notes-list {
        margin-top: 2rem;
    }
    .note {
        border: 1px solid #ccc;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 4px;
    }
</style>
