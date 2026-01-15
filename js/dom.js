export const dataNameIs = (atributo) => {
    if (atributo){
        return `[data-element-name=${atributo}]`
    }
    return `[data-element-name]`
}
export const classIs = (classe) => `.${classe}`

export class DomManipulator {

    static createTag(element){
        return (name) => {
            let wrapper = document.createElement('div')
            wrapper.innerHTML = element
            wrapper.firstElementChild.dataset.elementName = name
            return wrapper.innerHTML
        }
    }
    
    static Form(){
       return this.createTag(
        `
            <form>
                <label for='arquivos'>Selecione as Fotos</label>
                <input id='arquivos' type='file' name='arquivos' accept='image/*' multiple />
                <button>Carregar Imagens</button>
            </form>      
        `
        )('Form')
    }

    static Button(classe,value){
        return this.createTag(
            `<button type="button" class = "${classe}">${value}</button>`
        )('Button')
    }

    static Galeria(){
        return this.createTag(
        `
            <section>
            </section>
        `
        )('Galeria')
    }

    static Main(){
        return this.createTag(
        `
            <div id='main'>
                <header>
                <input type='checkbox' id='select-all'>
                ${this.Button('delete', 'delete')}
                </header>
                ${this.Galeria()}
                <footer>
                ${this.Button('insert', '+')}
                </footer>
            </div>
        `)('Main')
    }

    static Figure(src,image_index,alt_text = '',caption = ''){
        return this.createTag(
        `
            <figure>
                <img src = '${src}' alt = '${alt_text}' loading = 'lazy'/>
                <figcaption>${caption}</figcaption>
                <input type='checkbox' name='key' value=${image_index}>   
            <figure>
        `
        )('Figure')
    }

    static Banner(content){
        return this.createTag(
        `
            <div>
                ${content}
            </div>
        `
        )('Banner')
    }
    
    static Image(src,alt_text='',caption=''){
        return this.createTag(
        `
            <figure>
                <img src = '${src}' alt = '${alt_text}'/>
                <figcaption>${caption}</figcaption>
            <figure>
        `
        )('Image')
    }

    static createElement(elementDescriptor) {
        let wrapper = document.createElement('div')
        wrapper.innerHTML = elementDescriptor
        wrapper.querySelectorAll(dataNameIs()).forEach((e) => {
            Iteractions.register(e.dataset.elementName, e)
        })
        return wrapper.firstElementChild
    }
    
}

export class Iteractions{
    
    static iteraction = {
        'Figure': (element) => {this.Figure(element)},
        'Banner': (element) => {this.Banner(element)},
        'Button': (element) => {this.Button(element)},
        'Main': (element) => {this.Main(element)},
    }

    static register(elementType, element){
        const fn = this.iteraction[elementType]
        if (fn) fn(element)
    }

    static Figure(elem) {
        elem.querySelector('input').addEventListener('click', e => {e.stopPropagation()})
        elem.querySelector('input').addEventListener('change', (e) => {
            e.stopPropagation()
            const markedFigure = new CustomEvent('delete', {
                detail: {
                    checked: e.currentTarget.checked,
                    key: e.currentTarget.value,
                    element: e.currentTarget.parentElement
                },
                bubbles: true
            })
            document.dispatchEvent(markedFigure)
        }) 
        elem.addEventListener('click', 
            (event) =>{
                let element = event.target.closest('figure')
                const imgToShow = element.querySelector('img')
                const figCaption = element.querySelector('figcaption').textContent

                const banner = DomManipulator.createElement(
                    DomManipulator.Banner(
                        DomManipulator.Image(imgToShow.src, imgToShow.alt, figCaption)
                    )
                )

                function arrowRigth(){
                    const image = banner.querySelector(dataNameIs('Image'))
                    const nextImage = document.querySelector(dataNameIs('Galeria'))
                                                .querySelector(`[src='${image.querySelector('img').src}']`)
                                                ?.parentElement
                                                ?.nextElementSibling
                                                ?.querySelector('img')
                    if (nextImage){
                        image.remove()
                        banner.appendChild(
                            DomManipulator.createElement(
                                DomManipulator.Image(nextImage.src, nextImage.alt)
                            )
                        )
                    }
                }

                function arrowLeft(){
                    const image = banner.querySelector(dataNameIs('Image'))
                    const nextImage = document.querySelector(dataNameIs('Galeria'))
                                                .querySelector(`[src='${image.querySelector('img').src}']`)
                                                ?.parentElement
                                                ?.previousElementSibling
                                                ?.querySelector('img')
                    if(nextImage){
                        image.remove()
                        banner.appendChild(
                            DomManipulator.createElement(
                                DomManipulator.Image(nextImage.src, nextImage.alt)
                            )
                        )
                    }
                }
                document.addEventListener('keydown', (e) => {
                    if(e.key == 'ArrowRight'){
                        arrowRigth()
                    }else if(e.key == 'ArrowLeft'){
                        arrowLeft()
                    }else if (e.key == 'Escape'){
                        banner.click()
                    }
                })
                let x = 0
                let y = 0
                document.addEventListener('pointerdown', (e) => {
                    e.preventDefault()
                    x = e.clientX
                    y = e.clientY
                })
                document.addEventListener('pointerup', (e) => {
                    e.preventDefault()
                    let diffX = e.clientX - x
                    let diffY =Math.abs( e.clientY - y)
                    if(diffX > 30 && diffY < 50){
                        arrowLeft()
                    }
                    if(diffX < -30 && diffY < 50){
                        arrowRigth()
                    }
                })

                document.body.appendChild(banner)
            }
        )
        // elem.addEventListener('mouseover',
        //     (event) => {
        //         const element = event.target.closest('figure')
        //         element.querySelector('input').style.display = ''
        //     }
        // )
        // elem.addEventListener('mouseout',
        //     (event) =>{
        //         const element = event.target.closest('figure')
        //         element.querySelector('input').style.display = 'none'
        //     }
        // )
    }

    static Banner(elem) {
        elem.addEventListener('click', 
            (event) => {
                if (event.target == event.currentTarget)
                    event.currentTarget.remove()
            }
        )
    }

    static Button(elem) {
        if (elem.classList.contains('insert')){
            elem.addEventListener('click', (event) => {
                const banner = DomManipulator.createElement(
                    DomManipulator.Banner(DomManipulator.Form())
                )
                banner.querySelector('button').addEventListener('click', 
                    (e) => {
                        e.preventDefault()
                        const insertEvent = new CustomEvent('insert',{
                            detail: {
                                files: e.target.parentElement.querySelector('input').files
                            },
                            bubbles: true
                        })
                        document.dispatchEvent(insertEvent)
                    }
                )
                document.body.appendChild(banner)
            })   
        }else if (elem.classList.contains('delete')){
            elem.addEventListener('click', (event) => {
                const deleteAll = new CustomEvent('deleteAll')
                document.dispatchEvent(deleteAll)
            })
        }
    }
    static Main(elem) {
        elem.querySelector('#select-all').addEventListener('change', (event) => {
            const selectAll = new CustomEvent('selectAll', {
                detail:{
                    select: event.currentTarget.checked
                },
                bubbles:true
            })
            document.dispatchEvent(selectAll)
        })
    }
}