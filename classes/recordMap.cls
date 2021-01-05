public with sharing class recordMap {
    @AuraEnabled(cacheable=true)

    public static list<map<string,object>> getRecordList(string objectName, string latField, string longField) {        

        // Generate query string
        string queryString = 'SELECT Id, Name, ' + latField + ', ' + longField + ' FROM ' + objectName + ' ORDER BY Name ASC';

        // SOQL Query
        List<sObject> sobjList = Database.query(queryString);

        // Create the Map
        list<map<string,object>> markerList = new list<map<string,object>>();
        
        markerList = createMarkerMap(sobjList, objectName, latField, longField);
            
        return markerList;
    }

    @AuraEnabled(cacheable=true)
    public static list<map<string,object>> getSingleRecord(string id, string objectName, string latField, string longField) {

        // Generate query string
        string queryString = 'SELECT Id, Name, ' + latField + ', ' + longField + ' FROM ' + objectName + ' WHERE Id = ' + '\''+id+'\'';

        // SOQL Query
        List<sObject> sobjList = Database.query(queryString);


        // Create the Map
        list<map<string,object>> markerList = new list<map<string,object>>();
        
        markerList = createMarkerMap(sobjList, objectName, latField, longField);
            
        return markerList;
    }

    private static list<map<string,object>> createMarkerMap(List<sObject> records, string objectName, string latField, string longField) {
        list<map<string,object>> markerReturnList = new list<map<string,object>>();
        string latitude = latField;
        string longitude = longField;
        for (sObject element : records) {
            if (element.get(latField) != null || element.get(longField) != null) {
                map<string,object> markerMap = new map<string,object>();
                    markerMap.put('title', element.get('Name'));
                    map<string,object> addressMap = new map<string,object>();
                    addressMap.put('Latitude', element.get(latField));
                    addressMap.put('Longitude', element.get(longField));
                    markerMap.put('location', addressMap);
                    markerMap.put('value', element.Id);
                    markerReturnList.add(markerMap);
                }
        }
        return markerReturnList;
    }
}
