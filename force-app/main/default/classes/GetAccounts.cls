public with sharing class GetAccounts {
    @AuraEnabled(cacheable=true)
    public static String fetchAccounts(Integer currentPage){
        System.debug('currentPage ' + currentPage);
        List<Account> accList = [SELECT ID, NAME, Phone FROM Account where Page_No__c =: currentPage];
        
        String data = JSON.serialize(accList);
		System.debug(data);
        return data;
    }
}