import AWS from "aws-sdk";

export default async function GET(event) {
  const DB = new AWS.DynamoDB.DocumentClient();
  const { queryKey, ...otherParameters } = event.queryStringParameters;

  const paramBuilder = new DBParamBuilder();
  paramBuilder.setTableName("jejuLiveStock-order");

  if (queryKey === "dateRange") {
    const { dateStart, dateEnd } = otherParameters;
    paramBuilder.appendScanFilter(
      "date",
      "BETWEEN",
      YYYY_MM_DD(dateStart),
      YYYY_MM_DD(dateEnd)
    );
    // paramBuilder.appendScanFilter("date", "BE", YYYY_MM_DD(dateStart));
    // paramBuilder.appendScanFilter("date", "LE", YYYY_MM_DD(dateEnd));
  }

  if (queryKey === "accepterName") {
    const { accepterName } = otherParameters;
    paramBuilder.appendScanFilter("accepterName", "CONTAINS", accepterName);
  }

  if (queryKey === "accepterTel") {
    const { accepterTel } = otherParameters;
    paramBuilder.appendScanFilter("accepterTel", "CONTAINS", accepterTel);
  }

  if (queryKey === "addr") {
    const { addr } = otherParameters;
    paramBuilder.appendScanFilter("addr", "CONTAINS", addr);
  }

  if (queryKey === "addrDetail") {
    const { addrDetail } = otherParameters;
    paramBuilder.appendScanFilter("addrDetail", "CONTAINS", addrDetail);
  }

  if (queryKey === "memo") {
    const { memo } = otherParameters;
    paramBuilder.appendScanFilter("memo", "CONTAINS", memo);
  }

  return [...(await DB.scan(paramBuilder.build()).promise()).Items];
}

class DBParamBuilder {
  constructor() {
    this.param = {};
  }

  setTableName(tableName) {
    this.param.TableName = tableName;
    return this;
  }

  setPartitionKey(key, value) {
    this.param.KeyConditions = {
      ...this.param.KeyConditions,
      [key]: {
        ComparisonOperator: "EQ",
        AttributeValueList: [value],
      },
    };
    this.isQuery = true;
    return this;
  }

  setSortKey(key, operator, value) {
    this.param.KeyConditions = {
      ...this.param.KeyConditions,
      [key]: {
        ComparisonOperator: operator,
        AttributeValueList: [value],
      },
    };
    return this;
  }

  appendScanFilter(key, operator, value1, value2) {
    this.param.ScanFilter = {
      ...this.param.ScanFilter,
      [key]: {
        ComparisonOperator: operator,
        AttributeValueList: [value1, value2],
      },
    };
    return this;
  }

  appendQueryFilter(key, operator, value) {
    this.param.QueryFilter = {
      ...this.param.QueryFilter,
      [key]: {
        ComparisonOperator: operator,
        AttributeValueList: [value],
      },
    };
    return this;
  }

  build() {
    return this.param;
  }
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
