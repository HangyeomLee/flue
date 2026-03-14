export function mockDrawingRecognition(hasStrokes: boolean): Promise<boolean> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(hasStrokes && Math.random() > 0.3)
    }, 1200)
  })
}
