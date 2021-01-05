import { LightningElement, wire, track, api } from 'lwc';
import getRecordList from '@salesforce/apex/recordMap.getRecordList';
import getSingleRecord from '@salesforce/apex/recordMap.getSingleRecord';
import { NavigationMixin } from 'lightning/navigation';

export default class interactiveMap extends NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName;
    @api queryObject;
    @api zoomLevel;
    @api latitudeField;
    @api longitudeField;
    @track mapMarkers;
    @track selectedMarkerValue;
    @track listView;
    @track center;
    @track showCommunityNavigation = false;
    @track recordName;
    @track targetRecordId;
    @track url;
    @track recordRefPage;
    
    connectedCallback() {
        if (!(this.recordId === null)) {
            getSingleRecord({
                    id: this.recordId, 
                    objectName: this.objectApiName, 
                    latField: this.latitudeField, 
                    longField: this.longitudeField
                })
            .then(result => {
                this.mapMarkers = result;
                this.listView = 'hidden';
            })
            .catch(error => {
                this.error = error;
            });
        } else {
            getRecordList( {
                objectName: this.queryObject,
                latField: this.latitudeField,
                longField: this.longitudeField
            })
            .then(result => {
                this.mapMarkers = result;
                this.listView = 'hidden';
            })
            .catch(error => {
                this.error = error;
            });
        }
           
    }    

    handleMarkerSelect(event) {
        this.selectedMarkerValue = event.target.selectedMarkerValue; //set Id here
        if (this.recordId.isBlank()) {
            for (var i = 0; i < this.mapMarkers.length; i++) {
                if(this.mapMarkers[i].value == this.selectedMarkerValue) {
                    this.recordName = this.mapMarkers[i].title;
                    this.recordId = this.mapMarkers[i].value;
                }
            }
            this.showCommunityNavigation = true;
            
            this.communityRefPage = {
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.communityId,
                    actionName: 'view'
                }
            };
            this[NavigationMixin.GenerateUrl](this.recordRefPage)
                .then(url => this.url = url);
        } 
    }

    navigateButtonClicked(event) {
        // Stop the event's default behavior.
        event.preventDefault();
        // Stop the event from bubbling up in the DOM.
        event.stopPropagation();
        // Navigate to the Community Record page.
        this[NavigationMixin.Navigate](this.recordRefPage);
    }
}