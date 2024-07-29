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
                var ret = -1;
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

                var Url = "/ZHR_C_CANDIDATE_REGS(useralias='"+login+"')?$expand=UserRoleCollection";


                oModel.read( Url, {
                    async: false,
                    success: function (oData, oResponse) {
                        ret = oData;
                    },
                    error: function (oError) {
                        MessageToast.show(oError);
                        console.log(oError);
                        ret = -1;
                        return;
                    }

                });
                console.log(ret);





                //   oModel.read("/ZHR_C_CANDIDATE_REGS", {
                //      function(oData, oResponse){
                //          userAll = oData.useralias;
                //   return JSON.stringify(oData);
                //     },   }
                //  );

                //   console.log(userAll);

                oModel.read("/ZHR_C_CANDIDATE_REGS", {
                    success: function (oData, oResponse) {
                        var oMessage = new sap.ui.core.message.Message({
                            message: "We have received the following response: " + oResponse,
                            persistent: true, // create message as transition message
                            type: sap.ui.core.MessageType.Success


                        });
                        //"Messaging" required from module "sap/ui/core/Messaging";
                        Messaging.addMessages(oMessage);
                        fnResolve();
                    },
                    //  error: fnReject



                });









                oContext.created().then(
                    function () {
                        alert("Вы зарегистрированы. Данные отправлены на e-mail!")
                        window.open("https://sapbpc-dev.beloil.by/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html#Shell-home", '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');

                    },
                    function () { alert("Ошибка регистрации") }
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
