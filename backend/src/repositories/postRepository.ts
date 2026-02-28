import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { Post } from '@microblog/shared'

export class PostRepository {
  private client: DynamoDBDocumentClient
  private tableName: string

  constructor(tableName: string) {
    this.tableName = tableName
    const dynamoClient = new DynamoDBClient({})
    this.client = DynamoDBDocumentClient.from(dynamoClient)
  }

  async listPosts(): Promise<Post[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
      })
    )
    return (result.Items ?? []) as Post[]
  }
}
