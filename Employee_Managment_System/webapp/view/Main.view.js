sap.ui.jsview("roro.view.Main",{
   getControllerName: function(){
      return "roro.controller.Main";
   },  
   //the "oController"is a enstance of the whole Main.controller.js passes to the view
   createContent: function(oController)
   {
      var oInp = new sap.m.Input("idInput",{
         width: "80px" 
      });
     var oBtn = new sap.m.Button("idbtn",{
      text:"click me"
     });
     return [oInp, oBtn] ;
   }
}); 