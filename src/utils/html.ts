import * as fs from 'fs'
import * as mustache from 'mustache'
import * as path from 'path'

export const renderMainTemplate = (
  options: { [key: string]: unknown },
  partials?: mustache.PartialsOrLookupFn
): string =>
  mustache.render(
    fs.readFileSync(path.join(__dirname, '../../templates/main.mustache')).toString(),
    options,
    partials
  )
