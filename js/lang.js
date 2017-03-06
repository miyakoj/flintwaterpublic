i18next.init({
	debug: true,
	whitelist: ['en-US', 'es'],
	fallbackLng: 'en-US',
	backend: {
		loadPath: "langs/lang.{{lng}}.json",
		allowMultiLoading: false,
		crossDomain: false
	}
}, (err, t) => {
	/* Use jQuery to replace text. */
	jqueryI18next.init(i18next, $, {
		tName: 't', // --> appends $.t = i18next.t
		i18nName: 'i18n', // --> appends $.i18n = i18next
		handleName: 'localize', // --> appends $(selector).localize(opts);
		selectorAttr: 'data-i18n', // selector for translating elements
		targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if diffrent then itself)
		optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
		useOptionsAttr: false, // see optionsAttr
		parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
	});
	
	$(document).localize();
});

/* Loads a language file from the server. */
i18next.use(window.i18nextXHRBackend).init();

/* Detect the language set in the browser as set in localStorage. */
i18next.use(window.i18nextBrowserLanguageDetector).init({
    detection: {
		caches: ['localStorage'],
		order: ['localStorage'],
		lookupLocalStorage: 'lang'
	}
});

/* Cache language file in the browser storage. */
i18next.use(window.i18nextLocalStorageCache).init({
    cache: {
		enabled: true,
		prefix: 'i18next_res_',
		expirationTime: 7*24*60*60*1000 // cache for a week
	}
});

i18next.changeLanguage(lang, (err, t) => {
	console.log(lang);
});