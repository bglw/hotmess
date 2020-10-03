import BOOKSHOP_COMPONENTS from "../_bookshop/**/*.svelte";
import THEME_COMPONENTS from "./**/*.svelte";

let instances = [];
let usableApps = {};

if (typeof BOOKSHOP_COMPONENTS !== 'undefined') {
	for (let component of BOOKSHOP_COMPONENTS) {
		usableApps[component.default.name.toLowerCase()] = component;
	}
}
if (typeof THEME_COMPONENTS !== 'undefined') {
	for (let component of THEME_COMPONENTS) {
		usableApps[component.default.name.toLowerCase()] = component;
	}
}

let renderTargets = document.querySelectorAll("[data-svelte-component]");
for (let target of renderTargets) {
	let componentName = target.dataset["svelteComponent"];
	let componentData = target.dataset["svelteEndpoint"];

	let discoveredApp = usableApps[componentName];
	if (discoveredApp) {
		let props = window[componentData];

		instances.push(new discoveredApp.default({target, props, hydrate: true}));
	} else {
		console.warn(`WARN: Component "${componentName}" not found`)
	}
}

window.COMPONENT_INSTANCES = instances;