import AWS from "aws-sdk";

export default async function DELETE(event) {
  const DB = new AWS.DynamoDB.DocumentClient();
  const { uuid } = JSON.parse(event.body);

  return await DB.delete({
    TableName: "jejuLiveStock-order",
    Key: {
      uuid,
    },
  }).promise();
}
