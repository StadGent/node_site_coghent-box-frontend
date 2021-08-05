
import { fabric } from 'fabric'
import { Square } from '../../models/SquareModel'

export const colorArray = [
    'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'cyan', 'gold', 'grey', 'maroon', 'olive', 'navy', 'teal'
]

export default class SetupFabricService {

    public setupFabric(): any {
        const canvas = new fabric.Canvas('canvas')
        canvas.preserveObjectStacking = true // keep z-index of selected objects

        return canvas
    }

    public drawBasket(canvas: any, basket: any, basketHeight:number, bodyWidth: number): void {
        const basketRect = new fabric.Rect({
            width : bodyWidth - 200,
            height : basketHeight,
            fill : 'red',
            stroke: 'black',
            strokeWidth: 5,
            originX: 'center',
            originY: 'center'
        })

        const basketText = new fabric.Text('Basket', { 
            originX: 'center',
            originY: 'center'
        })

        const basketSquare = new fabric.Group([ basketRect, basketText ], {
            top : 0,
            left : 100,
            selectable: false,
            evented: false
        })

        canvas.add(basketSquare)

        basket.forEach((rect: Square) => {
            canvas.add(rect)
            canvas.add(rect.title)
        })
    }

    public loadRandomSquares(canvas: any, numOfSquares: number, bodyWidth: number) {
        for (let index = 0; index < numOfSquares; index++) {
            const rect = new fabric.Rect({
                top : Math.floor(Math.random() * 600) + 100,
                left : Math.floor(Math.random() * bodyWidth) + 100,
                width : 70,
                height : 70,
                fill : colorArray[Math.floor(Math.random() * colorArray.length) + 0],
                id : 'my-square-' + index
            })

            canvas.add(rect)
        }
    }
}