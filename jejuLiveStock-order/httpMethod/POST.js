import AWS from "aws-sdk";

export default async function POST(event) {
  const DB = new AWS.DynamoDB.DocumentClient();

  return await DB.put({
    TableName: "jejuLiveStock-order",
    Item: JSON.parse(event.body),
  }).promise();
}
