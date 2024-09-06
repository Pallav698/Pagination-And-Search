import { api, LightningElement } from 'lwc';


export default class AccountsDisplayedOnParent extends LightningElement {
    @api accounts;
    selectedAccountIds = [];

    handleCheckboxChange(event){
        const accountId = event.target.dataset.id;

        if (event.target.checked) {
            if (!this.selectedAccountIds.includes(accountId)) {
                this.selectedAccountIds.push(accountId);
            }
        } else {
            this.selectedAccountIds = this.selectedAccountIds.filter(id => id !== accountId);
        }

        console.log('accountIds ', JSON.stringify(this.selectedAccountIds));
        this.dispatchEvent(new CustomEvent('accountselection', { detail: this.selectedAccountIds }));
    }
    
}