import { LightningElement, wire, track } from 'lwc';
import fetchAccounts from '@salesforce/apex/GetAccounts.fetchAccounts';

export default class Pagination extends LightningElement {
    currentPage = 1;
    accounts;
    selectedAccounts = [];
    allAccounts = [];
    currentPageToAccounts = new Set(); 
    accids = [];
    namesLst = new Set();
    currentPageAccounts = [];
    disPre = true;
    disNxt = false;
    message = false;
    disableIpt = false;
    
    
    @wire(fetchAccounts, { currentPage: '$currentPage' }) 
    accessAccounts({ error, data }) {
      if (data) {
        this.accounts = JSON.parse(data);
        
        this.accounts = this.accounts.map(({ attributes, ...account }) => account);
        
        
        try {
        if (this.accounts.length > 0) {
            this.message = false;
            this.disableIpt = false;
            if(this.currentPage !== 1){
                this.disPre = false;
            }
            else{
                this.disPre = true;
            }
        } else {
            this.disNxt = true;
            this.message = true;
            this.disableIpt = true;
        }
    } catch (error) {
        console.error('Error in handleAccounts:', error);
    }
        
        
        if (this.selectedAccounts.length > 0) {
            this.accounts = this.accounts.map(account => {
                const isChecked = this.selectedAccounts.includes(account.Id);
                return { ...account, isChecked };
            });
        } else {
            this.accounts = this.accounts.map(account => ({ ...account, isChecked: false }));
        }
        console.log('this.selectedAccounts ', JSON.stringify(this.selectedAccounts));
        this.currentPageAccounts = [...this.accounts];
        const duplicate = this.accounts.filter(item => this.accids.includes(item.Id));
        if(duplicate.length === 0){
            if (this.selectedAccounts.length > 0) {
            this.allAccounts = this.allAccounts.map(account => {
                const isChecked = this.selectedAccounts.includes(account.Id);
                return { ...account, isChecked };
            });
        } else {
            this.accounts = this.accounts.map(account => ({ ...account, isChecked: false }));
        }
            console.log('Duplicate', JSON.stringify(this.accounts));
            this.allAccounts = [...this.accounts, ...this.allAccounts];
            this.accids = this.allAccounts.map(acc => acc.Id);
            this.namesLst = new Set(this.allAccounts.map(acc => acc.Name));
        }
        console.log('this.accIds ', this.accids);
        console.log('this.allAccounts', JSON.stringify(this.allAccounts));
        
      } else if (error) {
        console.error('Error:', error);
      }
    }

    handleNext() {
    this.currentPage += 1;
    }

    handlePrev(){
        if(this.currentPage > 1){
            this.currentPage -= 1;
            this.disNxt = false;
        }
        
    }

    onaccountselection(event){
        this.selectedAccounts = event.detail;
    }

    handleSearch(event){
        const seacrhTerm = event.target.value;

        if(seacrhTerm){
            this.accounts = this.allAccounts.filter(acc => {
                
                if(acc.Name.toLowerCase().includes(event.target.value.toLowerCase())){
                    return acc;
                }
            }
               
            );
        }
        else{
            this.accounts = this.currentPageAccounts;
        }
    }
}