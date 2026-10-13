sap.ui.define([], () => {
  "use strict";

  // What the two custom sections start, from the key of the customer on the
  // page. Nothing starts before the page has its customer; another customer
  // ends the running abap2UI5 sessions and starts new ones with its key.
  //
  // Z2UI5_CL_UI5_APP_HI_WORLD is in every abap2UI5 installation, the local
  // one in Node included, so both sections run it here - each in a session
  // of its own. An app of your own names two classes of its own.
  const APP = "Z2UI5_CL_UI5_APP_HI_WORLD";
  const SECOND_APP = "Z2UI5_CL_UI5_APP_HI_WORLD";

  return {
    app(id) {
      return id ? APP : "";
    },

    secondApp(id) {
      return id ? SECOND_APP : "";
    },

    params(id) {
      return id ? { customer: id } : null;
    },
  };
});
