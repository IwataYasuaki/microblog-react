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

  it('Lambda関数が7つ作成される', () => {
    // 5つのハンドラー関数
    // + S3のautoDeleteObjects: trueによるオブジェクト削除用Lambda
    // + BucketDeploymentによるデプロイ用Lambda
    template.resourceCountIs('AWS::Lambda::Function', 7)
  })

  it('API Gatewayが作成される', () => {
    template.resourceCountIs('AWS::ApiGateway::RestApi', 1)
  })

  it('API GatewayにCORSが設定される', () => {
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
    })
  })

  it('API GatewayにCognitoオーソライザーが設定される', () => {
    template.hasResourceProperties('AWS::ApiGateway::Authorizer', {
      Type: 'COGNITO_USER_POOLS',
    })
  })

  it('S3バケットが作成される', () => {
    template.resourceCountIs('AWS::S3::Bucket', 1)
  })

  it('CloudFrontディストリビューションが作成される', () => {
    template.resourceCountIs('AWS::CloudFront::Distribution', 1)
  })

  it('BucketDeploymentが作成される', () => {
    template.resourceCountIs('Custom::CDKBucketDeployment', 1)
  })

  it('Cognitoユーザープールが作成される', () => {
    template.resourceCountIs('AWS::Cognito::UserPool', 1)
  })

  it('CognitoユーザープールクライアントJが作成される', () => {
    template.resourceCountIs('AWS::Cognito::UserPoolClient', 1)
  })
})
