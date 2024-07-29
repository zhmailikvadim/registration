sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast'
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

            _createEntity: function () {

            },

            onButtonPress: function () {
                var nachn = this.getView().byId("nachn").getValue();
                var login = this.getView().byId("login").getValue();
                var password = this.getView().byId("password").getValue();
                var repeat_password = this.getView().byId("repeat_password").getValue();
                var mail = this.getView().byId("mail").getValue();
                var repeat_mail = this.getView().byId("repeat_mail").getValue();


                if (password != repeat_password) {
                    alert("Пароли не совпадают")
                    return;
                }

                if (mail != repeat_mail) {
                    alert("Почта не совпадает")
                    return;
                }

                if (nachn == "" || login == "" || password == "" || repeat_password == "" || mail == "" || repeat_mail == "") {
                    alert("Заполните обязательные поля")
                    return;
                }

                var oModel = this.getView().getModel();
                var Url = "/ZHR_C_CANDIDATE_REGS";
                var filters = new Array();
                var filterByName = new sap.ui.model.Filter("IsActiveEntity", sap.ui.model.FilterOperator.EQ, "false")
                filters.push(filterByName);
                var filterByName = new sap.ui.model.Filter("num01_email", sap.ui.model.FilterOperator.EQ, mail)
                filters.push(filterByName);
                oModel.read(Url, {
                    filters: filters,
                    success: function (oData, oResponse) {
                        var ret = oData.results;
                        console.log("return", ret);
                        if (ret.length != 0) {
                            alert("Данная почта зареригистрирована, пожалуйста введите другую")
                            return;
                        };
                        var oModel = this.getView().getModel();
                        oModel.setTokenHandlingEnabled(true);

                        var oContext = oModel.createEntry("/ZHR_C_CANDIDATE_REGS", {
                            properties: {
                                vorna: this.getView().byId("vorna").getValue(),
                                nachn: this.getView().byId("nachn").getValue(),
                                nach2: this.getView().byId("nachn2").getValue(),
                                pernr: this.getView().byId("tabel").getValue(),
                                useralias: this.getView().byId("login").getValue(),
                                password: this.getView().byId("password").getValue(),
                                num01_email: this.getView().byId("mail").getValue(),

                            }
                        });
                        oModel.submitChanges();
                        oContext.created().then(
                            function () {
                                //window.open("https://sapbpc-dev.beloil.by/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html#Shell-home", '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');

                            },
                            function () { alert("Ошибка регистрации") }
                        )

                    },
                    error: function (oError) {
                        console.log(oError);
                        return;
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
