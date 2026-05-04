import { ApiResponse, Data } from "./Model";

export async function attrApi(request: Data): Promise<ApiResponse> {
  console.log(request);
  const response = await fetch("/attr", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  console.log(response);

  const parsedResponse: ApiResponse = await response.json();

  if (response.status > 299 || !response.ok) {
    throw Error(parsedResponse.error || "Unknown Error Occured");
  }
  return parsedResponse;
}
