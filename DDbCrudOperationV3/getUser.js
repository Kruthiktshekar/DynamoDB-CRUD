const {DynamoDBClient} = require('@aws-sdk/client-dynamodb')
const {DynamoDBDocumentClient,GetCommand} = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const getUser = async(event) => {

   try{ 
       console.log('[INFO] event params from getuser', event.queryStringParameters)
       const  {id,name} = event.queryStringParameters
    const params = {
        TableName : 'UserTable2',
        Key : {
            id,
            name
        }
    }

    const sendData = new GetCommand(params)
    const responseData = await docClient.send(sendData)
    console.log('[INFO] User got successfully' , JSON.stringify(responseData))
    return responseData
 }
 catch(err){
    console.log('[ERROR]', err)
    throw err
 } 
}

module.exports.handler = async(event) => {
    try{
        const response = await getUser(event)
        return{
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : '*'
            },
            statusCode: 200,
            body: JSON.stringify({
                msg : 'User Fetched',
                data : response.Attributes
            })
        }

    }
    catch(err){
        console.log('[ERROR] error while fetching user',err)
        throw err
    }
}