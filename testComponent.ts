
module TutorialComponent {
angular.module('ion.web.samples').controller("TutorialComponent", [
"$scope", 'ionweb.commService', 'ionweb.dataModelFactory','ionweb.configurationService', (scope: ionweb.IComponentScope,
comm: ionweb.ICommService, factory: ionweb.tables.IDataModelFactory, confService:
ionweb.IConfigurationService) => new TutorialComponent(scope,comm,factory,confService)]);
class TutorialComponent {
    public ownerValue: string;
    public user1Value: string;
    public user2Value: string;
    public user3Value: string;
    public records: { owner: string , user1 : string, user2:string , user3:string }[];
    public dataTable: ionweb.tables.IDataTable;
    private ownerField = 'OWNER';
    private user1Field = 'USER1';
    private user2Field = 'USER2';
    private user3Field = 'USER3';
    public stringvalue :string;
    private recordOpts: ionweb.ISubscriptionOptions;
    private chainOpts: ionweb.ISubscriptionOptions;
    private recordSub: ionweb. ISubscription;
    private chainSub: ionweb.ISubscription;

    private fCallOptions : ionweb.IFunctionOptions;
   
    
    constructor(private scope: ionweb.IComponentScope, private comm: ionweb.ICommService, private factory: ionweb.tables.IDataModelFactory, private confService: ionweb.IConfigurationService){
        var cfg = confService.config;
        var rawConfig = JSON.stringify(cfg, null, 4);
    
        this.stringvalue = cfg['samples']['sampleStringVar'];

        this.ownerValue = 'None';
        this.user1Value = 'None';
        this.user2Value = 'None';
        this.user3Value = 'None';
        this.records = [];

       /*  this.recordOpts = {
            id: "ALL.SWAY.REVIEW.USER_Aditya_Javlekar",
            fields: [this.ownerField, this.user1Field,this.user2Field,this.user3Field],
            type: ionweb.SubscriptionType.Record,
            supply: (id: string, fields: { [key: string]: ionweb.FieldValue }) => {
                this.onStatusSupply(id, fields);
            }
        }; */

        this.fCallOptions ={
            name: "REVIEW_RESULTS_PublishResults",
            namedArgs : {"Reporter" : "Maheep", "attribute": "Clarity" ,"PosA": "Himani" ,"PosB" : "Amit" ,"PosC" : "Mayank" ,"PosD" : "Kriti"},
            namedTypes : {"Reporter" : "STRING", "attribute": "STRING" ,"PosA": "STRING" ,"PosB" : "STRING" ,"PosC" : "STRING" ,"PosD" : "STRING"}
        };

        this.comm.invoke( this.fCallOptions);
        this.chainOpts = {
            id: this.stringvalue,
            type: ionweb.SubscriptionType.Chain,
            add: (id: string, fields: { [key: string]: ionweb.FieldValue }) => {
                this.onRecordAdded(id, fields);
            },
            fields: [this.ownerField]
        };
        this.recordSub = this.comm.subscribe(this.recordOpts);
        this.chainSub = this.comm.subscribe(this.chainOpts);
        this.scope.$on('$destroy', () => {
            this.recordSub.unsubscribe();
            this.chainSub.unsubscribe();
        });

        // Create a data-driven model bound to a chain.
        // Not specifying the set of field to subscribe, all fields will be
        // subscribed.
        var dataModel =
        factory.createChainDataModel(this.stringvalue, {});
        // Create a dataTable: behaviour and aspect is defined at creation time. The
        // factory will act as a facade and transparently create the relevant
        //datamodels beneath.
        // by passing an empty options object we create a table with a standard column
        // for each subscribed field ordered as they appear on the bus.
        this.dataTable = factory.createDataTable(dataModel, {});
    }
  
    // this function is called by the ION.WEB framework while managing a
    // supply of the GSTATUS record, see below.
    private onStatusSupply(id: string, fields: { [key: string]: ionweb.FieldValue }) {
        this.scope.$evalAsync(() => {
            this.ownerValue = <string>fields[this.ownerField];
            this.user1Value = <string>fields[this.user1Field];
            this.user2Value = <string>fields[this.user2Field];
            this.user3Value = <string>fields[this.user3Field];

            this.records.push(
                {
                owner: this.ownerValue,
                user1:this.user1Value,
                user2:this.user2Value,
                user3:this.user3Value
            });
        });
    }
    public onRecordAdded(id: string, fields: { [key: string]: ionweb.FieldValue }) {
        var test = <string>fields[this.ownerField]; 
        // this.scope.$evalAsync(() => { this.records.push(test) });

        this.recordOpts = {
            id: id,
            fields: [this.ownerField, this.user1Field,this.user2Field,this.user3Field],
            type: ionweb.SubscriptionType.Record,
            supply: (id: string, fields: { [key: string]: ionweb.FieldValue }) => {
                this.onStatusSupply(id, fields);
            }
        };
        this.comm.subscribe(this.recordOpts);
    }

     public onAttributeRecordAdded(id: string, fields: { [key: string]: ionweb.FieldValue }) {
        var test = <string>fields[this.ownerField]; 
        // this.scope.$evalAsync(() => { this.records.push(test) });

        this.recordOpts = {
            id: id,
            fields: [this.ownerField, this.user1Field,this.user2Field,this.user3Field],
            type: ionweb.SubscriptionType.Record,
            supply: (id: string, fields: { [key: string]: ionweb.FieldValue }) => {
                this.onStatusSupply(id, fields);
            }
        };
        this.comm.subscribe(this.recordOpts);
    }
}
}
export var templateUrl = require('./testComponent.tpl.html');
