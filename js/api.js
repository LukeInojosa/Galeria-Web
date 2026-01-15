export class DataBase {
    constructor(name){
        this.name = name
        this.version = 1
        this.db = undefined
    }
    create(table){
        return new Promise((resolve, reject) => {
            if(!window.indexedDB){
                console.log('navegador não possui acesso a indexedDB')
                reject(false)
            } 
            const request = window.indexedDB.open(this.name,this.version)
            request.onupgradeneeded = (e) => {
                request.result.createObjectStore(table, {autoIncrement:true})
            }
            request.onsuccess = (e) => {
                this.db = request.result
                resolve(true)
            }
            request.onerror = (e) => {
                console.log(e.target.error?.message)
                reject(false)
            }
        })
    }

    get(table,index){
        return new Promise((resolve, reject) => {
            if (!this.db) {
                console.log('A base de dados ainda não foi aberta. Não é possível utilizar o get')
                reject(undefined)
            }

            const tx = this.db.transaction([table])
            const request = tx.objectStore(table).get(index)
            request.onsuccess = (e) => {
                resolve(URL.createObjectURL(request.result))
            }
            request.onerror = (e) => {
                console.log(`não foi possível obter objeto de index: ${index}`)
                reject(undefined)
            }
        })
    }

    getAll(table){
        let result = []
        return new Promise((resolve,reject) => {
            if (!this.db) {
                console.log('A base de dados ainda não foi aberta. Não é possível utilizar o getAll')
                reject(undefined)
                return
            }

            this.db
            .transaction([table],'readonly')
            .objectStore(table)
            .openCursor()
            .onsuccess = (e) => {
                const cursor = e.target.result
                if(cursor){
                    result.push({key: Number(cursor.key), url: URL.createObjectURL(cursor.value)})
                    cursor.continue()
                }else{
                    resolve(result)
                }
            }
        })
    }

    put(table,data){
        let keys = []
        return new Promise((resolve,reject) => {
            const tx = this.db.transaction([table],'readwrite')
            const request = tx.objectStore(table)
            tx.oncomplete = (e) => {
                resolve(keys)
            }
            tx.onerror = (e) => {
                reject('não foi possível adicionar dado na tabela : transaction erro')
            }
            for (const d of data){
                const req = request.add(d)
                req.onsuccess = (e) => {
                    keys.push(e.target.result)
                }
            }
        })
    }

    delete(table, key){
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction([table],'readwrite')
            const req = tx.objectStore(table).delete(key)
            tx.oncomplete = () =>{
                resolve(true)
            }
            tx.onerror = () => {
                reject(false)
            }
        })
    }

    length(table){
        return new Promise((resolve) => {
            const req = this.db.transaction([table]).objectStore(table).count()
            req.onsuccess = () => {
                resolve(req.result)
            }
        })
    }
}