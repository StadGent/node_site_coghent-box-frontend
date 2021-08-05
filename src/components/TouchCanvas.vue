<template>
    <canvas id="canvas" :width="bodyWidth" height="800"></canvas>
</template>


<script lang="ts">
import { defineComponent, onMounted, computed, ref, PropType, Ref, Prop, watch, toRefs } from 'vue'
import { fabric } from 'fabric'
import * as Hammer from 'hammerjs'
import { Square } from '../models/SquareModel'
import { ElasticHit } from '../models/ElasticDataModel'

export default defineComponent({
  name: 'TouchCanvas',
  props: {
    basket: {
      type: Array as PropType<Square[]>,
      required: true
    },
    entities: {
      type: Array as PropType<ElasticHit[]>,
      required: true
    },
    legend: {
      type: Array,
      required: true
    }
  },
  emits: ['update:basket', 'update:legend'],
  setup: (props, { emit }) => {
    let selectedSquare: Square
    let canvas: any
    const colorArray = ['green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'cyan', 'gold', 'grey', 'maroon', 'olive', 'navy', 'teal']

    const bodyWidth = computed<number>(() => {
      return document.body.clientWidth
    })

    const loadRandomSquares = (canvas: any, numOfSquares: number) => {
      for (let index = 0; index < numOfSquares; index++) {
        const rect = new fabric.Rect({
          top : Math.floor(Math.random() * 600) + 100,
          left : Math.floor(Math.random() * bodyWidth.value) + 100,
          width : 70,
          height : 70,
          fill : colorArray[Math.floor(Math.random() * colorArray.length) + 0],
          id : 'my-square-' + index
        })

        canvas.add(rect)
      }
    }

    const drawBasket = () => {
      const basketRect = new fabric.Rect({
        width : bodyWidth.value - 200,
        height : 130,
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
        selectable: false
      })

      canvas.add(basketSquare)

      props.basket.forEach((rect) => {
        canvas.add(rect)
        canvas.add(rect.title)
      })
    }

    const setSquareLineOpacity = (square: Square, opacity: number) => {
      square.lines.going.forEach((line: any) => {
        if(opacity === 100 && line.top < 100){
          line.opacity = 0
        } else {
          line.opacity = opacity
        }
      })
      square.lines.coming.forEach((line: any) => {
        if(opacity === 100 && line.top < 100){
          line.opacity = 0
        } else {
          line.opacity = opacity
        }
      })
    }

    const loadEntities = (entities: ElasticHit[]) => {
        canvas.clear()
        drawBasket()
        const types = new Map()
        const legend: any[] = []
        entities.map((entity) => {
            const rect = new fabric.Rect({
                top : Math.floor(Math.random() * 600) + 130,
                left : Math.floor(Math.random() * (bodyWidth.value - 200)) + 100,
                width : 100,
                height : 100,
                fill : colorArray[0],
                id : entity._id,
                source: entity._source,
                lines: {going: [], coming: []}
            })

            canvas.add(rect)

            entity._source.metadata.map((meta) => {
                if(meta.key === "type"){
                  if(types.get(meta.value)){
                    rect.fill = types.get(meta.value)[0].fill
                    types.set(meta.value, [...types.get(meta.value), rect])
                  } else {
                    rect.fill = colorArray[types.size] 
                    legend.push({'type': meta.value, 'color': rect.fill})
                    types.set(meta.value, [rect])
                  }
                }
                
                if(meta.key === "title") {
                  const rectText = new fabric.Textbox(meta.value, { 
                    left: rect.left, 
                    top: rect.top,
                    fontSize: 20,
                    selectable: false,
                    evented: false,
                    width: 100 })
                  rect.title = rectText
                  canvas.add(rectText)
                }
            })
        })

        types.forEach((type) => {
          type.map((entity: Square, index: number) => {
            const nextTarget = type[index+1]
            if(nextTarget){
                const line = new fabric.Line([ entity.left + entity.width/2, entity.top + entity.height/2, nextTarget.left + nextTarget.width/2, nextTarget.top + nextTarget.height/2 ], {
                    fill: entity.fill,
                    stroke: entity.fill,
                    strokeWidth: 3,
                    selectable: false,
                    evented: false
                })

                entity.lines.going.push(line)
                nextTarget.lines.coming.push(line)
                canvas.add(line)
                canvas.sendToBack(line)
            }
          })
        })

        emit('update:legend', legend)
    }

    const selectedSquares = (squares: any) => {
      if(squares._objects){
        squares._objects.forEach((square: Square) => {
          console.log(square)
        })
      } else {
        console.log(squares)
        selectedSquare = squares
      }
    }

    const dropSquare = (basket: Square[], square: Square, height: number, left: number) => {
      let squareAdded = -1
      for(var i = 0; i < basket.length; i++) {
        if (basket[i].id == square.id) {
            squareAdded = i
            break;
        }
      }

      if(square.top < height && square.left > left && square.left < (bodyWidth.value - left)) {
        basket.push(square)
        square.scale(1)
        square.set({
          left: left + 20 + ((basket.length - 1) * 100) + ((basket.length - 1) * 20),
          top: 18,
          angle: 0
        })
        square.title.set({'top': square.top, 'left': square.left})
        setSquareLineOpacity(square, 0)
      } else if (squareAdded > -1){
        basket.splice(squareAdded, 1)
        for(var i = 0; i < basket.length; i++) {
          basket[i].set({
            left: left + 20 + (i * 100) + (i * 20),
            top: 18
          })
          basket[i].title.set({'top': basket[i].top, 'left': basket[i].left})
        }
        setSquareLineOpacity(square, 100)
      }
      emit('update:basket', basket)
    }

    watch(
      () => props.entities,
      (newEntities: ElasticHit[]) => {
        loadEntities(newEntities)
      },
      { deep: true }
    )

    onMounted(() => {
      canvas = new fabric.Canvas('canvas')
      canvas.preserveObjectStacking = true // keep z-index of selected objects

      const hammer = new Hammer(canvas.upperCanvasEl, {})
      const pinch = new Hammer.Pinch()
      const rotate = new Hammer.Rotate()
      pinch.recognizeWith(rotate)
      hammer.add([pinch, rotate])

      hammer.on("pinch rotate", function(ev: any) {
        if(selectedSquare){
          selectedSquare.scale(ev.scale)
          selectedSquare.rotate(ev.rotation)
        }
      })

      drawBasket()
      //loadRandomSquares(canvas, 10)

      canvas.on('mouse:down', function(options: any) {
        if (options.target) {
          selectedSquares(options.target)
        }
      })

      canvas.on('mouse:up', function(options: any) { 
        if (options.target) {
          dropSquare(props.basket, options.target, 100, 100)
        }
      })

      canvas.on('object:moving', function(e: any) {
        const entity = e.target
        entity.lines.going.map((line: any) => {
          line.set({ 'x1': entity.left + entity.width/2, 'y1': entity.top + entity.height/2 })
        })
        entity.lines.coming.map((line: any) => {
          line.set({ 'x2': entity.left + entity.width/2, 'y2': entity.top + entity.height/2 })
        })
        entity.title.set({'top': entity.top, 'left': entity.left})
      })

      /*canvas.on('object:moved', function(e: any) {
        basketLine.set({ 'opacity': 0 })
      })*/
    })

    return {
      bodyWidth
    }
  }
})


</script>

<style scoped>
canvas {
  background-color: #eee;
}
</style>