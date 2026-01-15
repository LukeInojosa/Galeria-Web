import { DomManipulator, dataNameIs} from "./dom.js";
import { DataBase } from "./api.js";

document.body.appendChild(
    DomManipulator.createElement(
        DomManipulator.Main()
    )
)

const db = new DataBase('base',1)
const imageTableExist = await db.create('images')

async function refreshGalery(){
    const galery = document.querySelector(dataNameIs('Galeria'))
    const images = await db.getAll('images')
    images.forEach(element => {
        galery.appendChild(
            DomManipulator.createElement(
                DomManipulator.Figure(element.url,element.key)
            )
        )
    });
}
refreshGalery()

document.addEventListener('insert',
    async (event) => {
        const files = event.detail.files
        const keys = await db.put('images',files)
        const galery = document.querySelector(dataNameIs('Galeria'))
        for (const key of keys){
            galery.appendChild(
                DomManipulator.createElement(
                    DomManipulator.Figure(await db.get('images',key),key)
                )
            )
        }
    }   
)

let deleteList = []
document.addEventListener('delete',
    (event) => {
        if (event.detail.checked){
            const key = event.detail.key
            const element = event.detail.element
            deleteList.push({key,element})
        } else {
            deleteList = deleteList.filter((reg) => reg.key != event.detail.key)
        }
        console.log(deleteList)
    }   
)

document.addEventListener('deleteAll',
    async () => {
        const toDeleteNow = deleteList
        deleteList = []
        if(toDeleteNow.length == 0) console.log('marque algo para deletar')
        for(const register of toDeleteNow){
            const deleted = await db.delete('images',Number(register.key))
            if (deleted){
                URL.revokeObjectURL(register.element.querySelector('img').src)
            }
            register.element.remove()
        }

    }
)

document.addEventListener('selectAll', (event) =>{
    document.querySelectorAll(`input[type='checkbox']`).forEach(e => {
        if(event.detail.select){
            if (!e.checked) e.click()
        }else {
            if (e.checked) e.click()
        }
    })    
})


