class PQElement<T> {
    element: T;
    priority: number;

    constructor(element: T, priority: number) {
        this.element = element;
        this.priority = priority;
    }
}

class PriorityQueue<T> {
    items: PQElement<T>[];

    constructor() {
        this.items = [];
    }

    enqueue(element: T, priority: number) {
        const pqElement = new PQElement<T>(element, priority);
        let contain = false;

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority < pqElement.priority) {
                this.items.splice(i, 0, pqElement);
                contain = true;
                break;
            }
        }

        if (!contain) {
            this.items.push(pqElement);
        }
    }

    isEmpty() {
        return this.items.length === 0;
    }

    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift()?.element;
    }

    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0].element;
    }

    print() {
        let str = '';
        for (let i = 0; i < this.items.length; i++) {
            str += `${this.items[i].priority} - ${this.items[i].element}\n`;
        }
        return str;
    }
}

export default PriorityQueue;
