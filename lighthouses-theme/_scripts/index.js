import BOOKSHOP_COMPONENTS from "../_bookshop/**/*.svelte";
import THEME_COMPONENTS from "./**/*.svelte";

/**
 * Convert a component path (like in bookshop) to a component name.
 * Removes duplicate file/folder name, stops at components folder or dotpath.
 * @param  {String} filepath Raw filepath that was imported
 * @return {String}          Component name, as per bookshop conventions
 */
const rewriteSvelteComponent = (filepath) => {
  let fp = filepath.toLowerCase().split('/').reverse();
  let componentName = [fp[0].replace(/\..*$/, '')];
  let startAt = fp[1] === componentName[0] ? 2 : 1;
  for (let i = startAt; i < fp.length; i++) {
    if (fp[i] === 'components') break;
    if (/\./.test(fp[i])) break;
    componentName.unshift(fp[i]);
  }
  return componentName.join('/');
};

/**
 * Turn a raw import-glob-keyed object into a map of components
 * @param  {Object} importedObj Output from import-glob-keyed
 * @param  {Object} appObj      Object to insert components into
 */
const mapSvelteFiles = (importedObj, appObj) => {
	for (let [file, component] of Object.entries(importedObj)) {
		file = rewriteSvelteComponent(file);
		appObj[file] = component;
	}
}

/**
 * Look for svelte tags on the page, and try render an app into them.
 * @param  {Array}  targets Array of DOM nodes that have the data-svelte-component attr
 * @param  {Object} apps    All Svelte components available
 */
const registerSvelteApps = (targets, apps) => {
	let instances = [];

	for (let target of targets) {
		let componentName = target.dataset.svelteComponent;
		let componentData = target.dataset.svelteEndpoint;

		let discoveredApp = apps[componentName];
		if (discoveredApp) {
			let props = window[componentData];

			instances.push(new discoveredApp.default({target, props, hydrate: true}));
		} else {
			console.warn(`WARN: Component "${componentName}" not found`)
		}
	}

	window.COMPONENT_INSTANCES = instances;
}


(function() {
	let usableApps = {};
	if (typeof BOOKSHOP_COMPONENTS !== 'undefined') mapSvelteFiles(BOOKSHOP_COMPONENTS, usableApps);
	if (typeof THEME_COMPONENTS !== 'undefined') mapSvelteFiles(THEME_COMPONENTS, usableApps);

	let renderTargets = document.querySelectorAll("[data-svelte-component]");
	registerSvelteApps(renderTargets, usableApps);
}());



