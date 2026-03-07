import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
  TransactWriteCommand,
  BatchGetCommand,
} from '@aws-sdk/lib-dynamodb'
import type { Post } from '@microblog/shared'
import { randomUUID } from 'crypto'

export class PostRepository {
  private client: DynamoDBDocumentClient
  private tableName: string
  private likesTableName: string

  constructor(tableName: string, likesTableName: string) {
    this.tableName = tableName
    this.likesTableName = likesTableName
    const dynamoClient = new DynamoDBClient({})
    this.client = DynamoDBDocumentClient.from(dynamoClient)
  }

  async listPosts(): Promise<Post[]> {
    const result = await this.client.send(
      new ScanCommand({
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
      likedByMe: false,
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

  async likePost(postId: string, userId: string): Promise<void> {
    await this.client.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: this.likesTableName,
              Item: { userId, postId },
            },
          },
          {
            Update: {
              TableName: this.tableName,
              Key: { id: postId },
              UpdateExpression: 'ADD likeCount :inc',
              ExpressionAttributeValues: { ':inc': 1 },
            },
          },
        ],
      })
    )
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    await this.client.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Delete: {
              TableName: this.likesTableName,
              Key: { userId, postId },
            },
          },
          {
            Update: {
              TableName: this.tableName,
              Key: { id: postId },
              UpdateExpression: 'ADD likeCount :dec',
              ExpressionAttributeValues: { ':dec': -1 },
            },
          },
        ],
      })
    )
  }

  async getLikedPostIds(userId: string, postIds: string[]): Promise<string[]> {
    if (postIds.length === 0) return []

    const result = await this.client.send(
      new BatchGetCommand({
        RequestItems: {
          [this.likesTableName]: {
            Keys: postIds.map((postId) => ({ userId, postId })),
          },
        },
      })
    )

    const items = result.Responses?.[this.likesTableName] ?? []
    return items.map((item) => item.postId as string)
  }
}
