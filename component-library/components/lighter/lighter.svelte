<script>
	export let big = false;
	export let lit = false;
	export let title = "";

	const light = () => {
		lit = !lit;
	}
</script>

<div class="c-lighter"
	 class:is-svelte={true}
	 class:c-lighter--big={big}
	 class:is-lit={lit}
	 on:click={light}>

    <div class="c-lighter__title">
    	{ title }
    </div>

</div>