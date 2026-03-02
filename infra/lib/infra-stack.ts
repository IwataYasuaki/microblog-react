import * as cdk from 'aws-cdk-lib/core'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as path from 'path'
import { Construct } from 'constructs'

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // DynamoDB
    const table = new dynamodb.Table(this, 'PostsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    // Lambda共通設定
    const lambdaProps = {
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../backend/dist')),
      environment: {
        TABLE_NAME: table.tableName,
      },
    }

    // Lambda関数
    const listPostsFn = new lambda.Function(this, 'ListPostsFunction', {
      ...lambdaProps,
      handler: 'handlers/posts/list.handler',
    })

    const createPostFn = new lambda.Function(this, 'CreatePostFunction', {
      ...lambdaProps,
      handler: 'handlers/posts/create.handler',
    })

    const deletePostFn = new lambda.Function(this, 'DeletePostFunction', {
      ...lambdaProps,
      handler: 'handlers/posts/delete.handler',
    })

    const likePostFn = new lambda.Function(this, 'LikePostFunction', {
      ...lambdaProps,
      handler: 'handlers/posts/like.handler',
    })

    const unlikePostFn = new lambda.Function(this, 'UnlikePostFunction', {
      ...lambdaProps,
      handler: 'handlers/posts/unlike.handler',
    })

    // DynamoDBアクセス権限
    table.grantReadData(listPostsFn)
    table.grantWriteData(createPostFn)
    table.grantWriteData(deletePostFn)
    table.grantReadWriteData(likePostFn)
    table.grantReadWriteData(unlikePostFn)

    // API Gateway
    const api = new apigateway.RestApi(this, 'MicroblogApi', {
      restApiName: 'Microblog API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    })

    const posts = api.root.addResource('posts')
    posts.addMethod('GET', new apigateway.LambdaIntegration(listPostsFn))
    posts.addMethod('POST', new apigateway.LambdaIntegration(createPostFn))

    const post = posts.addResource('{postId}')
    post.addMethod('DELETE', new apigateway.LambdaIntegration(deletePostFn))

    const likes = post.addResource('likes')
    likes.addMethod('POST', new apigateway.LambdaIntegration(likePostFn))
    likes.addMethod('DELETE', new apigateway.LambdaIntegration(unlikePostFn))
  }
}
