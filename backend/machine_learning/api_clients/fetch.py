from .loader import JSON, GEMINI_API_URL, HEADERS, get_prompt
import httpx
import asyncio
from typing import Literal
from pymodule.utility import prismelt


async def async_post_request(*, url, json, headers):
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=json, headers=headers)
        return response


async def request_gemini(request_type: Literal["s", "r", "c", "t"], message: str):
    if not isinstance(message, str):
        raise TypeError(f"message must be a string, not {type(message).__name__}.")
    if request_type not in ["s", "r", "c", "t"]:
        raise ValueError(f"request type be `s`, `r`, `t` or `c`.")

    try:
        prompt = get_prompt(key=request_type)
        text = f"{prompt} Here's the user's message: {message}"
        JSON["contents"][0]["parts"][0]["text"] = text
        response = await async_post_request(
            url=GEMINI_API_URL, json=JSON, headers=HEADERS
        )
        # prismelt("We are here!", color=(255, 0, 0))

        if response.status_code == 200:
            data = response.json()
            finish_reason = data["candidates"][0]["finishReason"]
            if finish_reason != "STOP":
                return {
                    "error": True,
                    "error_message": "Unable to parse data by Gemini",
                    "response": "BAD INPUT",
                }
            else:
                parsed_data = await parseGeminiResponse(
                    data=data, request_type=request_type
                )
                return parsed_data
        else:
            return {
                "error": True,
                "error_message": f"Unable to fetch data from gemini, likely to be a request issue, detail: {response.status_code} error.",
                "response": "API ERROR",
            }

    except Exception as e:
        return {
            "error": True,
            "error_message": f"Unable to fetch data from gemini, likely to be a 500 error. detail: {e}",
            "response": "SYSTEM ERROR",
        }


async def parseGeminiResponse(*, data: dict, request_type: str) -> dict:
    response_text: str = data["candidates"][0]["content"]["parts"][0]["text"]
    response_text = response_text.strip("\n").strip()
    prismelt(f"Gemini Response: {response_text}", color=(0, 0, 255))
    match request_type:
        case "s":
            if response_text == "0":  # no error occurs, positive
                return {"error": False, "error_message": None, "response": "POSITIVE"}
            else:  # response text == "1" or unparsed, negative
                return {
                    "error": True,
                    "error_message": "Sentiment analysis result is negative",
                    "response": "NEGATIVE",
                }
        case "c":
            if response_text == "1":  # an error occurs
                return {
                    "error": True,
                    "error_message": "Gemini refuses to analysis the input",
                    "response": "BAD INPUT",
                }
            else:
                prismelt("Gemini data parsed successfully", color=(255, 0, 0))
                return {
                    "error": False,
                    "error_message": None,
                    "response": str(response_text),
                }
        case "r":
            if response_text == "0":  # no error, relevant
                return {"error": False, "error_message": None, "response": "RELEVANT"}
            else:  # response text == "1" or unparsed, irrelevant
                return {
                    "error": True,
                    "error_message": "Relevant Analysis result is negative",
                    "response": "IRRELEVANT",
                }
        case "t":
            match response_text:
                case "0":
                    return {
                        "error": False,
                        "error_message": None,
                        "response": "ACADEMIC",
                    }
                case "1":
                    return {
                        "error": False,
                        "error_message": None,
                        "response": "EXTRACURRICULAR",
                    }
                case "2":
                    return {
                        "error": False,
                        "error_message": None,
                        "response": "RELATION",
                    }
                case "3":
                    return {
                        "error": False,
                        "error_message": None,
                        "response": "CHARACTERISTIC",
                    }
                case _:
                    return {
                        "error": False,
                        "error_message": None,
                        "response": "GENERAL",
                    }
        case _:
            raise KeyError(f"Must be a valid key, not {request_type}")
