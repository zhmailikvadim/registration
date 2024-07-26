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

                var sServiceUrl = "https://sapbpc-dev.beloil.by/sap/opu/odata/sap/zhr_c_candidateheader_cds/?sap-client=400"
                var oMainModel = new sap.ui.model.odata.ODataModel(sServiceUrl,true);
                var oJsonMainModel = new sap.ui.model.json.JSONModel();
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
                console.log(metadata);
                console.log(scsrfSecToken);

                oModel.update("/ZHR_C_CANDIDATE_REGS", oEntry, {
                    method: "POST",
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
