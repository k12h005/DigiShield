const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class FileDB {
    constructor(collectionName) {
        this.filePath = path.join(__dirname, '../../data', `${collectionName}.json`);
        this.ensureFileExists();
    }

    ensureFileExists() {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([]));
        }
    }

    read() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error(`Error reading ${this.filePath}:`, err);
            return [];
        }
    }

    write(data) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error(`Error writing ${this.filePath}:`, err);
        }
    }

    async findMany(query = {}) {
        let items = this.read();
        return items.filter(item => {
            for (let key in query) {
                if (item[key] !== query[key]) return false;
            }
            return true;
        });
    }

    async findUnique(query = {}) {
        const items = await this.findMany(query);
        return items[0] || null;
    }

    async create(data) {
        const items = this.read();
        const newItem = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...data
        };
        items.push(newItem);
        this.write(items);
        return newItem;
    }

    async update(id, data) {
        const items = this.read();
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return null;
        
        items[index] = {
            ...items[index],
            ...data,
            updatedAt: new Date().toISOString()
        };
        this.write(items);
        return items[index];
    }

    async delete(id) {
        const items = this.read();
        const filtered = items.filter(item => item.id !== id);
        this.write(filtered);
        return true;
    }
}

module.exports = FileDB;
