import { BaseModel } from '@startupjs/orm'

export default function (racer) {
  racer.orm('pgGames', PGGames)
  racer.orm('pgGameDatas.*', PGGameData)
}

class PGGames extends BaseModel {
  async addNew ({ name }) {
    const pgGameId = this.id()
    await this.root.add(this.getCollection(), {
      id: pgGameId,
      name,
      playersCount: 0,
      createdAt: Date.now()
    })
    return pgGameId
  }
}

class PGGameData extends BaseModel {
  async addSelf (pgGameId) {
    const pgGameDataId = pgGameId
    await this.root.add(this.getCollection(), {
      id: pgGameDataId,
      round: 0,
      roundsData: []
    })
    return pgGameDataId
  }
}
