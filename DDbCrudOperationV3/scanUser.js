const {DynamoDBClient} = require('@aws-sdk/client-dynamodb')
const {DynamoDBDocumentClient,ScanCommand} = require('@aws-sdk/lib-dynamodb')


const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const scanUser = async(event) => {
    try{
        console.log('[INFO] scanUser Event' , event)

        const params = {
            TableName : "UserTable2",
            ProjectionExpression : "#name , #age, email",
            ExpressionAttributeNames : {
                "#name" : "name",
                "#age" : "age"
            }
        }

        const sendData = new ScanCommand(params)
        const response = await docClient.send(sendData)
        console.log('[INFO] user scanned successfully' , JSON.stringify(response.Items))
        return response
    }
    catch(err){
        console.log('[ERROR] error while scanning usersData', err)
        throw err
    }
}

module.exports.handler = async(event) => {
    try{
        console.log('[INFO] event' , event)
        const response = await scanUser(event)
        return {
            headers : {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : '*'
            },
            statusCode : 200,
            body : JSON.stringify({
                message : 'Users data scanned successfully',
                data : response.Items
            })
        }
    }
    catch(err){
        console.log('[ERROR] error ', err)
        throw err
    }
}