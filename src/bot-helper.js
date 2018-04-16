import doHacks from './hacks'

let botCounter = 0

export const setupBots = async (bots) => {
  doHacks()

  let _bots = []

  for (let i = 0; i < bots.length; i++) {
    const objectOrUrl = bots[i].constructor.call({})
    let object

    // If object is a string, assume url
    if (typeof objectOrUrl === 'string') {
      // Load gists
      if (objectOrUrl.indexOf('api.github.com/gists') > -1) {
        let data = await window.fetch(objectOrUrl).then(r => r.json())
        let file = data.files[Object.keys(data.files)[0]]

        object = Function(file.content).call({}) // eslint-disable-line
      } else {
        let data = await window.fetch(objectOrUrl).then(r => r.text())

        object = Function(data).call({}) // eslint-disable-line
      }
    } else {
      object = objectOrUrl
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
