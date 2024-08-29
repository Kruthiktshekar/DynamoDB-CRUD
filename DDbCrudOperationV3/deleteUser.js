const {DynamoDBClient} = require('@aws-sdk/client-dynamodb')
const {DynamoDBDocumentClient,DeleteCommand} = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const deleteUser = async(event) => {
    try{
        const { id, name} = JSON.parse(event.body)
        const params = {
            TableName : 'UserTable2',
            Key: {
                id,
                name
            }
        }
    
        const sendData = new DeleteCommand(params)
        const responseData = await docClient.send(sendData)
        console.log('[INFO] user deleted successfully', JSON.stringify(responseData.Attributes))
        return responseData
    }
    catch(err){
        console.log('[ERROR]', err)
    }
}

module.exports.handler = async(event) => {
    try{
        console.log('[INFO] Event:', event)
        const response = await deleteUser(event)
        return{
            headers:{
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : '*'
            },
            statusCode : 200,
            body : JSON.stringify({
                msg : 'User deleted Successfully',
                data: response.Attributes
            })
        }
    }
    catch(err){
        console.log('[ERROR] error while deleting the user',err)
        throw err
    }
}
