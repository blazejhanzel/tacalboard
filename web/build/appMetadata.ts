import { readFileSync } from 'node:fs'
import { type AppMetadata, BuildChannelSchema } from '../src/schemas/appMetadata'

const packageJson = JSON.parse(readFileSync('../package.json', 'utf-8'))
const packageVersion = String(packageJson.version)

const buildChannel = BuildChannelSchema.parse(process.env.BUILD_CHANNEL ?? 'dev')
const buildNumber = process.env.BUILD_NUMBER
const commitSha = process.env.BUILD_SHA?.slice(0, 7) ?? 'local'
const productionBuild = buildChannel === 'release'

function getVersionString(): string {
  if (!productionBuild) {
    return buildNumber
      ? `${packageVersion}-${buildChannel}.${buildNumber}+${commitSha}`
      : `${packageVersion}-${buildChannel}+${commitSha}`
  }

  return packageVersion
}

export const appMetadata: AppMetadata = {
  version: packageVersion,
  buildChannel,
  buildNumber,
  commitSha,
  productionBuild,
  versionString: getVersionString(),
}
