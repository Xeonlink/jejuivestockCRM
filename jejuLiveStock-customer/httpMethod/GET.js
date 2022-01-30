import AWS from "aws-sdk";

export default async function POST(event) {
  const DB = new AWS.DynamoDB.DocumentClient();

  let { customerName, customerTel } = event.queryStringParameters;
  const queryParameter = {
    TableName: "jejuLiveStock-customer",
    IndexName: undefined,
    ExpressionAttributeNames: {
      "#customerName": customerName === "" ? undefined : "customerName",
      "#customerTel": customerTel === "" ? undefined : "customerTel",
    },
    ExpressionAttributeValues: {
      ":customerName": customerName === "" ? undefined : customerName,
      ":customerTel": customerTel === "" ? undefined : customerTel,
    },
    KeyConditionExpression: undefined,
  };

  if (customerName !== "" && customerTel === "") {
    queryParameter.KeyConditionExpression = "#customerName = :customerName";
  }
  if (customerName !== "" && customerTel !== "") {
    queryParameter.KeyConditionExpression =
      "#customerName = :customerName and #customerTel = :customerTel";
  }
  if (customerName === "" && customerTel !== "") {
    queryParameter.IndexName = "customerTel-index";
    queryParameter.KeyConditionExpression = "#customerTel = :customerTel";
  }

  return await DB.query(queryParameter).promise();
}
