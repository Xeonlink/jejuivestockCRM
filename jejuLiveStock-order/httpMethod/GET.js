import AWS from "aws-sdk";

export default async function GET(event) {
  const DB = new AWS.DynamoDB.DocumentClient();

  let { dateStart, dateEnd } = event.queryStringParameters;
  let queriedData;
  let responseBody = [];

  while (dateStart <= dateEnd) {
    queriedData = await DB.query({
      TableName: "jejuLiveStock-order",
      IndexName: "orderDate-index",
      ExpressionAttributeValues: {
        ":dateStart": dateStart,
      },
      ExpressionAttributeNames: {
        "#orderDate": "orderDate",
      },
      KeyConditionExpression: "#orderDate = :dateStart",
    }).promise();

    queriedData.Count > 0 && responseBody.push(...queriedData.Items);

    dateStart = new Date(dateStart);
    dateStart.setDate(dateStart.getDate() + 1);
    dateStart = YYYY_MM_DD(dateStart);
  }

  return responseBody;
}

function YYYY_MM_DD(date) {
  let x = new Date(date);
  let YYYY = x.getFullYear().toString();
  let MM = (x.getMonth() + 1).toString();
  let DD = x.getDate().toString();
  DD.length === 1 && (DD = "0" + DD);
  MM.length === 1 && (MM = "0" + MM);
  return `${YYYY}-${MM}-${DD}`;
}
