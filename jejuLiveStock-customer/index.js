import POST from "./httpMethod/POST.js";
import GET from "./httpMethod/GET.js";

export const handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: "Hello from Lambda!",
  };

  try {
    if (event.httpMethod === "POST") {
      response.body = await POST(event);
    }
    if (event.httpMethod === "GET") {
      response.body = await GET(event);
    }
  } catch (error) {
    response.body = error.message;
    response.statusCode = error.statusCode;
  }

  response.body = JSON.stringify(response.body);
  return response;
};
