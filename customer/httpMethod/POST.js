import AWS from "aws-sdk";

export default async function POST(event) {
  const DB = new AWS.DynamoDB.DocumentClient();
  const customer = JSON.parse(event.body);

  const param = {
    TableName: "jejuLiveStock-customer",
    IndexName: "dupCheck-index",
    KeyConditions: {
      name: {
        ComparisonOperator: "EQ",
        AttributeValueList: [customer.name],
      },
      tel: {
        ComparisonOperator: "EQ",
        AttributeValueList: [customer.tel],
      },
    },
  };

  const existingRecord = await DB.query(param).promise();
  if (existingRecord.Count > 0) {
    const uuid = existingRecord.Items[0].uuid;

    await DB.delete({
      TableName: "jejuLiveStock-customer",
      Key: { uuid },
    }).promise();

    return await DB.put({
      TableName: "jejuLiveStock-customer",
      Item: { ...customer, uuid: uuid },
    }).promise();
  }

  return await DB.put({
    TableName: "jejuLiveStock-customer",
    Item: customer,
  }).promise();
}
