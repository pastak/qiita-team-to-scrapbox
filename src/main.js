import path from 'path'
import fs from 'fs'
import command from 'commander'
import md2sb from 'md2sb'
import settings from '../package.json'


command
  .version(settings.version)
  .description(settings.description)
  .usage('qiita-team-to-scrapbox <qiita-export.json>')
  .arguments('<json>')
  .action(async (qiitaJsonPath) => {
    const qiitaJson = require(path.resolve(qiitaJsonPath))
    const pages = await Promise.all(qiitaJson.articles.map(async (article) => {
      const title = article.title
      const lines = (await md2sb(article.body)).split('\n')
      lines.unshift(title)
      lines.push(article.tags.map((tag) => '#' + tag.name).join(' '))
      return {title, lines}
    }))
    console.log(JSON.stringify({pages}))
  })
  .parse(process.argv)
