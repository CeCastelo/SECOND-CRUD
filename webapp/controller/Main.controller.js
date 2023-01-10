sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/Text",
    "sap/ui/core/ID",
    "sap/ui/core/Fragment",
    "sap/ui/base/Object",
    "sap/m/Dialog",
  ],

    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        Controller,
        Filter,
        FilterOperator,
        JSONModel,
        MessageToast,
        Text,
        ID,
        Fragment,
        Object,
        Dialog
        ) {
        "use strict";
        let arrayid = [1]
        let lastID = ""
        let oTable;
        let oData;
        return Controller.extend("crud2.controller.Main", {
            onInit: function () {
                if(!this.oModel){
                    this.oModel = new JSONModel()
                    this.getView().setModel(this.oModel)
                }
                
                oTable = [
                    {
                        ID:"1",
                        User: "cesar castelo",
                        Access: "Full"
                    }
                ]
                this.oModel.setProperty("/Jobs", oTable)
            },

            onReload: function (oEvent) {
                window.location.reload();
              },

            onpressNew: function(){
              let TableId, oTable, Lastrecord
              TableId = "jobs_table"
              oTable= this.byId(TableId)  // para que serve?
              const oJobs = this.oModel.getProperty("/Jobs")
              this.oHistoric = oJobs
              Lastrecord = oJobs[oJobs.lenght -1]
              lastID = (parseFloat(Lastrecord.ID) +1).toString()

              this.SaveMode = "N"
              this.onCreateEditDialog("N", false, TableId)
              this.oModel.setProperty("/ID", lastID);
            },

            onCreateEditDialog: function(action, rowSelected, tableSelect){
                const oModelDialog = new sap.ui.model.json.JSONModel()
                const selectgrid = tableSelect

                this.oDialog = new sap.ui.xmlfragment(`crud2.view.Dialog`, this)
                this.getView().addDependent(this.oDialog)

                if(action === "N"){
                    this.oModel.setProperty("/NewOrEdit", "Novo Cadastro");
                    const lasID = this.oModel.getProperty("/ID");
                    const initialData = { ID: lastID };
                    oModelDialog.setData(initialData);
                    this.oDialog.setModel(oModelDialog, "form");
                    this.oDialog.open();
                }else{
                    const resourceText = this.getResourceBundle()
                    .getText("editRecord")
                    .replace("&Person", rowSelected)
                    oModelDialog.setData(rowSelected)
                    this.oModel.setProperty("/NewOrEdit", resourceText)
                    this.oDialog.setModel(oModelDialog, "form")
                    this.oDialog.open()
                }
            },

            getResourceBundle: function(){
                return this.getOwnerComponent().getModel("i18n").getResourceBundle()
            },

            onAfterClose: function(){
                this.oDialog.destroy()
            }

        });
    });
