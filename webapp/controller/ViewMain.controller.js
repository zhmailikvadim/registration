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

<<<<<<< HEAD
               
=======
                var sServiceUrl = "https://sapbpc-dev.beloil.by/sap/opu/odata/sap/zhr_c_candidateheader_cds/?sap-client=400"
                var oMainModel = new sap.ui.model.odata.ODataModel(sServiceUrl,true);
                var oJsonMainModel = new sap.ui.model.json.JSONModel();
>>>>>>> a01b4603a53b05ed34fc8d165434c9fe68d971d3
            },

           


            

            onButtonPress: function() {
<<<<<<< HEAD
             
               var nachn =  this.getView().byId("inp3").getValue(); 
               var login =  this.getView().byId("login").getValue();
               var password =  this.getView().byId("password").getValue();
               var repeat_password =  this.getView().byId("repeat_password").getValue();
               var mail =  this.getView().byId("mail").getValue();
               var repeat_mail =  this.getView().byId("repeat_mail").getValue();

               if ( nachn == " " || login == " " || password == " " || repeat_password == " " || mail == " " || repeat_mail == " " ) {
                  alert("Заполните обязательные поля")
                  return;
               }
               

=======
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
>>>>>>> a01b4603a53b05ed34fc8d165434c9fe68d971d3
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
