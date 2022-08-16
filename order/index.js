import POST from "./httpMethod/POST.js";
import GET from "./httpMethod/GET.js";
import PATCH from "./httpMethod/PATCH.js";
import DELETE from "./httpMethod/DELETE.js";

export const handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: "Hello from Lambda!",
  };

  try {
    switch (event.httpMethod) {
      case "POST":
        response.body = await POST(event);
        break;
      case "GET":
        response.body = await GET(event);
        break;
      case "PATCH":
        response.body = await PATCH(event);
        break;
      case "DELETE":
        response.body = await DELETE(event);
        break;
      default:
        throw new Error("httpMethod is not valid");
    }
  } catch (error) {
    response.body = error.message;
    response.statusCode = 500;
  }

  response.body = JSON.stringify(response.body);
  return response;
};
