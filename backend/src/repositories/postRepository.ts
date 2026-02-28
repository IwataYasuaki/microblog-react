import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb'
import type { Post } from '@microblog/shared'
import { randomUUID } from 'crypto'

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

  async createPost(input: {
    content: string
    authorName: string
  }): Promise<Post> {
    const post: Post = {
      id: randomUUID(),
      content: input.content,
      authorName: input.authorName,
      createdAt: new Date().toISOString(),
      likeCount: 0,
    }

    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: post,
      })
    )

    return post
  }

  async deletePost(postId: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { id: postId },
      })
    )
  }
}
