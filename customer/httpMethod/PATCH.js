import AWS from "aws-sdk";

export default async function PATCH(event) {
  const DB = new AWS.DynamoDB.DocumentClient();

  const { oldRecord, newRecord } = JSON.parse(event.body);

  await DB.delete({
    TableName: "jejuLiveStock-customer",
    Key: {
      uuid: oldRecord.uuid,
    },
  }).promise();

  await DB.put({
    TableName: "jejuLiveStock-customer",
    Item: newRecord,
  }).promise();

  return {};

  // const queryParameter = {
  //   TableName: "jejuLiveStock-customer",
  //   Key: {
  //     customerName,
  //     customerTel,
  //   },
  //   ExpressionAttributeNames: {
  //     "#customerName": "customerName",
  //   },
  //   ExpressionAttributeValues: {
  //     ":label": "Global Records",
  //   },
  //   UpdateExpression: "SET RecordLabel = :label",
  // };
  // return await DB.update(queryParameter).promise();
}
