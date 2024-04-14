<script>

  let title = '';
  let content = '';

  function handleSubmit() {
    if (title.trim() === '' || content.trim() === '') {
      alert('Please fill in both title and content');
      return;
    }

    // You can perform further actions here, like saving the note to a database or emitting an event to notify parent components.
    console.log('Note submitted:', { title, content });

    // Reset the form fields after submission
    title = '';
    content = '';
  }

</script>
<svelte:head>
    <title>Notes</title>
</svelte:head>


<h1>Notes</h1>

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
  
  
