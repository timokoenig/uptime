/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs'
import * as mustache from 'mustache'
import * as path from 'path'

export const renderHtmlTemplate = (options: { [key: string]: any }): string =>
  mustache.render(
    fs.readFileSync(path.join(__dirname, '../../templates/index.mustache')).toString(),
    options
  )
