const {DynamoDBClient} = require('@aws-sdk/client-dynamodb')
const {DynamoDBDocumentClient,PutCommand} = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)


const createUser = async(event) => {
    try{
        console.log('[INFO] event from addUser', event)
        const data = JSON.parse(event.body)
        const params = {
            TableName : "UserTable2",
            Item : {
                ...data
            },  
        }
        const sendData = new PutCommand(params)
        const response = await docClient.send(sendData)
        console.log('data-added', response)
        return response
    }
    catch(err){
        throw err
    }
}
module.exports.handler = async (event) => {
  
    try{
        console.log('[INFO] EVENT', event)
        const response = await createUser(event)
        return  {
            headers:{
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
            },
            statusCode: 200,
            body: JSON.stringify({
                message: 'created user Info',
                data: response.Attributes
            })
        }
    }
    catch(err){
        console.log('[ERROR]', err)
        throw err
    }

};
