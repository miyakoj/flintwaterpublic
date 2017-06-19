/* Change the document language. */
function changeDocLang(lang) {
	var langCode;
	
	if (lang) {
		if (lang.indexOf('-') != -1)
			langCode = lang.slice(0, lang.indexOf('-'));
		else
			langCode = lang;
		
		$('html').attr('lang', langCode);
	}
	else
		lang = 'en';
}

/* Change the language when something is selected in the menu. */
$('.lang').click(function () {
	var lang = $(this).attr('data-lang');
	i18next.changeLanguage(lang, (err, t) => {
		// change the Google map language

		changeDocLang(lang);
		$('#language_menu .dropdown-menu li').removeClass('active');
		$(this).parent().addClass('active');
		$(document).localize();
	});
});

$(document).ready(function() {
	/* Loads a language file from the server. */
	i18next.use(window.i18nextXHRBackend).init();

	/* Detect the language set in the browser as saved in localStorage (if available). */
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
			//expirationTime: 7*24*60*60*1000 // cache for a week
			expirationTime: 10*1000
		}
	});
	
	/* Initialize the i18next plugin. */
	i18next.init({
		debug: true,
		whitelist: ['en-US', 'es'],
		fallbackLng: 'en-US',
		load: 'currentOnly',
		//ns: ['template'],
		backend: {
			loadPath: 'langs/{{lng}}.json'
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
		
		var lang = localStorage.lang;
		changeDocLang(lang);
		$('.lang[data-lang=' + lang +']').parent().addClass('active'); // select the right language menu item on page load
		$(document).localize();
	});
});