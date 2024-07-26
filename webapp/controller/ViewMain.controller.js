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

           


            

            onButtonPress: function() {
                var oModel = this.getView().getModel();
                var oEntry = {};
                oEntry.IsActiveEntity = "true"
                oEntry.vorna = this.getView().byId("vorna").getValue();
                oEntry.nachn = this.getView().byId("nachn").getValue();
                oEntry.nach2 = this.getView().byId("nach2").getValue();
                oModel.setTokenHandlingEnabled(true);
                var scsrfSecToken = oModel.getSecurityToken(); 
                var metadata = oModel.getMetaModel(); 
                console.log("Token:", scsrfSecToken);
                console.log("Metadata:", metadata);
                
                const myHeaders = new Headers();
                myHeaders.append("X-CSRF-Token", scsrfSecToken);
                myHeaders.append("Content-Type", "application/json");

                oModel.update("/ZHR_C_CANDIDATE_REGS", oEntry, {
                    method: "POST",
                    headers:myHeaders,
                    redirect: "follow",
                    success: function(data) {
                     alert("success");
                    },
                    error: function(e) {
                     alert("error");
                    }
                   });
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
