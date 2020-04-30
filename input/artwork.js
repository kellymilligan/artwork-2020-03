const canvasSketch = require( 'canvas-sketch' )
const { random } = require( 'canvas-sketch-util' )
random.setSeed( 0 /* random.getRandomSeed() */ )

const Vector = require( './Vector' )
const Box = require( './Box' )
const Sphere = require( './Sphere' )
const Octree = require( './Octree' )

/* Config */

const settings = {
  dimensions: [ 2048, 2048 ]
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
    const otree = Octree( Box( 0, 0, 0, width, height, depth ), 10 )

    context.fillStyle = 'white'
    context.fillRect( 0, 0, width, height )

    /* --- */

    const COUNT = 100000
    const RADIUS = width * 0.0035
    const MAX_ATTEMPTS = COUNT

    let currentCount = 1
    let failedAttempts = 0

    // const centerPoint = Vector( width / 2, height / 2, depth / 2 )
    // otree.insert( centerPoint )

    do {

      const newPoint = Vector(
        width * 0.1 + width * 0.8 * random.value(),
        height * 0.5,// + height * 0.8 * random.value(),
        depth * 0.1 + depth * 0.8 * random.value()
        // depth * 0.1
      )

      newPoint.x += random.noise3D( newPoint.x, newPoint.y, newPoint.z, 0.0006 ) * width * 0.12
      newPoint.y += random.noise3D( newPoint.x, newPoint.y, newPoint.z, 0.0009 ) * height * 0.17
      // newPoint.z += random.noise3D( newPoint.x, newPoint.y, newPoint.z, 0.0004 ) * depth * 0.15

      if ( !Box( width * 0.1, height * 0.1, depth * 0.1, width * 0.8, height * 0.8, depth * 0.8 ).contains( newPoint ) ) continue

      // const queryVolume = Box( newPoint.x - RADIUS * 2, newPoint.y - RADIUS * 2, newPoint.z - RADIUS * 2, RADIUS * 4, RADIUS * 4, RADIUS * 4 )
      const queryVolume = Sphere( newPoint.x, newPoint.y, newPoint.z, RADIUS * 2 )

      const collisions = otree.query( queryVolume )

      if ( collisions.length ) {
        failedAttempts += 1
      }
      else {
        otree.insert( newPoint )
        currentCount += 1
      }

      if ( failedAttempts >= MAX_ATTEMPTS ) {
        console.log( 'Too many failed attempts. Stopped trying to add new points...' )
        break
      }

    } while ( currentCount < COUNT )

    const allPoints = otree.getAllPoints()
    for ( let i = 0; i < allPoints.length; i++ ) {
      const point = allPoints[ i ]
      context.save()
      context.globalAlpha = 0.95
      context.globalCompositeOperation = 'darken'
      context.fillStyle = `rgb(${255 * (1 - point.z / depth)}, 0, ${255 * (point.z / depth)})`
      drawCircle( context, point.x, point.y, RADIUS )
      context.fill()
      context.restore()
    }

    // otree.visualize( context )

    // const searchVolume = Box( width * 0.25, width * 0.25, depth * 0.25, width * 0.33, width * 0.33, depth * 0.33 )

    // context.save()
    // context.strokeStyle = '#0f0'
    // context.strokeRect( searchVolume.x, searchVolume.y, searchVolume.width, searchVolume.height )
    // const points = otree.query( searchVolume )
    // for ( let point of points ) {
    //   context.fillStyle = '#0ff'
    //   drawCircle( context, point.x, point.y, width * 0.005 )
    //   context.fill()
    // }
    // const randomPoint = otree.getRandomPoint()
    // context.fillStyle='#f0f'
    // drawCircle( context, randomPoint.x, randomPoint.y, width * 0.005 )
    // context.fill()
    // context.restore()

  }
}

canvasSketch( sketch, settings )
