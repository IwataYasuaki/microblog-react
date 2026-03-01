import * as cdk from 'aws-cdk-lib/core'
import { Template } from 'aws-cdk-lib/assertions'
import { InfraStack } from '../lib/infra-stack'

let template: Template

beforeEach(() => {
  const app = new cdk.App()
  const stack = new InfraStack(app, 'TestStack')
  template = Template.fromStack(stack)
})

describe('InfraStack', () => {
  it('DynamoDBテーブルが作成される', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      BillingMode: 'PAY_PER_REQUEST',
    })
  })

  it('Lambda関数が5つ作成される', () => {
    template.resourceCountIs('AWS::Lambda::Function', 5)
  })

  it('API Gatewayが作成される', () => {
    template.resourceCountIs('AWS::ApiGateway::RestApi', 1)
  })
})
