import * as cdk from 'aws-cdk-lib/core'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as cognito from 'aws-cdk-lib/aws-cognito'
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

    // Cognito
    const userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true, username: true },
      autoVerify: { email: true },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    })

    // UserPoolIdとClientIdを出力
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    })

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    })

    // API Gateway
    const api = new apigateway.RestApi(this, 'MicroblogApi', {
      restApiName: 'Microblog API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    })

    // Cognitoオーソライザー
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      'Authorizer',
      {
        cognitoUserPools: [userPool],
      }
    )

    const posts = api.root.addResource('posts')
    posts.addMethod('GET', new apigateway.LambdaIntegration(listPostsFn))
    posts.addMethod('POST', new apigateway.LambdaIntegration(createPostFn), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    })
    const post = posts.addResource('{postId}')
    post.addMethod('DELETE', new apigateway.LambdaIntegration(deletePostFn), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    })

    const likes = post.addResource('likes')
    likes.addMethod('POST', new apigateway.LambdaIntegration(likePostFn), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    })
    likes.addMethod('DELETE', new apigateway.LambdaIntegration(unlikePostFn), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    })

    // S3バケット
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    // CloudFront
    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    })

    // CloudFrontのURLを出力
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
    })

    // S3にフロントエンド資材をデプロイ
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [
        s3deploy.Source.asset(path.join(__dirname, '../../frontend/dist')),
      ],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    })
  }
}
