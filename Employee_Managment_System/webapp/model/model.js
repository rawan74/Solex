// "sap/ui/model/xml/XMLModel",
sap.ui.define(
  ["sap/ui/model/json/JSONModel", "sap/ui/model/resource/ResourceModel"],
  function (JSONModel, ResourceModel) {
    return {
      createJSONnModel: function (addressOfDataFile) {
        //steps to create a Model
        //step 1: create a brand new model object
        var oModel = new JSONModel();
        //step:2 set/load the data inside the model
        oModel.loadData(addressOfDataFile);
        //step 3 : return the model obj
        return oModel;
      },
      // createXMLModel: function () {
      //   var oModel = new XMLModel();
      //   oModel.loadData("model/mockData/myDemo.xml");
      //   return oModel;
      // },
      createResourceModel: function () {
        var oModel = new ResourceModel({
          bundleUrl: "i18n/i18n.properties",
        });
        return oModel;
      },
    };
  }
);
