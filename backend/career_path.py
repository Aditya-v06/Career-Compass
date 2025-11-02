import time
from google import genai
import re
import os

# PLEASE REPLACE "YOUR_GEMINI_API_KEY" WITH YOUR ACTUAL GEMINI API KEY
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")

try:
  client = genai.Client(api_key=GEMINI_API_KEY)
  chat = client.chats.create(model="gemini-2.0-flash")
except Exception as e:
  print(f'Error with Gemini API key: {e}')
  chat = None

def ask_gemini(skills , target_role):
  if not chat:
    return "Error: Gemini client not initialized. Please check your API key."
  try:
    prompt = f"The user has skills: {skills}.They want to become a {target_role}. Strictly List top 3 missing skills only clearly.Keep it concise."
    response = chat.send_message(prompt)
    p2 = f"top 1 certification for each of the following skill: {response.text}.Only provide course name in your answer along with website do not mention the skill. Keep it concise "
    r = chat.send_message(p2)
    return (response.text,r.text)
  except Exception as e:
    return f"Oops something went wrong : {e}"

if __name__ == "__main__":
    skills = input("Skills: ")
    target_role = input("Target Role: ")
    response = ask_gemini(skills,target_role)

    if isinstance(response, tuple):
        splitsk = re.split(r'\d+\.\s*', response[0])
        skills = [item.strip() for item in splitsk if item.strip()]
        print("Missing skills:")
        print(skills)

        splitcl = re.split(r'\d+\.\s*', response[1])
        certifs = [item.strip() for item in splitcl if item.strip()]
        print("\nCertifications:")
        print(certifs)
    else:
        print(response)