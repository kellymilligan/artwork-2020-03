const canvasSketch = require( 'canvas-sketch' )
const { random } = require( 'canvas-sketch-util' )

const Vector = require( './Vector' )
const Box = require( './Box' )
const Octree = require( './Octree' )

/* Config */

const settings = {
  dimensions: [ 1024, 1024 ]
}

/* Toolbox */

const drawCircle = ( ctx, x = 0, y = 0, r = 1 ) => {
  ctx.beginPath()
  ctx.arc( x, y, r, 0, Math.PI * 2 )
  ctx.closePath()
}

/* Artwork */

const sketch = () => {
  return ( { context, width, height } ) => {

    const depth = width
    const otree = Octree( Box( width * 0.1, height * 0.1, depth * 0.1, width * 0.8, height * 0.8, depth * 0.8 ), 10 )

    context.fillStyle = 'white'
    context.fillRect( 0, 0, width, height )

    /* --- */

    const COUNT = 11
    const RADIUS = width * 0.01
    const MAX_ATTEMPTS = COUNT * 2

    let currentCount = 1
    let failedAttempts = 0

    const centerPoint = Vector( width / 2, height / 2, depth / 2 )
    otree.insert( centerPoint )

    do {

      const newPoint = Vector(
        width * 0.1 + width * 0.8 * random.value(),
        height * 0.1 + height * 0.8 * random.value(),
        depth * 0.1 + depth * 0.8 * random.value()
      )

      // console.log( newPoint )

      // if ( !Box( 0, 0, 0, width, height, depth ).contains( newPoint ) ) continue

      // const queryRange = Box( newPoint.x - RADIUS * 2, newPoint.y - RADIUS * 2, newPoint.z + RADIUS * 2, RADIUS * 4, RADIUS * 4, RADIUS * -4 )

      // context.save()
      // context.strokeStyle = 'red'
      // context.strokeRect( queryRange.x, queryRange.y, queryRange.width, queryRange.height )
      // context.restore()

      // const collisions = otree.query( queryRange )

      // if ( collisions.length ) {
      //   failedAttempts += 1
      // }
      // else {
        otree.insert( newPoint )
        currentCount += 1

        // context.save()
        // context.strokeStyle = '#0f0'
        // context.strokeRect( queryRange.x, queryRange.y, queryRange.width, queryRange.height )
        // context.restore()
      // }

      if ( failedAttempts >= MAX_ATTEMPTS ) {
        console.log( 'Too many failed attempts.' )
        break
      }

    } while ( currentCount < COUNT )

    const allPoints = otree.query( Box( 0, 0, 0, width, height, depth ) )
    for ( let i = 0; i < allPoints.length; i++ ) {
      const point = allPoints[ i ]
      context.save()
      context.fillStyle = `rgb(${255 * (point.z / depth)}, 0, ${255 * (1 - point.z / depth)})`
      drawCircle( context, point.x, point.y, RADIUS )
      context.fill()
      context.restore()
    }

    otree.visualize( context )

    const searchVolume = Box( width * 0.25, width * 0.25, depth * 0.25, width * 0.33, width * 0.33, depth * 0.33 )

    context.save()
    context.strokeStyle = '#0f0'
    context.strokeRect( searchVolume.x, searchVolume.y, searchVolume.width, searchVolume.height )
    const points = otree.query( searchVolume )
    for ( let point of points ) {
      context.fillStyle = '#0ff'
      drawCircle( context, point.x, point.y, width * 0.005 )
      context.fill()
    }
    // const randomPoint = otree.getRandomPoint()
    // context.fillStyle='#f0f'
    // drawCircle( context, randomPoint.x, randomPoint.y, randomPoint.z, width * 0.005 )
    // context.fill()
    context.restore()

  }
}

canvasSketch( sketch, settings )
