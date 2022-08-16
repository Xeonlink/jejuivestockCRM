import AWS from "aws-sdk";

export default async function POST(event) {
  const DB = new AWS.DynamoDB.DocumentClient();
  const Item = JSON.parse(event.body);

  return await DB.put({
    TableName: "gobundal-product",
    Item: Item,
  }).promise();
}
