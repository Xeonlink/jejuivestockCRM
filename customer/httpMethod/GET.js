import AWS from "aws-sdk";

export default async function GET(event) {
  const {
    customerName: partitionKey,
    customerTel: sortKey,
    ...others
  } = {
    ...event.queryStringParameters,
  };

  const paramBuilder = new DBParamBuilder();
  paramBuilder.setTableName("jejuLiveStock-customer");
  // paramBuilder.setPartitionKey("customerName", partitionKey);
  // paramBuilder.setSortKey("customerTel", sortKey);
  paramBuilder.setFilter("customerName", partitionKey);
  paramBuilder.setFilter("customerTel", sortKey);

  Object.entries(others).forEach(([key, value]) =>
    paramBuilder.setFilter(key, value)
  );
  const param = paramBuilder.build();

  const DB = new AWS.DynamoDB.DocumentClient();
  return [...(await DB.scan(param).promise()).Items];
  // return !!partitionKey === true // if is Query
  //   ? [...(await DB.query(param).promise()).Items]
  //   : [...(await DB.scan(param).promise()).Items];
}

class DBParamBuilder {
  constructor() {
    this.param = {};
    this.isQuery = false;
  }

  setTableName(tableName) {
    this.param.TableName = tableName;
    return this;
  }

  setPartitionKey(key, value) {
    if (!!value === false) return this;

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

  setSortKey(key, value) {
    if (!!value === false) return this;

    if (this.isQuery) {
      this.param.KeyConditions = {
        ...this.param.KeyConditions,
        [key]: {
          ComparisonOperator: "EQ",
          AttributeValueList: [value],
        },
      };
      return this;
    }

    this.param.ScanFilter = {
      ...this.param.ScanFilter,
      [key]: {
        ComparisonOperator: "CONTAINS",
        AttributeValueList: [value],
      },
    };
    return this;
  }

  setFilter(key, value) {
    if (!!value === false) return this;

    if (this.isQuery) {
      this.param.QueryFilter = {
        ...this.param.QueryFilter,
        [key]: {
          ComparisonOperator: "CONTAINS",
          AttributeValueList: [value],
        },
      };
      return this;
    }

    this.param.ScanFilter = {
      ...this.param.ScanFilter,
      [key]: {
        ComparisonOperator: "CONTAINS",
        AttributeValueList: [value],
      },
    };
    return this;
  }

  build() {
    return this.param;
  }
}
