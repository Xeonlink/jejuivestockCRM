import AWS from "aws-sdk";

export default async function PATCH(event) {
  const DB = new AWS.DynamoDB.DocumentClient();

  const { oldRecord, newRecord } = JSON.parse(event.body);

  await DB.delete({
    TableName: "gobundal-product",
    Key: {
      itemID: oldRecord.uuid,
    },
  }).promise();

  await DB.put({
    TableName: "gobundal-product",
    Item: newRecord,
  }).promise();

  return {};
}
