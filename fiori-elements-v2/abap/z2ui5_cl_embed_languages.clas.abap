"! The second abap2UI5 app of the Fiori elements example for OData V2: the
"! second object page extension starts it with the country on the page as a
"! startup parameter (ext/Abap2UI5Section.js), after the facet "Language". It
"! lists the name of that country in every language the system has - an app
"! next to Z2UI5_CL_EMBED_COUNTRY on the same page, in a session of its own.
CLASS z2ui5_cl_embed_languages DEFINITION PUBLIC FINAL CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2ui5_if_app.

    TYPES:
      BEGIN OF ty_s_text,
        language    TYPE string,
        name        TYPE string,
        nationality TYPE string,
      END OF ty_s_text.
    TYPES ty_t_text TYPE STANDARD TABLE OF ty_s_text WITH EMPTY KEY.

    DATA title TYPE string.
    DATA texts TYPE ty_t_text.

  PROTECTED SECTION.
    DATA country TYPE string.

  PRIVATE SECTION.
    METHODS read_texts.

    METHODS view_display
      IMPORTING
        client TYPE REF TO z2ui5_if_client.

ENDCLASS.


CLASS z2ui5_cl_embed_languages IMPLEMENTATION.

  METHOD z2ui5_if_app~main.

    IF client->check_on_init( ).
      " params="{ country: 'AT' }" of the second object page extension
      LOOP AT client->get( )-t_comp_params INTO DATA(param).
        IF to_lower( param-n ) = `country`.
          country = param-v.
        ENDIF.
      ENDLOOP.
      read_texts( ).
      view_display( client ).

    ELSEIF client->check_on_navigated( ).
      view_display( client ).
    ENDIF.

  ENDMETHOD.


  METHOD read_texts.

    " T005T has the country's texts in every language, T002 the ISO code of
    " each language - the view of the RAP service has the logon language only
    SELECT FROM t005t
        INNER JOIN t002 ON t002~spras = t005t~spras
        FIELDS t002~laiso, t005t~landx, t005t~natio
        WHERE t005t~land1 = @country
        ORDER BY t002~laiso
        INTO TABLE @DATA(rows).
    IF sy-subrc <> 0.
      title = |{ country } is not in T005T|.
      CLEAR texts.
      RETURN.
    ENDIF.

    title = |{ country } in every language of the system, read from T005T|.
    texts = VALUE #( FOR row IN rows
                     ( language    = row-laiso
                       name        = row-landx
                       nationality = row-natio ) ).

  ENDMETHOD.


  METHOD view_display.

    DATA(view) = z2ui5_cl_ui5_view_builder=>factory(
        )->ele( n = `View` ns = `mvc`
            )->a( n = `xmlns`         v = `sap.m`
            )->a( n = `xmlns:mvc`     v = `sap.ui.core.mvc`
            )->a( n = `displayBlock`  v = `true`
            )->a( n = `height`        v = `100%` ).

    view->ele( `Page`
        )->a( n = `title` v = `abap2UI5 - the country in every language`
        )->ele( `Table`
            )->a( n = `headerText` v = client->_bind( title )
            )->a( n = `items`      v = client->_bind( texts )
            )->ele( `columns`
                )->ele( `Column`
                    )->tag( `Text`
                        )->a( n = `text` v = `Language`
                )->end(
                )->ele( `Column`
                    )->tag( `Text`
                        )->a( n = `text` v = `Name`
                )->end(
                )->ele( `Column`
                    )->tag( `Text`
                        )->a( n = `text` v = `Nationality`
                )->end(
            )->end(
            )->ele( `items`
                )->ele( `ColumnListItem`
                    )->ele( `cells`
                        )->tag( `Text`
                            )->a( n = `text` v = `{LANGUAGE}`
                        )->tag( `Text`
                            )->a( n = `text` v = `{NAME}`
                        )->tag( `Text`
                            )->a( n = `text` v = `{NATIONALITY}` ).

    client->view_display( view->stringify( ) ).

  ENDMETHOD.

ENDCLASS.
