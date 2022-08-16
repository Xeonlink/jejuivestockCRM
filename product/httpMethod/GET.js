import AWS from "aws-sdk";

export default async function GET(event) {
  const DB = new AWS.DynamoDB.DocumentClient();

  const scanResult = await DB.scan({
    TableName: "gobundal-product",
  }).promise();

  return [...scanResult.Items];
}
