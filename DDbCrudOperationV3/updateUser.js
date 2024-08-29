const {DynamoDBClient, ReturnValue} = require('@aws-sdk/client-dynamodb')
const {DynamoDBDocumentClient,UpdateCommand} = require("@aws-sdk/lib-dynamodb")


const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const updateUser = async(event) => {
    try{
        const {id, name, age} = JSON.parse(event.body)
        const params = {
            TableName : 'UserTable2',
            Key: {
                id,
                name
            },

            UpdateExpression : 'SET #age = :age',
            ExpressionAttributeNames : {
                '#age' : "age"
            },
            ExpressionAttributeValues : {
                ':age' : age
            },
            ReturnValues :"ALL_NEW"
        }

        const sendData = new UpdateCommand(params)
        const responseData = await docClient.send(sendData)
        console.log('[INFO] User updated Successfully' , JSON.stringify(responseData.Attributes))
        return responseData
    }
    catch(err){
        console.log('[ERROR]' , err)
    }
}

module.exports.handler = async(event) => {
    try{
        console.log('[INFO] Event', event)
        const response = await updateUser(event)
        return{
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : '*'
            },
            statusCode : 200,
            body : JSON.stringify({
                msg : "User Updated Successfully",
                data : response.Attributes
            })

        }
    }
    catch(err){
        console.log('[ERROR] error while updating user' , err)
    }
}