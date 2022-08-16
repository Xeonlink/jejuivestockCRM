import POST from "./httpMethod/POST.js";
import GET from "./httpMethod/GET.js";
import DELETE from "./httpMethod/DELETE.js";
import PATCH from "./httpMethod/PATCH.js";

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
    if (event.httpMethod === "DELETE") {
      response.body = await DELETE(event);
    }
    if (event.httpMethod === "PATCH") {
      response.body = await PATCH(event);
    }
  } catch (error) {
    response.body = error.message;
    response.statusCode = 500;
  }

  response.body = JSON.stringify(response.body);
  return response;
};
