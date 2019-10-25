import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = []; //New items into the list are pushed here.
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item; //This is just best practice, not explained why?
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);// Check array for where array elem id === passed in id
        this.items.splice(index, 1);
    }

    updateCount (id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
        
    }
}