sap.ui.define([], () => {
  "use strict";

  // What the two object page extensions start, from the country on the page.
  //
  // Abap2UI5Section.fragment.xml, after the facet "General": nothing starts
  // before the page has its country with all three fields - a field still on
  // its way (undefined) would start the app without it and start it again,
  // in a new session, once it arrives; another country ends the running
  // abap2UI5 session and starts a new one with its fields.
  //
  // Abap2UI5Languages.fragment.xml, after the facet "Language": a second app,
  // in a session of its own, with the country alone.
  //
  // Z2UI5_CL_UI5_APP_HI_WORLD is in every abap2UI5 installation, the local
  // one in Node included, so both sections run it here. With the RAP objects
  // of abap/ in the system, start the apps that come with them -
  // Z2UI5_CL_EMBED_COUNTRY reads the three parameters and the country from
  // the same service, Z2UI5_CL_EMBED_LANGUAGES lists the country's name in
  // every language.
  const APP = "Z2UI5_CL_UI5_APP_HI_WORLD";
  const LANGUAGES_APP = "Z2UI5_CL_UI5_APP_HI_WORLD";

  const complete = (country, language, nationality) =>
    !!country && language != null && nationality != null;

  return {
    app(country, language, nationality) {
      return complete(country, language, nationality) ? APP : "";
    },

    params(country, language, nationality) {
      return complete(country, language, nationality)
        ? { country, language, nationality }
        : null;
    },

    languagesApp(country) {
      return country ? LANGUAGES_APP : "";
    },

    languagesParams(country) {
      return country ? { country } : null;
    },
  };
});
