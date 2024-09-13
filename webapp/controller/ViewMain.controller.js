sap.ui.define(
  ['sap/ui/core/mvc/Controller', 'sap/m/MessageBox', 'sap/m/MessageToast', '../controller/CreateValueHelpConfig'],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageBox, MessageToast, ValueHelpConfig) {
    'use strict';
    let candidateEntity = '/ZHR_C_CANDIDATE_REGS';
    let eEducTypeVH = '/ZHR_I_EDUC_TYPE_VH';
    let factoryVH = '/ZHR_I_FACTORY_VH';
    let logEntity = 'to_RecruitmentLog';
    return Controller.extend('registration.controller.ViewMain', {
      onInit: function () {
        var viewProperties = {
          bEnableUpdate: false,
        };

        var viewModel = new sap.ui.model.json.JSONModel(viewProperties);
        this.getView().setModel(viewModel, 'viewModel');
      },

      onSapLogonPress: function () {
        var new_window = window.open(
          'https://sapbpc-dev.beloil.by/sap/bc/ui5_ui5/ui2/ushell/shells/abap/?sap-client=400&sap-language=ru/FioriLaunchpad.html#zhr_anketa_sem-manage',
          '_blank',
        );
        new_window.onload = function () {
          new_window.document.getElementById('USERNAME_FIELD-inner').value = '111111';
          const inputElement = new_window.document.querySelector('#USERNAME_FIELD-inner');
          inputElement.value = '111111';
        };
      },

      onButtonRegistrationPress: function () {
        var nachn = this.getView().byId('nachn').getValue();
        var login = this.getView().byId('login').getValue();
        var password = this.getView().byId('password').getValue();
        var repeat_password = this.getView().byId('repeat_password').getValue();
        var mail = this.getView().byId('mail').getValue();
        var repeat_mail = this.getView().byId('repeat_mail').getValue();

        if (password != repeat_password) {
          alert('Пароли не совпадают');
          return;
        }

        if (mail != repeat_mail) {
          alert('Почта не совпадает');
          return;
        }

        if (nachn == '' || login == '' || password == '' || repeat_password == '' || mail == '' || repeat_mail == '') {
          alert('Заполните обязательные поля');
          return;
        }

        var oModel = this.getView().getModel();
        var filters = new Array();
        filters.push(new sap.ui.model.Filter('IsActiveEntity', sap.ui.model.FilterOperator.EQ, 'false'));
        filters.push(new sap.ui.model.Filter('has_errors', sap.ui.model.FilterOperator.EQ, 'false'));
        filters.push(new sap.ui.model.Filter('num01_email', sap.ui.model.FilterOperator.EQ, mail));

        //Read for checking e-mail
        oModel.read(candidateEntity, {
          filters: filters,
          success: this.onReadEmailSuccess.bind(this),
          error: (oError) => MessageBox.error(JSON.parse(oError.responseText).error.message.value, { title: 'Ошибка' }),
        });
      },
      onReadEmailSuccess: function (oData) {
        let oModel = this.getView().getModel();
        let oView = this.getView();
        if (oData.results.length != 0) {
          MessageBox.error('Анкета с такой почтой (' + oView.byId('mail').getValue() + ') уже зареригистрирована. \r\n Введите пожалуйста другую');
          return;
        }
        oView.setBusy(true);
        oModel.createEntry('/ZHR_C_CANDIDATE_REGS', {
          properties: {
            vorna: oView.byId('vorna').getValue(),
            nachn: oView.byId('nachn').getValue(),
            nach2: oView.byId('nachn2').getValue(),
            pernr: oView.byId('tabel').getValue(),
            useralias: oView.byId('login').getValue(),
            password: oView.byId('password').getValue(),
            num01_email: oView.byId('mail').getValue(),
            factory_name: oView.byId('factory').getValue(),
            factory_numc: oView.byId('factoryid').getValue(),
            is_run_registration: true,
          },
        });
        oModel.submitChanges({
          success: this.onSuccessRecordAdded.bind(this),
          error: (oError) => {
            // MessageBox.error(JSON.parse(oError.responseText).error.message.value, { title: 'Ошибка' });
            oView.setBusy(false);
          },
        });
      },

      onSuccessRecordAdded: function () {
        let oModel = this.getView().getModel();
        let oView = this.getView();
        oView.setBusy(false);
        var filters = new Array();
        filters.push(new sap.ui.model.Filter('IsActiveEntity', sap.ui.model.FilterOperator.EQ, 'false'));
        filters.push(new sap.ui.model.Filter('num01_email', sap.ui.model.FilterOperator.EQ, oView.byId('mail').getValue()));

        oModel.read(candidateEntity, {
          filters: filters,
          success: this.onCheckErrors.bind(this),
          error: oView.setBusy(false),
          // error: (oError) => MessageBox.error(JSON.parse(oError.responseText).error.message.value, { title: 'Ошибка' }),
        });
      },
      onCheckErrors: function (oData) {
        var ErrorUnexpected = 'Не удалось отправить, повторите пожалуйста отправку формы!'
        if (oData.results.length > 0) {
          if (oData.results[0].has_errors == true) {
            let oModelLog = this.getView().getModel();
            var filters1 = new Array();
            filters1.push(new sap.ui.model.Filter('IsActiveEntity', sap.ui.model.FilterOperator.EQ, 'false'));
            filters1.push(new sap.ui.model.Filter('uuid', sap.ui.model.FilterOperator.EQ, oData.results[0].uuid));
            oModelLog.read(candidateEntity, {
              filters: filters1,
              urlParameters: { $expand: 'to_RecruitmentLog' },
              success: function (data, response) {
                console.log(response),
                  console.log(data),
                  MessageBox.error(data.results[0].to_RecruitmentLog.results[0].message + data.results[0].to_RecruitmentLog.results[0].message_v4);
              },
            });
          } else {
            if (oData.results[0].zsap_user > '') {
              window.open(
                'https://sapbpc-dev.beloil.by/sap/bc/ui5_ui5/ui2/ushell/shells/abap/?sap-client=400&sap-language=ru/FioriLaunchpad.html#zhr_anketa_sem-manage',
                '_blank',
              );
              MessageBox.show('Анкета отправлена. \r\n Спасибо за регистрацию!');
              return;
            }
            else MessageBox.error(ErrorUnexpected);
          }
        } else  MessageBox.error(ErrorUnexpected);
      },

      onCheckBoxSuccessSelect: function (oEvent) {
        var bSelected = oEvent.getParameter('selected');
        if (bSelected == true) {
          this.getView().getModel('viewModel').setProperty('/bEnableUpdate', true);
        } else {
          this.getView().getModel('viewModel').setProperty('/bEnableUpdate', false);
        }
      },

      onInputFactoryValueHelpRequest: async function (oEvent) {
        var pageModel = this.getView().getModel();
        var view = this.getView();
        this.getView()
          .getModel()
          .read(factoryVH, {
            //filters: filters,
            success: function (data, response) {
              console.log(data);
            },
            error: (oError) => MessageBox.error(JSON.parse(oError.responseText).error.message.value, { title: 'Ошибка' }),
          });

        if (!this._valueHelpDialog) {
          this._valueHelpDialog = await ValueHelpConfig.createValueHelp({
            title: 'Предприятия',
            model: this.getView().getModel(),
            multiSelect: false,
            keyField: 'ID',
            keyDescField: 'Description',
            basePath: factoryVH,
            columns: [
              {
                label: 'Название',
                path: 'Description',
              },
            ],
            ok: function (selectedRow) {
              //pageModel.setProperty("/factory_numc", selectedRow.ID);
              view.byId('factory').setValue(selectedRow.Description);
              view.byId('factoryid').setValue(selectedRow.ID);
              ///view.byId('tabel').setValue(99999999);
            },
          });
          this.getView().addDependent(this._valueHelpDialog);
        }
        this._valueHelpDialog.open();
      },
    });
  },
);
