import doHacks from './hacks'

let botCounter = 0

export const setupBots = async (bots) => {
  doHacks()

  let _bots = []

  for (let i = 0; i < bots.length; i++) {
    const objectOrPromise = bots[i].constructor.call({})
    let object

    // If object is a promise, wait for it
    if (objectOrPromise.then) {
      const data = await objectOrPromise

      // If data.files exists, assume it's a gist
      if (data && data.files) {
        const file = data.files[Object.keys(data.files)[0]]
        object = Function(file.content).call({}) // eslint-disable-line
      } else {
        object = Function(data).call({}) // eslint-disable-line
      }
    } else {
      object = objectOrPromise
    }

    _bots.push({
      ...bots[i],
      key: ++botCounter,
      object,
      health: 100,
      reload: 30,
      pos: (
        i === 0
          ? { x: -50, y: -50 }
          : { x: 50, y: 50 }
      )
    })
  }

  return _bots
}
