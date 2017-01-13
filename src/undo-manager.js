/**
 * Created by yeanzhi on 16/12/4.
 */
'use strict';
export default class UndoManager {
    constructor(limit,undoScopeHost) {
        this._stack = [];
        this.limit = limit;
        this.position = 0;
        this.length = 0;
        this._fireEvent = typeof CustomEvent != 'undefined' && undoScopeHost && undoScopeHost.dispatchEvent;
        this._ush = undoScopeHost;
    }

    transact(transaction, merge) {
        if (arguments.length < 2) {
            throw new TypeError('Not enough arguments to UndoManager.transact.');
        }

        transaction.execute();

        if (this.position > 0) {
            this.clearRedo();
        }

        let transactions;
        if (merge && this.length) {
            transactions = this._stack.first().push(transaction);
            this._stack = this._stack.shift().unshift(transactions);
        }
        else {
            transactions = Immutable.List.of(transaction);
            this._stack = this._stack.unshift(transactions);
            this.length++;

            if (this._limit && this.length > this._limit) {
                this.clearUndo(this._limit);
            }
        }

        this._dispatch('DOMTransaction', transactions);
    }

    undo() {
        if (this.position >= this.length) { return; }

        let transactions = this._stack.get(this.position);
        let i = transactions.size;
        while (i--) {
            transactions.get(i).undo();
        }
        this.position++;

        this._dispatch('undo', transactions);
    }

    redo() {
        if (this.position === 0) { return; }

        this.position--;
        let transactions = this._stack.get(this.position);
        for (let i = 0; i < transactions.size; i++) {
            transactions.get(i).redo();
        }

        this._dispatch('redo', transactions);
    }

    _dispatch(event, transactions) {
        if (this._fireEvent) {
            this._ush.dispatchEvent(new CustomEvent(event, {
                detail: {transactions: transactions.toArray()},
                bubbles: true,
                cancelable: false
            }));
        }
    }
}
