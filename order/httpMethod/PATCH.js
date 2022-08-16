import AWS from "aws-sdk";

export default async function PATCH(event) {
  const DB = new AWS.DynamoDB.DocumentClient();

  const { oldRecord, newRecord } = JSON.parse(event.body);

  await DB.delete({
    TableName: "jejuLiveStock-order",
    Key: {
      uuid: oldRecord.uuid,
    },
  }).promise();

  await DB.put({
    TableName: "jejuLiveStock-order",
    Item: newRecord,
  }).promise();

  return {};
}
