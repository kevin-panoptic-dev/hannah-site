import json
from dotenv import load_dotenv
from typing import Literal
from .constants import PROMPTS
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={GEMINI_API_KEY}"
JSON = {"contents": [{"parts": [{"text": ""}]}]}
HEADERS = {"Content-Type": "application/json"}


def get_prompt(*, key: Literal["s", "r", "c"]) -> str:
    if key not in ["s", "r", "c"]:
        raise KeyError(f"Key must be `s`, `r`, or `c`, not {key}")

    return PROMPTS[key]
