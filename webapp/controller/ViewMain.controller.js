sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("registration.controller.ViewMain", {
            onInit: function () {

                var viewProperties = {
                    bEnableUpdate: false
                };
                var viewModel = new sap.ui.model.json.JSONModel(viewProperties);
                this.getView().setModel(viewModel, "viewModel");


            },






            onButtonPress: function () {

                /*                var nachn = this.getView().byId("").getValue();
                                var login = this.getView().byId("login").getValue();
                                var password = this.getView().byId("password").getValue();
                                var repeat_password = this.getView().byId("repeat_password").getValue();
                                var mail = this.getView().byId("mail").getValue();
                                var repeat_mail = this.getView().byId("repeat_mail").getValue();
                
                                if (nachn == " " || login == " " || password == " " || repeat_password == " " || mail == " " || repeat_mail == " ") {
                                    alert("Заполните обязательные поля")
                                    return;
                                }*/



                var oModel = this.getView().getModel();
                oModel.setTokenHandlingEnabled(true);
                var oContext = oModel.createEntry("/ZHR_C_CANDIDATE_REGS", {
                    properties: {
                        vorna: this.getView().byId("vorna").getValue(),
                        nachn: this.getView().byId("nachn").getValue(), 
                    }                   
                });
                oModel.submitChanges( );
                oContext.created().then(
                    function () { alert("success") },
                    function () { alert("error") }
                  )
            },


            onParentClicked: function (oEvent) {
                var bSelected = oEvent.getParameter("selected");
                if (bSelected == true) {

                    this.getView().getModel("viewModel").setProperty("/bEnableUpdate", true);
                }
                else {
                    this.getView().getModel("viewModel").setProperty("/bEnableUpdate", false);
                }
            }

        });
    });
