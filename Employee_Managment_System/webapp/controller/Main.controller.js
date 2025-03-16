//define the dependecy of a model on another model
sap.ui.define(
  ["roro/controller/baseController", "roro/model/model", "roro/util/formatter"],
  function (Controller, myModel, formatter) {
    "use strict";

    return Controller.extend("roro.controller.Main", {
      //this how we define func. in UI5
      onInit: function () {
        var oModel = myModel.createJSONnModel("model/mockData/myData.json");
        var oModel2 = myModel.createJSONnModel("model/mockData/myData2.json");

        //one way binding
        //oModel.setDefaultBindingMode("OneWay");

        //step:3 make the mode aware to the application (you gave the model to the application)
        sap.ui.getCore().setModel(oModel); //--default model
        sap.ui.getCore().setModel(oModel2, "mango");

        // var OXMLModel = myModel.createXMLModel();
        // sap.ui.getCore().setModel(OXMLModel);
        var oResourceModel = myModel.createResourceModel();
        sap.ui.getCore().setModel(oResourceModel, "i18n");
        //step 4: binding in Xml view
        //sytanx 4 for data binding
        //this.getView().byId("idSal").bindValue("/empStr/salary");
        //this.getView().byId("idCurr").bindProperty("value", "/empStr/currency");
      },

      // we creating a global var to be used any where in any func. of my controller
      lifeSaver: formatter,

      onMagic: function (oEvent) {
        //step 1: get the model object from the application
        var oModel = sap.ui.getCore().getModel();
        //step 2:inside the model obj set the data
        oModel.setProperty("/empStr/mario", false);
      },
      flag: false,
      onFlip: function () {
        var oModel = sap.ui.getCore().getModel();
        var oModel2 = sap.ui.getCore().getModel("mango");
        sap.ui.getCore().setModel(oModel2);
        sap.ui.getCore().setModel(oModel, "mango");

        //flip betwnn xml model and json model
        var oTable = this.getView().byId("UITable");
        if (this.flag === false) {
          this.flag = true;
          oTable.bindRows("/empTable");
        } else {
          this.flag = false;
          oTable.bindRows("empTab/roW");
        }
      },
      onSelect: function (oEvent) {
        //step 1: give the add of the memory of the selected row
        var oContext = oEvent.getParameter("rowContext");
        var sPath = oContext.getPath();
        //step 2: bind the element to the simple form
        var oSimple = this.getView().byId("rr");
        oSimple.bindElement(sPath);
      },
      // onAfterRendering: function () {
      //   $("#idrawan--rawraw-sapUiTableCnt").fadeOut(5000).fadeIn(5000);
      // },
      onBeforeRendering: function () {},
    });
  }
);
