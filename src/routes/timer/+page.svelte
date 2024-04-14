<script>
  let timerInterval;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let running = false;

  function startTimer() {
    if (!running) {
      running = true;
      timerInterval = setInterval(updateTimer, 600);
    }
  }

  function stopTimer() {
    running = false;
    clearInterval(timerInterval);
  }

  function resetTimer() {
    stopTimer();
    hours = 0;
    minutes = 0;
    seconds = 0;
  }

  function updateTimer() {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
      if (minutes === 60) {
        minutes = 0;
        hours++;
      }
    }
  }

  $: formattedTime = `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
</script>

<svelte:head>
  <title>Timer</title>
  <meta name="description" content="Study Timer" />
</svelte:head>

<section>
  <div id="timer">{formattedTime}</div>
  <div id="buttons">
    <button on:click={startTimer}>Start</button>
    <br />
    <button on:click={stopTimer}>Stop</button>
    <br />
    <button on:click={resetTimer}>Reset</button>
  </div>
</section>

<style>
  	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

  button {
    margin-bottom: 10px;
    width: 400px
  }

  #timer {
    font-size: 3rem; /* Adjust font size as needed */
  }
</style>