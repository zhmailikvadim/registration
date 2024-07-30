sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageBox',
    'sap/m/MessageToast',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        MessageBox,
        MessageToast) {
        "use strict";
        let candidateEntity = "/ZHR_C_CANDIDATE_REGS";
        return Controller.extend("registration.controller.ViewMain", {
            onInit: function()  {

                var viewProperties = {
                    bEnableUpdate: false
                };
                var viewModel = new sap.ui.model.json.JSONModel(viewProperties);
                this.getView().setModel(viewModel, "viewModel");
            },

            onSuccessRecordAdded: function()  {
                oView.setBusy(false);
                let oModel = this.getView().getModel();
                let oView = this.getView();         
                var filters = new Array();
                filters.push(new sap.ui.model.Filter("IsActiveEntity", sap.ui.model.FilterOperator.EQ, "false"));
                filters.push(new sap.ui.model.Filter("num01_email", sap.ui.model.FilterOperator.EQ, oView.byId("mail").getValue()));
                filters.push(new sap.ui.model.Filter("zsap_user", sap.ui.model.FilterOperator.GT, ''));
                oModel.read(candidateEntity, {
                    filters: filters,
                    success: (oData) => {
                        if (oData.results.length != 0) {
                            MessageToast.show('Анкета отправлена. \r\n Спасибо за регистрацию!');
                            window.open("https://sapbpc-dev.beloil.by/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html#Shell-home", '_blank');
                        }
                        else {
                            MessageBox.error('Ошибка регистрации. \r\n Проверьте пожалуйста данные!');
                        }
                    },
                    error: oError => MessageBox.error(JSON.parse(oError.responseText).error.message.value, { title: "Ошибка" })
                });

            },

            onSuccessReadEmail: function (oData)  {
                var oModel = this.getView().getModel();
                var oView = this.getView();
                var ret = oData.results;
                console.log("return", ret);
                if (ret.length != 0) {
                    MessageBox.error("Анкета с такой почтой (" + oView.byId("mail").getValue() + ") уже зареригистрирована. \r\n Введите пожалуйста другую");
                    return;
                };
                oView.setBusy(true);
                var oContext = oModel.createEntry("/ZHR_C_CANDIDATE_REGS", {
                    properties: {
                        vorna: oView.byId("vorna").getValue(),
                        nachn: oView.byId("nachn").getValue(),
                        nach2: oView.byId("nachn2").getValue(),
                        pernr: oView.byId("tabel").getValue(),
                        useralias: oView.byId("login").getValue(),
                        password: oView.byId("password").getValue(),
                        num01_email: oView.byId("mail").getValue(),
                    }
                });
                oModel.submitChanges({
                    success: this.onSuccessRecordAdded.bind(this),
                    error: oError => {
                        MessageBox.error(JSON.parse(oError.responseText).error.message.value, { title: "Ошибка" });
                        oView.setBusy(false)
                    }
                });
            },

            onButtonPress: function () {
                var nachn = this.getView().byId("nachn").getValue();
                var login = this.getView().byId("login").getValue();
                var password = this.getView().byId("password").getValue();
                var repeat_password = this.getView().byId("repeat_password").getValue();
                var mail = this.getView().byId("mail").getValue();
                var repeat_mail = this.getView().byId("repeat_mail").getValue();


                if (password != repeat_password) {
                    alert("Пароли не совпадают");
                    return;
                }

                if (mail != repeat_mail) {
                    alert("Почта не совпадает");
                    return;
                }

                if (nachn == "" || login == "" || password == "" || repeat_password == "" || mail == "" || repeat_mail == "") {
                    alert("Заполните обязательные поля");
                    return;
                }

                var oModel = this.getView().getModel();
                oModel.setTokenHandlingEnabled(true);
                var filters = new Array();
                filters.push(new sap.ui.model.Filter("IsActiveEntity", sap.ui.model.FilterOperator.EQ, "false"));
                filters.push(new sap.ui.model.Filter("num01_email", sap.ui.model.FilterOperator.EQ, mail));
                oModel.read(candidateEntity, {
                    filters: filters,
                    success: this.onSuccessReadEmail.bind(this),
                    error: oError => MessageBox.error(JSON.parse(oError.responseText).error.message.value, { title: "Ошибка" })
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
