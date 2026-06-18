module.exports = class EventEmitter {
    listeners = {};

    addListener(eventName, cb) {
        this.listeners[eventName] = this.listeners[eventName] || [];
        this.listeners[eventName].push(cb);
        return this;
    }

    on(eventName, cb) {
        return this.addListener(eventName, cb);
    }

    emit(eventName, ...args) {
        const callbacks = this.listeners[eventName];

        if (!callbacks || callbacks.length === 0) {
            return false;
        }

        callbacks.forEach(cb => cb(...args));
        return true;
    }

    removeListener(eventName, cb) {
        const callbacks = this.listeners[eventName];
        if (!callbacks) {
            return this;
        }
        this.listeners[eventName] = callbacks.filter(listener => listener !== cb);
        return this;
    }

    off(eventName, cb) {
        return this.removeListener(eventName, cb);
    }

    once(eventName, cb) {
        const onceWrapper = (...args) => {
            cb(...args);
            this.off(eventName, onceWrapper);
        };

        return this.on(eventName, onceWrapper);
    }
}
