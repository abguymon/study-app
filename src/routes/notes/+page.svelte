<script>
    import { notes } from '$lib/stores/notes';
    import { user } from '$lib/stores/auth';

    let title = '';
    let content = '';

    // Modal state
    let showModal = false;
    let selectedNote = null;
    let editTitle = "";
    let editContent = "";

    function handleSubmit() {
        if (title.trim() === '' || content.trim() === '') {
            alert('Please fill in both title and content');
            return;
        }

        notes.add({ title, content });

        title = '';
        content = '';
    }

    function openModal(note) {
        selectedNote = note;
        editTitle = note.title;
        editContent = note.content;
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        selectedNote = null;
    }

    function handleUpdate() {
        if (!selectedNote || editTitle.trim() === '' || editContent.trim() === '') return;

        notes.update(selectedNote.id, {
            title: editTitle,
            content: editContent
        });

        closeModal();
    }

    function handleDelete() {
        if (!selectedNote) return;
        if (confirm("Are you sure you want to delete this note?")) {
            notes.remove(selectedNote.id);
            closeModal();
        }
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
        <div class="note" on:click={() => openModal(note)}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
        </div>
    {/each}
</div>

{#if showModal}
    <div class="modal-backdrop" on:click={closeModal}>
        <div class="modal" on:click|stopPropagation>
            <h2>Edit Note</h2>
            <label>
                Title:
                <input type="text" bind:value={editTitle} />
            </label>
            <br>
            <label>
                Content:
                <textarea rows="4" bind:value={editContent}></textarea>
            </label>
            <div class="modal-actions">
                <button on:click={handleUpdate}>Update</button>
                <button on:click={handleDelete} class="delete-btn">Delete</button>
                <button on:click={closeModal}>Close</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .notes-list {
        margin-top: 2rem;
    }
    .note {
        border: 1px solid #ccc;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    .note:hover {
        background-color: #f0f0f0;
    }
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .modal {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        min-width: 300px;
        width: 50%;
    }
    .modal-actions {
        margin-top: 1rem;
        display: flex;
        gap: 0.5rem;
    }
    .delete-btn {
        background-color: #ff4444;
        color: white;
    }
</style>
