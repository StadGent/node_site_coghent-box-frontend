<template>
    <canvas id="canvas" :width="bodyWidth" height="800"></canvas>
</template>


<script lang="ts">
import { defineComponent, onMounted, computed, ref, PropType, Ref, Prop, watch, toRefs } from 'vue'
import { fabric } from 'fabric'
import * as Hammer from 'hammerjs'
import { Square } from '../models/SquareModel'
import { Result } from '../models/CollectionModel'
import SetupFabricService, { colorArray } from '../services/canvas/SetupFabricService'

export default defineComponent({
  name: 'TouchCanvas',
  props: {
    basket: {
      type: Array as PropType<Square[]>,
      required: true
    },
    entities: {
      type: Array as PropType<Result[]>,
      required: true
    },
    legend: {
      type: Array,
      required: true
    }
  },
  emits: ['update:basket', 'update:legend'],
  setup: (props, { emit }) => {
    const fabricService: SetupFabricService = new SetupFabricService()
    let selectedSquare: Square
    let canvas: any
    const basketHeight = 130

    const bodyWidth = computed<number>(() => {
      return document.body.clientWidth
    })

    const setSquareLineOpacity = (square: Square, opacity: number) => {
      square.lines.going.forEach((line: any) => {
        // make sure not showing lines to the basket
        if(opacity === 100 && line.top < basketHeight){
          line.opacity = 0
        } else {
          line.opacity = opacity
        }
      })
      square.lines.coming.forEach((line: any) => {
        if(opacity === 100 && line.top < basketHeight){
          line.opacity = 0
        } else {
          line.opacity = opacity
        }
      })
    }

    const setRect = (rect: Square, entity: Result) => {
      rect.left = fabric.util.getRandomInt(100, bodyWidth.value - 200)
      rect.top = fabric.util.getRandomInt(basketHeight, 600)
      rect.strokeWidth = 5
      rect.id = entity._id
      rect.data = entity.data
      rect.metadata = entity.metadata,
      rect.lines = {going: [], coming: []}
    }

    const getLine = (prevEntity: Square, entity: Square) => {
      return new fabric.Line([ 
        prevEntity.left + (prevEntity.width*prevEntity.scaleX)/2, 
        prevEntity.top + (prevEntity.height*prevEntity.scaleY)/2, 
        entity.left + (entity.width*entity.scaleX)/2, 
        entity.top + (entity.height*entity.scaleY)/2 ], 
        {
          fill: prevEntity.stroke,
          stroke: prevEntity.stroke,
          strokeWidth: 3,
          selectable: false,
          evented: false
        }
      )
    }

    const loadEntities = (entities: Result[]) => {
      canvas.clear()
      fabricService.drawBasket(canvas, props.basket, basketHeight, bodyWidth.value)
      // sketchy fix for updating legend: 
      props.legend.length = 0
      emit('update:legend', props.legend)

      const types = new Map()
      entities.map((entity) => {
        fabric.Image.fromURL(entity.image, function(rect: any) {
          if(entity.image === undefined) {
            rect = new fabric.Rect({
              width: 150,
              height: 100
            })
          } else {
            rect.scaleToHeight(100)
          }
          setRect(rect, entity)
          rect.stroke = colorArray[0]
          canvas.add(rect)

          entity.metadata.map((meta) => {
            if(meta.key === "type"){
              const type = types.get(meta.value)
              if(type){
                rect.stroke = type[0].stroke
                rect.fill = type[0].stroke
                types.set(meta.value, [...type, rect])

                const entity = type[type.length - 1]
                const line = getLine(entity, rect)
                entity.lines.going.push(line)
                rect.lines.coming.push(line)
                canvas.add(line)
                canvas.sendToBack(line)
              } else {
                rect.stroke = colorArray[types.size] 
                rect.fill = colorArray[types.size] 
                props.legend.push({'type': meta.value, 'color': rect.stroke})
                types.set(meta.value, [rect])
                emit('update:legend', props.legend)
              }
            }
            
            if(meta.key === "title") {
              const rectText = new fabric.Textbox(meta.value, { 
                left: rect.left, 
                top: rect.top,
                fontSize: 20,
                selectable: false,
                evented: false,
                width: 100 
              })
              rect.title = rectText
              canvas.add(rectText)
            }
          })
        })
      })
    }

    const dropSquare = (basket: Square[], square: Square, height: number, left: number) => {
      let squareAdded = -1
      for(var i = 0; i < basket.length; i++) {
        if (basket[i].id == square.id) {
            squareAdded = i
            break;
        }
      }

      // check if the square isn't already in the basket
      if(square.top < height && square.left > left && square.left < (bodyWidth.value - left)) {
        basket.push(square)
        square.set({
          left: left + 20 + ((basket.length - 1) * 150) + ((basket.length - 1) * 20),
          top: 18,
          angle: 0
        })
        square.title?.set({'top': square.top, 'left': square.left})
        setSquareLineOpacity(square, 0)
      } else if (squareAdded > -1){
        basket.splice(squareAdded, 1)
        for(var i = 0; i < basket.length; i++) {
          basket[i].set({
            left: left + 20 + (i * 150) + (i * 20),
            top: 18
          })
          basket[i].title?.set({'top': basket[i].top, 'left': basket[i].left})
        }
        setSquareLineOpacity(square, 100)
      }
      emit('update:basket', basket)
    }

    watch(
      () => props.entities,
      (newEntities: Result[]) => {
        loadEntities(newEntities)
      },
      { deep: true }
    )

    onMounted(() => {
      canvas = fabricService.setupFabric()

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

      fabricService.drawBasket(canvas, props.basket, basketHeight, bodyWidth.value)

      canvas.on('mouse:down', function(options: any) {
        if (options.target) {
          console.log(options.target)
          selectedSquare = options.target
        }
      })

      canvas.on('mouse:up', function(options: any) { 
        if (options.target) {
          dropSquare(props.basket, options.target, 100, 100)
        }
      })

      canvas.on('object:moving', function(e: any) {
        const entity = e.target
        console.log(entity.width)
        entity.lines.going.map((line: any) => {
          line.set({ 'x1': entity.left + (entity.width*entity.scaleX)/2, 'y1': entity.top + (entity.height*entity.scaleY)/2 })
        })
        entity.lines.coming.map((line: any) => {
          line.set({ 'x2': entity.left + (entity.width*entity.scaleX)/2, 'y2': entity.top + (entity.height*entity.scaleY)/2 })
        })
        entity.title.set({'top': entity.top, 'left': entity.left})
      })
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