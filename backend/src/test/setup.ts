import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'

export const ddbMock = mockClient(DynamoDBDocumentClient)

beforeEach(() => {
  ddbMock.reset()
})
